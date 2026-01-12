
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // 1. Find the first user (usually the one created during broken setup)
        const user = await prisma.user.findFirst({
            orderBy: { createdAt: 'asc' }
        })

        if (!user) {
            return new NextResponse("No users found. Run setup first.", { status: 404 })
        }

        // 2. Find or Create the Main Site
        let site = await prisma.site.findUnique({
            where: { subdomain: 'main' }
        })

        if (!site) {
            console.log("Creating 'main' site...")
            site = await prisma.site.create({
                data: {
                    name: "KampusCMS",
                    description: "Welcome to your new campus portal",
                    subdomain: "main",
                    customDomain: null, // Let it be accessed by root domain logic
                    colors: { primary: '#0f172a', secondary: '#64748b' },
                }
            })
        }

        // 3. Link User to Site
        if (user.siteId !== site.id) {
            console.log(`Linking user ${user.email} to site ${site.name}...`)
            await prisma.user.update({
                where: { id: user.id },
                data: { siteId: site.id }
            })
        }

        return NextResponse.json({
            success: true,
            message: "Site data repaired.",
            details: {
                user: user.email,
                site: site.name,
                linked: true
            }
        })

    } catch (error) {
        console.error("Fix error:", error)
        return new NextResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`, { status: 500 })
    }
}
