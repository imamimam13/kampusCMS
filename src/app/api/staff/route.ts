import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET (Public)
export async function GET(req: Request) {
    try {
        const staff = await prisma.staff.findMany({
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

        // Check uniqueness of slug
        const existing = await prisma.staff.findUnique({ where: { slug } })
        if (existing) {
            return new NextResponse("Slug already exists", { status: 400 })
        }

        const staff = await prisma.staff.create({
            data: { name, slug, nidn, role, bio, image, links, pddiktiData }
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
