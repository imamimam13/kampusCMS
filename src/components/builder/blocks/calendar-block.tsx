"use client"

import { BlockData } from "@/types/builder"
import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarIcon, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CalendarBlock({ data }: { data: BlockData }) {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const count = data.content.count || 3
        fetch(`/api/events?limit=${count}&upcoming=true`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setEvents(data)
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [data.content.count])

    // If waiting for data or no events
    if (!loading && events.length === 0) {
        return (
            <div className="py-12 px-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg text-center mx-auto max-w-7xl my-8">
                <CalendarIcon className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-slate-900">Events Calendar</h3>
                <p className="text-slate-500">No upcoming events found. Add events in the Calendar menu to display them here.</p>
            </div>
        )
    }

    return (
        <div className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div className="text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            {data.content.title || "Upcoming Events"}
                        </h2>
                        <p className="mt-2 text-lg text-gray-600">
                            {data.content.subtitle || "Don't miss out on what's happening on campus."}
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/agenda">
                            View All Events <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse"></div>
                        ))
                    ) : (
                        events.map((event) => (
                            <Link
                                key={event.id}
                                href={`/agenda/${event.slug}`}
                                className="group block bg-slate-50 rounded-xl overflow-hidden hover:shadow-md transition-all border border-slate-100 hover:border-blue-200"
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="px-3 py-1 bg-white text-blue-700 rounded-md text-sm font-bold shadow-sm border">
                                            {new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            {event.category || "Event"}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2 min-h-[3.5rem]">
                                        {event.title}
                                    </h3>

                                    <div className="flex items-center text-sm text-slate-500 gap-4 mt-4">
                                        <div className="flex items-center gap-1">
                                            <CalendarIcon className="h-4 w-4" />
                                            <span>{new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        {event.location && (
                                            <div className="flex items-center gap-1 truncate">
                                                <MapPin className="h-4 w-4" />
                                                <span className="truncate max-w-[100px]">{event.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
