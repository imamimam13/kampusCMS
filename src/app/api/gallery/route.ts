import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET Albums (Public)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

        const albums = await prisma.galleryAlbum.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                images: {
                    take: 1 // Get first image as cover if coverImage is not set
                }
            }
        })

        return NextResponse.json(albums)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// CREATE Album
export async function POST(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const { title, description, coverImage } = body

        if (!title) {
            return new NextResponse("Title is required", { status: 400 })
        }

        const album = await prisma.galleryAlbum.create({
            data: { title, description, coverImage }
        })

        return NextResponse.json(album)
    } catch (error) {
        console.error("[GALLERY_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
