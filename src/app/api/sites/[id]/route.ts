
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session || session.user.role !== 'super_admin') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const site = await prisma.site.findUnique({
        where: { id }
    })

    if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 })

    return NextResponse.json(site)
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session || session.user.role !== 'super_admin') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    try {
        const body = await req.json()
        const { name, description, subdomain, customDomain, enabledBlocks } = body

        // Validate subdomain uniqueness if changed
        if (subdomain) {
            const existing = await prisma.site.findUnique({ where: { subdomain } })
            if (existing && existing.id !== id) {
                return NextResponse.json({ error: "Subdomain already taken" }, { status: 400 })
            }
        }

        const site = await prisma.site.update({
            where: { id },
            data: {
                name,
                description,
                subdomain,
                customDomain: customDomain || null,
                enabledBlocks // Update enabledBlocks field
            }
        })

        return NextResponse.json(site)
    } catch (error) {
        console.error("Update site error:", error)
        return NextResponse.json({ error: "Failed to update site" }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session || session.user.role !== 'super_admin') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    try {
        // Prevent deleting main site?
        const site = await prisma.site.findUnique({ where: { id } })
        if (site?.subdomain === 'main') {
            return NextResponse.json({ error: "Cannot delete main site" }, { status: 400 })
        }

        await prisma.site.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete site" }, { status: 500 })
    }
}
