import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
    const session = await auth()
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const body = await req.json()
        const { name, bio, nidn } = body

        // Update Staff
        const staff = await prisma.staff.update({
            where: { userId: session.user.id },
            data: {
                name,
                bio,
                nidn
            }
        })

        // Also update User name for consistency
        await prisma.user.update({
            where: { id: session.user.id },
            data: { name }
        })

        return NextResponse.json(staff)
    } catch (error) {
        console.error("Update error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
