import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Megaphone, Trash2 } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"

export const dynamic = 'force-dynamic'

export default async function AlertsPage() {
    const alerts = await prisma.alert.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Alerts</h1>
                    <p className="text-muted-foreground">Manage running text announcements.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/alerts/new">
                        <Plus className="mr-2 h-4 w-4" /> New Alert
                    </Link>
                </Button>
            </div>

            <div className="space-y-4">
                {alerts.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg bg-slate-50 text-muted-foreground">
                        <Megaphone className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                        <p>No active alerts.</p>
                    </div>
                ) : (
                    alerts.map((alert: any) => (
                        <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className={`h-2 w-2 rounded-full ${alert.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <div>
                                    <p className="font-medium">{alert.content}</p>
                                    <div className="flex gap-2 text-xs text-muted-foreground">
                                        {alert.endDate && <span>Ends: {new Date(alert.endDate).toLocaleDateString()}</span>}
                                        {alert.link && <span className="text-blue-500">Has Link</span>}
                                    </div>
                                </div>
                            </div>
                            <DeleteButton id={alert.id} apiPath="/api/alerts" itemName="alert" />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
