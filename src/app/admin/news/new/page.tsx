import Link from "next/link"
import { PostForm } from "@/components/posts/post-form"

export default function NewPostPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin/news" className="text-sm text-muted-foreground hover:underline mb-2 inline-block">
                        ← Back to Posts
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
                </div>
            </div>

            <PostForm />
        </div>
    )
}
