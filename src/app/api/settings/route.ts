import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(req: Request) {
    // Singleton pattern: always return the first/only settings record
    let settings = await prisma.siteSettings.findFirst()

    if (!settings) {
        // Create default if not exists
        settings = await prisma.siteSettings.create({
            data: {
                name: "KampusCMS Demo",
                colors: { primary: "#0f172a", secondary: "#3b82f6" },
                headerLinks: []
            }
        })
    }

    return NextResponse.json(settings)
}

export async function PUT(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const { name, description, logo, colors, fonts, headerLinks, footerText, headCode, bodyCode, aiConfig } = body

        // Upsert logic (update if exists, create if not)
        // We assume there's only one record, so we findFirst
        const existing = await prisma.siteSettings.findFirst()

        let settings
        if (existing) {
            settings = await prisma.siteSettings.update({
                where: { id: existing.id },
                data: {
                    name, description, logo, colors, fonts, headerLinks, footerText, headCode, bodyCode, aiConfig
                }
            })
        } else {
            settings = await prisma.siteSettings.create({
                data: {
                    name, description, logo, colors, fonts, headerLinks, footerText, headCode, bodyCode, aiConfig
                }
            })
        }

        return NextResponse.json(settings)
    } catch (error) {
        console.error("Settings Update Error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
