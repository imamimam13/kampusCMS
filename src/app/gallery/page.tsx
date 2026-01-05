import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Image as ImageIcon } from "lucide-react"

export const revalidate = 3600

export default async function GalleryPage() {
    const albums = await prisma.galleryAlbum.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { images: true }
            }
        }
    })

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10">
                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Campus Gallery
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Explore photos from our latest events, student activities, and campus life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {albums.length === 0 ? (
                        <div className="col-span-full py-16 text-center">
                            <ImageIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900">No albums yet</h3>
                            <p className="text-gray-500 mt-2">Check back soon for photos!</p>
                        </div>
                    ) : (
                        albums.map((album) => (
                            <Link
                                key={album.id}
                                href={`/gallery/${album.id}`}
                                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="relative h-64 bg-slate-200">
                                    {album.coverImage ? (
                                        <Image
                                            src={album.coverImage}
                                            alt={album.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-slate-400">
                                            <ImageIcon className="h-12 w-12" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform">
                                        <h3 className="font-bold text-xl mb-1 leading-tight">{album.title}</h3>
                                        {album.description && (
                                            <p className="text-sm text-white/80 line-clamp-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                                {album.description}
                                            </p>
                                        )}
                                        <div className="flex items-center text-xs font-medium text-white/70 uppercase tracking-wider">
                                            <ImageIcon className="h-3 w-3 mr-1" />
                                            {album._count.images} Photos
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
