"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"

export function AlertForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Simple state form
    const [content, setContent] = useState("")
    const [link, setLink] = useState("")
    const [isActive, setIsActive] = useState(true)
    const [endDate, setEndDate] = useState("")

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await fetch('/api/alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    link,
                    isActive,
                    endDate: endDate ? new Date(endDate).toISOString() : null
                })
            })
            router.push('/admin/alerts')
            router.refresh()
        } catch (error) {
            alert("Failed to save")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4 max-w-lg border p-6 rounded-lg bg-white shadow-sm">
            <div className="space-y-2">
                <Label>Announcement Text</Label>
                <Input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="e.g. Campus closed for holidays..."
                    required
                />
            </div>

            <div className="space-y-2">
                <Label>Link (Optional)</Label>
                <Input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://..."
                />
            </div>

            <div className="space-y-2">
                <Label>End Date (Optional)</Label>
                <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Alert will auto-hide after this date.</p>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    checked={isActive}
                    onCheckedChange={setIsActive}
                />
                <Label>Active Immediately</Label>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Saving..." : "Create Alert"}
            </Button>
        </form>
    )
}
