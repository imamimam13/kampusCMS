import { BlockData } from "@/types/builder"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function AboutBlock({ data }: { data: BlockData }) {
    const { title, description, image, stats, ctaText, ctaLink } = data.content

    return (
        <section className="py-16 md:py-24 overflow-hidden">
            <div className="container px-4 md:px-6">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Image Section */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative aspect-square md:aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
                            <img
                                src={image || '/placeholder.jpg'}
                                alt={title}
                                className="w-full h-full object-cover transform transition duration-700 group-hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col justify-center space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
                            <div
                                className="prose prose-gray dark:prose-invert max-w-none text-muted-foreground"
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        </div>

                        {/* Stats Grid */}
                        {stats && stats.length > 0 && (
                            <div className="grid grid-cols-3 gap-6 border-y py-8">
                                {stats.map((stat: any, index: number) => (
                                    <div key={index} className="space-y-1 text-center lg:text-left">
                                        <h3 className="text-3xl font-bold text-purple-600">{stat.value}</h3>
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTA */}
                        {ctaText && ctaLink && (
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button asChild size="lg" className="rounded-full px-8">
                                    <Link href={ctaLink}>
                                        {ctaText}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
