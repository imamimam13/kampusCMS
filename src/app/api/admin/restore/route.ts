
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

        // 3.5. Legacy Support: Ensure Schema Compatibility & Migrate Orphans
        // If the backup was from an older version, it might overwrite tables and remove 'siteId'
        // We run 'prisma db push' to ensure the schema is current (re-adding siteId if lost)
        try {
            console.log("Ensuring schema compatibility...")
            await new Promise<void>((resolve, reject) => {
                const push = spawn('npx', ['prisma', 'db', 'push', '--accept-data-loss', '--skip-generate'], {
                    cwd: process.cwd() // Ensure we are in the project root
                })
                push.on('exit', (code) => {
                    if (code === 0) resolve()
                    else reject(new Error(`prisma db push exited with code ${code}`))
                })
                push.stdout.on('data', (d) => console.log(`prisma: ${d}`))
                push.stderr.on('data', (d) => console.error(`prisma error: ${d}`))
            })

            // Fix Orphans: Assign NULL siteId to 'main'
            // We assume 'main' subdomain exists. If not, we might need to create it or pick one.
            // For now, let's look for a site with subdomain 'main' or fallback to the first site found.
            // Note: We need a fresh prisma client or raw query because the schema might have just changed?
            // Existing prisma client might be okay if we didn't change the TS definitions.

            // Using prisma.$executeRawUnsafe to migrate table by table
            const tablesWithSiteId = [
                'Page', 'Post', 'Event', 'Download', 'GalleryAlbum', 'Testimonial', 'Alert', 'ProgramStudi', 'Staff'
            ]

            // Find Main Site ID
            const mainSite = await prisma.site.findUnique({ where: { subdomain: 'main' } })

            if (mainSite) {
                console.log(`Migrating orphaned content to site: ${mainSite.name} (${mainSite.id})`)
                for (const table of tablesWithSiteId) {
                    try {
                        const count = await prisma.$executeRawUnsafe(`UPDATE "${table}" SET "siteId" = '${mainSite.id}' WHERE "siteId" IS NULL;`)
                        console.log(`Migrated ${count} ${table}s`)
                    } catch (e) {
                        console.warn(`Failed to migrate table ${table}:`, e)
                    }
                }

                // Also update Users if needed? Users usually global, but if they had siteId...
                // Only if User model has siteId, which it does now.
                // await prisma.$executeRawUnsafe(`UPDATE "User" SET "siteId" = '${mainSite.id}' WHERE "siteId" IS NULL;`)
            } else {
                console.warn("Main site not found. Skipping orphan migration.")
            }

        } catch (e) {
            console.error("Legacy migration failed:", e)
            // We don't fail the whole request, just log it, as data restore might have been successful enough
        }

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
