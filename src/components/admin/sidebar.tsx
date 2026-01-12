"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
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
    BarChart,
    DatabaseBackup,
    Globe
} from "lucide-react"

const sidebarItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard", roles: ["all"] },
    { href: "/admin/sites", icon: Globe, label: "Manage Sites", roles: ["super_admin"] },
    { href: "/admin/pages", icon: FileText, label: "Pages", roles: ["all"] },
    { href: "/admin/prodi", icon: GraduationCap, label: "Program Studi", roles: ["all"] },
    { href: "/admin/tracer", icon: BarChart, label: "Tracer Study", roles: ["all"] },
    { href: "/admin/news", icon: Newspaper, label: "News & Posts", roles: ["all"] },
    { href: "/admin/calendar", icon: Calendar, label: "Calendar", roles: ["all"] },
    { href: "/admin/downloads", icon: Download, label: "Downloads", roles: ["all"] },
    { href: "/admin/staff", icon: Users, label: "Dosen / Staff Directory", roles: ["all"] },
    { href: "/admin/gallery", icon: ImageIcon, label: "Gallery", roles: ["all"] },
    { href: "/admin/alerts", icon: Megaphone, label: "Alerts", roles: ["all"] },
    { href: "/admin/users", icon: Users, label: "User Management", roles: ["super_admin", "site_admin"] },
    { href: "/admin/settings", icon: Settings, label: "Settings", roles: ["super_admin", "site_admin"] },
    { href: "/admin/settings/backup", icon: DatabaseBackup, label: "Backup & Restore", roles: ["super_admin"] },
]

export function AdminSidebar({ className, setOpen }: { className?: string, setOpen?: (open: boolean) => void }) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const userRole = session?.user?.role || "editor"
    const [enabledItems, setEnabledItems] = useState<string[] | null>(null)

    useEffect(() => {
        // Fetch enabled sidebar items
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.enabledSidebarItems) {
                    setEnabledItems(data.enabledSidebarItems)
                }
            })
            .catch(err => console.error("Failed to fetch sidebar config", err))
    }, [])

    const filteredItems = sidebarItems.filter(item => {
        // First check role
        const roleMatch = item.roles.includes("all") || item.roles.includes(userRole)
        if (!roleMatch) return false

        // Then check enabledItems (if configured)
        // Always show Dashboard, Settings, Manage Sites, Backup for safety
        const safeItems = ["Dashboard", "Settings", "Manage Sites", "Backup & Restore"]
        if (safeItems.includes(item.label)) return true

        if (enabledItems && !enabledItems.includes(item.label)) {
            return false
        }

        return true
    })

    return (
        <div className={cn("pb-12 w-64 border-r bg-muted/40 h-full", className)}>
            <div className="space-y-4 py-4">
                <div className="px-4 py-2 flex items-center h-14 border-b">
                    <h2 className="text-lg font-bold tracking-tight">KampusCMS</h2>
                </div>
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        {filteredItems.map((item) => (
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

