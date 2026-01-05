import { BlockData } from "@/types/builder"

export function ColumnsBlock({ data }: { data: BlockData }) {
    const { count, columns } = data.content
    const gridCols = count === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'

    return (
        <div className={`grid grid-cols-1 ${gridCols} gap-8 py-8`}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: columns?.[i]?.html || '' }} />
                </div>
            ))}
        </div>
    )
}
