"use client"

import { BlockData } from "@/types/builder"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Image as ImageIcon, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function GalleryBlock({ data }: { data: BlockData }) {
    const [albums, setAlbums] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const count = data.content.count || 3
        fetch(`/api/gallery?limit=${count}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAlbums(data)
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [data.content.count])

    // If waiting for data or no events
    if (!loading && albums.length === 0) {
        return (
            <div className="py-12 px-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg text-center mx-auto max-w-5xl my-8">
                <ImageIcon className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-slate-900">Gallery</h3>
                <p className="text-slate-500">No albums found. Create albums in the Gallery menu.</p>
            </div>
        )
    }

    return (
        <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            {data.content.title || "Campus Gallery"}
                        </h2>
                        {data.content.subtitle && (
                            <p className="mt-2 text-lg text-muted-foreground">{data.content.subtitle}</p>
                        )}
                    </div>

                    <Button asChild variant="outline" className="hidden sm:inline-flex">
                        <Link href="/gallery">
                            View All Albums
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="aspect-[4/3] bg-slate-100 rounded-xl animate-pulse" />
                        ))
                    ) : (
                        albums.map((album) => (
                            <Link
                                key={album.id}
                                href={`/gallery/${album.id}`}
                                className="group relative block aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-sm hover:shadow-xl transition-all"
                            >
                                {album.coverImage ? (
                                    <Image
                                        src={album.coverImage}
                                        alt={album.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-slate-300">
                                        <ImageIcon className="h-12 w-12" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60 ml-4 mb-4 rounded-xl" />
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <h3 className="font-bold text-lg leading-tight truncate">{album.title}</h3>
                                    <p className="text-xs text-white/80 mt-1">{album.description || `${album.images?.length || 0} Photos`}</p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                <div className="mt-8 sm:hidden">
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/gallery">
                            View All Albums
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
