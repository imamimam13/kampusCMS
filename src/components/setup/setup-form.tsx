"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function SetupForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)

        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        try {
            const res = await fetch("/api/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const msg = await res.text()
                throw new Error(msg || "Failed to create admin")
            }

            alert("Admin created successfully! Redirecting to login...")
            router.push("/login")
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
                <div>
                    <Label>Full Name</Label>
                    <Input name="name" required placeholder="Administrator Name" />
                </div>
                <div>
                    <Label>Email Address</Label>
                    <Input name="email" type="email" required placeholder="admin@campus.edu" />
                </div>
                <div>
                    <Label>Password</Label>
                    <Input name="password" type="password" required minLength={8} />
                </div>
                <div>
                    <Label>Confirm Password</Label>
                    <Input name="confirmPassword" type="password" required minLength={8} />
                </div>
            </div>

            {error && (
                <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded border border-red-200">
                    {error}
                </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Admin Account
            </Button>
        </form>
    )
}
