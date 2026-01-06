"use client"

import { BlockData } from "@/types/builder"
import { useEffect, useState } from "react"
import { ExternalLink, Rss } from "lucide-react"

export function RSSBlock({ data }: { data: BlockData }) {
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    // Config
    const rssUrl = data.content.url
    const keyword = data.content.keyword
    const limit = data.content.count || 6
    const title = data.content.title
    const layout = data.content.layout || "grid" // grid | list

    useEffect(() => {
        if (!rssUrl && !keyword) {
            setLoading(false)
            return
        }

        setLoading(true)
        setError(false)

        let apiUrl = `/api/rss?limit=${limit}`
        if (rssUrl) apiUrl += `&url=${encodeURIComponent(rssUrl)}`
        else if (keyword) apiUrl += `&keyword=${encodeURIComponent(keyword)}`

        fetch(apiUrl)
            .then(res => {
                if (!res.ok) throw new Error("Failed")
                return res.json()
            })
            .then(data => {
                if (data.items) setItems(data.items)
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false))

    }, [rssUrl, keyword, limit])

    if (!rssUrl && !keyword) {
        return (
            <div className="py-12 px-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg text-center mx-auto max-w-4xl my-8">
                <Rss className="h-10 w-10 text-orange-400 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-slate-900">RSS Feed Block</h3>
                <p className="text-slate-500">Please configure a valid RSS URL or Keyword in the settings.</p>
            </div>
        )
    }

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-10 bg-red-50 text-red-600 rounded-xl">
                        <p>Failed to load feed. Please check the URL or try again later.</p>
                    </div>
                ) : (
                    <div className={layout === 'list' ? 'space-y-4 max-w-3xl mx-auto' : 'grid grid-cols-1 md:grid-cols-3 gap-6'}>
                        {items.map((item, idx) => (
                            <a
                                key={idx}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-orange-200 ${layout === 'list' ? 'flex items-start gap-4 p-4' : 'flex flex-col h-full'}`}
                            >
                                {/* Image (if available or fallback) */}
                                {layout !== 'list' && (
                                    <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-200">
                                                <Rss className="h-12 w-12" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className={`flex flex-col flex-1 ${layout !== 'list' ? 'p-5' : ''}`}>
                                    <h3 className="font-bold text-gray-900 group-hover:text-orange-600 mb-2 line-clamp-2 leading-tight">
                                        {item.title}
                                    </h3>

                                    {layout !== 'list' && (
                                        <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-1">
                                            {item.contentSnippet || "No description available."}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between mt-auto pt-2 text-xs text-slate-400">
                                        <span>{new Date(item.pubDate).toLocaleDateString()}</span>
                                        <ExternalLink className="h-3 w-3" />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
