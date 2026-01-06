
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Download, Upload, AlertTriangle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export default function BackupPage() {
    const [isBackingUp, setIsBackingUp] = useState(false)
    const [isRestoring, setIsRestoring] = useState(false)
    const [restoreFile, setRestoreFile] = useState<File | null>(null)

    const handleDownloadBackup = async () => {
        setIsBackingUp(true)
        try {
            const res = await fetch('/api/admin/backup', { method: 'POST' })

            if (!res.ok) throw new Error("Backup generation failed")

            // Convert response to blob and download
            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `kampuscms-backup-${new Date().toISOString().split('T')[0]}.zip`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            toast.success("Backup downloaded successfully")
        } catch (error) {
            console.error(error)
            toast.error("Failed to download backup")
        } finally {
            setIsBackingUp(false)
        }
    }

    const handleRestore = async () => {
        if (!restoreFile) return
        if (!confirm("WARNING: This will overwrite your database and uploads. This action cannot be undone. Are you sure?")) return

        setIsRestoring(true)
        const formData = new FormData()
        formData.append('file', restoreFile)

        try {
            const res = await fetch('/api/admin/restore', {
                method: 'POST',
                body: formData
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || "Restore failed")

            toast.success("System restored successfully! Reloading...")
            setTimeout(() => window.location.reload(), 2000)
        } catch (error) {
            console.error(error)
            toast.error("Failed to restore system")
        } finally {
            setIsRestoring(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Backup & Restore</h1>
                <p className="text-muted-foreground">Manage your data security and system state.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Backup Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5" />
                            Backup
                        </CardTitle>
                        <CardDescription>
                            Create a full backup of your database and uploaded files.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>Contents included:</AlertTitle>
                            <AlertDescription>
                                - Full PostgreSQL Database Dump (SQL)<br />
                                - All images/documents in Public Uploads
                            </AlertDescription>
                        </Alert>

                        <Button onClick={handleDownloadBackup} disabled={isBackingUp} className="w-full">
                            {isBackingUp ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating Backup... (This may take a while)
                                </>
                            ) : (
                                "Download Backup Archive (.zip)"
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Restore Section */}
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <Upload className="h-5 w-5" />
                            Restore
                        </CardTitle>
                        <CardDescription>
                            Restore your system from a previous backup archive.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Danger Zone</AlertTitle>
                            <AlertDescription>
                                Restoring will <strong>PERMANENTLY DELETE</strong> current data and replace it with the backup. Proceed with caution.
                            </AlertDescription>
                        </Alert>

                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <input
                                type="file"
                                accept=".zip"
                                onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <Button
                            onClick={handleRestore}
                            disabled={isRestoring || !restoreFile}
                            variant="destructive"
                            className="w-full"
                        >
                            {isRestoring ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Restoring System... (Do not close)
                                </>
                            ) : (
                                "Upload & Restore System"
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
