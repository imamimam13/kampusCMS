import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { FileText, Download as DownloadIcon, Search } from "lucide-react"

// Force dynamic rendering to skip build-time DB check
export const dynamic = 'force-dynamic'

export default async function DownloadPage({
    searchParams
}: {
    searchParams: { q?: string; category?: string }
}) {
    // Await searchParams in Next.js 15+
    const params = await searchParams
    const category = params.category
    const q = params.q

    const where: any = {}
    if (category && category !== 'All') {
        where.category = category
    }
    if (q) {
        where.title = { contains: q, mode: 'insensitive' }
    }

    const downloads = await prisma.download.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    })

    const categories = ["All", "Academic", "Administrative", "Student Life", "Research", "Other"]

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-10">
                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Document Center
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Access and download official forms, academic guides, and policy documents.
                    </p>
                </div>

                {/* Filters (Client-side usually, but we can do server links for simplicity) */}
                <div className="flex flex-wrap justify-center gap-2">
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={(category === cat || (cat === 'All' && !category)) ? "default" : "outline"}
                            size="sm"
                            asChild
                        >
                            <a href={`/download?category=${cat === 'All' ? '' : cat}`}>
                                {cat}
                            </a>
                        </Button>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    {downloads.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No documents found</h3>
                            <p className="mt-1">Try adjusting your category filter.</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {downloads.map((doc: any) => (
                                <div key={doc.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1 sm:mt-0">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800">
                                                    {doc.category || "General"}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(doc.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button asChild variant="outline" className="shrink-0 w-full sm:w-auto">
                                        <a href={doc.fileUrl} target="_blank" download>
                                            <DownloadIcon className="mr-2 h-4 w-4" /> Download
                                        </a>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
