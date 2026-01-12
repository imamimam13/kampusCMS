
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { NewUserClient } from "./client"

export default async function NewUserPage() {
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

    let sites: { id: string, name: string }[] = []

    if (isSuperAdmin) {
        sites = await prisma.site.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        })
    } else if (isSiteAdmin && user.siteId) {
        // Site admin is restricted to their own site
        const site = await prisma.site.findUnique({
            where: { id: user.siteId },
            select: { id: true, name: true }
        })
        if (site) sites = [site]
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Add New User</h2>
            </div>
            <NewUserClient sites={sites} userRole={user.role} userSiteId={user.siteId} />
        </div>
    )
}
