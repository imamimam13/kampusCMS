import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { slugify } from "@/lib/utils"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { id } = await params
        const post = await prisma.post.findUnique({
            where: { id }
        })
        if (!post) return new NextResponse("Post not found", { status: 404 })

        // Authorization check: User must be super_admin or user's siteId must match post's siteId
        if ((session.user as any).role !== 'super_admin' && (session.user as any).siteId !== post.siteId) {
            return new NextResponse("Forbidden: Access denied to this resource", { status: 403 })
        }

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
        const post = await prisma.post.findUnique({
            where: { id }
        })
        if (!post) return new NextResponse("Post not found", { status: 404 })

        // Authorization check: User must be super_admin or user's siteId must match post's siteId
        if ((session.user as any).role !== 'super_admin' && (session.user as any).siteId !== post.siteId) {
            return new NextResponse("Forbidden: Access denied to this resource", { status: 403 })
        }

        await prisma.post.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("DELETE Error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
