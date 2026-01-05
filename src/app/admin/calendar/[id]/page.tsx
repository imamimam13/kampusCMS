import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { EventForm } from "@/components/calendar/event-form"

// Params is a promise in Next.js 15
export default async function EditEventPage({ params }: { params: { id: string } }) {
    const { id } = await params

    const event = await prisma.event.findUnique({
        where: { id }
    })

    if (!event) notFound()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
                <p className="text-muted-foreground">Update event details.</p>
            </div>

            <EventForm initialData={event} />
        </div>
    )
}
