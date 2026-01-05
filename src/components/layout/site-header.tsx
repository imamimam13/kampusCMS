import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader({ settings }: { settings: any }) {
    const { name, logo, headerLinks } = settings || {}
    const links = Array.isArray(headerLinks) ? headerLinks : []

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    {logo ? (
                        <img src={logo} alt={name || "Logo"} className="h-8 w-auto object-contain" />
                    ) : (
                        <span>{name || "KampusCMS"}</span>
                    )}
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    {links.map((link: any, i: number) => (
                        <Link
                            key={i}
                            href={link.href || '#'}
                            className="text-sm font-medium hover:text-[var(--primary)] transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    {/* Hardcoded defaults if empty, for demo */}
                    {links.length === 0 && (
                        <>
                            <Link href="/posts" className="text-sm font-medium hover:text-blue-600">News</Link>
                            <Link href="/gallery" className="text-sm font-medium hover:text-blue-600">Gallery</Link>
                            <Link href="/download" className="text-sm font-medium hover:text-blue-600">Downloads</Link>
                            <Link href="/dosen" className="text-sm font-medium hover:text-blue-600">Staff</Link>
                        </>
                    )}
                </nav>

                <div className="flex items-center gap-2">
                    {/* Mobile Menu Trigger could go here */}
                    <Link href="/login">
                        <Button variant="default" size="sm" style={{ backgroundColor: 'var(--primary)' }}>
                            Login
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
