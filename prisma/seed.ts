
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // 1. Create Default Main Site
    const mainSite = await prisma.site.upsert({
        where: { subdomain: 'main' },
        update: {},
        create: {
            name: 'Kampus CMS Platform',
            description: 'Main Campus Portal',
            subdomain: 'main', // "main" is reserved for the root domain or main dashboard
            customDomain: null,
            colors: { primary: '#0f172a', secondary: '#64748b' },
        },
    })
    console.log(`Created site: ${mainSite.name} (${mainSite.id})`)

    // 2. Create Admin User
    const password = await hash('admin123', 12)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@kampus.id' },
        update: {},
        create: {
            email: 'admin@kampus.id',
            name: 'Super Admin',
            password, // Intentionally weak for dev
            role: 'super_admin',
        },
    })
    console.log(`Created user: ${admin.email} (${admin.id})`)

    // 3. Create a Demo Subdomain Site
    const bemSite = await prisma.site.upsert({
        where: { subdomain: 'bem' },
        update: {},
        create: {
            name: 'BEM Universitas',
            description: 'Website Resmi Badan Eksekutif Mahasiswa',
            subdomain: 'bem',
            colors: { primary: '#dc2626', secondary: '#f87171' },
        },
    })
    console.log(`Created site: ${bemSite.name} (${bemSite.id})`)

    console.log('Seeding finished.')
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
