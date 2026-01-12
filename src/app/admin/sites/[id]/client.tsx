
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Loader2, Save, Trash2, ArrowLeft } from "lucide-react"
import type { Site } from "@prisma/client"

// Constants
const AVAILABLE_BLOCKS = [
    { id: "hero", label: "Hero Section" },
    { id: "features", label: "Features List" },
    { id: "about", label: "About Section" },
    { id: "gallery", label: "Gallery Grid" },
    { id: "news-grid", label: "News / Post Grid" },
    { id: "calendar", label: "Calendar / Events" },
    { id: "download", label: "Download List" },
    { id: "contact", label: "Contact Form / Info" },
    { id: "staff-grid", label: "Staff Directory" },
    { id: "prodi-grid", label: "Program Studi Grid" },
    { id: "carousel", label: "Image Carousel" },
    { id: "card-grid", label: "Card Grid (Generic)" },
    { id: "columns", label: "Two Columns" },
    { id: "image", label: "Single Image" },
    { id: "separator", label: "Separator / Divider" },
    { id: "social", label: "Social Media Embeds" },
    { id: "rss", label: "RSS Feed" },
    { id: "tracer-stats", label: "Tracer Study Stats" },
]

export function EditSiteClient({ site }: { site: Site }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [enabledBlocks, setEnabledBlocks] = useState<string[]>(
        (site.enabledBlocks as string[]) || AVAILABLE_BLOCKS.map(b => b.id)
    )
    const [enabledSidebarItems, setEnabledSidebarItems] = useState<string[] | null>(
        (site.enabledSidebarItems as string[]) || null
    )

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const data = {
            name: formData.get("name"),
            subdomain: formData.get("subdomain"),
            customDomain: formData.get("customDomain"),
            description: formData.get("description"),
            colors: {
                primary: formData.get("primaryColor"),
                secondary: formData.get("secondaryColor")
            },
            enabledBlocks,
            enabledSidebarItems
        }

        try {
            const res = await fetch(`/api/sites/${site.id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                throw new Error("Failed to update site")
            }

            toast.success("Site updated successfully")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleSidebarItem = (item: string) => {
        setEnabledSidebarItems(prev => {
            const current = prev || ["Program Studi", "Tracer Study", "News & Posts", "Calendar", "Downloads", "Dosen / Staff Directory", "Gallery", "Alerts"]
            return current.includes(item)
                ? current.filter(i => i !== item)
                : [...current, item]
        })
    }

    async function onDelete() {
        if (!confirm("Are you sure you want to delete this site? This action cannot be undone.")) return

        setIsLoading(true)
        try {
            const res = await fetch(`/api/sites/${site.id}`, {
                method: "DELETE",
            })

            if (!res.ok) {
                const text = await res.text()
                throw new Error(text || "Failed to delete site")
            }

            toast.success("Site deleted")
            router.push("/admin/sites")
        } catch (error: any) {
            toast.error(error.message)
            setIsLoading(false)
        }
    }

    const toggleBlock = (blockId: string) => {
        setEnabledBlocks(prev =>
            prev.includes(blockId)
                ? prev.filter(id => id !== blockId)
                : [...prev, blockId]
        )
    }

    // Colors parsing
    const colors = (site.colors as any) || { primary: "#0f172a", secondary: "#3b82f6" }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/sites')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-3xl font-bold tracking-tight">Edit Site</h2>
                    </div>
                    <p className="text-muted-foreground pl-10">
                        Manage configuration for {site.name}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="destructive" size="sm" onClick={onDelete} disabled={site.subdomain === 'main' || isLoading}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <form onSubmit={onSubmit}>
                <Tabs defaultValue="general" className="w-full">
                    <TabsList>
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="builder">Page Builder</TabsTrigger>
                        <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
                        <TabsTrigger value="theme">Theme</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general">
                        <Card>
                            <CardHeader>
                                <CardTitle>General Information</CardTitle>
                                <CardDescription>Basic site details and domain settings.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Site Name</Label>
                                    <Input id="name" name="name" defaultValue={site.name} required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="subdomain">Subdomain</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input id="subdomain" name="subdomain" defaultValue={site.subdomain} required />
                                            <span className="text-muted-foreground text-sm font-medium">.localhost</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
                                        <Input id="customDomain" name="customDomain" defaultValue={site.customDomain || ''} placeholder="e.g. bem.uwb.ac.id" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" defaultValue={site.description || ''} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="builder">
                        <Card>
                            <CardHeader>
                                <CardTitle>Page Builder Configuration</CardTitle>
                                <CardDescription>Control which blocks are available for this site's editors.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {AVAILABLE_BLOCKS.map(block => (
                                        <div key={block.id} className="flex items-center space-x-2 border p-3 rounded-md">
                                            <Checkbox
                                                id={`block-${block.id}`}
                                                checked={enabledBlocks.includes(block.id)}
                                                onCheckedChange={() => toggleBlock(block.id)}
                                            />
                                            <Label htmlFor={`block-${block.id}`} className="cursor-pointer font-normal">
                                                {block.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Button type="button" variant="outline" size="sm" onClick={() => setEnabledBlocks(AVAILABLE_BLOCKS.map(b => b.id))}>Select All</Button>
                                    <Button type="button" variant="outline" size="sm" onClick={() => setEnabledBlocks([])}>Deselect All</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="sidebar">
                        <Card>
                            <CardHeader>
                                <CardTitle>Admin Sidebar Configuration</CardTitle>
                                <CardDescription>Control which menu items appear in the admin dashboard for this site.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {["Program Studi", "Tracer Study", "News & Posts", "Calendar", "Downloads", "Dosen / Staff Directory", "Gallery", "Alerts"].map(item => (
                                        <div key={item} className="flex items-center space-x-2 border p-3 rounded-md">
                                            <Checkbox
                                                id={`sidebar-${item}`}
                                                checked={!enabledSidebarItems || enabledSidebarItems.includes(item)}
                                                onCheckedChange={() => toggleSidebarItem(item)}
                                            />
                                            <Label htmlFor={`sidebar-${item}`} className="cursor-pointer font-normal">
                                                {item}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="theme">
                        <Card>
                            <CardHeader>
                                <CardTitle>Theme Colors</CardTitle>
                                <CardDescription>Customize the primary branding colors.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="primaryColor">Primary Color</Label>
                                        <div className="flex gap-2">
                                            <Input type="color" id="primaryColor" name="primaryColor" defaultValue={colors.primary} className="w-12 p-1 h-9" />
                                            <Input type="text" defaultValue={colors.primary} className="flex-1" readOnly tabIndex={-1} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                                        <div className="flex gap-2">
                                            <Input type="color" id="secondaryColor" name="secondaryColor" defaultValue={colors.secondary} className="w-12 p-1 h-9" />
                                            <Input type="text" defaultValue={colors.secondary} className="flex-1" readOnly tabIndex={-1} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="mt-6 flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    )
}
