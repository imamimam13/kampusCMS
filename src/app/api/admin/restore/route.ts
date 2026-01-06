
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs/promises'
import AdmZip from 'adm-zip'

export async function POST(req: Request) {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        }

        // 1. Save uploaded zip temporarily
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const tempZipPath = path.join('/tmp', `restore-${Date.now()}.zip`)
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

        // Execute psql to restore
        // We write SQL to a temp file first to safely pass it to psql
        const tempSqlPath = path.join('/tmp', `restore-${Date.now()}.sql`)
        await fs.writeFile(tempSqlPath, sqlContent)

        await new Promise<void>((resolve, reject) => {
            // psql -d URL -f file.sql
            const psql = spawn('psql', [dbUrl, '-f', tempSqlPath])

            psql.on('exit', (code) => {
                if (code === 0) resolve()
                else reject(new Error(`psql exited with code ${code}`))
            })

            psql.stderr.on('data', (data) => console.error(`psql error: ${data}`))
        })

        // 4. Restore Uploads
        const uploadsDir = path.join(process.cwd(), 'public/uploads')

        // Find 'uploads/' folder in zip
        const uploadEntries = zipEntries.filter(entry => entry.entryName.startsWith('uploads/'))

        if (uploadEntries.length > 0) {
            // Check if directory exists
            try {
                await fs.access(uploadsDir)
                // Clean existing uploads?? Or merge? 
                // Usually restore implies replacing state. Let's merge/overwrite but not delete existing unless requested.
                // For a true "restore state" we should probably clean it, but let's be safe and just overwrite/add.
            } catch (e) {
                await fs.mkdir(uploadsDir, { recursive: true })
            }

            // Extract all upload entries to public/uploads
            // adm-zip extracts preserving paths, so user/uploads/file.png -> target/uploads/file.png
            // We want target to be process.cwd()/public
            zip.extractEntryTo("uploads/", path.join(process.cwd(), 'public'), false, true)
        }

        // 5. Cleanup
        await fs.unlink(tempZipPath)
        await fs.unlink(tempSqlPath)

        return NextResponse.json({ success: true, message: "System restored successfully" })

    } catch (error) {
        console.error("Restore failed:", error)
        return NextResponse.json({ error: "Restore process failed" }, { status: 500 })
    }
}
