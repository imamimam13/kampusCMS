"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { FileText, UploadCloud, Loader2, CheckCircle } from "lucide-react"

interface DownloadFormProps {
    initialData?: any
}

const CATEGORIES = ["Academic", "Administrative", "Student Life", "Research", "Other"]

export function DownloadForm({ initialData }: DownloadFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [title, setTitle] = useState(initialData?.title || "")
    const [fileUrl, setFileUrl] = useState(initialData?.fileUrl || "")
    const [category, setCategory] = useState(initialData?.category || "Academic")

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return

        const file = e.target.files[0]
        setUploading(true)

        // Find a way to default the title if empty
        if (!title) {
            // Remove extension and underscores for a cleaner title
            const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ")
            setTitle(cleanName)
        }

        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) throw new Error("Upload failed")

            const data = await res.json()
            setFileUrl(data.url)
        } catch (error) {
            console.error(error)
            alert("Upload failed. Please try again.")
        } finally {
            setUploading(false)
            // Reset input so same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = { title, fileUrl, category }

            const res = await fetch('/api/downloads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (!res.ok) throw new Error("Failed to save")

            router.push('/admin/downloads')
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8 max-w-xl">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Document Title</Label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="e.g. Academic Calendar 2025"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Category</Label>
                    <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label>File URL</Label>
                    <div className="flex gap-2">
                        <Input
                            value={fileUrl}
                            onChange={(e) => setFileUrl(e.target.value)}
                            required
                            placeholder="https://... or upload a file"
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                        <Button
                            type="button"
                            variant={uploading ? "secondary" : "outline"}
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <UploadCloud className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                    {fileUrl && fileUrl.startsWith('/uploads/') && (
                        <div className="flex items-center gap-2 text-xs text-green-600 mt-1">
                            <CheckCircle className="h-3 w-3" />
                            File uploaded successfully
                        </div>
                    )}
                    <p className="text-xs text-muted-foreground">Upload a file or paste a direct URL.</p>
                </div>
            </div>

            <Button type="submit" disabled={loading || uploading}>
                {loading ? "Saving..." : "Add Document"}
            </Button>
        </form>
    )
}
