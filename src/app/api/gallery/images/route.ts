import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// ADD Image to Album
export async function POST(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const { albumId, url, caption, size, width, height } = body

        if (!albumId || !url) {
            return new NextResponse("Missing fields", { status: 400 })
        }

        const image = await prisma.galleryImage.create({
            data: {
                albumId,
                url,
                caption,
                size,
                width,
                height
            }
        })

        return NextResponse.json(image)
    } catch (error) {
        console.error("[GALLERY_IMAGE_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// DELETE Image
export async function DELETE(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) return new NextResponse("ID required", { status: 400 })

        await prisma.galleryImage.delete({ where: { id } })

        return new NextResponse("Deleted", { status: 200 })
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
