
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Globe, Settings, ExternalLink } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function SitesPage() {
    const session = await auth()

    // RBAC Check
    if (session?.user?.role !== 'super_admin') {
        redirect('/admin')
    }

    const sites = await prisma.site.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { posts: true, pages: true, users: true }
            }
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Sites</h2>
                    <p className="text-muted-foreground">
                        Manage all the sub-sites and campuses.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/sites/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Site
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Sites
                        </CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sites.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Sites</CardTitle>
                    <CardDescription>
                        List of all active sites on the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Subdomain</TableHead>
                                <TableHead>Custom Domain</TableHead>
                                <TableHead>Stats</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sites.map((site) => (
                                <TableRow key={site.id}>
                                    <TableCell className="font-medium">{site.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                                {site.subdomain}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {site.customDomain ? (
                                            <span className="font-mono text-xs">{site.customDomain}</span>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs text-muted-foreground space-y-1">
                                            <div>{site._count.pages} Pages</div>
                                            <div>{site._count.posts} Posts</div>
                                            <div>{site._count.users} Users</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <a href={`http://${site.subdomain}.localhost:3000`} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/sites/${site.id}`}>
                                                    <Settings className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
