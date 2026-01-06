import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"

export default async function PostsPage() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: { author: true }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">News & Articles</h1>
                    <p className="text-muted-foreground">Manage campus news and blog posts.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/news/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Post
                    </Link>
                </Button>
            </div>

            <div className="border rounded-lg">
                <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 font-medium text-sm">
                    <div className="col-span-6">Title</div>
                    <div className="col-span-2">Author</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>
                {posts.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No posts found. Create one to get started.
                    </div>
                ) : (
                    posts.map((post: any) => (
                        <div key={post.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-center hover:bg-slate-50">
                            <div className="col-span-6">
                                <div className="font-medium">{post.title}</div>
                                <div className="text-xs text-muted-foreground truncate">/{post.slug}</div>
                            </div>
                            <div className="col-span-2 text-sm">
                                {post.author?.name || "-"}
                            </div>
                            <div className="col-span-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {post.published ? 'Published' : 'Draft'}
                                </span>
                            </div>
                            <div className="col-span-2 flex items-center justify-end gap-2">
                                <Button asChild variant="ghost" size="icon">
                                    <Link href={`/admin/news/${post.id}`}>
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <DeleteButton id={post.id} apiPath="/api/posts" itemName={post.title} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
