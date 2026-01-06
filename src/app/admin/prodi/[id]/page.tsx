
import { prisma } from "@/lib/prisma"
import { ProdiForm } from "@/components/prodi/prodi-form"
import { notFound } from "next/navigation"

export default async function EditProdiPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const prodi = await prisma.programStudi.findUnique({ where: { id } })
    if (!prodi) notFound()

    const lecturers = await prisma.staff.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } })

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Edit Program Studi</h1>
            <ProdiForm initialData={prodi} lecturers={lecturers} />
        </div>
    )
}
