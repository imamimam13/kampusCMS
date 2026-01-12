import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { CsvImporter } from "@/components/admin/csv-importer"
import { StaffTable } from "@/components/admin/staff-table"

export const dynamic = 'force-dynamic'


import { headers } from "next/headers"
import { getSiteData } from "@/lib/sites"

export default async function StaffManagement() {
    const headersList = await headers()
    const host = headersList.get("host") || "localhost:3000"
    const site = await getSiteData(host)

    if (!site) return <div>Site not found</div>

    const staff = await prisma.staff.findMany({
        where: { siteId: site.id },
        orderBy: { updatedAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <CsvImporter />

            <div className="flex items-center justify-between pt-6 border-t">
                <h1 className="text-2xl font-bold tracking-tight">Staff Directory</h1>
                <div className="flex gap-2">

                    <Button asChild>
                        <Link href="/admin/staff/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Staff
                        </Link>
                    </Button>
                </div>
            </div>

            <StaffTable staff={staff} />
        </div>
    )
}
