"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

interface ProdiGridBlockProps {
    content: {
        title?: string
        description?: string
        count?: number
    }
}

export function ProdiGridBlock({ content }: ProdiGridBlockProps) {
    const [prodiList, setProdiList] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetch('/api/prodi')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProdiList(data)
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    const displayList = content.count ? prodiList.slice(0, content.count) : prodiList

    return (
        <section className="py-12 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">{content.title || "Academic Programs"}</h2>
                    {content.description && (
                        <p className="text-muted-foreground text-lg">{content.description}</p>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 rounded-xl bg-slate-200 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayList.map((prodi) => (
                            <Card key={prodi.id} className="hover:shadow-md transition-all group border-0 shadow-sm">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="secondary" className="font-mono">{prodi.code}</Badge>
                                        <Badge variant="outline">{prodi.degree}</Badge>
                                    </div>
                                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                                        <Link href={`/prodi/${prodi.code}`}>
                                            {prodi.name}
                                        </Link>
                                    </CardTitle>
                                    {prodi.accreditation && (
                                        <CardDescription>
                                            <span className="inline-block px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                                                Accreditation: {prodi.accreditation}
                                            </span>
                                        </CardDescription>
                                    )}
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
