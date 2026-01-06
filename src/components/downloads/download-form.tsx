"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { FileText, UploadCloud, Loader2, CheckCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface DownloadFormProps {
    initialData?: {
        id: string
        title: string
        category: string
        fileUrl: string
    } | null
}

const CATEGORIES = ["Akademik", "Panduan", "SK", "Umum", "Lainnya"]

export function DownloadForm({ initialData }: DownloadFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [title, setTitle] = useState(initialData?.title || "")
    const [fileUrl, setFileUrl] = useState(initialData?.fileUrl || "")
    const [category, setCategory] = useState(initialData?.category || "Akademik")

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) throw new Error("Upload failed")

            const data = await res.json()
            setFileUrl(data.url)
            toast.success("File uploaded successfully")
        } catch (error) {
            console.error(error)
            toast.error("Failed to upload file")
        } finally {
            setUploading(false)
            // Reset input so same file can be selected again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = initialData?.id ? `/api/downloads/${initialData.id}` : "/api/downloads"
            const method = initialData?.id ? "PATCH" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    category,
                    fileUrl,
                }),
            })

            if (!res.ok) throw new Error("Failed to save")

            router.refresh()
            router.push("/admin/downloads")
            toast.success(initialData?.id ? "Document updated" : "Document created")
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8 max-w-xl">
            <div className="space-y-2">
                <Label>Title</Label>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Document title"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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

            <Button type="submit" disabled={loading || uploading}>
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    initialData?.id ? "Update Document" : "Add Document"
                )}
            </Button>
        </form>
    )
}
