"use client"

import { useState } from "react"
import { BuilderProvider } from "@/contexts/builder-context"
import { BuilderSidebar } from "@/components/builder/builder-sidebar"
import { BuilderCanvas } from "@/components/builder/builder-canvas"
import { BuilderInspector } from "@/components/builder/builder-inspector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, AlertCircle, ArrowLeft } from "lucide-react"
import { useBuilder } from "@/contexts/builder-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function BuilderClient({ initialData }: { initialData?: any }) {
    const [preview, setPreview] = useState(false)

    return (
        <BuilderProvider initialData={initialData}>
            <div className="flex flex-col h-screen overflow-hidden">
                <BuilderHeader onPreview={() => setPreview(!preview)} isPreview={preview} />
                <div className="flex flex-1 overflow-hidden relative">
                    {/* Sidebar - hidden in preview */}
                    <div className={`${preview ? 'hidden' : 'block'} transition-all`}>
                        <BuilderSidebar />
                    </div>

                    {/* Canvas - full width in preview */}
                    <div className="flex-1 overflow-y-auto bg-slate-100 flex justify-center">
                        <div className={`transition-all duration-300 ${preview ? 'w-full' : 'w-full'}`}>
                            {/* We reuse BuilderCanvas but maybe we want to wrap it to control width/padding separately if needed */}
                            <BuilderCanvas />
                        </div>
                    </div>

                    {/* Inspector - hidden in preview */}
                    <div className={`${preview ? 'hidden' : 'block'} transition-all`}>
                        <BuilderInspector />
                    </div>
                </div>
            </div>
        </BuilderProvider>
    )
}

function BuilderHeader({ onPreview, isPreview }: { onPreview: () => void, isPreview: boolean }) {
    const { saveLayout, isLoading, title, setTitle, slug, setSlug } = useBuilder()

    return (
        <div className="flex items-center justify-between border-b px-6 py-3 bg-white gap-4 z-10 relative">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/pages">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex flex-col">
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="h-7 text-sm font-semibold border-transparent hover:border-input focus:border-input px-0 w-[200px]"
                        placeholder="Page Title"
                        disabled={isPreview}
                    />
                    {!isPreview && (
                        <div className="flex items-center text-xs text-muted-foreground">
                            <span className="mr-1">/</span>
                            <Input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="h-5 text-xs border-transparent hover:border-input focus:border-input px-0 w-[150px]"
                                placeholder="slug"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    variant={isPreview ? "default" : "outline"}
                    size="sm"
                    onClick={onPreview}
                >
                    {isPreview ? "Exit Preview" : "Preview"}
                </Button>
                {!isPreview && (
                    <Button onClick={saveLayout} disabled={isLoading} size="sm">
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? "Saving..." : "Save Page"}
                    </Button>
                )}
            </div>
        </div>
    )
}
