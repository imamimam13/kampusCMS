import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET Single Album
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const album = await prisma.galleryAlbum.findUnique({
            where: { id },
            include: {
                images: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (!album) return new NextResponse("Not Found", { status: 404 })

        return NextResponse.json(album)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// UPDATE Album
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { id } = await params
        const body = await req.json()
        const { title, description, coverImage } = body

        const album = await prisma.galleryAlbum.update({
            where: { id },
            data: { title, description, coverImage }
        })

        return NextResponse.json(album)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// DELETE Album
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { id } = await params
        await prisma.galleryAlbum.delete({ where: { id } })
        return new NextResponse("Deleted", { status: 200 })
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
