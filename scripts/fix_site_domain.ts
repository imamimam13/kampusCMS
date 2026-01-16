
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const mainSite = await prisma.site.findUnique({
        where: { subdomain: 'main' }
    })

    if (!mainSite) {
        console.log('Main site not found!')
        return
    }

    console.log('Updating main site:', mainSite.id)

    const updated = await prisma.site.update({
        where: { id: mainSite.id },
        data: {
            customDomain: 'uwb.ac.id'
        }
    })

    console.log('Updated main site customDomain:', updated.customDomain)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
