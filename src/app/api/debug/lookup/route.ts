
import { prisma } from "@/lib/prisma"
import { getSiteData } from "@/lib/sites"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const host = searchParams.get('host') || 'localhost'
    const slug = searchParams.get('slug') || '/'

    const report: any = {
        input: { host, slug },
        steps: []
    }

    try {
        // Step 1: Site Resolution
        const site = await getSiteData(host)
        report.steps.push({
            step: "Resolve Site",
            host: host,
            found: !!site,
            siteId: site?.id,
            subdomain: site?.subdomain
        })

        if (!site) {
            return NextResponse.json({ error: "Site not found", report }, { status: 404 })
        }

        // Step 2: Page Resolution
        const exactSlug = slug
        const queries = [
            { slug: exactSlug },
            { slug: `/${exactSlug}` },
            { slug: exactSlug.startsWith('/') ? exactSlug : `/${exactSlug}` }
        ]

        report.steps.push({
            step: "Query Page",
            siteId: site.id,
            queries: queries,
            publishedOnly: true
        })

        const page = await prisma.page.findFirst({
            where: {
                siteId: site.id,
                OR: queries,
                published: true
            }
        })

        report.steps.push({
            step: "Page Result",
            found: !!page,
            pageId: page?.id,
            pageSlug: page?.slug,
            pageTitle: page?.title
        })

        // Step 3: Check if page exists but is unpublished
        if (!page) {
            const unpublishedPage = await prisma.page.findFirst({
                where: {
                    siteId: site.id,
                    OR: queries,
                }
            })
            if (unpublishedPage) {
                report.steps.push({
                    step: "Unpublished Check",
                    found: true,
                    message: "PAGE EXISTS BUT IS NOT PUBLISHED!",
                    pageId: unpublishedPage.id
                })
            }
        }

        return NextResponse.json(report)

    } catch (error: any) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 })
    }
}
