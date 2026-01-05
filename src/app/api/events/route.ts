import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET (Public)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const upcoming = searchParams.get('upcoming') === 'true'
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

        const where = upcoming
            ? { startDate: { gte: new Date() } }
            : {}

        const events = await prisma.event.findMany({
            where,
            orderBy: { startDate: 'asc' },
            take: limit
        })

        return NextResponse.json(events)
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
        const { title, slug, description, startDate, endDate, location, category, image } = body

        // Validate required
        if (!title || !startDate) {
            return new NextResponse("Missing fields", { status: 400 })
        }

        const event = await prisma.event.create({
            data: {
                title,
                slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                description,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                location,
                category,
                image
            }
        })

        return NextResponse.json(event)
    } catch (error) {
        console.error("[EVENT_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// UPDATE (Using PUT)
export async function PUT(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const { id, title, slug, description, startDate, endDate, location, category, image } = body

        if (!id) return new NextResponse("ID required", { status: 400 })

        const event = await prisma.event.update({
            where: { id },
            data: {
                title,
                slug,
                description,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                location,
                category,
                image
            }
        })

        return NextResponse.json(event)
    } catch (error) {
        console.error("[EVENT_PUT]", error)
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

        await prisma.event.delete({ where: { id } })

        return new NextResponse("Deleted", { status: 200 })
    } catch (error) {
        console.error("[EVENT_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
