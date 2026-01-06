"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, Timer, CheckCircle2 } from "lucide-react"

interface TracerStatsBlockProps {
    content: {
        title?: string
        description?: string
    }
}

export function TracerStatsBlock({ content }: TracerStatsBlockProps) {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/public/tracer-stats')
            .then(res => res.json())
            .then(data => {
                setStats(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading stats...</div>
    }

    if (!stats) return null

    return (
        <section className="py-12 bg-slate-50">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        {content.title || "Alumni Success"}
                    </h2>
                    {content.description && (
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                            {content.description}
                        </p>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Total Alumni</CardTitle>
                            <Users className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">Graduates tracked</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Employed Rate</CardTitle>
                            <Briefcase className="w-4 h-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.employedRate}%</div>
                            <p className="text-xs text-muted-foreground">Working or Entrepreneur</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Fast Hired</CardTitle>
                            <Timer className="w-4 h-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.fastHiredRate}%</div>
                            <p className="text-xs text-muted-foreground">Hired within 6 months</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">High Relevance</CardTitle>
                            <CheckCircle2 className="w-4 h-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.relevantJobRate}%</div>
                            <p className="text-xs text-muted-foreground">Job matches study field</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
