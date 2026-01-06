import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { AlbumForm } from "@/components/gallery/album-form"
import { AlbumPhotoManager } from "@/components/gallery/album-photo-manager"
import { DeleteButton } from "@/components/admin/delete-button"

export default async function EditAlbumPage({ params }: { params: Promise<{ id: string }> }) {
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
        <div className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <Link href="/admin/gallery" className="text-sm text-muted-foreground hover:underline mb-2 inline-block">
                        ← Back to Gallery
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Album</h1>
                    <p className="text-muted-foreground">Manage album details and photos.</p>
                </div>
                <DeleteButton id={album.id} apiPath="/api/gallery" itemName="album" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <AlbumForm initialData={album} />
                </div>
                <div className="lg:col-span-2">
                    <AlbumPhotoManager albumId={album.id} images={album.images} />
                </div>
            </div>
        </div>
    )
}
