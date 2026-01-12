
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function NewSitePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const data = {
            name: formData.get("name"),
            subdomain: formData.get("subdomain"),
            description: formData.get("description"),
            colors: {
                primary: formData.get("primaryColor"),
                secondary: formData.get("secondaryColor")
            }
        }

        try {
            const res = await fetch("/api/sites", {
                method: "POST",
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const text = await res.text()
                throw new Error(text || "Failed to create site")
            }

            toast.success("Site created successfully")
            router.push("/admin/sites")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">New Site</h2>
                <p className="text-muted-foreground">
                    Create a new sub-site within the campus network.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Site Details</CardTitle>
                    <CardDescription>
                        Configure the basic settings for the new site.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Site Name</Label>
                            <Input id="name" name="name" placeholder="e.g. Faculty of Engineering" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subdomain">Subdomain</Label>
                            <div className="flex items-center space-x-2">
                                <Input id="subdomain" name="subdomain" placeholder="engineering" required className="flex-1" />
                                <span className="text-muted-foreground text-sm font-medium">.localhost</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Only lowercase letters, numbers, and hyphens.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea id="description" name="description" placeholder="Short description of this site..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="primaryColor">Primary Color</Label>
                                <div className="flex gap-2">
                                    <Input type="color" id="primaryColor" name="primaryColor" defaultValue="#0f172a" className="w-12 p-1 h-9" />
                                    <Input type="text" defaultValue="#0f172a" className="flex-1" readOnly tabIndex={-1} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="secondaryColor">Secondary Color</Label>
                                <div className="flex gap-2">
                                    <Input type="color" id="secondaryColor" name="secondaryColor" defaultValue="#3b82f6" className="w-12 p-1 h-9" />
                                    <Input type="text" defaultValue="#3b82f6" className="flex-1" readOnly tabIndex={-1} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-2">
                            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Site
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
