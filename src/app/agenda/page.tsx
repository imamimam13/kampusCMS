import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export const revalidate = 3600 // Revalidate every hour

export default async function AgendaPage() {
    // Fetch upcoming events first
    const events = await prisma.event.findMany({
        orderBy: { startDate: 'asc' },
        where: {
            startDate: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)) // From today onwards
            }
        }
    })

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-10">

                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Campus Agenda
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Stay updated with the latest academic schedules, seminars, and student activities.
                    </p>
                </div>

                <div className="grid gap-6">
                    {events.length === 0 ? (
                        <div className="text-center p-12 bg-white rounded-xl border shadow-sm">
                            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No upcoming events</h3>
                            <p className="text-muted-foreground mt-1">Check back later for updates.</p>
                        </div>
                    ) : (
                        events.map((event: any) => (
                            <div key={event.id} className="group bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row">
                                <div className="md:w-48 bg-blue-600 text-white flex flex-col items-center justify-center p-6 shrink-0">
                                    <span className="text-3xl font-bold">
                                        {new Date(event.startDate).getDate()}
                                    </span>
                                    <span className="text-lg font-medium uppercase tracking-wider">
                                        {new Date(event.startDate).toLocaleString('default', { month: 'short' })}
                                    </span>
                                    <span className="text-blue-200 text-sm mt-1">
                                        {new Date(event.startDate).getFullYear()}
                                    </span>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-2">
                                        <span className="px-2 py-0.5 bg-blue-50 rounded-full">{event.category || "General"}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                        <Link href={`/agenda/${event.slug}`}>
                                            {event.title}
                                        </Link>
                                    </h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {event.endDate && ` - ${new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                        </div>
                                        {event.location && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                {event.location}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-auto">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/agenda/${event.slug}`}>
                                                Event Details
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                                {event.image && (
                                    <div className="hidden md:block w-48 relative bg-slate-100">
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
