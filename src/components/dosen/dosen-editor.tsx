"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save } from "lucide-react"
import { useRouter } from "next/navigation"

export function DosenEditor({ staff }: { staff: any }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: staff?.name || "",
        bio: staff?.bio || "",
        nidn: staff?.nidn || "",
        // We can add links parsing here later
    })

    const handleSave = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/dosen/me', {
                method: 'PATCH',
                body: JSON.stringify(formData)
            })

            if (!res.ok) throw new Error("Failed to save")

            router.refresh()
            alert("Profile updated!")
        } catch (err) {
            console.error(err)
            alert("Error saving profile")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-card border rounded-lg p-6 space-y-6">
            <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label>NIDN / NIP</Label>
                <Input
                    value={formData.nidn}
                    onChange={(e) => setFormData({ ...formData, nidn: e.target.value })}
                    placeholder="Optional"
                />
            </div>

            <div className="space-y-2">
                <Label>Biography</Label>
                <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={6}
                    placeholder="Tell us about your academic background and research interests..."
                />
            </div>

            <div className="pt-4">
                <Button onClick={handleSave} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </div>
        </div>
    )
}
