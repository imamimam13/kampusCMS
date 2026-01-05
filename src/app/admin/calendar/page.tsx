import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit, Trash2, Calendar } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"

export const dynamic = 'force-dynamic'

export default async function CalendarAdminPage() {
    const events = await prisma.event.findMany({
        orderBy: { startDate: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Calendar & Events</h1>
                    <p className="text-muted-foreground">Manage academic schedules and campus events.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/calendar/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Event
                    </Link>
                </Button>
            </div>

            <div className="border rounded-md bg-white">
                <div className="p-4 grid grid-cols-12 gap-4 border-b font-medium text-sm text-muted-foreground bg-slate-50 rounded-t-md">
                    <div className="col-span-4">Event Name</div>
                    <div className="col-span-3">Date</div>
                    <div className="col-span-3">Location</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {events.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No events found. Click "Add Event" to create one.
                    </div>
                ) : (
                    <div className="divide-y">
                        {events.map((event: any) => (
                            <div key={event.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 transition-colors text-sm">
                                <div className="col-span-4 font-medium flex items-center gap-2">
                                    <div className="h-8 w-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <span className="truncate">{event.title}</span>
                                </div>
                                <div className="col-span-3 text-muted-foreground">
                                    {new Date(event.startDate).toLocaleDateString(undefined, {
                                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                    })}
                                </div>
                                <div className="col-span-3 text-muted-foreground truncate">
                                    {event.location || "-"}
                                </div>
                                <div className="col-span-2 flex justify-end gap-2">
                                    <Button asChild variant="ghost" size="icon">
                                        <Link href={`/admin/calendar/${event.id}`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <DeleteButton id={event.id} apiPath="/api/events" itemName="event" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
