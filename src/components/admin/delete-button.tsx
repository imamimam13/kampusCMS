"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface DeleteButtonProps {
    id: string
    apiPath: string
    itemName?: string
}

export function DeleteButton({ id, apiPath, itemName = "item" }: DeleteButtonProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete this ${itemName}? This action cannot be undone.`)) return

        setLoading(true)
        try {
            const res = await fetch(`${apiPath}?id=${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error("Failed to delete")

            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Failed to delete")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            disabled={loading}
            title="Delete"
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
    )
}
