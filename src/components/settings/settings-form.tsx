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
        aiConfig: { provider: 'gemini', geminiKey: '', openaiKey: '', openRouterKey: '' }
    })

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                // Merge with defaults to ensure nested objects exist
                setFormData({
                    ...data,
                    colors: data.colors || { primary: "#0f172a", secondary: "#3b82f6" },
                    fonts: data.fonts || { heading: "Inter", body: "Inter" },
                    aiConfig: data.aiConfig || { provider: 'gemini', geminiKey: '', openaiKey: '' }
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
                <TabsList className="grid w-full grid-cols-5 lg:w-[500px]">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="navigation">Navigation</TabsTrigger>
                    <TabsTrigger value="scripts">Scripts</TabsTrigger>
                    <TabsTrigger value="ai">AI Integration</TabsTrigger>
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

                            <div className="space-y-2">
                                <Label>Footer Text</Label>
                                <Input
                                    value={formData.footerText || ''}
                                    onChange={(e) => handleChange('footerText', e.target.value)}
                                    placeholder="© 2024 KampusCMS. All rights reserved."
                                />
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

                {/* AI Settings */}
                <TabsContent value="ai" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Configuration</CardTitle>
                            <CardDescription>Configure AI providers for content generation.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Default Provider</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.aiConfig?.provider || 'gemini'}
                                    onChange={(e) => handleNestedChange('aiConfig', 'provider', e.target.value)}
                                >
                                    <option value="gemini">Google Gemini</option>
                                    <option value="openai">OpenAI (GPT-4/3.5)</option>
                                    <option value="openrouter">OpenRouter</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Gemini API Key</Label>
                                <Input
                                    type="password"
                                    placeholder="AIza..."
                                    value={formData.aiConfig?.geminiKey || ''}
                                    onChange={(e) => handleNestedChange('aiConfig', 'geminiKey', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Gemini Model</Label>
                                <Input
                                    placeholder="gemini-pro"
                                    value={formData.aiConfig?.geminiModel || 'gemini-pro'}
                                    onChange={(e) => handleNestedChange('aiConfig', 'geminiModel', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">e.g. gemini-pro, gemini-1.5-flash</p>
                            </div>

                            <div className="space-y-2">
                                <Label>OpenAI API Key</Label>
                                <Input
                                    type="password"
                                    placeholder="sk-..."
                                    value={formData.aiConfig?.openaiKey || ''}
                                    onChange={(e) => handleNestedChange('aiConfig', 'openaiKey', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>OpenAI Model</Label>
                                <Input
                                    placeholder="gpt-3.5-turbo"
                                    value={formData.aiConfig?.openaiModel || 'gpt-3.5-turbo'}
                                    onChange={(e) => handleNestedChange('aiConfig', 'openaiModel', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">e.g. gpt-3.5-turbo, gpt-4</p>
                            </div>

                            <div className="space-y-2 pt-4 border-t">
                                <Label>OpenRouter API Key</Label>
                                <Input
                                    type="password"
                                    placeholder="sk-or-..."
                                    value={formData.aiConfig?.openRouterKey || ''}
                                    onChange={(e) => handleNestedChange('aiConfig', 'openRouterKey', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>OpenRouter Model</Label>
                                <Input
                                    placeholder="openai/gpt-3.5-turbo"
                                    value={formData.aiConfig?.openRouterModel || 'openai/gpt-3.5-turbo'}
                                    onChange={(e) => handleNestedChange('aiConfig', 'openRouterModel', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">e.g. openai/gpt-4o, anthropic/claude-3-opus</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
