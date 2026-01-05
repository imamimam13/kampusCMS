import { DownloadForm } from '@/components/downloads/download-form';

export default function NewDownloadPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add Document</h1>
                <p className="text-muted-foreground">Add a new file for public download.</p>
            </div>

            <DownloadForm />
        </div>
    )
}
