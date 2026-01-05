import { BlockData } from "@/types/builder"
import { Button } from "@/components/ui/button"

export function HeroBlock({ data }: { data: BlockData }) {
    const { title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink, backgroundColor, backgroundImage } = data.content

    return (
        <div
            className="relative py-24 px-6 text-center rounded-md overflow-hidden text-white"
            style={{
                backgroundColor: backgroundColor || '#111827',
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Overlay if image is present to ensure text readability */}
            {backgroundImage && (
                <div className="absolute inset-0 bg-black/50"></div>
            )}

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                    {title}
                </h1>
                <p className="text-lg leading-8 text-gray-300">
                    {subtitle}
                </p>
                <Button variant="default" size="lg" asChild>
                    <a href={ctaLink || '#'}>{ctaText}</a>
                </Button>
                <Button variant="link" className="text-white" asChild>
                    <a href={secondaryCtaLink || '#'}>
                        {secondaryCtaText || "Learn more"} <span aria-hidden="true">→</span>
                    </a>
                </Button>
            </div>
        </div>

    )
}
