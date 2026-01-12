
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { hash } from "bcryptjs"

export async function GET(req: Request) {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { user } = session
    const isSuperAdmin = user.role === "super_admin"
    const isSiteAdmin = user.role === "site_admin"

    if (!isSuperAdmin && !isSiteAdmin) {
        return new NextResponse("Forbidden", { status: 403 })
    }

    try {
        const users = await prisma.user.findMany({
            where: isSiteAdmin ? { siteId: user.siteId } : {},
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                site: { select: { name: true } },
                createdAt: true,
            }
        })
        return NextResponse.json(users)
    } catch (error) {
        console.error("Failed to fetch users:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { user } = session
    const isSuperAdmin = user.role === "super_admin"
    const isSiteAdmin = user.role === "site_admin"

    if (!isSuperAdmin && !isSiteAdmin) {
        return new NextResponse("Forbidden", { status: 403 })
    }

    try {
        const body = await req.json()
        const { name, email, password, role, siteId } = body

        if (!name || !email || !password || !role) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Validate site access
        if (isSiteAdmin && siteId !== user.siteId) {
            return new NextResponse("Cannot create user for another site", { status: 403 })
        }

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return new NextResponse("User already exists", { status: 400 })
        }

        const hashedPassword = await hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                siteId: isSiteAdmin ? user.siteId : siteId // Site Admin always locked to their site
            }
        })

        const { password: _, ...userWithoutPassword } = newUser
        return NextResponse.json(userWithoutPassword)
    } catch (error) {
        console.error("Failed to create user:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
