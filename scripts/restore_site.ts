
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const existing = await prisma.site.findUnique({
        where: { subdomain: 'main' }
    })

    if (existing) {
        console.log('Main site already exists:', existing.id)
        return
    }

    const existingCustom = await prisma.site.findUnique({
        where: { customDomain: 'uwb.ac.id' }
    })

    if (existingCustom) {
        console.log('Site with customDomain uwb.ac.id already exists:', existingCustom.id)
        return
    }

    const site = await prisma.site.create({
        data: {
            name: 'Universitas Wira Bhakti',
            description: 'Kampus Merdeka, Kampus Juara',
            subdomain: 'main',
            customDomain: 'uwb.ac.id',
            enabledBlocks: [
                "hero", "features", "about", "gallery", "news-grid",
                "calendar", "download", "contact", "carousel", "card-grid",
                "columns", "image", "separator", "social", "rss"
            ],
            enabledSidebarItems: [
                "News & Posts", "Calendar", "Downloads",
                "Dosen / Staff Directory", "Gallery", "Alerts"
            ]
        }
    })

    console.log('Created main site:', site.id)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
