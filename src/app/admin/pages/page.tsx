import Link from "next/link"
import { headers } from "next/headers"
import { getSiteData } from "@/lib/sites"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { Plus, Pencil, ExternalLink } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { PageListActions } from "@/components/pages/page-list-actions"

export const dynamic = 'force-dynamic'

export default async function PagesManagement() {
    const headersList = await headers()
    const host = headersList.get("host") || "localhost:3000"
    const site = await getSiteData(host)

    if (!site) return <div>Site not found</div>

    const pages = await prisma.page.findMany({
        where: { siteId: site.id },
        orderBy: { updatedAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Pages</h1>
                <Button asChild>
                    <Link href="/admin/pages/builder">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Page
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No pages found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pages.map((page: any) => (
                                <TableRow key={page.id}>
                                    <TableCell className="font-medium">{page.title}</TableCell>
                                    <TableCell>{page.slug}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${page.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {page.published ? 'Published' : 'Draft'}
                                        </span>
                                    </TableCell>
                                    <TableCell>{page.updatedAt.toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <PageListActions page={page} />
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
