import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// ... imports

export async function POST(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const { id, slug, title, content, published } = body

        // If ID is provided, update existing
        if (id) {
            const updated = await prisma.page.update({
                where: { id },
                data: { slug, title, content, published }
            })
            return NextResponse.json(updated)
        }

        // Fallback: Check by slug (legacy behavior or new page with specific slug)
        const existing = await prisma.page.findUnique({ where: { slug } })

        if (existing) {
            const updated = await prisma.page.update({
                where: { slug },
                data: { title, content, published }
            })
            return NextResponse.json(updated)
        }

        // Create new
        const created = await prisma.page.create({
            data: { slug, title, content, published }
        })
        return NextResponse.json(created)

    } catch (error) {
        console.error("[PAGE_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) return new NextResponse("ID required", { status: 400 })

        await prisma.page.delete({ where: { id } })
        return new NextResponse("Deleted", { status: 200 })
    } catch (error) {
        console.error("[PAGE_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
