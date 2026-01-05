import { writeFile, mkdir } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { auth } from '@/auth'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    let buffer = Buffer.from(await file.arrayBuffer() as any)

    // Compression Logic
    // If it's an image and larger than 500KB, compress it
    const isImage = file.type.startsWith('image/')
    const isLarge = file.size > 500 * 1024 // 500KB

    if (isImage && isLarge) {
        try {
            buffer = await sharp(buffer)
                .resize(1920, 1080, { // Max dimensions (HD)
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 80, mozjpeg: true }) // Convert to JPEG with good compression
                .toBuffer()
        } catch (error) {
            console.error("Compression failed, saving original.", error)
            // Fallback to original buffer
        }
    }

    // Sanitize filename (ensure .jpg if compressed, otherwise keep original extension)
    let filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    if (isImage && isLarge) {
        // If we compressed, we likely converted to JPEG, so update extension
        filename = filename.replace(/\.[^/.]+$/, "") + ".jpg"
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const finalFilename = `${uniqueSuffix}-${filename}`

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (e) {
        // Ignore error if directory exists
    }

    const filePath = path.join(uploadDir, finalFilename)

    try {
        await writeFile(filePath, buffer)

        // Get metadata using sharp (even if not compressed)
        let width = 0
        let height = 0

        try {
            // Try to get dimensions if it's an image
            const metadata = await sharp(buffer).metadata()
            width = metadata.width || 0
            height = metadata.height || 0
        } catch (e) {
            // Ignore if not an image or failed to read metadata
        }

        // Return URL relative to public folder
        return NextResponse.json({
            success: true,
            url: `/uploads/${finalFilename}`,
            filename: finalFilename,
            size: buffer.length,
            width,
            height
        })
    } catch (error) {
        console.error("[UPLOAD_ERROR]", error)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}
