
import { NextResponse } from "next/server"
import Parser from "rss-parser"

// Force dynamic for now, but we should cache results
export const dynamic = 'force-dynamic'

const parser = new Parser()

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")
    const keyword = searchParams.get("keyword")
    const limit = parseInt(searchParams.get("limit") || "5")

    try {
        let feedUrl = url

        // If keyword is provided, generate Google News RSS URL
        if (!url && keyword) {
            feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=id&gl=ID&ceid=ID:id`
        }

        if (!feedUrl) {
            return NextResponse.json({ error: "URL or Keyword is required" }, { status: 400 })
        }

        // Validate URL
        try {
            const u = new URL(feedUrl)
            if (!['http:', 'https:'].includes(u.protocol)) {
                return NextResponse.json({ error: "Invalid protocol" }, { status: 400 })
            }
        } catch {
            return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
        }

        // Fetch and parse the feed
        const feed = await parser.parseURL(feedUrl)

        // Simplify response
        const items = feed.items.slice(0, limit).map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            contentSnippet: item.contentSnippet,
            // Try to find an image if possible (Google News doesn't always give good ones easily, but standard RSS might)
            image: item.enclosure?.url || null
        }))

        return NextResponse.json({
            title: feed.title,
            description: feed.description,
            items
        })

    } catch (error: any) {
        // Handle specific errors to reduce noise
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.message?.includes('getaddrinfo')) {
            console.warn(`[RSS] Failed to fetch feed (network/DNS): ${url || keyword}`)
            return NextResponse.json({ error: "Could not reach the feed URL" }, { status: 400 })
        }

        console.error("RSS Fetch Error:", error)
        return NextResponse.json({ error: "Failed to fetch RSS feed" }, { status: 500 })
    }
}
