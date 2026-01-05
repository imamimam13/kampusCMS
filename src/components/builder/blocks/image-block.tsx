import { BlockData } from "@/types/builder"
import Image from "next/image"

export function ImageBlock({ data }: { data: BlockData }) {
    const { url, alt, caption } = data.content || {}

    if (!url) {
        return (
            <div className="w-full h-64 bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 rounded-lg">
                <p>No Image Selected</p>
            </div>
        )
    }

    return (
        <section className="py-8">
            <div className="container mx-auto px-4">
                <figure className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-lg bg-slate-100">
                    {/* Using standard img tag for external URLs if domain not allowed in next.config, 
                         or generic approach. For strictly local/safe URLs, Next/Image is better. 
                         Using img for flexibility in this builder context. */}
                    <img
                        src={url}
                        alt={alt || "Section Image"}
                        className="w-full h-full object-cover"
                    />
                    {caption && (
                        <figcaption className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 text-center backdrop-blur-sm">
                            {caption}
                        </figcaption>
                    )}
                </figure>
            </div>
        </section>
    )
}
