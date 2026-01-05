"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Image as ImageIcon, UploadCloud, Loader2, X } from "lucide-react"
import Image from "next/image"

interface AlbumFormProps {
    initialData?: any
}

export function AlbumForm({ initialData }: AlbumFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [title, setTitle] = useState(initialData?.title || "")
    const [description, setDescription] = useState(initialData?.description || "")
    const [coverImage, setCoverImage] = useState(initialData?.coverImage || "")

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return

        const file = e.target.files[0]
        setUploading(true)

        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) throw new Error("Upload failed")

            const data = await res.json()
            setCoverImage(data.url)
        } catch (error) {
            console.error(error)
            alert("Upload failed")
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = { title, description, coverImage }
            const url = initialData?.id
                ? `/api/gallery/${initialData.id}`
                : '/api/gallery'

            const method = initialData?.id ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (!res.ok) throw new Error("Failed to save")

            const savedAlbum = await res.json()

            // If new album, redirect to edit page to add photos
            if (!initialData?.id) {
                router.push(`/admin/gallery/${savedAlbum.id}`)
            } else {
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6 max-w-xl">
            <div className="space-y-2">
                <Label>Album Title</Label>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Graduation 2025"
                />
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of this collection..."
                />
            </div>

            <div className="space-y-2">
                <Label>Cover Image</Label>

                {coverImage ? (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-slate-100 group">
                        <Image src={coverImage} alt="Cover" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button type="button" variant="destructive" size="sm" onClick={() => setCoverImage("")}>
                                <X className="mr-2 h-4 w-4" /> Remove
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-slate-50 hover:border-blue-400 cursor-pointer transition-colors"
                    >
                        {uploading ? (
                            <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        ) : (
                            <UploadCloud className="h-8 w-8 mb-2" />
                        )}
                        <span className="text-sm font-medium">Click to upload cover</span>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </div>

            <Button type="submit" disabled={loading || uploading}>
                {loading ? "Saving..." : (initialData ? "Update Album" : "Create Album & Add Photos")}
            </Button>
        </form>
    )
}
