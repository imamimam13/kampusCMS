"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { UploadCloud, Sparkles } from "lucide-react"

interface PostFormProps {
    initialData?: any
}

export function PostForm({ initialData }: PostFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Form States
    const [title, setTitle] = useState(initialData?.title || "")
    const [content, setContent] = useState(initialData?.content || "")
    const [image, setImage] = useState(initialData?.image || "")
    const [published, setPublished] = useState(initialData?.published || false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const url = initialData?.id ? `/api/posts/${initialData.id}` : '/api/posts'
        const method = initialData?.id ? 'PUT' : 'POST'

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    image,
                    published
                })
            })

            if (!res.ok) throw new Error("Failed to save")

            router.push('/admin/posts')
            router.refresh()
        } catch (error) {
            alert("Something went wrong")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Post Title</Label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                onClick={async () => {
                                    if (!content) return alert("Write some content first!")
                                    setLoading(true)
                                    try {
                                        const res = await fetch('/api/ai/generate', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ prompt: `Generate a catchy news headline for this content (max 10 words). IMPORTANT: Detect the language of the content (e.g. Indonesian) and output the headline IN THE SAME LANGUAGE: ${content}` })
                                        })
                                        const data = await res.json()
                                        if (data.result) setTitle(data.result.replace(/^"|"$/g, ''))
                                    } catch (e) { console.error(e); alert("AI Failed") }
                                    setLoading(false)
                                }}
                            >
                                <Sparkles className="w-3 h-3 mr-1" />
                                Generate Title
                            </Button>
                        </div>
                        <Input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Enter article title..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Content</Label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                onClick={async () => {
                                    if (content.length < 10) return alert("Write a bit more first!")
                                    setLoading(true)
                                    try {
                                        const res = await fetch('/api/ai/generate', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ prompt: `Improve this article content, fix grammar, and make it professional HTML (keep formatting). IMPORTANT: Detect the language of the content and output the result IN THE SAME LANGUAGE: ${content}` })
                                        })
                                        const data = await res.json()
                                        console.log("AI Response:", data) // Debugging

                                        if (data.result) {
                                            // Strip markdown code fences if present
                                            let cleanContent = data.result.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '')
                                            setContent(cleanContent)
                                        }
                                    } catch (e) { console.error(e); alert("AI Failed") }
                                    setLoading(false)
                                }}
                            >
                                <Sparkles className="w-3 h-3 mr-1" />
                                Enhance Writing
                            </Button>
                        </div>
                        <RichTextEditor
                            value={content}
                            onChange={setContent}
                        />
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <div className="p-4 border rounded-lg bg-white space-y-4">
                        <h3 className="font-semibold">Publishing</h3>

                        <div className="flex items-center justify-between">
                            <Label>Published</Label>
                            <Switch checked={published} onCheckedChange={setPublished} />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Saving..." : (initialData ? "Update Post" : "Create Post")}
                        </Button>
                    </div>

                    <div className="p-4 border rounded-lg bg-white space-y-4">
                        <h3 className="font-semibold">Featured Image</h3>

                        {image ? (
                            <div className="relative aspect-video rounded-md overflow-hidden bg-slate-100">
                                <img src={image} alt="Preview" className="object-cover w-full h-full" />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2 h-6 w-6 p-0"
                                    onClick={() => setImage("")}
                                >
                                    ×
                                </Button>
                            </div>
                        ) : (
                            <div
                                className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                                onClick={() => document.getElementById('post-image')?.click()}
                            >
                                <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                <span className="text-xs text-muted-foreground">Click to upload</span>
                            </div>
                        )}

                        <input
                            id="post-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return

                                const formData = new FormData()
                                formData.append('file', file)

                                const res = await fetch('/api/upload', { method: 'POST', body: formData })
                                if (res.ok) {
                                    const data = await res.json()
                                    setImage(data.url)
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </form>
    )
}
