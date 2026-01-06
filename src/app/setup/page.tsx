import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { SetupForm } from "@/components/setup/setup-form"

export const dynamic = 'force-dynamic'

export default async function SetupPage() {
    // Security Check: Only allow setup if NO users exist
    const userCount = await prisma.user.count()
    if (userCount > 0) {
        redirect("/login")
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Initial Setup</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Create the Administrator account for your Campus CMS.
                    </p>
                </div>

                <SetupForm />
            </div>
        </div>
    )
}
