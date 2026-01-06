"use client"

import { useBuilder } from "@/contexts/builder-context"
import { BlockType } from "@/types/builder"
import { Button } from "@/components/ui/button"
import {
    Type,
    ImageIcon,
    LayoutTemplate,
    Grid3X3,
    Calendar,
    Download,
    GalleryHorizontal,
    Images,
    LayoutDashboard,
    SquareDashedBottom,
    Newspaper,
    Users,
    Contact,
    Columns,
    Info,
    GraduationCap,
    Rss,
    Share2
} from "lucide-react"

const availableBlocks: { type: BlockType; label: string; icon: any }[] = [
    { type: "hero", label: "Hero Section", icon: LayoutTemplate },
    { type: "features", label: "Features List", icon: Grid3X3 },
    { type: "about", label: "About Us", icon: Info }, // New
    { type: "cards", label: "Card Grid", icon: LayoutDashboard },
    { type: "columns", label: "Multi-Column Text", icon: Columns }, // New
    { type: "contact", label: "Contact & Map", icon: Contact }, // New
    { type: "social", label: "Social Media Embed", icon: Share2 },
    { type: "rss", label: "RSS News Feed", icon: Rss },
    { type: "news-grid", label: "News Grid", icon: Newspaper },
    { type: "staff-grid", label: "Staff Linktree", icon: Users },
    { type: "text", label: "Text Block", icon: Type },
    { type: "image", label: "Image/Video", icon: ImageIcon },
    { type: "gallery", label: "Photo Gallery", icon: GalleryHorizontal },
    { type: "carousel", label: "Image Carousel", icon: Images },
    { type: "separator", label: "Spacer / Separator", icon: SquareDashedBottom },
    { type: "calendar", label: "Events Calendar", icon: Calendar },
    { type: "prodi-grid", label: "Academic Programs", icon: GraduationCap },
    { type: "tracer-stats", label: "Tracer Stats", icon: Users },
    { type: "download", label: "Download Center", icon: Download },
]

export function BuilderSidebar() {
    const { addBlock } = useBuilder()

    return (
        <div className="w-64 border-l bg-background p-4 overflow-y-auto h-[calc(100vh-60px)]">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground">
                Toolbox
            </h3>
            <div className="grid gap-2">
                {availableBlocks.map((block) => (
                    <Button
                        key={block.type}
                        variant="outline"
                        className="justify-start h-auto py-3"
                        onClick={() => addBlock(block.type)}
                    >
                        <block.icon className="mr-2 h-4 w-4" />
                        <div className="flex flex-col items-start">
                            <span>{block.label}</span>
                            <span className="text-[10px] text-muted-foreground font-normal">Click to add</span>
                        </div>
                    </Button>
                ))}
            </div>
        </div>
    )
}
