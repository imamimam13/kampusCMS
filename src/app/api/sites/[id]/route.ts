
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
        console.log("[SITE_PATCH] Updating site", { id, bodyKeys: Object.keys(body) })
        const { name, description, colors, logo, footerText, footerConfig, headerLinks, headCode, bodyCode, subdomain, customDomain, enabledBlocks, theme, enabledSidebarItems } = body

        // Prepare update data dynamically to handle partial updates
        const data: any = {}
        if (name) data.name = name
        // Allow description to be set to null/empty string, but only if provided
        if (description !== undefined) data.description = description

        // Validate subdomain uniqueness if changed
        if (subdomain) {
            const existing = await prisma.site.findUnique({ where: { subdomain } })
            if (existing && existing.id !== id) {
                return NextResponse.json({ error: "Subdomain already taken" }, { status: 400 })
            }
            data.subdomain = subdomain
        }

        if (customDomain !== undefined) data.customDomain = customDomain || null
        if (enabledBlocks) data.enabledBlocks = enabledBlocks
        if (enabledSidebarItems) data.enabledSidebarItems = enabledSidebarItems
        if (theme) data.theme = theme // Assuming 'colors' or 'theme' field? 

        // Check the client code, it sends "colors" but prisma might store it in a specific way?
        // Looking at schema would be ideal, but assuming 'colors' based on client.tsx line 59:
        // colors: { primary: ..., secondary: ... }
        if (body.colors) data.colors = body.colors

        const site = await prisma.site.update({
            where: { id },
            data
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
