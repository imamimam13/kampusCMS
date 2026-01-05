"use client"

import { BlockData } from "@/types/builder"
import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Download, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DownloadBlock({ data }: { data: BlockData }) {
    const [downloads, setDownloads] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const count = data.content.count || 5
        fetch(`/api/downloads?limit=${count}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setDownloads(data)
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [data.content.count])

    // If waiting for data or no events
    if (!loading && downloads.length === 0) {
        return (
            <div className="py-12 px-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg text-center mx-auto max-w-5xl my-8">
                <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-slate-900">Download Center</h3>
                <p className="text-slate-500">No documents found. Add files in the Downloads menu to display them here.</p>
            </div>
        )
    }

    return (
        <div className="py-16 px-4 bg-slate-50">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                        {data.content.title || "Downloads"}
                    </h2>
                    <Button asChild variant="link" className="text-blue-600">
                        <Link href="/download">
                            View All <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border divide-y">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="p-4 h-20 animate-pulse">
                                <div className="h-4 bg-slate-100 rounded w-1/3 mb-2"></div>
                                <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                            </div>
                        ))
                    ) : (
                        downloads.map((doc) => (
                            <div key={doc.id} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3 w-full">
                                    <div className="h-10 w-10 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
                                        <p className="text-xs text-muted-foreground">{doc.category || "General"}</p>
                                    </div>
                                </div>
                                <Button asChild variant="ghost" size="sm" className="shrink-0">
                                    <a href={doc.fileUrl} target="_blank" download>
                                        <Download className="mr-2 h-4 w-4" /> Download
                                    </a>
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
