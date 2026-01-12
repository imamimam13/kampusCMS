import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Calendar, MapPin, Clock, ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Params is a promise in Next.js 15
export default async function EventDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = await params

    const event = await prisma.event.findUnique({
        where: { slug }
    })

    if (!event) notFound()

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Button asChild variant="ghost" className="mb-6 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-gray-900">
                    <Link href="/agenda">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Agenda
                    </Link>
                </Button>

                <article className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    {event.image && (
                        <div className="relative h-64 sm:h-96 w-full bg-slate-100">
                            <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div className="p-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                {event.category || "Event"}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                            {event.title}
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-y py-6">
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-gray-900">Date</p>
                                    <p className="text-muted-foreground">
                                        {new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-gray-900">Time</p>
                                    <p className="text-muted-foreground">
                                        {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {event.endDate && ` - ${new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-gray-900">Location</p>
                                    <p className="text-muted-foreground">{event.location || "TBA"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="prose max-w-none text-gray-600">
                            <p className="whitespace-pre-wrap">{event.description}</p>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    )
}
