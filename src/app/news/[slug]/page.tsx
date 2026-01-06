import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Calendar, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await prisma.post.findUnique({
        where: { slug }
    })

    if (!post || !post.published) {
        notFound()
    }

    return (
        <article className="container max-w-4xl py-12 mx-auto">
            <Link href="/news">
                <Button variant="ghost" className="mb-6 pl-0 hover:pl-0 hover:bg-transparent">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to News
                </Button>
            </Link>

            <header className="mb-8 text-center">
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
            </header>

            {post.image && (
                <div className="aspect-video w-full overflow-hidden rounded-xl mb-10 border shadow-sm">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
        </article>
    )
}
