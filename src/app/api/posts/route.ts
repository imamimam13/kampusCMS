
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { slugify } from "@/lib/utils"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const publishedOnly = searchParams.get('published') === 'true'

    const posts = await prisma.post.findMany({
        where: publishedOnly ? { published: true } : {},
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
            author: {
                select: { name: true }
            }
        }
    })

    return NextResponse.json(posts)
}

export async function POST(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const { title, content, image, published, authorId } = body

        let slug = slugify(title)

        // Ensure unique slug
        const existing = await prisma.post.findUnique({ where: { slug } })
        if (existing) {
            slug = `${slug} -${Date.now()} `
        }

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                image,
                published,
                authorId
            }
        })

        return NextResponse.json(post)
    } catch (error) {
        console.error("POST Error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
