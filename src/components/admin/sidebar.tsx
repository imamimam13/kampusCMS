"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    FileText,
    Newspaper,
    Calendar,
    Download,
    Users,
    Image as ImageIcon,
    Settings,
    Megaphone,
    GraduationCap,
    BarChart
} from "lucide-react"

const sidebarItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/pages", icon: FileText, label: "Pages" },
    { href: "/admin/prodi", icon: GraduationCap, label: "Program Studi" },
    { href: "/admin/tracer", icon: BarChart, label: "Tracer Study" },
    { href: "/admin/news", icon: Newspaper, label: "News & Posts" },
    { href: "/admin/calendar", icon: Calendar, label: "Calendar" },
    { href: "/admin/downloads", icon: Download, label: "Downloads" },
    { href: "/admin/staff", icon: Users, label: "Dosen / Staff Directory" },
    { href: "/admin/gallery", icon: ImageIcon, label: "Gallery" },
    { href: "/admin/alerts", icon: Megaphone, label: "Alerts" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
]

export function AdminSidebar({ className, setOpen }: { className?: string, setOpen?: (open: boolean) => void }) {
    const pathname = usePathname()

    return (
        <div className={cn("pb-12 w-64 border-r bg-muted/40 h-full", className)}>
            <div className="space-y-4 py-4">
                <div className="px-4 py-2 flex items-center h-14 border-b">
                    <h2 className="text-lg font-bold tracking-tight">KampusCMS</h2>
                </div>
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                asChild
                                onClick={() => setOpen?.(false)}
                            >
                                <Link href={item.href}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
