import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    Globe,
    Instagram,
    Facebook,
    Linkedin,
    Twitter,
    Youtube,
    Twitch,
    Gamepad2,
    MessageCircle,
    ExternalLink,
    UserCircle
} from "lucide-react"

// Map icon strings to components
const ICON_MAP: Record<string, any> = {
    web: Globe,
    instagram: Instagram,
    facebook: Facebook,
    linkedin: Linkedin,
    twitter: Twitter,
    youtube: Youtube,
    whatsapp: MessageCircle,
    twitch: Twitch,
    gaming: Gamepad2,
}

export default async function PublicStaffPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const staff = await prisma.staff.findUnique({
        where: { slug }
    })

    if (!staff) notFound()

    const links = Array.isArray(staff.links) ? staff.links : []

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="relative h-32 w-32 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-md">
                                {staff.image ? (
                                    <Image
                                        src={staff.image}
                                        alt={staff.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">
                                        <UserCircle className="h-16 w-16" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{staff.name}</h1>
                            <p className="text-lg text-blue-600 font-medium mt-1">{staff.role}</p>
                            {staff.nidn && (
                                <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">
                                        NIDN: {staff.nidn}
                                    </span>
                                </p>
                            )}
                        </div>

                        {staff.bio && (
                            <div className="mt-8 prose prose-slate">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                                <p className="text-gray-600 whitespace-pre-line">{staff.bio}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Linktree / Connect Section */}
                {links.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 text-center uppercase tracking-wider text-xs text-muted-foreground">
                            Connect & Resources
                        </h3>
                        <div className="grid gap-3 max-w-lg mx-auto">
                            {links.map((link: any, i: number) => {
                                const Icon = ICON_MAP[link.icon || 'web'] || Globe
                                return (
                                    <a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center p-4 bg-white border rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200"
                                    >
                                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                                                {link.label}
                                            </p>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
