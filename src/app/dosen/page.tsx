import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Search, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Revalidate every hour
export const revalidate = 3600

export default async function StaffDirectoryPage({
    searchParams
}: {
    searchParams: { q?: string }
}) {
    // Note: In Next.js 15, searchParams is a promise, need to await if accessing properties
    // However, for this simple implementation we might just fetch all and filter client side 
    // OR just fetch all for now. Let's do a simple server fetch.

    // Safety check for searchParams in Next 15 if needed, 
    // but for now let's just list all.
    const staff = await prisma.staff.findMany({
        orderBy: { name: 'asc' }
    })

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Dosen & Staff Directory
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Meet our dedicated team of lecturers and staff members committed to academic excellence.
                    </p>
                </div>

                {/* Search Bar (Visual only for now, or form driven) */}
                <div className="max-w-md mx-auto">
                    <form className="relative flex items-center">
                        <Search className="absolute left-3 h-5 w-5 text-gray-400" />
                        <Input
                            type="search"
                            name="q"
                            placeholder="Search by name..."
                            className="pl-10 h-11 bg-white"
                        />
                    </form>
                </div>

                {/* Grid */}
                {staff.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No staff members found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {staff.map((person: any) => (
                            <Link
                                key={person.id}
                                href={`/dosen/${person.slug}`}
                                className="group bg-white rounded-xl shadow-sm border hover:shadow-md hover:border-blue-200 transition-all duration-200 overflow-hidden flex flex-col"
                            >
                                <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden">
                                    {person.image ? (
                                        <Image
                                            src={person.image}
                                            alt={person.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <UserCircle className="h-16 w-16" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                        {person.name}
                                    </h3>
                                    <p className="text-sm text-blue-600 font-medium mt-1 mb-3 line-clamp-1">
                                        {person.role}
                                    </p>

                                    {/* Mini Info */}
                                    <div className="mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{person.nidn ? `NIDN: ${person.nidn}` : 'Staff'}</span>
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 font-medium">
                                            View Profile →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
