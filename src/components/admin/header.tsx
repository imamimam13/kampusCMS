"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AdminSidebar } from "./sidebar"
import { signOut } from "next-auth/react"

export function AdminHeader() {
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch for Radix UI
    if (typeof window !== 'undefined' && !mounted) {
        setMounted(true)
    }

    // Return empty div or simpler header during SSR if needed, 
    // but just checking mounted for the Sheet is often enough.
    // Actually, the mismatch is on attributes. 
    // Let's just suppress warning on the specific button if possible, but safer is ensuring client-only render for the Sheet trigger area if feasible.
    // Or, just use `suppressHydrationWarning`.

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
            {/* Sheet causes hydration mismatch due to generated IDs */}
            {mounted && (
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        {/* Pass setOpen to close sidebar on click */}
                        <AdminSidebar setOpen={setOpen} className="w-full border-none" />
                    </SheetContent>
                </Sheet>
            )}
            {!mounted && <div className="w-9 h-9 lg:hidden" />} {/* Placeholder to prevent layout shift */}

            <div className="w-full flex-1">
                {/* Breadcrumb or Search could go here */}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <User className="h-5 w-5" />
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
