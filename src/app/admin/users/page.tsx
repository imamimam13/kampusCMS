
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UsersClient } from "./client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function UsersPage() {
    const session = await auth()
    if (!session) {
        redirect("/login")
    }

    const { user } = session
    const isSuperAdmin = user.role === "super_admin"
    const isSiteAdmin = user.role === "site_admin"

    if (!isSuperAdmin && !isSiteAdmin) {
        redirect("/admin")
    }

    // Fetch users directly on server
    const users = await prisma.user.findMany({
        where: isSiteAdmin ? { siteId: user.siteId } : {},
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            site: { select: { name: true } },
            createdAt: true,
        }
    })

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                <div className="flex items-center space-x-2">
                    <Button asChild>
                        <Link href="/admin/users/new">
                            <Plus className="mr-2 h-4 w-4" /> Add User
                        </Link>
                    </Button>
                </div>
            </div>
            <UsersClient initialUsers={users} />
        </div>
    )
}
