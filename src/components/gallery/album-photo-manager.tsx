"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { UploadCloud, X, Loader2, Plus } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function AlbumPhotoManager({ albumId, images }: { albumId: string, images: any[] }) {
    const router = useRouter()
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return

        setUploading(true)
        const files = Array.from(e.target.files)

        try {
            // Upload files sequentially for simplicity
            for (const file of files) {
                const formData = new FormData()
                formData.append('file', file)

                // 1. Upload to storage
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                })

                if (!uploadRes.ok) continue
                const { url, size, width, height } = await uploadRes.json()

                // 2. Add to Album in DB
                await fetch('/api/gallery/images', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        albumId,
                        url,
                        caption: file.name.split('.')[0],
                        size,
                        width,
                        height
                    })
                })
            }
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Some photos failed to upload")
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleDelete = async (imageId: string) => {
        if (!confirm("Delete this photo?")) return
        try {
            await fetch(`/api/gallery/images?id=${imageId}`, { method: 'DELETE' })
            router.refresh()
        } catch (error) {
            alert("Failed to delete")
        }
    }

    // Helper to format bytes
    const formatBytes = (bytes: number) => {
        if (!bytes) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    return (
        <div className="space-y-6 mt-8 border-t pt-8">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Album Photos ({images.length})</h3>
                <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    {uploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Plus className="mr-2 h-4 w-4" />
                    )}
                    Add Photos
                </Button>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleUpload}
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img: any) => (
                    <div key={img.id} className="group relative bg-slate-100 rounded-lg overflow-hidden border hover:shadow-md transition-all">
                        <div className="aspect-square relative">
                            <Image src={img.url} alt={img.caption || "Photo"} fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleDelete(img.id)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-2 text-xs text-muted-foreground bg-white border-t">
                            <div className="font-medium truncate text-slate-700">{img.caption}</div>
                            <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                                <span>{img.width && img.height ? `${img.width}x${img.height}` : ''}</span>
                                <span>{formatBytes(img.size)}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Upload Placeholder */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-slate-50 hover:border-blue-400 cursor-pointer transition-colors"
                >
                    <UploadCloud className="h-8 w-8 mb-2" />
                    <span className="text-xs">Add Photos</span>
                </div>
            </div>
        </div>
    )
}
