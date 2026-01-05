import { BlockData } from "@/types/builder"
import { HeroBlock } from "./blocks/hero-block"
import { FeaturesBlock } from "./blocks/features-block"
import { NewsGridBlock } from "./blocks/news-grid-block"
import { StaffGridBlock } from "./blocks/staff-grid-block"
import { CalendarBlock } from "./blocks/calendar-block"
import { DownloadBlock } from "./blocks/download-block"
import { GalleryBlock } from "./blocks/gallery-block"
import { ImageBlock } from "./blocks/image-block"

export function BlockRenderer({ block }: { block: BlockData }) {
    switch (block.type) {
        case "hero":
            return <HeroBlock data={block} />
        case "features":
            return <FeaturesBlock data={block} />
        case "news-grid":
            return <NewsGridBlock data={block} />
        case "staff-grid":
            return <StaffGridBlock data={block} />
        case "calendar":
            return <CalendarBlock data={block} />
        case "download":
            return <DownloadBlock data={block} />
        case "gallery":
            return <GalleryBlock data={block} />
        case "image":
            return <ImageBlock data={block} />
        case "text":
            return <div className="p-4 bg-white prose max-w-none" dangerouslySetInnerHTML={{ __html: block.content.html }} />
        default:
            // Fallback for unimplemented blocks
            return (
                <div className="p-12 border-2 border-dashed rounded-lg text-center text-muted-foreground bg-gray-50">
                    <p className="font-medium">Block Type: {block.type}</p>
                    <p className="text-xs mt-2">Component not yet implemented</p>
                </div>
            )
    }
}
