
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import archiver from 'archiver'
import { Readable } from 'stream'

// Helper to convert stream to buffer (for simple error handling)
const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
    const chunks = []
    for await (const chunk of stream) {
        chunks.push(chunk)
    }
    return Buffer.concat(chunks)
}

export async function POST(req: Request) {
    const session = await auth()
    if (!session || !['admin', 'super_admin'].includes(session.user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 1. Prepare Paths
    const uploadsDir = path.join(process.cwd(), 'public/uploads')
    const dbUrl = process.env.DATABASE_URL

    if (!dbUrl) {
        return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 })
    }

    // 2. Setup Archiver
    const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
    })

    // 3. Create a PassThrough stream to pipe the zip content to the response
    const stream = new Readable({
        read() { }
    })

    archive.on('data', (chunk) => {
        stream.push(chunk)
    })

    archive.on('end', () => {
        stream.push(null)
    })

    archive.on('error', (err) => {
        console.error("Archive Error:", err)
        stream.emit('error', err)
    })

    // 4. Dump Database
    // We use pg_dump via child_process
    // Note: This requires 'postgresql-client' to be installed in the Docker container
    const dumpFileName = 'database_dump.sql'

    // Parse connection string for pg_dump arguments if needed, 
    // but usually pg_dump accepts the connection string directly via -d
    const pgDump = spawn('pg_dump', [dbUrl, '--clean', '--if-exists', '--no-owner', '--no-privileges'])

    // Pipe pg_dump stdout directly into a file in the archive
    archive.append(pgDump.stdout, { name: dumpFileName })

    pgDump.stderr.on('data', (data) => {
        console.log(`pg_dump stderr: ${data}`)
    })

    pgDump.on('error', (err) => {
        console.error("Failed to start pg_dump:", err)
        archive.append(Buffer.from(`Error starting pg_dump: ${err.message}`), { name: 'backup_error.txt' })
    })

    pgDump.on('exit', (code) => {
        if (code !== 0) {
            console.error(`pg_dump exited with code ${code}`)
            archive.append(Buffer.from(`pg_dump failed with exit code ${code}`), { name: 'backup_failed.txt' })
        }
    })

    // 5. Add Uploads Directory
    if (fs.existsSync(uploadsDir)) {
        archive.directory(uploadsDir, 'uploads')
    }

    // 6. Finalize Archive
    archive.finalize()

    // 7. Return Response Stream
    // We return a Response with the stream
    return new Response(stream as any, {
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="kampuscms_backup_${new Date().toISOString().split('T')[0]}.zip"`,
        },
    })
}
