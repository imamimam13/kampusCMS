
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from "@/lib/prisma"
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs/promises'
import AdmZip from 'adm-zip'

export const maxDuration = 300; // 5 minutes

export async function POST(req: Request) {
    const session = await auth()
    if (!session || session.user.role !== 'super_admin') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let tempZipPath = ''
    let tempSqlPath = ''

    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        }

        console.log("[RESTORE] Starting restore process...")

        // 1. Save uploaded zip temporarily
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        tempZipPath = path.join('/tmp', `restore-${Date.now()}.zip`)
        await fs.writeFile(tempZipPath, buffer)

        // 2. Open Zip
        const zip = new AdmZip(tempZipPath)
        const zipEntries = zip.getEntries()

        // 3. Locate SQL Dump and Restore DB
        const sqlEntry = zipEntries.find(entry => entry.entryName.endsWith('.sql') || entry.entryName === 'database_dump.sql')

        if (!sqlEntry) {
            return NextResponse.json({ error: "Invalid backup: No SQL dump found" }, { status: 400 })
        }

        const dbUrl = process.env.DATABASE_URL
        if (!dbUrl) {
            return NextResponse.json({ error: "DATABASE_URL configuration missing" }, { status: 500 })
        }

        // Extract SQL content
        const sqlContent = sqlEntry.getData()
        if (sqlContent.length === 0) {
            return NextResponse.json({ error: "Invalid backup: SQL dump is empty" }, { status: 400 })
        }

        // Write SQL to temp file
        tempSqlPath = path.join('/tmp', `restore-${Date.now()}.sql`)
        await fs.writeFile(tempSqlPath, sqlContent)

        // 3.1 Terminate other connections to allow clean drop/restore
        try {
            console.log("[RESTORE] Terminating active database connections...")
            await prisma.$executeRawUnsafe(`
                SELECT pg_terminate_backend(pg_stat_activity.pid)
                FROM pg_stat_activity
                WHERE pg_stat_activity.datname = current_database()
                AND pid <> pg_backend_pid();
            `)
        } catch (e) {
            console.warn("[RESTORE] Failed to terminate connections (non-fatal):", e)
        }

        // 3.2 Execute psql to restore
        console.log("[RESTORE] Executing psql...")
        const restoreOutput = await new Promise<{ stdout: string, stderr: string }>((resolve, reject) => {
            const psql = spawn('psql', [dbUrl, '-f', tempSqlPath], {
                env: { ...process.env, ON_ERROR_STOP: '1' }
            })

            let stdout = ''
            let stderr = ''

            psql.stdout.on('data', (d) => stdout += d.toString())
            psql.stderr.on('data', (d) => stderr += d.toString())

            psql.on('exit', (code) => {
                if (code === 0) resolve({ stdout, stderr })
                else reject(new Error(`psql exited with code ${code}\nStderr: ${stderr}`))
            })

            psql.on('error', (err) => {
                reject(new Error(`Failed to spawn psql: ${err.message}`))
            })
        })

        console.log("[RESTORE] Database restored.")

        /* 
        // 3.5. Legacy Support: Disabled for now as it may cause conflicts with clean restores
        // The restore process using pg_dump should already handle the schema correctly.
        */

        // 4. Restore Uploads
        const uploadsDir = path.join(process.cwd(), 'public/uploads')
        const uploadEntries = zipEntries.filter(entry => entry.entryName.startsWith('uploads/'))

        if (uploadEntries.length > 0) {
            console.log(`[RESTORE] Restoring ${uploadEntries.length} upload files...`)
            try {
                await fs.mkdir(uploadsDir, { recursive: true })
            } catch (e) { }

            zip.extractEntryTo("uploads/", path.join(process.cwd(), 'public'), false, true)
        }

        // 5. Cleanup
        try {
            await fs.unlink(tempZipPath)
            await fs.unlink(tempSqlPath)
        } catch (e) { /* ignore cleanup errors */ }

        return NextResponse.json({ success: true, message: "System restored successfully" })

    } catch (error: any) {
        console.error("Restore failed:", error)
        // Attempt cleanup
        try {
            if (tempZipPath) await fs.unlink(tempZipPath).catch(() => { })
            if (tempSqlPath) await fs.unlink(tempSqlPath).catch(() => { })
        } catch (e) { }

        return NextResponse.json({
            error: "Restore process failed",
            details: error.message || String(error)
        }, { status: 500 })
    }
}
