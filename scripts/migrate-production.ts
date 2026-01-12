
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Starting Production Migration...")

    // 1. Ensure Main Site Exists
    let mainSite = await prisma.site.findUnique({
        where: { subdomain: 'main' }
    })

    if (!mainSite) {
        console.log("Creating Main Site...")
        mainSite = await prisma.site.create({
            data: {
                name: 'Main Campus Site',
                subdomain: 'main',
                description: 'The main campus website migrated from legacy.',
                colors: { primary: '#0f172a', secondary: '#3b82f6' }
            }
        })
    } else {
        console.log("Main Site already exists:", mainSite.id)
    }

    // 2. Assign Global Content to Main Site
    // For Posts
    const postsResult = await prisma.post.updateMany({
        where: { siteId: null },
        data: { siteId: mainSite.id }
    })
    console.log(`Migrated ${postsResult.count} posts to Main Site.`)

    // For Pages
    const pagesResult = await prisma.page.updateMany({
        where: { siteId: null },
        data: { siteId: mainSite.id }
    })
    console.log(`Migrated ${pagesResult.count} pages to Main Site.`)

    // For Staff
    const staffResult = await prisma.staff.updateMany({
        where: { siteId: null },
        data: { siteId: mainSite.id }
    })
    console.log(`Migrated ${staffResult.count} staff to Main Site.`)

    // For Events
    const eventsResult = await prisma.event.updateMany({
        where: { siteId: null },
        data: { siteId: mainSite.id }
    })
    console.log(`Migrated ${eventsResult.count} events to Main Site.`)

    // For Users (Optional: Assign existing admins to Main Site?)
    // Let's make existing admins "Super Admins" effectively, or Site Admins for Main.
    // Ideally, the first admin is Super Admin.
    const firstAdmin = await prisma.user.findFirst({
        orderBy: { createdAt: 'asc' }
    })
    if (firstAdmin) {
        await prisma.user.update({
            where: { id: firstAdmin.id },
            data: { role: 'super_admin' }
        })
        console.log(`Promoted ${firstAdmin.email} to super_admin.`)
    }

    console.log("Migration Complete.")
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
