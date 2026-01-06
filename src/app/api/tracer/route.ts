import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { nim, nama, kodeProdi, tahunLulus, status } = body

        if (!nim || !nama || !kodeProdi || !tahunLulus || !status) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Check if NIM already submitted
        const existing = await prisma.tracerResponse.findUnique({
            where: { nim }
        })

        if (existing) {
            // Update existing or error? For now allow update
            const updated = await prisma.tracerResponse.update({
                where: { nim },
                data: {
                    ...body,
                    tahunLulus: parseInt(body.tahunLulus),
                    waktuTunggu: body.waktuTunggu ? parseInt(body.waktuTunggu) : null
                }
            })
            return NextResponse.json(updated)
        }

        const tracer = await prisma.tracerResponse.create({
            data: {
                ...body,
                tahunLulus: Number(body.tahunLulus),
                waktuTunggu: body.waktuTunggu ? Number(body.waktuTunggu) : null
            }
        })

        return NextResponse.json(tracer)

    } catch (error: any) {
        console.error("Tracer Submit Error:", error)
        return new NextResponse(JSON.stringify({ error: error.message || "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
}

export async function GET(req: Request) {
    try {
        // Only for admin or verifying
        const responses = await prisma.tracerResponse.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100
        })
        return NextResponse.json(responses)
    } catch (error) {
        return new NextResponse("Internal server error", { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) return new NextResponse("ID required", { status: 400 })

        await prisma.tracerResponse.delete({
            where: { id }
        })

        return new NextResponse("Deleted", { status: 200 })
    } catch (error) {
        console.error("Tracer Delete Error:", error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}
