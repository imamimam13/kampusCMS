"use client"

import { useBuilder } from "@/contexts/builder-context"
import { useEffect, useState } from "react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { BlockRenderer } from "@/components/builder/block-renderer"

// Sortable Item Wrapper
function SortableBlock({ id, children }: { id: string, children: React.ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 20 : 1,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative' as const
    }

    // We apply the listeners to a specific handle, or the whole block?
    // Let's apply to the whole block for now, but usually a handle is better.
    // For better UX, let's wrap the children in a div that has the ref.

    return (
        <div ref={setNodeRef} style={style} className="relative group mb-4">
            {/* We pass attributes and listeners to the child or a handle */}
            {children}
        </div>
    )
}

export function BuilderCanvas() {
    const { blocks, moveBlock, selectBlock, selectedBlockId } = useBuilder()

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5 // Avoid accidental drags when clicking inputs
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    if (!mounted) return (
        <div className="flex-1 overflow-y-auto bg-muted/20 p-8 h-[calc(100vh-60px)]">
            <div className="mx-auto max-w-5xl min-h-[500px] bg-white shadow-sm rounded-md p-8 pb-32">
                <div className="flex h-64 items-center justify-center">
                    <p className="text-muted-foreground">Loading editor...</p>
                </div>
            </div>
        </div>
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active.id !== over?.id && over) {
            moveBlock(active.id as string, over.id as string)
        }
    }

    return (
        <div className="flex-1 overflow-y-auto bg-muted/20 p-8 h-[calc(100vh-60px)]">
            <div className="mx-auto max-w-5xl min-h-[500px] bg-white shadow-sm rounded-md p-8 pb-32">
                {blocks.length === 0 ? (
                    <div className="flex h-64 items-center justify-center border-dashed border-2 rounded-lg bg-slate-50">
                        <div className="text-center">
                            <p className="text-lg font-medium text-slate-900">Start Building</p>
                            <p className="text-sm text-muted-foreground">Select a block from the sidebar to add it to your page.</p>
                        </div>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={blocks.map(b => b.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {blocks.map((block) => (
                                <SortableBlock key={block.id} id={block.id}>
                                    {/* 
                           We need to separate the drag handle from the content eventually. 
                           For now, the SortableBlock wrapper handles the drag ref.
                           But wait, in the generic SortableBlock above, I didn't attach listeners to a div.
                           Let's fix the SortableBlock specifically here.
                        */}
                                    <DraggableWrapper
                                        id={block.id}
                                        isSelected={selectedBlockId === block.id}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            selectBlock(block.id)
                                        }}
                                    >
                                        <BlockRenderer block={block} />
                                    </DraggableWrapper>
                                </SortableBlock>
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    )
}

// Sortable Item Wrapper
// Sortable Item Wrapper

function DraggableWrapper({ id, children, isSelected, onClick }: { id: string, children: React.ReactNode, isSelected?: boolean, onClick?: (e: React.MouseEvent) => void }) {
    const { attributes, listeners } = useSortable({ id })

    return (
        <div
            onClick={onClick}
            className={cn(
                "relative group ring-offset-2 rounded-md transition-all cursor-pointer",
                isSelected ? "ring-2 ring-blue-500" : "hover:ring-2 hover:ring-blue-500/50"
            )}
        >
            {/* Drag Handle - Absolutely positioned OUTSIDE the clipped area effectively, 
                but since the parent is NOT overflow hidden, it shows. */}
            <div
                {...attributes}
                {...listeners}
                className={cn(
                    "absolute -left-8 top-1/2 -translate-y-1/2 p-2 bg-white border shadow-sm rounded cursor-move transition-opacity z-50",
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
                title="Drag to move"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.66669 2.66667V13.3333M11.3334 2.66667V13.3333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>

            {/* Inner Content Wrapper - Clips content that overflows (like Hero images) */}
            <div className="overflow-hidden rounded-md">
                {children}
            </div>
        </div>
    )
}
