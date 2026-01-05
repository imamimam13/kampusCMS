"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import {
    Plus, Trash, ExternalLink,
    Globe,
    Instagram,
    Facebook,
    Linkedin,
    Twitter,
    Youtube,
    Twitch,
    Gamepad2,
    MessageCircle
} from "lucide-react"

interface StaffFormProps {
    initialData?: any
}

const ICON_OPTIONS = [
    { value: "web", label: "Website / Portfolio", icon: Globe },
    { value: "instagram", label: "Instagram", icon: Instagram },
    { value: "facebook", label: "Facebook", icon: Facebook },
    { value: "linkedin", label: "LinkedIn", icon: Linkedin },
    { value: "twitter", label: "Twitter / X", icon: Twitter },
    { value: "youtube", label: "YouTube", icon: Youtube },
    { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { value: "twitch", label: "Twitch", icon: Twitch },
    { value: "gaming", label: "Gamer Tag", icon: Gamepad2 },
]

export function StaffForm({ initialData }: StaffFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Basic Fields
    const [name, setName] = useState(initialData?.name || "")
    const [slug, setSlug] = useState(initialData?.slug || "")
    const [nidn, setNidn] = useState(initialData?.nidn || "")
    const [role, setRole] = useState(initialData?.role || "")
    const [bio, setBio] = useState(initialData?.bio || "")
    const [image, setImage] = useState(initialData?.image || "")

    // Dynamic Links (Linktree)
    // Structure: { icon: string, label: string, url: string }
    const [links, setLinks] = useState(Array.isArray(initialData?.links) ? initialData.links : [])
    const [activeIconSelector, setActiveIconSelector] = useState<number | null>(null) // Index of active selector

    const toggleIconSelector = (index: number) => {
        setActiveIconSelector(activeIconSelector === index ? null : index)
    }

    const handleAddLink = () => {
        setLinks([...links, { icon: "web", label: "", url: "" }])
    }

    const handleRemoveLink = (index: number) => {
        const newLinks = [...links]
        newLinks.splice(index, 1)
        setLinks(newLinks)
    }

    const handleLinkChange = (index: number, field: 'icon' | 'label' | 'url', value: string) => {
        const newLinks = [...links]
        newLinks[index] = { ...newLinks[index], [field]: value }
        setLinks(newLinks)
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = { name, slug, nidn, role, bio, image, links }
            const method = initialData ? 'PUT' : 'POST'
            const body = initialData ? { id: initialData.id, ...data } : data

            const res = await fetch('/api/staff', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (!res.ok) throw new Error("Failed to save")

            router.push('/admin/staff')
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8 max-w-3xl">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Full Name / Nama Lengkap</Label>
                        <Input
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                                if (!slug) setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))
                            }}
                            required
                            placeholder="e.g. Dr. Budi Santoso"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>URL Slug</Label>
                        <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
                        <p className="text-xs text-muted-foreground">Example: /dosen/{slug || 'nama-dosen'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>NIDN / NIP (Lecturer ID)</Label>
                        <div className="flex gap-2">
                            <Input value={nidn} onChange={(e) => setNidn(e.target.value)} placeholder="Nomor Induk Dosen Nasional" />
                            <Button type="button" variant="outline" onClick={() => alert("PDDikti Sync Implementation in Next Step")}>
                                Sync PDDikti
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Role / Jabatan</Label>
                        <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Dosen Luar Biasa, Kaprodi" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Profile Image URL / Foto Profil</Label>
                    <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
                </div>

                <div className="space-y-2">
                    <Label>Bio / Deskripsi Singkat</Label>
                    <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} placeholder="Write a short biography..." />
                </div>
            </div>

            <div className="space-y-4 border p-4 rounded-md bg-slate-50">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Personal Links (Linktree) / Konfigurasi Link</h3>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddLink}>
                        <Plus className="mr-2 h-4 w-4" /> Add Link
                    </Button>
                </div>

                {links.map((link: any, index: number) => {
                    const SelectedIcon = ICON_OPTIONS.find(opt => opt.value === link.icon)?.icon || Globe

                    return (
                        <div key={index} className="flex gap-2 items-center">
                            <div className="relative">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-[140px] justify-start gap-2 px-3"
                                    onClick={() => toggleIconSelector(index)}
                                >
                                    <SelectedIcon className="h-4 w-4 max-w-[16px] max-h-[16px]" />
                                    <span className="truncate">{ICON_OPTIONS.find(opt => opt.value === (link.icon || "web"))?.label.split('/')[0]}</span>
                                </Button>

                                {activeIconSelector === index && (
                                    <div className="absolute top-full left-0 z-50 mt-1 w-[280px] p-2 bg-white border rounded-md shadow-lg grid grid-cols-2 gap-1">
                                        {ICON_OPTIONS.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 transition-colors text-left"
                                                onClick={() => {
                                                    handleLinkChange(index, 'icon', option.value)
                                                    setActiveIconSelector(null)
                                                }}
                                            >
                                                <option.icon className="h-4 w-4 shrink-0" />
                                                <span className="truncate">{option.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Overlay to close */}
                                {activeIconSelector === index && (
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setActiveIconSelector(null)}
                                    />
                                )}
                            </div>

                            <Input
                                placeholder="Label (e.g. Follow me)"
                                value={link.label}
                                onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                                className="w-1/3"
                            />
                            <Input
                                placeholder="URL"
                                value={link.url}
                                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                className="flex-1"
                            />
                            <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => handleRemoveLink(index)}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    )
                })}
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Dosen / Staff"}
            </Button>
        </form>
    )
}
