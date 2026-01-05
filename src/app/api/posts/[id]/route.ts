import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { slugify } from "@/lib/utils"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { id } = await params
        const body = await req.json()
        const { title, content, image, published } = body

        // Optional: Update slug if title changes (usually discouraged, but possible)
        // For now, let's keep slug stable to avoid breaking links

        const post = await prisma.post.update({
            where: { id },
            data: {
                title,
                content,
                image,
                published,
            }
        })

        return NextResponse.json(post)
    } catch (error) {
        console.error("PUT Error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { id } = await params
        await prisma.post.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("DELETE Error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
