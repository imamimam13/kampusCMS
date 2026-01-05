import { AlbumForm } from "@/components/gallery/album-form"

export default function NewAlbumPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Album</h1>
                <p className="text-muted-foreground">Start by creating an album. You can add photos in the next step.</p>
            </div>

            <AlbumForm />
        </div>
    )
}
