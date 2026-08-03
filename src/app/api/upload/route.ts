import { writeFile, mkdir } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { auth } from '@/auth'

// Lazy load sharp to prevent runtime crashes on environments lacking the correct native binary (e.g. Docker Alpine)
async function getSharp() {
    try {
        const sharpModule = await import('sharp')
        return sharpModule.default || sharpModule
    } catch (error) {
        console.error("[UPLOAD] Failed to dynamically import 'sharp':", error)
        return null
    }
}

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

    // Strict Security Validation: Whitelist safe file extensions & disallow executable/script files (SVG, HTML, PHP, JS, etc.)
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.txt', '.csv'];
    const fileExt = path.extname(file.name).toLowerCase();
    const mimeType = (file.type || '').toLowerCase();

    if (!allowedExtensions.includes(fileExt) || mimeType.includes('svg') || mimeType.includes('html') || mimeType.includes('javascript')) {
        console.warn(`[UPLOAD_SECURITY_BLOCK] Blocked potentially unsafe file upload: name=${file.name}, ext=${fileExt}, type=${mimeType}`);
        return NextResponse.json({ error: "File type not allowed for security reasons." }, { status: 400 });
    }

    let buffer = Buffer.from(await file.arrayBuffer() as any)

    // Compression Logic
    // If it's an image and larger than 500KB, compress it
    const isImage = file.type.startsWith('image/')
    const isLarge = file.size > 500 * 1024 // 500KB
    let wasCompressed = false

    if (isImage && isLarge) {
        try {
            const sharpInstance = await getSharp()
            if (sharpInstance) {
                buffer = await sharpInstance(buffer)
                    .resize(1920, 1080, { // Max dimensions (HD)
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .jpeg({ quality: 80, mozjpeg: true }) // Convert to JPEG with good compression
                    .toBuffer()
                wasCompressed = true
            } else {
                console.warn("[UPLOAD] sharp is not available. Saving original file without compression.")
            }
        } catch (error) {
            console.error("Compression failed, saving original.", error)
            // Fallback to original buffer
        }
    }

    // Sanitize filename (ensure .jpg if compressed, otherwise keep original extension)
    let filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    if (wasCompressed) {
        // If we compressed, we likely converted to JPEG, so update extension
        filename = filename.replace(/\.[^/.]+$/, "") + ".jpg"
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const finalFilename = `${uniqueSuffix}-${filename}`

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    console.log(`[UPLOAD] Processing upload... Target dir: ${uploadDir}`)

    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (e) {
        // Ignore error if directory exists
    }

    const filePath = path.join(uploadDir, finalFilename)
    console.log(`[UPLOAD] Writing file to: ${filePath}`)

    try {
        await writeFile(filePath, buffer)
        console.log(`[UPLOAD] Write successful (size: ${buffer.length})`)

        // Get metadata using sharp (even if not compressed)
        let width = 0
        let height = 0

        try {
            // Try to get dimensions if it's an image
            if (isImage) {
                const sharpInstance = await getSharp()
                if (sharpInstance) {
                    const metadata = await sharpInstance(buffer).metadata()
                    width = metadata.width || 0
                    height = metadata.height || 0
                }
            }
        } catch (e) {
            console.warn("[UPLOAD] Metadata extraction failed (non-fatal):", e)
        }

        // Return URL relative to public folder
        const responseData = {
            success: true,
            url: `/uploads/${finalFilename}?v=${Date.now()}`,
            filename: finalFilename,
            size: buffer.length,
            width,
            height
        }
        console.log(`[UPLOAD] Success:`, responseData.url)
        return NextResponse.json(responseData)
    } catch (error) {
        console.error("[UPLOAD_ERROR] Critical failure:", error)
        return NextResponse.json({ error: "Upload failed: " + (error as Error).message }, { status: 500 })
    }
}
