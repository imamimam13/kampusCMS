
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const sites = await prisma.site.findMany()
    console.log('Sites found:', sites.length)
    console.log(JSON.stringify(sites, null, 2))
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
