import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Pencil, Trash2 } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { CsvImporter } from "@/components/admin/csv-importer"

export default async function StaffManagement() {
    const staff = await prisma.staff.findMany({
        orderBy: { updatedAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <CsvImporter />
            <div className="flex items-center justify-between pt-6 border-t">
                <h1 className="text-2xl font-bold tracking-tight">Staff Directory</h1>
                <Button asChild>
                    <Link href="/admin/staff/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Staff
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>NIDN</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staff.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No staff members found. Add one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            staff.map((s: any) => (
                                <TableRow key={s.id}>
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
