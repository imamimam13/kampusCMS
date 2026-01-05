"use client"

import React, { createContext, useContext, useState } from 'react'
import { BlockData, PageLayout, defaultBlockContent, BlockType } from '@/types/builder'
import { v4 as uuidv4 } from 'uuid'

interface BuilderContextType {
    blocks: BlockData[]
    addBlock: (type: BlockType) => void
    removeBlock: (id: string) => void
    moveBlock: (activeId: string, overId: string) => void
    updateBlockContent: (id: string, content: any) => void
    saveLayout: () => Promise<void>
    isLoading: boolean
    selectedBlockId: string | null
    selectBlock: (id: string | null) => void
    title: string
    setTitle: (title: string) => void
    slug: string
    setSlug: (slug: string) => void
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined)

export function BuilderProvider({ children, initialData }: { children: React.ReactNode, initialData?: any }) {
    // Parse content if it's a string (from DB), otherwise use it as is or default to empty array
    const [blocks, setBlocks] = useState<BlockData[]>(() => {
        if (!initialData?.content) return []
        if (typeof initialData.content === 'string') {
            try {
                return JSON.parse(initialData.content)
            } catch (e) {
                return []
            }
        }
        return initialData.content
    })

    const [title, setTitle] = useState(initialData?.title || "New Page")
    const [slug, setSlug] = useState(initialData?.slug || "/")
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const addBlock = (type: BlockType) => {
        const newBlock: BlockData = {
            id: uuidv4(),
            type,
            content: defaultBlockContent[type]
        }
        setBlocks((prev) => [...prev, newBlock])
    }

    const removeBlock = (id: string) => {
        setBlocks((prev) => prev.filter((b) => b.id !== id))
        if (selectedBlockId === id) setSelectedBlockId(null)
    }

    const moveBlock = (activeId: string, overId: string) => {
        setBlocks((prev) => {
            const oldIndex = prev.findIndex((b) => b.id === activeId)
            const newIndex = prev.findIndex((b) => b.id === overId)

            if (oldIndex === -1 || newIndex === -1) return prev

            const newBlocks = [...prev]
            const [movedBlock] = newBlocks.splice(oldIndex, 1)
            newBlocks.splice(newIndex, 0, movedBlock)
            return newBlocks
        })
    }

    const selectBlock = (id: string | null) => {
        setSelectedBlockId(id)
    }

    const updateBlockContent = (id: string, content: any) => {
        setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content } : b)))
    }

    const saveLayout = async () => {
        setIsLoading(true)
        try {
            await fetch('/api/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug,
                    title,
                    content: blocks,
                    published: true,
                    id: initialData?.id
                })
            })
            alert('Page saved successfully!')
        } catch (error) {
            console.error("Failed to save", error)
            alert('Failed to save')
        }
        setIsLoading(false)
    }

    return (
        <BuilderContext.Provider value={{
            blocks, addBlock, removeBlock, moveBlock, updateBlockContent,
            saveLayout, isLoading, selectedBlockId, selectBlock,
            title, setTitle, slug, setSlug
        }}>
            {children}
        </BuilderContext.Provider>
    )
}

export const useBuilder = () => {
    const context = useContext(BuilderContext)
    if (!context) throw new Error("useBuilder must be used within a BuilderProvider")
    return context
}
