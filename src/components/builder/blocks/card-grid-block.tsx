import { BlockData } from "@/types/builder"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CardGridBlock({ data }: { data: BlockData }) {
    const { title, columns, items } = data.content

    // Determine grid columns
    const gridCols = columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3"

    return (
        <div className="py-8 space-y-8">
            {title && (
                <h2 className="text-3xl font-bold tracking-tight text-center">{title}</h2>
            )}

            <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
                {items?.map((item: any, idx: number) => (
                    <div key={idx} className="group relative flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm hover:shadow-md transition-shadow">
                        {item.image && (
                            <div className="aspect-video w-full overflow-hidden bg-muted">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        )}
                        <div className="flex flex-1 flex-col p-4">
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">
                                {item.description}
                            </p>
                            {/* Make the whole card clickable if link exists? Or just display logic? */}
                            {item.link && (
                                <Link
                                    href={item.link}
                                    className="mt-4 text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center"
                                >
                                    Learn more <span className="ml-1">→</span>
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
