import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function NewsIndexPage() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="container py-12 mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">Latest News</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post: any) => (
                    <Link key={post.id} href={`/news/${post.slug}`}>
                        <Card className="h-full hover:shadow-lg transition-shadow">
                            {post.image && (
                                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    {post.authorId && (
                                        <>
                                            <span>•</span>
                                            <User className="w-3 h-3" />
                                            <span>Admin</span>
                                        </>
                                    )}
                                </div>
                                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm line-clamp-3">
                                    {post.excerpt || "No description available."}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <p>No news articles published yet.</p>
                </div>
            )}
        </div>
    )
}
