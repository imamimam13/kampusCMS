import { BlockData } from "@/types/builder"
import { HeroBlock } from "./blocks/hero-block"
import { FeaturesBlock } from "./blocks/features-block"
import { NewsGridBlock } from "./blocks/news-grid-block"
import { StaffGridBlock } from "./blocks/staff-grid-block"
import { CalendarBlock } from "./blocks/calendar-block"
import { DownloadBlock } from "./blocks/download-block"
import { GalleryBlock } from "./blocks/gallery-block"
import { ImageBlock } from "./blocks/image-block"
import { CarouselBlock } from "./blocks/carousel-block"
import { SeparatorBlock } from "./blocks/separator-block"
import { CardGridBlock } from "./blocks/card-grid-block"
import { ContactBlock } from "./blocks/contact-block"
import { ColumnsBlock } from "./blocks/columns-block"
import { AboutBlock } from "./blocks/about-block"
import { ProdiGridBlock } from "./blocks/prodi-grid-block"

import { TracerStatsBlock } from "./blocks/tracer-stats-block"
import { RSSBlock } from "./blocks/rss-block"
import { SocialBlock } from "./blocks/social-block"

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
        case "carousel":
            return <CarouselBlock data={block} />
        case "separator":
            return <SeparatorBlock data={block} />
        case "cards":
            return <CardGridBlock data={block} />
        case "contact":
            return <ContactBlock data={block} />
        case "columns":
            return <ColumnsBlock data={block} />
        case "about":
            return <AboutBlock data={block} />
        case "prodi-grid":
            return <ProdiGridBlock content={block.content} />
        case "tracer-stats":
            return <TracerStatsBlock content={block.content} />
        case "rss":
            return <RSSBlock data={block} />
        case "social":
            return <SocialBlock data={block} />
        case "image":
            return <ImageBlock data={block} />
        case "text":
            return (
                <section className="bg-white">
                    <div className="container mx-auto px-4 py-8">
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: block.content.html }} />
                    </div>
                </section>
            )
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
