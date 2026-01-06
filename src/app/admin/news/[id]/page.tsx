import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PostForm } from "@/components/posts/post-form"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: PageProps) {
    const { id } = await params

    const post = await prisma.post.findUnique({
        where: { id }
    })

    if (!post) notFound()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin/news" className="text-sm text-muted-foreground hover:underline mb-2 inline-block">
                        ← Back to Posts
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
                </div>
            </div>

            <PostForm initialData={post} />
        </div>
    )
}
