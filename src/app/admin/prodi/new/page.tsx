
import { prisma } from "@/lib/prisma"
import { ProdiForm } from "@/components/prodi/prodi-form"

export default async function NewProdiPage() {
    const lecturers = await prisma.staff.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } })

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Add New Program Studi</h1>
            <ProdiForm lecturers={lecturers} />
        </div>
    )
}
