
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(req: Request) {
    const session = await auth()

    // RBAC: Only super_admin
    if (session?.user?.role !== 'super_admin') {
        return new NextResponse("Unauthorized", { status: 403 })
    }

    try {
        const body = await req.json()
        const { name, subdomain, description, colors } = body

        // Validation
        if (!name || !subdomain) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Check availability
        const existing = await prisma.site.findUnique({
            where: { subdomain }
        })

        if (existing) {
            return new NextResponse("Subdomain already taken", { status: 409 })
        }

        const site = await prisma.site.create({
            data: {
                name,
                subdomain,
                description,
                colors: colors || { primary: '#0f172a', secondary: '#3b82f6' }
            }
        })

        return NextResponse.json(site)
    } catch (error) {
        console.error("CREATE SITE ERROR:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
