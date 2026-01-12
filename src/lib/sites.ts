
import { prisma } from "@/lib/prisma"
import { Site } from "@prisma/client"

export async function getSiteData(domain: string): Promise<Site | null> {
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'
    const subdomain = domain.endsWith(`.${rootDomain}`)
        ? domain.replace(`.${rootDomain}`, "")
        : null

    // If it's the root domain itself (e.g. localhost:3000), treat as "main"
    // OR if subdomain is null but we are not on root (e.g. custom domain)

    // Logic: 
    // 1. Check custom domain
    // 2. Check subdomain
    // 3. Fallback to 'main' for root domain dev?

    // Simplified for now: assume subdomain or main
    // If it's the root domain itself (e.g. localhost:3000), treat as "main"
    // Also explicitly handle 'localhost' and '127.0.0.1' which might come from split header
    if (
        domain === 'localhost:3000' ||
        domain === 'localhost' ||
        domain === '127.0.0.1' ||
        domain === rootDomain
    ) {
        return await prisma.site.findUnique({ where: { subdomain: 'main' } })
    }

    // Attempt custom domain
    const siteByCustomDomain = await prisma.site.findUnique({
        where: { customDomain: domain }
    })
    if (siteByCustomDomain) return siteByCustomDomain

    // Attempt subdomain
    if (subdomain) {
        return await prisma.site.findUnique({
            where: { subdomain }
        })
    }

    return null
}
