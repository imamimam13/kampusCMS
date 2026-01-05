import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Image as ImageIcon } from "lucide-react"

export const revalidate = 3600

export default async function AlbumPage({ params }: { params: { id: string } }) {
    // Await params in next 15+
    const { id } = await params

    const album = await prisma.galleryAlbum.findUnique({
        where: { id },
        include: {
            images: {
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!album) notFound()

    return (
        <div className="min-h-screen bg-white">
            {/* Header / Hero */}
            <div className="bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0">
                    {album.coverImage && (
                        <Image
                            src={album.coverImage}
                            alt={album.title}
                            fill
                            className="object-cover opacity-20 blur-sm"
                        />
                    )}
                </div>
                <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    <Link href="/gallery" className="inline-flex items-center text-sm text-slate-300 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Gallery
                    </Link>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-4">
                        {album.title}
                    </h1>
                    {album.description && (
                        <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
                            {album.description}
                        </p>
                    )}
                    <div className="mt-8 flex items-center gap-4 text-sm font-medium text-slate-400">
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1.5" />
                            {new Date(album.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </div>
                        <div className="flex items-center">
                            <ImageIcon className="h-4 w-4 mr-1.5" />
                            {album.images.length} Photos
                        </div>
                    </div>
                </div>
            </div>

            {/* Photo Grid */}
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {album.images.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>No photos have been uploaded to this album yet.</p>
                    </div>
                ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                        {album.images.map((img: any) => (
                            <div key={img.id} className="break-inside-avoid relative group rounded-xl overflow-hidden bg-slate-100 shadow-sm hover:shadow-lg transition-all">
                                <Image
                                    src={img.url}
                                    alt={img.caption || album.title}
                                    width={800}
                                    height={600}
                                    className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Overlay for caption/download */}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 ease-out">
                                    <p className="text-white text-sm font-medium truncate">{img.caption || "Untitled"}</p>
                                    <a
                                        href={img.url}
                                        target="_blank"
                                        download
                                        className="text-xs text-slate-300 hover:text-white mt-1 inline-block"
                                    >
                                        Open Original
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
