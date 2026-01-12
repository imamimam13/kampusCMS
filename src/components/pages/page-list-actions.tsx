"use client"

import { Button } from "@/components/ui/button"
import { Pencil, ExternalLink, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function PageListActions({ page, site }: { page: any, site: any }) {
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this page?")) return

        try {
            const res = await fetch(`/api/pages?id=${page.id}`, { method: 'DELETE' })
            if (res.ok) {
                router.refresh()
            } else {
                alert("Failed to delete")
            }
        } catch (e) {
            console.error(e)
            alert("Error deleting")
        }
    }

    const getPageUrl = () => {
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

        // Logic for constructing the URL
        let hostname = rootDomain
        if (site.customDomain) {
            hostname = site.customDomain
        } else if (site.subdomain !== 'main') {
            hostname = `${site.subdomain}.${rootDomain}`
        }

        const slug = page.slug.startsWith('/') ? page.slug : `/${page.slug}`
        return `${protocol}://${hostname}${slug}`
    }

    return (
        <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="icon" asChild>
                <Link href={`/admin/pages/builder?id=${page.id}`}>
                    <Pencil className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <a href={getPageUrl()} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                </a>
            </Button>
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    )
}
