import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

import { getSiteData } from "@/lib/sites"

// GET (Public)
export async function GET(req: Request) {
    try {
        const host = req.headers.get('host') || 'localhost:3000'
        const site = await getSiteData(host.split(':')[0])

        if (!site) return new NextResponse("Site not found", { status: 404 })

        const staff = await prisma.staff.findMany({
            where: { siteId: site.id },
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(staff)
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
        const { name, slug, nidn, role, bio, image, links, pddiktiData } = body

        const host = req.headers.get('host') || 'localhost:3000'
        const site = await getSiteData(host.split(':')[0])
        if (!site) return new NextResponse("Site not found", { status: 404 })

        // Check uniqueness of slug within site
        const existing = await prisma.staff.findFirst({
            where: { slug, siteId: site.id }
        })

        if (existing) {
            return new NextResponse("Slug already exists", { status: 400 })
        }

        const staff = await prisma.staff.create({
            data: { name, slug, nidn, role, bio, image, links, pddiktiData, siteId: site.id }
        })

        return NextResponse.json(staff)
    } catch (error) {
        console.error("[STAFF_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// UPDATE (Using POST-like structure or PUT)
export async function PUT(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const { id, name, slug, nidn, role, bio, image, links, pddiktiData } = body

        if (!id) return new NextResponse("ID required", { status: 400 })

        // Check if slug changed and is unique is hard without more logic, 
        // Prisma catches unique constraint errors.

        const staff = await prisma.staff.update({
            where: { id },
            data: { name, slug, nidn, role, bio, image, links, pddiktiData }
        })

        return NextResponse.json(staff)
    } catch (error) {
        console.error("[STAFF_PUT]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
// DELETE
export async function DELETE(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        const ids = searchParams.get("ids") // comma separated

        if (ids) {
            const idList = ids.split(',')
            await prisma.staff.deleteMany({
                where: { id: { in: idList } }
            })
            return new NextResponse("Deleted count: " + idList.length, { status: 200 })
        }

        if (!id) return new NextResponse("ID required", { status: 400 })

        await prisma.staff.delete({
            where: { id }
        })

        return new NextResponse("Deleted", { status: 200 })
    } catch (error) {
        console.error("[STAFF_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
