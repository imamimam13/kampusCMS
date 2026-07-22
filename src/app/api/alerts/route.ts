import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getSiteData } from "@/lib/sites"

// GET Alerts (Public return active only, Admin return all)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const isAdmin = searchParams.get('admin') === 'true'

    // Determine site context from host header
    const host = req.headers.get('host') || 'localhost:3000'
    const site = await getSiteData(host.split(':')[0])

    if (isAdmin) {
        const session = await auth()
        if (!session) return new NextResponse("Unauthorized", { status: 401 })

        const whereClause: any = {}
        // Filter by siteId for non-super-admins
        if ((session.user as any).role !== 'super_admin') {
            whereClause.siteId = (session.user as any).siteId
        }

        const alerts = await prisma.alert.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(alerts)
    } else {
        // Public: Return only active and within date range, filtered by the current site
        const now = new Date()
        
        const whereClause: any = {
            isActive: true,
            startDate: { lte: now },
            OR: [
                { endDate: null },
                { endDate: { gte: now } }
            ]
        }
        
        if (site) {
            whereClause.siteId = site.id
        }

        const alerts = await prisma.alert.findMany({
            where: whereClause,
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
        const { content, link, startDate, endDate, isActive, siteId } = body

        let targetSiteId = siteId

        // If no siteId provided, try to infer from Host
        if (!targetSiteId) {
            const host = req.headers.get('host') || 'localhost:3000'
            const site = await getSiteData(host.split(':')[0])
            if (site) targetSiteId = site.id
        }

        if (!targetSiteId) {
            return new NextResponse("Site ID required or site not found", { status: 400 })
        }

        // Authorization check: User must be super_admin or user's siteId must match targetSiteId
        if ((session.user as any).role !== 'super_admin' && (session.user as any).siteId !== targetSiteId) {
            return new NextResponse("Forbidden: Access denied to this site's resources", { status: 403 })
        }

        const alert = await prisma.alert.create({
            data: {
                content,
                link,
                isActive: isActive ?? true,
                startDate: startDate ? new Date(startDate) : new Date(),
                endDate: endDate ? new Date(endDate) : null,
                siteId: targetSiteId
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

        // Retrieve existing alert to check siteId
        const alert = await prisma.alert.findUnique({
            where: { id }
        })
        if (!alert) return new NextResponse("Alert not found", { status: 404 })

        // Authorization check: User must be super_admin or user's siteId must match alert's siteId
        if ((session.user as any).role !== 'super_admin' && (session.user as any).siteId !== alert.siteId) {
            return new NextResponse("Forbidden: Access denied to this resource", { status: 403 })
        }

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

        // Retrieve existing alert to check siteId
        const alert = await prisma.alert.findUnique({
            where: { id }
        })
        if (!alert) return new NextResponse("Alert not found", { status: 404 })

        // Authorization check: User must be super_admin or user's siteId must match alert's siteId
        if ((session.user as any).role !== 'super_admin' && (session.user as any).siteId !== alert.siteId) {
            return new NextResponse("Forbidden: Access denied to this resource", { status: 403 })
        }

        if (data.startDate) data.startDate = new Date(data.startDate)
        if (data.endDate) data.endDate = new Date(data.endDate)

        const updatedAlert = await prisma.alert.update({
            where: { id },
            data
        })
        return NextResponse.json(updatedAlert)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
