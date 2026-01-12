"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox" // Not used yet but might be for flags
import { toast } from "sonner"
import { Loader2, ArrowLeft } from "lucide-react"

interface NewUserClientProps {
    sites: { id: string, name: string }[]
    userRole: string
    userSiteId?: string | null
}

export function NewUserClient({ sites, userRole, userSiteId }: NewUserClientProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const isSuperAdmin = userRole === "super_admin"

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const role = formData.get("role") as string
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            role: role,
            siteId: role === 'super_admin' ? null : formData.get("siteId")
            // Super Admin generally doesn't belong to a site, but could. 
            // Logic: if selecting 'super_admin', siteId is irrelevant/null.
            // If selecting other roles, siteId is required (unless global editor? stick to site-based).
        }

        // Validation refinement for siteId
        if (role !== 'super_admin' && !data.siteId) {
            // Allow 'site_admin' or 'editor' without siteId? 
            // Ideally all non-super users should belong to a site in this multi-tenant setup.
            // But let's allow flexibility if the backend handles it.
            // Backend requires siteId mapping for strict tenant isolation.
        }

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const text = await res.text()
                throw new Error(text || "Failed to create user")
            }

            toast.success("User created successfully")
            router.push("/admin/users")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <Button variant="ghost" className="pl-0" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                    <CardDescription>
                        Create a new user account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" required placeholder="John Doe" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select name="role" required defaultValue="editor">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="editor">Editor</SelectItem>
                                        <SelectItem value="dosen">Dosen</SelectItem>
                                        {isSuperAdmin && <SelectItem value="site_admin">Site Admin</SelectItem>}
                                        {isSuperAdmin && <SelectItem value="super_admin">Super Admin</SelectItem>}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="siteId">Assigned Site</Label>
                                <Select name="siteId" required={!isSuperAdmin} defaultValue={userSiteId || undefined} disabled={!isSuperAdmin}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select site" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sites.map(site => (
                                            <SelectItem key={site.id} value={site.id}>
                                                {site.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {isSuperAdmin && <p className="text-[10px] text-muted-foreground">Required unless creating Super Admin</p>}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create User
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
