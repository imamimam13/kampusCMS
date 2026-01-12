import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getSiteData } from "@/lib/sites"

// ... imports

export async function POST(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const { id, slug, title, content, published } = body

        // Get current site
        const host = req.headers.get('host') || 'localhost:3000'
        const site = await getSiteData(host.split(':')[0])

        if (!site) return new NextResponse("Site not found", { status: 404 })

        const siteId = site.id

        // If ID is provided, update existing
        if (id) {
            // Verify ownership
            const existing = await prisma.page.findFirst({
                where: { id, siteId }
            })

            if (!existing) return new NextResponse("Page not found or access denied", { status: 404 })

            const updated = await prisma.page.update({
                where: { id },
                data: { slug, title, content, published }
            })
            return NextResponse.json(updated)
        }

        // Check for existing slug in THIS site
        const existing = await prisma.page.findFirst({
            where: { slug, siteId }
        })

        if (existing) {
            const updated = await prisma.page.update({
                where: { id: existing.id },
                data: { title, content, published }
            })
            return NextResponse.json(updated)
        }

        // Create new
        const created = await prisma.page.create({
            data: { slug, title, content, published, siteId }
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
