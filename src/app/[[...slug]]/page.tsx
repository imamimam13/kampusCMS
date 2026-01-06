
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { BlockRenderer } from "@/components/builder/block-renderer"
import { BlockData } from "@/types/builder"

export const dynamic = 'force-dynamic'

// Next.js 14 catch-all route: [[...slug]]
// This handles / and /about and /foo/bar etc.
export default async function PublicPage({ params }: { params: { slug?: string[] } }) {
    // If no slug, it's the home page "/"
    const { slug } = await params
    // In Prisma, we might save it as "/" or just empty slug.
    // Let's assume user saves it as "/" for home.

    const slugPath = slug ? slug.join("/") : "/"
    const exactSlug = slug ? slugPath : "/"

    const page = await prisma.page.findFirst({
        where: {
            OR: [
                { slug: exactSlug },
                { slug: `/${exactSlug}` }, // Try relative path
                { slug: exactSlug.startsWith('/') ? exactSlug : `/${exactSlug}` }
            ],
            published: true
        }
    })

    if (!page) {
        notFound()
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
