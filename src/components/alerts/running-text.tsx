"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Megaphone, X } from "lucide-react"
import { usePathname } from "next/navigation"

interface Alert {
    id: string
    content: string
    link?: string
    endDate?: string
}

export function RunningText() {
    const pathname = usePathname()
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        if (pathname.startsWith('/admin')) return

        fetch('/api/alerts')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setAlerts(data)
            })
            .catch(err => console.error(err))
    }, [pathname])

    if (pathname.startsWith('/admin')) return null
    if (!visible || alerts.length === 0) return null

    return (
        <div className="bg-blue-600 text-white relative overflow-hidden h-10 flex items-center">
            {/* Close Button */}
            <button
                onClick={() => setVisible(false)}
                className="absolute right-2 z-20 p-1 hover:bg-white/20 rounded-full"
            >
                <X className="h-4 w-4" />
            </button>

            {/* Icon */}
            <div className="absolute left-0 z-20 h-full bg-blue-600 px-3 flex items-center shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                <Megaphone className="h-4 w-4" />
            </div>

            {/* Marquee Content */}
            <div className="w-full overflow-hidden flex items-center">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-12 pl-12">
                    {alerts.map((alert) => (
                        <span key={alert.id} className="inline-flex items-center gap-2">
                            {alert.content}
                            {alert.link && (
                                <Link href={alert.link} className="underline text-blue-100 hover:text-white text-sm font-medium">
                                    Learn More
                                </Link>
                            )}
                        </span>
                    ))}
                    {/* Duplicate for smooth loop if only one item */}
                    {alerts.length === 1 && (
                        <span className="inline-flex items-center gap-2">
                            {alerts[0].content}
                            {alerts[0].link && (
                                <Link href={alerts[0].link} className="underline text-blue-100 hover:text-white text-sm font-medium">
                                    Learn More
                                </Link>
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
