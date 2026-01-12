import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { getSiteData } from "@/lib/sites"

export async function GET(req: Request) {
    const host = req.headers.get('host') || 'localhost:3000'
    const site = await getSiteData(host)

    if (!site) {
        return new NextResponse("Site not found", { status: 404 })
    }

    // Return site as "settings"
    return NextResponse.json(site)
}

export async function PUT(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    const host = req.headers.get('host') || 'localhost:3000'
    const site = await getSiteData(host)

    if (!site) {
        return new NextResponse("Site not found", { status: 404 })
    }

    // RBAC
    const userRole = session.user.role
    const userSiteId = session.user.siteId

    // Allow if super_admin OR (site_admin AND assigned to this site)
    const isAllowed = userRole === 'super_admin' || (userRole === 'site_admin' && userSiteId === site.id)

    if (!isAllowed) {
        return new NextResponse("Forbidden", { status: 403 })
    }

    try {
        const body = await req.json()
        const { name, description, logo, colors, fonts, headerLinks, footerText, footerConfig, headCode, bodyCode, aiConfig, pddiktiUrl, enabledBlocks, enabledSidebarItems } = body

        const updatedSite = await prisma.site.update({
            where: { id: site.id },
            data: {
                name, description, logo, colors, fonts, headerLinks, footerText, footerConfig, headCode, bodyCode, aiConfig, pddiktiUrl, enabledBlocks, enabledSidebarItems
            }
        })

        return NextResponse.json(updatedSite)
    } catch (error) {
        console.error("Settings Update Error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
