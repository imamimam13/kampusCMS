import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

export const dynamic = 'force-dynamic'

export default async function GalleryAdminPage() {
    const albums = await prisma.galleryAlbum.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { images: true }
            }
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gallery Albums</h1>
                    <p className="text-muted-foreground">Manage photo albums and collections.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/gallery/new">
                        <Plus className="mr-2 h-4 w-4" /> Create Album
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.length === 0 ? (
                    <div className="col-span-full p-12 text-center border rounded-lg bg-slate-50 text-muted-foreground">
                        <ImageIcon className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                        <p>No albums found. Click "Create Album" to start.</p>
                    </div>
                ) : (
                    albums.map((album) => (
                        <Link
                            key={album.id}
                            href={`/admin/gallery/${album.id}`}
                            className="group block bg-white border rounded-xl overflow-hidden hover:shadow-md transition-all"
                        >
                            <div className="relative h-48 bg-slate-100">
                                {album.coverImage ? (
                                    <Image
                                        src={album.coverImage}
                                        alt={album.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-slate-300">
                                        <ImageIcon className="h-12 w-12" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="font-bold text-lg leading-tight">{album.title}</h3>
                                    <p className="text-xs text-white/80">{album._count.images} Photos</p>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {album.description || "No description"}
                                </p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
