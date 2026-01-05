"use client"

import { useBuilder } from "@/contexts/builder-context"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, X, UploadCloud } from "lucide-react"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

export function BuilderInspector() {
    const { blocks, updateBlockContent, removeBlock, selectedBlockId, selectBlock } = useBuilder()

    const selectedBlock = blocks.find((b) => b.id === selectedBlockId)

    if (!selectedBlock) {
        return (
            <div className="w-80 border-l bg-background p-6">
                <div className="flex h-full items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                    <p>Select a block on the canvas to edit its properties.</p>
                </div>
            </div>
        )
    }

    const handleUpdate = (key: string, value: any) => {
        updateBlockContent(selectedBlock.id, {
            ...selectedBlock.content,
            [key]: value
        })
    }

    return (
        <div className="w-80 border-l bg-background flex flex-col h-[calc(100vh-60px)]">
            <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold capitalize">{selectedBlock.type} Settings</h3>
                <Button variant="ghost" size="icon" onClick={() => selectBlock(null)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Dynamic Fields based on Block Type */}

                {selectedBlock.type === 'hero' && (
                    <>
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                value={selectedBlock.content.title || ''}
                                onChange={(e) => handleUpdate('title', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Subtitle</Label>
                            <Textarea
                                value={selectedBlock.content.subtitle || ''}
                                onChange={(e) => handleUpdate('subtitle', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                value={selectedBlock.content.ctaText || ''}
                                onChange={(e) => handleUpdate('ctaText', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>CTA Link (Primary)</Label>
                            <Input
                                value={selectedBlock.content.ctaLink || '#'}
                                onChange={(e) => handleUpdate('ctaLink', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Secondary Text</Label>
                                <Input
                                    value={selectedBlock.content.secondaryCtaText || 'Learn more'}
                                    onChange={(e) => handleUpdate('secondaryCtaText', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Secondary Link</Label>
                                <Input
                                    value={selectedBlock.content.secondaryCtaLink || '#'}
                                    onChange={(e) => handleUpdate('secondaryCtaLink', e.target.value)}
                                />
                            </div>
                        </div>
                    </>
                )}

                {selectedBlock.type === 'features' && (
                    <>
                        <div className="space-y-2">
                            <Label>Section Title</Label>
                            <Input
                                value={selectedBlock.content.title || ''}
                                onChange={(e) => handleUpdate('title', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Subtitle</Label>
                            <Textarea
                                value={selectedBlock.content.subtitle || ''}
                                onChange={(e) => handleUpdate('subtitle', e.target.value)}
                            />
                        </div>

                        <div className="space-y-4 border-t pt-4">
                            <Label>Features List</Label>
                            {(selectedBlock.content.items || []).map((item: any, index: number) => (
                                <div key={index} className="space-y-2 p-3 bg-slate-50 rounded border">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-muted-foreground">Item {index + 1}</span>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500" onClick={() => {
                                            const newItems = [...(selectedBlock.content.items || [])]
                                            newItems.splice(index, 1)
                                            handleUpdate('items', newItems)
                                        }}>
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <Input
                                        placeholder="Title"
                                        className="h-8 text-sm"
                                        value={item.title || ''}
                                        onChange={(e) => {
                                            const newItems = [...(selectedBlock.content.items || [])]
                                            newItems[index] = { ...newItems[index], title: e.target.value }
                                            handleUpdate('items', newItems)
                                        }}
                                    />
                                    <Textarea
                                        placeholder="Description"
                                        className="min-h-[60px] text-sm"
                                        value={item.description || ''}
                                        onChange={(e) => {
                                            const newItems = [...(selectedBlock.content.items || [])]
                                            newItems[index] = { ...newItems[index], description: e.target.value }
                                            handleUpdate('items', newItems)
                                        }}
                                    />
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                    const newItems = [...(selectedBlock.content.items || []), { title: "New Feature", description: "Description" }]
                                    handleUpdate('items', newItems)
                                }}
                            >
                                + Add Feature
                            </Button>
                        </div>
                    </>
                )}

                {selectedBlock.type === 'news-grid' && (
                    <div className="space-y-2">
                        <Label>Section Title</Label>
                        <Input
                            value={selectedBlock.content.title || ''}
                            onChange={(e) => handleUpdate('title', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            This block automatically displays the latest 3 posts.
                        </p>
                    </div>
                )}

                {selectedBlock.type === 'staff-grid' && (
                    <div className="space-y-2">
                        <Label>Section Title</Label>
                        <Input
                            value={selectedBlock.content.title || ''}
                            onChange={(e) => handleUpdate('title', e.target.value)}
                        />
                        <div className="space-y-2 mt-2">
                            <Label>Number of Staff to Show</Label>
                            <Input
                                type="number"
                                value={selectedBlock.content.count || 4}
                                onChange={(e) => handleUpdate('count', parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'calendar' && (
                    <div className="space-y-2">
                        <Label>Section Title</Label>
                        <Input
                            value={selectedBlock.content.title || ''}
                            onChange={(e) => handleUpdate('title', e.target.value)}
                        />
                        <Label>Subtitle</Label>
                        <Input
                            value={selectedBlock.content.subtitle || ''}
                            onChange={(e) => handleUpdate('subtitle', e.target.value)}
                        />
                        <div className="space-y-2 mt-2">
                            <Label>Events to Show</Label>
                            <Input
                                type="number"
                                value={selectedBlock.content.count || 3}
                                onChange={(e) => handleUpdate('count', parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'text' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Content</Label>
                            <RichTextEditor
                                value={selectedBlock.content.html || ''}
                                onChange={(value) => handleUpdate('html', value)}
                            />
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'image' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Image Source</Label>
                            <div className="flex flex-col gap-3">
                                {/* Upload Button */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => document.getElementById('block-image-upload')?.click()}
                                        className="w-full"
                                    >
                                        <UploadCloud className="mr-2 h-4 w-4" />
                                        Upload Image
                                    </Button>
                                    <input
                                        id="block-image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (!file) return

                                            // Upload logic
                                            const formData = new FormData()
                                            formData.append('file', file)
                                            try {
                                                const res = await fetch('/api/upload', { method: 'POST', body: formData })
                                                if (res.ok) {
                                                    const data = await res.json()
                                                    handleUpdate('url', data.url)
                                                    handleUpdate('alt', file.name.split('.')[0]) // Auto-fill alt
                                                }
                                            } catch (err) {
                                                console.error("Upload failed")
                                            }
                                        }}
                                    />
                                </div>
                                <div className="text-center text-xs text-muted-foreground">- OR -</div>
                                {/* Manual URL Input */}
                                <Input
                                    value={selectedBlock.content.url || ''}
                                    onChange={(e) => handleUpdate('url', e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Alt Text</Label>
                            <Input
                                value={selectedBlock.content.alt || ''}
                                onChange={(e) => handleUpdate('alt', e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'download' && (
                    <div className="space-y-2">
                        <Label>Section Title</Label>
                        <Input
                            value={selectedBlock.content.title || ''}
                            onChange={(e) => handleUpdate('title', e.target.value)}
                        />
                        <div className="space-y-2 mt-2">
                            <Label>Items to Show</Label>
                            <Input
                                type="number"
                                value={selectedBlock.content.count || 5}
                                onChange={(e) => handleUpdate('count', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2 mt-2">
                            <Label>Category Filter (Optional)</Label>
                            <Input
                                value={selectedBlock.content.category || ''}
                                onChange={(e) => handleUpdate('category', e.target.value)}
                                placeholder="e.g. Academic"
                            />
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'gallery' && (
                    <div className="space-y-2">
                        <Label>Section Title</Label>
                        <Input
                            value={selectedBlock.content.title || ''}
                            onChange={(e) => handleUpdate('title', e.target.value)}
                        />
                        <div className="space-y-2 mt-2">
                            <Label>Subtitle</Label>
                            <Input
                                value={selectedBlock.content.subtitle || ''}
                                onChange={(e) => handleUpdate('subtitle', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 mt-2">
                            <Label>Un-check to show only Album Covers (Grid)</Label>
                            <p className="text-xs text-muted-foreground">Currently displays latest albums.</p>
                            <div className="flex items-center gap-2">
                                <Label>Count: </Label>
                                <Input
                                    type="number"
                                    className="w-20"
                                    value={selectedBlock.content.count || 3}
                                    onChange={(e) => handleUpdate('count', parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Generic fallback for remaining unknown types */}
                {!['hero', 'text', 'features', 'news-grid', 'staff-grid', 'calendar', 'download', 'image', 'gallery'].includes(selectedBlock.type) && (
                    <div className="space-y-2">
                        <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                            Field editor for <strong>{selectedBlock.type}</strong> is under construction.
                        </p>
                        <Label>Raw JSON Data</Label>
                        <Textarea
                            className="font-mono text-xs min-h-[150px]"
                            value={JSON.stringify(selectedBlock.content, null, 2)}
                            disabled
                        />
                    </div>
                )}
            </div>

            <div className="p-4 border-t bg-slate-50">
                <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                        removeBlock(selectedBlock.id)
                        selectBlock(null)
                    }}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Block
                </Button>
            </div>
        </div>
    )
}
