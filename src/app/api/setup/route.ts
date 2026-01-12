import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        // Strict Check: Setup only allowed if ZERO users exist
        const count = await prisma.user.count()
        if (count > 0) {
            return new NextResponse("Setup is already complete. Users exist.", { status: 403 })
        }

        const body = await req.json()
        const { name, email, password } = body

        if (!email || !password || !name) {
            return new NextResponse("Missing fields", { status: 400 })
        }

        // Determine domain from headers
        const host = req.headers.get("host") || "localhost"
        const subdomain = host.split('.')[0] === "www" ? host.split('.')[1] : host.split('.')[0]

        // Start Transaction: Create Site -> Create User -> Link
        await prisma.$transaction(async (tx) => {
            // 1. Create Default Site
            const site = await tx.site.create({
                data: {
                    name: "KampusCMS",
                    description: "Welcome to your new campus portal",
                    subdomain: subdomain, // e.g. "uwb" or "localhost"
                    customDomain: host,   // e.g. "uwb.ac.id"
                    colors: { primary: '#0f172a', secondary: '#64748b' },
                }
            })

            const hashedPassword = await bcrypt.hash(password, 10)

            // 2. Create Admin User linked to Site
            await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: "super_admin",
                    siteId: site.id
                }
            })
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Setup error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
