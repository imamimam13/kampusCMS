"use client"

import { BlockData } from "@/types/builder"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { useState, useEffect } from "react"

export function NewsGridBlock({ data }: { data: BlockData }) {
    const { title } = data.content || {}
    const [news, setNews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/posts?limit=3&published=true')
                if (res.ok) {
                    const data = await res.json()
                    setNews(data)
                }
            } catch (error) {
                console.error("Failed to fetch news", error)
            } finally {
                setLoading(false)
            }
        }
        fetchNews()
    }, [])

    return (
        <section className="py-16 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-bold">{title || "Latest News"}</h2>
                    <Link href="/posts" className="text-blue-600 font-medium hover:underline">View All News &rarr;</Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-200 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {news.map((item, i) => (
                            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                                {item.image ? (
                                    <div className="h-48 w-full relative overflow-hidden">
                                        <img src={item.image} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                ) : (
                                    <div className="h-48 bg-slate-200 w-full flex items-center justify-center text-slate-400">
                                        No Image
                                    </div>
                                )}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">News</span>
                                        <span className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        <Link href={`/posts/${item.slug}`}>{item.title}</Link>
                                    </h3>
                                    <div className="text-slate-600 text-sm line-clamp-2 flex-1" dangerouslySetInnerHTML={{ __html: item.content }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
