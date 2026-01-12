import { prisma } from "@/lib/prisma"
import { SetupForm } from "@/components/setup/setup-form"
import { AlertCircle, CheckCircle2, Database, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'

export default async function SetupPage() {
    let userCount = 0
    let dbError = ""

    try {
        // Security Check: Only allow setup if NO users exist
        userCount = await prisma.user.count()
    } catch (e: any) {
        console.error("Setup DB Error:", e)
        dbError = e.message || "Unknown database error"
    }

    // DIAGNOSTIC STATE:
    // If we possess users, we show a warning instead of a silent redirect.
    // If we have a DB error, we show the error.

    if (dbError) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
                <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-red-200">
                    <div className="flex flex-col items-center text-center text-red-600">
                        <AlertCircle className="h-12 w-12 mb-4" />
                        <h2 className="text-xl font-bold">Database Connection Failed</h2>
                        <p className="mt-2 text-sm text-gray-600 bg-gray-100 p-3 rounded w-full break-all font-mono">
                            {dbError}
                        </p>
                        <p className="mt-4 text-sm text-gray-600">
                            Please check your database configuration and ensure the server is running.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (userCount > 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
                <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-lg border border-yellow-200">
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-yellow-100 p-3 rounded-full mb-4">
                            <Users className="h-8 w-8 text-yellow-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Setup Already Completed</h2>
                        <div className="mt-2 p-4 bg-yellow-50 rounded-lg w-full">
                            <p className="text-sm text-yellow-800 font-medium">
                                Diagnostic Info:
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Found <strong>{userCount}</strong> existing user(s) in the database.
                            </p>
                        </div>
                        <p className="mt-4 text-sm text-gray-600">
                            The setup wizard is disabled to prevent accidental reconfiguration.
                            If you believe this is an error, your database volume may contain old data.
                        </p>
                        <div className="mt-6 flex flex-col gap-3 w-full">
                            <Link href="/login" className="w-full">
                                <Button className="w-full">Go to Login</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Database className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
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
