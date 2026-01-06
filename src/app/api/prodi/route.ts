
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET Public
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (id) {
            const prodi = await prisma.programStudi.findUnique({
                where: { id },
                include: { headOfProdi: true }
            })
            return NextResponse.json(prodi)
        }

        const prodiList = await prisma.programStudi.findMany({
            orderBy: { name: 'asc' },
            include: { headOfProdi: { select: { name: true, image: true } } }
        })
        return NextResponse.json(prodiList)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// POST (Admin)
export async function POST(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const { code, name, degree, accreditation, vision, mission, headOfProdiId, curriculum } = body

        // Check Unique Code
        const existing = await prisma.programStudi.findUnique({ where: { code } })
        if (existing) return new NextResponse("Code already exists", { status: 400 })

        const prodi = await prisma.programStudi.create({
            data: {
                code, name, degree, accreditation, vision, mission, headOfProdiId, curriculum
            }
        })

        return NextResponse.json(prodi)
    } catch (error) {
        console.error("[PRODI_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// PUT (Admin)
export async function PUT(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const { id, code, name, degree, accreditation, vision, mission, headOfProdiId, curriculum } = body

        if (!id) return new NextResponse("ID required", { status: 400 })

        const prodi = await prisma.programStudi.update({
            where: { id },
            data: {
                code, name, degree, accreditation, vision, mission, headOfProdiId, curriculum
            }
        })

        return NextResponse.json(prodi)
    } catch (error) {
        console.error("[PRODI_PUT]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// DELETE (Admin)
export async function DELETE(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) return new NextResponse("ID required", { status: 400 })

        await prisma.programStudi.delete({
            where: { id }
        })

        return new NextResponse("Deleted", { status: 200 })
    } catch (error) {
        console.error("[PRODI_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
