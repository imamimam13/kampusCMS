"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, Palette, Type, Code, Globe, Save } from "lucide-react"

export function SettingsForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState<any>({
        name: "",
        description: "",
        logo: "",
        colors: { primary: "#0f172a", secondary: "#3b82f6" },
        fonts: { heading: "Inter", body: "Inter" },
        headerLinks: [],
        footerText: "",
        headCode: "",
        bodyCode: "",
        footerConfig: { description: "", contact: "" },
        aiConfig: { provider: 'gemini', geminiKey: '', openaiKey: '', openRouterKey: '' },
        enabledBlocks: null
    })

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

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                // Merge with defaults to ensure nested objects exist
                setFormData({
                    ...data,
                    colors: data.colors || { primary: "#0f172a", secondary: "#3b82f6" },
                    fonts: data.fonts || { heading: "Inter", body: "Inter" },
                    footerConfig: data.footerConfig || { description: "", contact: "" },
                    aiConfig: data.aiConfig || { provider: 'gemini', geminiKey: '', openaiKey: '' },
                    enabledBlocks: data.enabledBlocks || null
                })
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    const handleChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }))
    }

    const handleNestedChange = (parent: string, key: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [parent]: { ...prev[parent], [key]: value }
        }))
    }

    const toggleBlock = (blockId: string) => {
        setFormData((prev: any) => {
            const current = prev.enabledBlocks || AVAILABLE_BLOCKS.map(b => b.id)
            const updated = current.includes(blockId)
                ? current.filter((id: string) => id !== blockId)
                : [...current, blockId]
            return { ...prev, enabledBlocks: updated }
        })
    }

    const onSubmit = async () => {
        setSaving(true)
        try {
            await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            router.refresh()
            alert("Settings saved successfully!")
        } catch (error) {
            alert("Failed to save settings")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div>Loading settings...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Site Settings</h2>
                <Button onClick={onSubmit} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-6 lg:w-[600px]">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="navigation">Navigation</TabsTrigger>
                    <TabsTrigger value="footer">Footer</TabsTrigger>
                    <TabsTrigger value="builder">Builder</TabsTrigger>
                    <TabsTrigger value="scripts">Scripts</TabsTrigger>
                    <TabsTrigger value="ai">AI</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                            <CardDescription>Basic details about your campus website.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Site Name</Label>
                                <Input
                                    value={formData.name || ''}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Site Description</Label>
                                <Textarea
                                    value={formData.description || ''}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Logo URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={formData.logo || ''}
                                        onChange={(e) => handleChange('logo', e.target.value)}
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => document.getElementById('logo-upload')?.click()}
                                    >
                                        <UploadCloud className="h-4 w-4" />
                                    </Button>
                                    <input
                                        id="logo-upload"
                                        type="file"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (!file) return
                                            const fd = new FormData()
                                            fd.append('file', file)
                                            const res = await fetch('/api/upload', { method: 'POST', body: fd })
                                            if (res.ok) {
                                                const d = await res.json()
                                                handleChange('logo', d.url)
                                            }
                                        }}
                                    />
                                </div>
                                {formData.logo && (
                                    <div className="mt-2 p-2 border rounded bg-slate-50 inline-block">
                                        <img src={formData.logo} alt="Logo" className="h-12 object-contain" />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Appearance Settings */}
                <TabsContent value="appearance" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Theme & Colors</CardTitle>
                            <CardDescription>Customize the look and feel of your site.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Primary Color</Label>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-10 h-10 rounded border shadow-sm"
                                            style={{ backgroundColor: formData.colors.primary }}
                                        />
                                        <Input
                                            type="color"
                                            className="w-full h-10 p-1 cursor-pointer"
                                            value={formData.colors.primary}
                                            onChange={(e) => handleNestedChange('colors', 'primary', e.target.value)}
                                        />
                                        <Input
                                            value={formData.colors.primary}
                                            onChange={(e) => handleNestedChange('colors', 'primary', e.target.value)}
                                            className="w-32 font-mono"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Used for buttons, links, and highlights.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Secondary Color</Label>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-10 h-10 rounded border shadow-sm"
                                            style={{ backgroundColor: formData.colors.secondary }}
                                        />
                                        <Input
                                            type="color"
                                            className="w-full h-10 p-1 cursor-pointer"
                                            value={formData.colors.secondary}
                                            onChange={(e) => handleNestedChange('colors', 'secondary', e.target.value)}
                                        />
                                        <Input
                                            value={formData.colors.secondary}
                                            onChange={(e) => handleNestedChange('colors', 'secondary', e.target.value)}
                                            className="w-32 font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Navigation Settings */}
                <TabsContent value="navigation" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Main Menu</CardTitle>
                            <CardDescription>Manage the links in your site header.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                {(formData.headerLinks || []).map((link: any, index: number) => (
                                    <div key={index} className="flex gap-4 items-center p-4 border rounded-lg bg-slate-50">
                                        <div className="grid gap-2 flex-1">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <Label className="text-xs">Label</Label>
                                                    <Input
                                                        value={link.label}
                                                        onChange={(e) => {
                                                            const newLinks = [...formData.headerLinks]
                                                            newLinks[index] = { ...link, label: e.target.value }
                                                            handleChange('headerLinks', newLinks)
                                                        }}
                                                        placeholder="Home"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs">URL</Label>
                                                    <Input
                                                        value={link.href}
                                                        onChange={(e) => {
                                                            const newLinks = [...formData.headerLinks]
                                                            newLinks[index] = { ...link, href: e.target.value }
                                                            handleChange('headerLinks', newLinks)
                                                        }}
                                                        placeholder="/"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500"
                                            onClick={() => {
                                                const newLinks = [...formData.headerLinks]
                                                newLinks.splice(index, 1)
                                                handleChange('headerLinks', newLinks)
                                            }}
                                        >
                                            <code className="text-lg">×</code>
                                        </Button>
                                    </div>
                                ))}

                                <Button
                                    variant="outline"
                                    className="w-full border-dashed"
                                    onClick={() => {
                                        handleChange('headerLinks', [...(formData.headerLinks || []), { label: "New Link", href: "/" }])
                                    }}
                                >
                                    + Add Menu Item
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Footer Settings */}
                <TabsContent value="footer" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Footer Content</CardTitle>
                            <CardDescription>Customize the content in your site footer.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Footer Text</Label>
                                <Input
                                    value={formData.footerText || ''}
                                    onChange={(e) => handleChange('footerText', e.target.value)}
                                    placeholder="© 2024 KampusCMS. All rights reserved."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Footer Description</Label>
                                <Textarea
                                    value={formData.footerConfig?.description || ''}
                                    onChange={(e) => handleNestedChange('footerConfig', 'description', e.target.value)}
                                    placeholder="A modern content management system..."
                                />
                                <p className="text-xs text-muted-foreground">Appears under the logo in the first column.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Contact Info</Label>
                                <Textarea
                                    value={formData.footerConfig?.contact || ''}
                                    onChange={(e) => handleNestedChange('footerConfig', 'contact', e.target.value)}
                                    placeholder="Jl. Kampus Merdeka No. 123..."
                                    className="min-h-[100px]"
                                />
                                <p className="text-xs text-muted-foreground">Appears in the Contact column. Supports newlines.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Page Builder Settings */}
                <TabsContent value="builder" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Page Builder Configuration</CardTitle>
                            <CardDescription>Control which blocks are available available in the page builder.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {AVAILABLE_BLOCKS.map(block => (
                                    <div key={block.id} className="flex items-center space-x-2 border p-3 rounded-md">
                                        <input
                                            type="checkbox"
                                            id={`block-${block.id}`}
                                            checked={!formData.enabledBlocks || formData.enabledBlocks.includes(block.id)}
                                            onChange={() => toggleBlock(block.id)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <Label htmlFor={`block-${block.id}`} className="cursor-pointer font-normal">
                                            {block.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => handleChange('enabledBlocks', AVAILABLE_BLOCKS.map(b => b.id))}>Select All</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => handleChange('enabledBlocks', [])}>Deselect All</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Scripts Settings */}
                <TabsContent value="scripts" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Custom Codes</CardTitle>
                            <CardDescription>Inject custom scripts for analytics, SEO, etc.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Head Code</Label>
                                <Textarea
                                    className="font-mono text-xs min-h-[150px]"
                                    placeholder="<meta name='google-site-verification' ... />"
                                    value={formData.headCode || ''}
                                    onChange={(e) => handleChange('headCode', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Output just before the closing &lt;/head&gt; tag.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Body Code</Label>
                                <Textarea
                                    className="font-mono text-xs min-h-[150px]"
                                    placeholder="<script>...</script>"
                                    value={formData.bodyCode || ''}
                                    onChange={(e) => handleChange('bodyCode', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Output just before the closing &lt;/body&gt; tag.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* AI Settings */}
                <TabsContent value="ai" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Artificial Intelligence</CardTitle>
                            <CardDescription>Configure AI providers for content generation features.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>AI Provider</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={formData.aiConfig?.provider || 'gemini'}
                                    onChange={(e) => handleNestedChange('aiConfig', 'provider', e.target.value)}
                                >
                                    <option value="gemini">Google Gemini</option>
                                    <option value="openai">OpenAI (ChatGPT)</option>
                                </select>
                            </div>

                            {formData.aiConfig?.provider === 'gemini' && (
                                <div className="space-y-2">
                                    <Label>Gemini API Key</Label>
                                    <Input
                                        type="password"
                                        value={formData.aiConfig?.geminiKey || ''}
                                        onChange={(e) => handleNestedChange('aiConfig', 'geminiKey', e.target.value)}
                                        placeholder="AIza..."
                                    />
                                    <p className="text-xs text-muted-foreground">Required for Gemini-powered features.</p>
                                </div>
                            )}

                            {formData.aiConfig?.provider === 'openai' && (
                                <div className="space-y-2">
                                    <Label>OpenAI API Key</Label>
                                    <Input
                                        type="password"
                                        value={formData.aiConfig?.openaiKey || ''}
                                        onChange={(e) => handleNestedChange('aiConfig', 'openaiKey', e.target.value)}
                                        placeholder="sk-..."
                                    />
                                    <p className="text-xs text-muted-foreground">Required for ChatGPT-powered features.</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>OpenRouter API Key (Optional)</Label>
                                <Input
                                    type="password"
                                    value={formData.aiConfig?.openRouterKey || ''}
                                    onChange={(e) => handleNestedChange('aiConfig', 'openRouterKey', e.target.value)}
                                    placeholder="sk-or-..."
                                />
                                <p className="text-xs text-muted-foreground">Used for fallback or specific models via OpenRouter.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
