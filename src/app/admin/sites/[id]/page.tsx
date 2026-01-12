
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { EditSiteClient } from './client'

export default async function EditSitePage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session || session.user.role !== 'super_admin') {
        redirect('/admin')
    }

    const { id } = await params
    const site = await prisma.site.findUnique({
        where: { id }
    })

    if (!site) {
        redirect('/admin/sites')
    }

    return <EditSiteClient site={site} />
}
