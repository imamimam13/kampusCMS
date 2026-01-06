
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Pencil, GraduationCap, Trash } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function ProdiManagement() {
    const prodiList = await prisma.programStudi.findMany({
        orderBy: { name: 'asc' },
        include: { headOfProdi: true }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pt-6 border-t">
                <h1 className="text-2xl font-bold tracking-tight">Program Studi</h1>
                <Button asChild>
                    <Link href="/admin/prodi/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Prodi
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Degree</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Accreditation</TableHead>
                            <TableHead>Head of Prodi</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {prodiList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No Program Studi found. Create one.
                                </TableCell>
                            </TableRow>
                        ) : (
                            prodiList.map((p: any) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-mono text-xs">{p.code}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{p.degree}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{p.name}</TableCell>
                                    <TableCell>{p.accreditation || '-'}</TableCell>
                                    <TableCell>
                                        {p.headOfProdi ? (
                                            <div className="flex items-center gap-2">
                                                {p.headOfProdi.image && (
                                                    <img src={p.headOfProdi.image} className="w-6 h-6 rounded-full object-cover" />
                                                )}
                                                <span className="text-sm">{p.headOfProdi.name}</span>
                                            </div>
                                        ) : <span className="text-muted-foreground text-xs">Unassigned</span>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/prodi/${p.id}`}>
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
