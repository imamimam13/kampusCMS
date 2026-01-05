"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"

interface EventFormProps {
    initialData?: any
}

export function EventForm({ initialData }: EventFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState(initialData?.title || "")
    const [slug, setSlug] = useState(initialData?.slug || "")
    // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
    const formatDateForInput = (dateString: string) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        const offset = date.getTimezoneOffset()
        const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000))
        return adjustedDate.toISOString().slice(0, 16)
    }

    const [startDate, setStartDate] = useState(formatDateForInput(initialData?.startDate) || "")
    const [endDate, setEndDate] = useState(formatDateForInput(initialData?.endDate) || "")
    const [location, setLocation] = useState(initialData?.location || "")
    const [description, setDescription] = useState(initialData?.description || "")
    const [image, setImage] = useState(initialData?.image || "")
    const [category, setCategory] = useState(initialData?.category || "Academic")

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = { title, slug, description, startDate, endDate, location, category, image }
            const method = initialData ? 'PUT' : 'POST'
            const body = initialData ? { id: initialData.id, ...data } : data

            const res = await fetch('/api/events', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (!res.ok) throw new Error("Failed to save")

            router.push('/admin/calendar')
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8 max-w-3xl">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Event Title</Label>
                        <Input
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                                if (!slug) setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))
                            }}
                            required
                            placeholder="e.g. Graduation Ceremony 2025"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>URL Slug</Label>
                        <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Start Date & Time</Label>
                        <Input
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>End Date & Time (Optional)</Label>
                        <Input
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Location</Label>
                        <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Auditorium Hall A" />
                    </div>
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <select
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="Academic">Academic</option>
                            <option value="Student Life">Student Life</option>
                            <option value="Admissions">Admissions</option>
                            <option value="Holiday">Holiday</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Event Image (URL)</Label>
                    <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
                </div>

                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder="Event details..." />
                </div>
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Event"}
            </Button>
        </form>
    )
}
