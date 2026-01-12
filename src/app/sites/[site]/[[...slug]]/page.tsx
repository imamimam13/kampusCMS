
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { BlockRenderer } from "@/components/builder/block-renderer"
import { BlockData } from "@/types/builder"
import { getSiteData } from "@/lib/sites"

export const dynamic = 'force-dynamic'

export default async function PublicPage({ params }: { params: { site: string, slug?: string[] } }) {
    const { site: domain, slug } = await params

    // 1. Get Site
    const siteData = await getSiteData(domain)
    if (!siteData) {
        return notFound()
    }

    // 2. Get Page
    const slugPath = slug ? slug.join("/") : "/"
    const exactSlug = slug ? slugPath : "/"

    console.log(`[Page] Domain: ${domain}, SiteID: ${siteData.id}, Slug: ${JSON.stringify(slug)}, Exact: ${exactSlug}`)

    const page = await prisma.page.findFirst({
        where: {
            siteId: siteData.id,
            OR: [
                { slug: exactSlug },
                { slug: `/${exactSlug}` },
                { slug: exactSlug.startsWith('/') ? exactSlug : `/${exactSlug}` }
            ],
            published: true
        }
    })

    if (!page) {
        // Fallback: If home page "/" and not found, maybe show standard home?
        // Or just 404.
        return notFound()
    }

    let blocks: BlockData[] = []
    try {
        blocks = typeof page.content === 'string' ? JSON.parse(page.content) : page.content
    } catch (e) {
        console.error("Failed to parse page blocks", e)
    }

    return (
        <main className="min-h-screen bg-white">
            {blocks.map((block) => (
                <BlockRenderer key={block.id} block={block} />
            ))}
        </main>
    )
}
