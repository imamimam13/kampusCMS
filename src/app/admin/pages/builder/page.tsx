import { prisma } from "@/lib/prisma"
import { BuilderClient } from "@/components/builder/builder-client"
import { getSiteData } from "@/lib/sites"
import { headers } from "next/headers"

export const dynamic = 'force-dynamic'

export default async function PageBuilder({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    let initialData = null

    // Awaiting searchParams is required in Next.js 15+, safe to do in 14.
    // However, in Next.js 14 it's just an object.
    const params = await searchParams
    const id = params?.id as string | undefined

    if (id) {
        console.log("Fetching page with ID:", id)
        try {
            initialData = await prisma.page.findUnique({
                where: { id }
            })
            console.log("Fetched Data:", initialData ? "Found" : "Null")
        } catch (e) {
            console.error("Failed to fetch page", e)
        }
    }

    // Fetch Site Data for enabledBlocks
    const headersList = await headers()
    const host = headersList.get("host") || "localhost:3000"
    const site = await getSiteData(host)

    const builderData = {
        ...initialData,
        enabledBlocks: site?.enabledBlocks || null
    }

    return <BuilderClient initialData={builderData} />
}
