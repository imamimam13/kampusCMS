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

        const hashedPassword = await bcrypt.hash(password, 10)

        // Create Admin User
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "admin"
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Setup error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
