import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET Alerts (Public return active only, Admin return all)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const isAdmin = searchParams.get('admin') === 'true'

    if (isAdmin) {
        // Admin: Return all sorted by date
        const alerts = await prisma.alert.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(alerts)
    } else {
        // Public: Return only active and within date range
        const now = new Date()
        const alerts = await prisma.alert.findMany({
            where: {
                isActive: true,
                startDate: { lte: now },
                OR: [
                    { endDate: null },
                    { endDate: { gte: now } }
                ]
            },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(alerts)
    }
}

// POST Create Alert
export async function POST(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const { content, link, startDate, endDate, isActive } = body

        const alert = await prisma.alert.create({
            data: {
                content,
                link,
                isActive: isActive ?? true,
                startDate: startDate ? new Date(startDate) : new Date(),
                endDate: endDate ? new Date(endDate) : null
            }
        })
        return NextResponse.json(alert)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// DELETE Alert
export async function DELETE(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        if (!id) return new NextResponse("ID required", { status: 400 })

        await prisma.alert.delete({ where: { id } })
        return new NextResponse("Deleted", { status: 200 })
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// PUT Update Alert (Toggle Active etc)
export async function PUT(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const { id, ...data } = body

        if (data.startDate) data.startDate = new Date(data.startDate)
        if (data.endDate) data.endDate = new Date(data.endDate)

        const alert = await prisma.alert.update({
            where: { id },
            data
        })
        return NextResponse.json(alert)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
