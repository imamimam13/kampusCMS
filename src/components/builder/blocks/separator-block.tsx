import { BlockData } from "@/types/builder"

export function SeparatorBlock({ data }: { data: BlockData }) {
    const { height, color, showLine } = data.content

    return (
        <div
            className="w-full flex items-center justify-center"
            style={{
                height: `${height || 20}px`,
                backgroundColor: color || 'transparent'
            }}
        >
            {showLine && (
                <div className="w-full h-[1px] bg-border max-w-5xl mx-auto" />
            )}
        </div>
    )
}
