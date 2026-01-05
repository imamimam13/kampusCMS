import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { DosenEditor } from "@/components/dosen/dosen-editor"

export default async function DosenManagePage() {
    const session = await auth()

    // Auth Check
    if (!session || !session.user) {
        redirect("/login?callbackUrl=/dosen/manage")
    }

    // Role Check (Dosen or Admin)
    const role = (session.user as any).role
    if (role !== 'dosen' && role !== 'admin') {
        return <div className="p-10 text-center">Unauthorized Access</div>
    }

    // Fetch Staff Record
    const staff = await prisma.staff.findUnique({
        where: { userId: session.user.id }
    })

    if (!staff && role === 'dosen') {
        return (
            <div className="container mx-auto py-10">
                <div className="bg-yellow-50 p-6 rounded-lg text-yellow-800">
                    <h1 className="text-xl font-bold mb-2">Profile Not Found</h1>
                    <p>Your user account is working, but it is not linked to a Staff profile yet. Please contact the administrator.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Manage Profile</h1>
                    <p className="text-muted-foreground">Update your public lecturer profile information.</p>
                </div>

                <DosenEditor staff={staff} />
            </div>
        </div>
    )
}
