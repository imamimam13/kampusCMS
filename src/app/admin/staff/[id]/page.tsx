import { prisma } from "@/lib/prisma"
import { StaffForm } from "@/components/staff/staff-form"
import { notFound } from "next/navigation"

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const staff = await prisma.staff.findUnique({
        where: { id }
    })

    if (!staff) notFound()

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Edit Staff</h1>
            <StaffForm initialData={staff} />
        </div>
    )
}
