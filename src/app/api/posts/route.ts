import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { slugify } from "@/lib/utils"
import { getSiteData } from "@/lib/sites"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const publishedOnly = searchParams.get('published') === 'true'

    // Determine site context
    const host = req.headers.get('host') || 'localhost:3000'
    const site = await getSiteData(host.split(':')[0]) // Remove port

    const whereClause: any = {
        ...(publishedOnly ? { published: true } : {})
    }

    // Isolate by site if detected
    if (site) {
        whereClause.siteId = site.id
    }

    const posts = await prisma.post.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
            author: { select: { name: true } }
        }
    })

    return NextResponse.json(posts)
}

export async function POST(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const { title, content, image, published, authorId, siteId } = body

        let targetSiteId = siteId

        // If no siteId provided, try to infer from Host
        if (!targetSiteId) {
            const host = req.headers.get('host') || 'localhost:3000'
            const site = await getSiteData(host.split(':')[0])
            if (site) targetSiteId = site.id
        }

        let slug = slugify(title)

        // Ensure unique slug scope to site if possible, but schema has @unique([siteId, slug])
        // If siteId is null (global?), it might conflict?

        // Check existence
        const existing = await prisma.post.findFirst({
            where: {
                slug,
                siteId: targetSiteId
            }
        })

        if (existing) {
            slug = `${slug}-${Date.now()}`
        }

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                image,
                published,
                authorId,
                siteId: targetSiteId
            }
        })

        return NextResponse.json(post)
    } catch (error) {
        console.error("POST Error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
