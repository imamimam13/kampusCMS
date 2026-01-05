import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Trash2, FileText, Download as DownloadIcon } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"

export const dynamic = 'force-dynamic'

export default async function DownloadAdminPage() {
    const downloads = await prisma.download.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Downloads Center</h1>
                    <p className="text-muted-foreground">Manage documents and files available for public download.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/downloads/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Document
                    </Link>
                </Button>
            </div>

            <div className="border rounded-md bg-white">
                {/* Delete functionality will be client-side in a real app, 
                     here we just show the list for MVP */}
                <div className="p-4 grid grid-cols-12 gap-4 border-b font-medium text-sm text-muted-foreground bg-slate-50 rounded-t-md">
                    <div className="col-span-6">Document Name</div>
                    <div className="col-span-3">Category</div>
                    <div className="col-span-3 text-right">Actions</div>
                </div>

                {downloads.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No documents found. Click "Add Document" to upload one.
                    </div>
                ) : (
                    <div className="divide-y">
                        {downloads.map((doc: any) => (
                            <div key={doc.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 transition-colors text-sm">
                                <div className="col-span-6 font-medium flex items-center gap-2">
                                    <div className="h-8 w-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="truncate">{doc.title}</span>
                                        <a href={doc.fileUrl} target="_blank" className="text-xs text-blue-500 hover:underline truncate max-w-[200px]">{doc.fileUrl}</a>
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200/80">
                                        {doc.category || "General"}
                                    </span>
                                </div>
                                <div className="col-span-3 flex justify-end gap-2">
                                    <Button asChild variant="ghost" size="icon">
                                        <a href={doc.fileUrl} target="_blank" download>
                                            <DownloadIcon className="h-4 w-4" />
                                        </a>
                                    </Button>
                                    <DeleteButton id={doc.id} apiPath="/api/downloads" itemName="document" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
