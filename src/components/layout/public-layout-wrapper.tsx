"use client"

import { usePathname } from "next/navigation"
import { SiteHeader } from "./site-header"
import { SiteFooter } from "./site-footer"
import { RunningText } from "@/components/alerts/running-text"

export function PublicLayoutWrapper({
    children,
    settings
}: {
    children: React.ReactNode
    settings: any
}) {
    const pathname = usePathname()
    // Hide header/footer on admin routes and login page
    const isAdmin = pathname?.startsWith("/admin")
    const isLogin = pathname === "/login" || pathname === "/admin/login"

    if (isAdmin || isLogin) {
        return <>{children}</>
    }

    return (
        <>
            <RunningText />
            <SiteHeader settings={settings} />
            <div className="flex-1">
                {children}
            </div>
            <SiteFooter settings={settings} />
        </>
    )
}
