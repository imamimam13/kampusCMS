"use client"

import { BlockData } from "@/types/builder"
import { useEffect, useRef } from "react"
import { Instagram, Music, Youtube, Hash, Code } from "lucide-react"

export function SocialBlock({ data }: { data: BlockData }) {
    // Config
    const mode = data.content.mode || "url" // 'url' | 'code'
    const platform = data.content.platform || "instagram"
    const url = data.content.url
    const embedCode = data.content.code
    const title = data.content.title

    const containerRef = useRef<HTMLDivElement>(null)

    // Helper to safely inject script tags if needed (for some widgets)
    useEffect(() => {
        if (mode === "code" && embedCode && containerRef.current) {
            // Check for script tags and execute them manually if standard innerHTML doesn't work
            const scripts = containerRef.current.querySelectorAll("script")
            scripts.forEach(oldScript => {
                const newScript = document.createElement("script")
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value))
                newScript.appendChild(document.createTextNode(oldScript.innerHTML))
                oldScript.parentNode?.replaceChild(newScript, oldScript)
            })
        }
    }, [embedCode, mode])

    // Render Native Embeds
    const renderNativeEmbed = () => {
        if (!url) {
            return (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border-2 border-dashed rounded-lg text-slate-400">
                    <Hash className="h-10 w-10 mb-2 opacity-50" />
                    <p>Paste a valid URL to display the post</p>
                </div>
            )
        }

        switch (platform) {
            case "youtube":
                // Extract Video ID
                let videoId = ""
                try {
                    if (url.includes("youtu.be")) videoId = url.split("/").pop()!
                    else if (url.includes("v=")) videoId = new URL(url).searchParams.get("v")!
                } catch (e) { }

                return (
                    <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-black">
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            className="w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                )

            case "instagram":
                // Basic Instagram Embed (via iframe is safest to avoid script conflicts)
                // Note: Instagram usually requires their script.js, but a simple way is link or using standard embed endpoints if available
                return (
                    <div className="flex justify-center">
                        <blockquote className="instagram-media" data-instgrm-permalink={url} data-instgrm-version="14" style={{ background: '#FFF', border: 0, borderRadius: '3px', boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)', margin: '1px', maxWidth: '540px', minWidth: '326px', padding: 0, width: '99.375%', width: '-webkit-calc(100% - 2px)', width: 'calc(100% - 2px)' }}>
                        </blockquote>
                        {/* We need the script globally or injected here. For now, we rely on the component mount injection or advise user to paste code */}
                        <script async src="//www.instagram.com/embed.js"></script>
                    </div>
                )

            case "tiktok":
                // TikTok Blockquote approach
                return (
                    <div className="flex justify-center">
                        <blockquote className="tiktok-embed" cite={url} data-video-id={url.split('/').pop()} style={{ maxWidth: '605px', minWidth: '325px' }} >
                            <section> <a target="_blank" href={url}>{url}</a> </section>
                        </blockquote>
                        <script async src="https://www.tiktok.com/embed.js"></script>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
                    </div>
                )}

                <div ref={containerRef} className="flex justify-center">
                    {mode === 'url' ? renderNativeEmbed() : (
                        embedCode ? (
                            <div dangerouslySetInnerHTML={{ __html: embedCode }} />
                        ) : (
                            <div className="w-full p-8 text-center bg-slate-50 border rounded text-slate-500">
                                Paste your widget code in the settings
                            </div>
                        )
                    )}
                </div>
            </div>
        </section>
    )
}
