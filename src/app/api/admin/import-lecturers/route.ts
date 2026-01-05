import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    const session = await auth()
    if (!session || (session.user as any).role !== "admin") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const { lecturers } = await req.json() // Array of { name, nidn, email, bio? }

        const results = {
            success: 0,
            failed: 0,
            errors: [] as string[]
        }

        for (const lecturer of lecturers) {
            try {
                if (!lecturer.email || !lecturer.name) {
                    results.failed++
                    continue
                }

                // 1. Create or Find User
                const hashedPassword = await bcrypt.hash("dosen123", 10) // Default password

                const user = await prisma.user.upsert({
                    where: { email: lecturer.email },
                    update: {}, // Don't update existing users for safety
                    create: {
                        email: lecturer.email,
                        name: lecturer.name,
                        password: hashedPassword,
                        role: "dosen"
                    }
                })

                // 2. Create or Update Staff Profile
                // Create a slug from name
                const slug = lecturer.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(Math.random() * 1000)

                await prisma.staff.upsert({
                    where: { userId: user.id }, // Ideally we'd match by existing Staff if possible, but relating by User is safer
                    update: {
                        name: lecturer.name,
                        nidn: lecturer.nidn,
                        // Don't overwrite bio if exists, unless empty? Let's just update basic info
                    },
                    create: {
                        userId: user.id,
                        name: lecturer.name,
                        slug: slug,
                        nidn: lecturer.nidn,
                        role: "Lecturer",
                        bio: lecturer.bio || "Lecturer at our university.",
                    }
                })

                results.success++
            } catch (err: any) {
                console.error(`Failed to import ${lecturer.email}:`, err)
                results.failed++
                results.errors.push(`Failed ${lecturer.email}: ${err.message}`)
            }
        }

        return NextResponse.json(results)
    } catch (error) {
        console.error("Import error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
