"use client"

import { BlockData } from "@/types/builder"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { UserCircle } from "lucide-react"

export function StaffGridBlock({ data }: { data: BlockData }) {
    const [staff, setStaff] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/staff')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setStaff(data)
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    const limit = typeof data.content.count === 'number' ? data.content.count : 4
    const displayStaff = staff.slice(0, limit)

    return (
        <div className="py-12 px-4 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        {data.content.title || "Meet Our Team"}
                    </h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-64 bg-slate-200 rounded-xl"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayStaff.map((person) => (
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
                                <div className="p-4 flex-1">
                                    <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                        {person.name}
                                    </h3>
                                    <p className="text-sm text-blue-600 font-medium mt-1 line-clamp-1">
                                        {person.role}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
