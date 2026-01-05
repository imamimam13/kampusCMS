import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET (Public)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
        const category = searchParams.get('category')

        const where = category && category !== 'All' ? { category } : {}

        const downloads = await prisma.download.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit
        })

        return NextResponse.json(downloads)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// CREATE
export async function POST(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const { title, fileUrl, category } = body

        if (!title || !fileUrl) {
            return new NextResponse("Missing fields", { status: 400 })
        }

        const download = await prisma.download.create({
            data: { title, fileUrl, category }
        })

        return NextResponse.json(download)
    } catch (error) {
        console.error("[DOWNLOAD_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// DELETE
export async function DELETE(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) return new NextResponse("ID required", { status: 400 })

        await prisma.download.delete({ where: { id } })

        return new NextResponse("Deleted", { status: 200 })
    } catch (error) {
        console.error("[DOWNLOAD_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
