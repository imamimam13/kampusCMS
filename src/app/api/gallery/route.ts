import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

import { getSiteData } from "@/lib/sites"

// GET Albums (Public)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

        const host = req.headers.get('host') || 'localhost:3000'
        const site = await getSiteData(host.split(':')[0])

        if (!site) return new NextResponse("Site not found", { status: 404 })

        const albums = await prisma.galleryAlbum.findMany({
            where: { siteId: site.id },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                images: {
                    take: 1
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

        const host = req.headers.get('host') || 'localhost:3000'
        const site = await getSiteData(host.split(':')[0])
        if (!site) return new NextResponse("Site not found", { status: 404 })

        const album = await prisma.galleryAlbum.create({
            data: { title, description, coverImage, siteId: site.id }
        })

        return NextResponse.json(album)
    } catch (error) {
        console.error("[GALLERY_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
