"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

interface StaffTableProps {
    staff: any[]
}

export function StaffTable({ staff }: StaffTableProps) {
    const router = useRouter()
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const toggleSelectAll = () => {
        if (selectedIds.length === staff.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(staff.map(s => s.id))
        }
    }

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(idx => idx !== id))
        } else {
            setSelectedIds([...selectedIds, id])
        }
    }

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} staff members?`)) return

        setLoading(true)
        try {
            const res = await fetch(`/api/staff?ids=${selectedIds.join(',')}`, { method: 'DELETE' })
            if (!res.ok) throw new Error("Failed to delete")

            setSelectedIds([])
            router.refresh()
        } catch (error) {
            alert("Failed to delete selected items")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            {selectedIds.length > 0 && (
                <div className="bg-slate-50 p-2 rounded border flex items-center justify-between">
                    <span className="text-sm font-medium px-2">{selectedIds.length} Selected</span>
                    <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={loading}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Selected
                    </Button>
                </div>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={staff.length > 0 && selectedIds.length === staff.length}
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>NIDN</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staff.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No staff members found. Add one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            staff.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(s.id)}
                                            onCheckedChange={() => toggleSelect(s.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{s.name}</TableCell>
                                    <TableCell>{s.role || '-'}</TableCell>
                                    <TableCell>{s.nidn || '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/staff/${s.id}`}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
