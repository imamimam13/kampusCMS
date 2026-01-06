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
                            <div className="space-y-2">
                                <Label>Background Color</Label>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-10 h-10 rounded border shadow-sm"
                                        style={{ backgroundColor: selectedBlock.content.backgroundColor || '#111827' }}
                                    />
                                    <Input
                                        type="color"
                                        className="w-full h-10 p-1 cursor-pointer"
                                        value={selectedBlock.content.backgroundColor || '#111827'}
                                        onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Background Image</Label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => document.getElementById('hero-bg-upload')?.click()}
                                        className="w-full"
                                    >
                                        <UploadCloud className="mr-2 h-4 w-4" />
                                        Upload BG
                                    </Button>
                                    <input
                                        id="hero-bg-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (!file) return
                                            const formData = new FormData()
                                            formData.append('file', file)
                                            try {
                                                const res = await fetch('/api/upload', { method: 'POST', body: formData })
                                                if (res.ok) {
                                                    const data = await res.json()
                                                    handleUpdate('backgroundImage', data.url)
                                                }
                                            } catch (err) { console.error("Upload failed") }
                                        }}
                                    />
                                </div>
                                {selectedBlock.content.backgroundImage && (
                                    <div className="relative mt-2 aspect-video w-full rounded border overflow-hidden group">
                                        <img src={selectedBlock.content.backgroundImage} className="w-full h-full object-cover" />
                                        <Button
                                            variant="destructive" size="icon"
                                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleUpdate('backgroundImage', '')}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                )}
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
                            <select
                                className="w-full border rounded-md p-2 text-sm"
                                value={selectedBlock.content.category || ''}
                                onChange={(e) => handleUpdate('category', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="Akademik">Akademik</option>
                                <option value="Panduan">Panduan</option>
                                <option value="SK">SK</option>
                                <option value="Umum">Umum</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
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

                {selectedBlock.type === 'carousel' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Autoplay</Label>
                            <input
                                type="checkbox"
                                className="toggle"
                                checked={selectedBlock.content.autoplay}
                                onChange={(e) => handleUpdate('autoplay', e.target.checked)}
                            />
                        </div>

                        <div className="space-y-4 border-t pt-4">
                            <Label>Slides</Label>
                            {(selectedBlock.content.slides || []).map((slide: any, index: number) => (
                                <div key={index} className="space-y-3 p-3 bg-slate-50 rounded border relative group">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-muted-foreground">Slide {index + 1}</span>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500" onClick={() => {
                                            const newSlides = [...(selectedBlock.content.slides || [])]
                                            newSlides.splice(index, 1)
                                            handleUpdate('slides', newSlides)
                                        }}>
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    {/* Image Upload/Preview */}
                                    <div className="relative aspect-video bg-slate-200 rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => document.getElementById(`slide-upload-${index}`)?.click()}
                                    >
                                        {slide.image ? (
                                            <img src={slide.image} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">Click to Upload Image</div>
                                        )}
                                        <input
                                            id={`slide-upload-${index}`}
                                            type="file"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0]
                                                if (!file) return
                                                const formData = new FormData()
                                                formData.append('file', file)
                                                // Simplified upload logic for brevity
                                                try {
                                                    const res = await fetch('/api/upload', { method: 'POST', body: formData })
                                                    if (res.ok) {
                                                        const data = await res.json()
                                                        const newSlides = [...(selectedBlock.content.slides || [])]
                                                        newSlides[index] = { ...newSlides[index], image: data.url }
                                                        handleUpdate('slides', newSlides)
                                                    }
                                                } catch (e) {
                                                    console.error(e)
                                                }
                                            }}
                                        />
                                    </div>

                                    <Input
                                        placeholder="Title"
                                        className="h-8 text-sm"
                                        value={slide.title || ''}
                                        onChange={(e) => {
                                            const newSlides = [...(selectedBlock.content.slides || [])]
                                            newSlides[index] = { ...newSlides[index], title: e.target.value }
                                            handleUpdate('slides', newSlides)
                                        }}
                                    />
                                    <Input
                                        placeholder="Subtitle"
                                        className="h-8 text-sm"
                                        value={slide.subtitle || ''}
                                        onChange={(e) => {
                                            const newSlides = [...(selectedBlock.content.slides || [])]
                                            newSlides[index] = { ...newSlides[index], subtitle: e.target.value }
                                            handleUpdate('slides', newSlides)
                                        }}
                                    />
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                    const newSlides = [...(selectedBlock.content.slides || []), { title: "New Slide", subtitle: "", image: "" }]
                                    handleUpdate('slides', newSlides)
                                }}
                            >
                                + Add Slide
                            </Button>
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'separator' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Height (px)</Label>
                            <Input
                                type="number"
                                value={selectedBlock.content.height || 20}
                                onChange={(e) => handleUpdate('height', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Show Line</Label>
                            <input
                                type="checkbox"
                                className="toggle"
                                checked={selectedBlock.content.showLine}
                                onChange={(e) => handleUpdate('showLine', e.target.checked)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Background Color</Label>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-10 h-10 rounded border shadow-sm"
                                    style={{ backgroundColor: selectedBlock.content.color || 'transparent' }}
                                />
                                <Input
                                    type="color"
                                    className="w-full h-10 p-1 cursor-pointer"
                                    value={selectedBlock.content.color || '#ffffff'}
                                    onChange={(e) => handleUpdate('color', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'cards' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Section Title</Label>
                            <Input
                                value={selectedBlock.content.title || ''}
                                onChange={(e) => handleUpdate('title', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Columns</Label>
                            <select
                                className="w-full border rounded-md p-2 text-sm"
                                value={selectedBlock.content.columns || 3}
                                onChange={(e) => handleUpdate('columns', parseInt(e.target.value))}
                            >
                                <option value={2}>2 Columns</option>
                                <option value={3}>3 Columns</option>
                                <option value={4}>4 Columns</option>
                            </select>
                        </div>

                        <div className="space-y-4 border-t pt-4">
                            <Label>Cards</Label>
                            {(selectedBlock.content.items || []).map((item: any, index: number) => (
                                <div key={index} className="space-y-3 p-3 bg-slate-50 rounded border relative group">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-muted-foreground">Card {index + 1}</span>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500" onClick={() => {
                                            const newItems = [...(selectedBlock.content.items || [])]
                                            newItems.splice(index, 1)
                                            handleUpdate('items', newItems)
                                        }}>
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    {/* Image Upload for Card */}
                                    {/* Image Upload/Preview */}
                                    <div className="relative aspect-video bg-slate-200 rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => document.getElementById(`card-upload-${index}`)?.click()}
                                    >
                                        {item.image ? (
                                            <img src={item.image} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">Click to Upload Image</div>
                                        )}
                                        <input
                                            id={`card-upload-${index}`}
                                            type="file"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0]
                                                if (!file) return
                                                const formData = new FormData()
                                                formData.append('file', file)
                                                // Simplified upload logic
                                                try {
                                                    const res = await fetch('/api/upload', { method: 'POST', body: formData })
                                                    if (res.ok) {
                                                        const data = await res.json()
                                                        const newItems = [...(selectedBlock.content.items || [])]
                                                        newItems[index] = { ...newItems[index], image: data.url }
                                                        handleUpdate('items', newItems)
                                                    }
                                                } catch (e) {
                                                    console.error(e)
                                                }
                                            }}
                                        />
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
                                    <Input
                                        placeholder="Link URL"
                                        className="h-8 text-sm"
                                        value={item.link || ''}
                                        onChange={(e) => {
                                            const newItems = [...(selectedBlock.content.items || [])]
                                            newItems[index] = { ...newItems[index], link: e.target.value }
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
                                    const newItems = [...(selectedBlock.content.items || []), { title: "New Card", description: "Description", image: "", link: "#" }]
                                    handleUpdate('items', newItems)
                                }}
                            >
                                + Add Card
                            </Button>
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'contact' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Section Title</Label>
                            <Input
                                value={selectedBlock.content.title || ''}
                                onChange={(e) => handleUpdate('title', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Address / Info (Rich Text)</Label>
                            <RichTextEditor
                                value={selectedBlock.content.address || ''}
                                onChange={(value) => handleUpdate('address', value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input
                                value={selectedBlock.content.phone || ''}
                                onChange={(e) => handleUpdate('phone', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                value={selectedBlock.content.email || ''}
                                onChange={(e) => handleUpdate('email', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Google Maps Embed URL</Label>
                            <Textarea
                                placeholder="https://www.google.com/maps/embed?..."
                                className="text-xs font-mono"
                                value={selectedBlock.content.mapUrl || ''}
                                onChange={(e) => handleUpdate('mapUrl', e.target.value)}
                            />
                            <p className="text-[10px] text-muted-foreground">Go to Google Maps &gt; Share &gt; Embed a map &gt; Copy the 'src' URL inside the &lt;iframe&gt;</p>
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'prodi-grid' && (
                    <div className="space-y-2">
                        <Label>Section Title</Label>
                        <Input
                            value={selectedBlock.content.title || ''}
                            onChange={(e) => handleUpdate('title', e.target.value)}
                        />
                        <Label>Description</Label>
                        <Textarea
                            value={selectedBlock.content.description || ''}
                            onChange={(e) => handleUpdate('description', e.target.value)}
                        />
                        <div className="space-y-2 mt-2">
                            <Label>Items to Show</Label>
                            <Input
                                type="number"
                                value={selectedBlock.content.count || 6}
                                onChange={(e) => handleUpdate('count', parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'tracer-stats' && (
                    <div className="space-y-2">
                        <Label>Section Title</Label>
                        <Input
                            value={selectedBlock.content.title || ''}
                            onChange={(e) => handleUpdate('title', e.target.value)}
                        />
                        <Label>Description</Label>
                        <Textarea
                            value={selectedBlock.content.description || ''}
                            onChange={(e) => handleUpdate('description', e.target.value)}
                        />
                    </div>
                )}

                {selectedBlock.type === 'columns' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Layout</Label>
                            <select
                                className="w-full border rounded-md p-2 text-sm"
                                value={selectedBlock.content.count || 2}
                                onChange={(e) => handleUpdate('count', parseInt(e.target.value))}
                            >
                                <option value={2}>2 Columns (50/50)</option>
                                <option value={3}>3 Columns (33/33/33)</option>
                            </select>
                        </div>

                        <div className="space-y-6 pt-4 border-t">
                            {Array.from({ length: selectedBlock.content.count || 2 }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Label className="font-semibold text-purple-600">Column {i + 1} Content</Label>
                                    <RichTextEditor
                                        value={selectedBlock.content.columns?.[i]?.html || ''}
                                        onChange={(value) => {
                                            const newCols = [...(selectedBlock.content.columns || [])]
                                            // Ensure array has objects up to i
                                            for (let k = 0; k <= i; k++) { if (!newCols[k]) newCols[k] = { html: '' } }
                                            newCols[i] = { ...newCols[i], html: value }
                                            handleUpdate('columns', newCols)
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'about' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Section Title</Label>
                            <Input
                                value={selectedBlock.content.title || ''}
                                onChange={(e) => handleUpdate('title', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <RichTextEditor
                                value={selectedBlock.content.description || ''}
                                onChange={(value) => handleUpdate('description', value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Main Image</Label>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById('about-bg-upload')?.click()}
                                    className="w-full"
                                >
                                    <UploadCloud className="mr-2 h-4 w-4" />
                                    Upload Image
                                </Button>
                                <input
                                    id="about-bg-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return
                                        const formData = new FormData()
                                        formData.append('file', file)
                                        try {
                                            const res = await fetch('/api/upload', { method: 'POST', body: formData })
                                            if (res.ok) {
                                                const data = await res.json()
                                                handleUpdate('image', data.url)
                                            }
                                        } catch (err) { console.error("Upload failed") }
                                    }}
                                />
                            </div>
                            {selectedBlock.content.image && (
                                <div className="relative mt-2 aspect-video w-full rounded border overflow-hidden group">
                                    <img src={selectedBlock.content.image} className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>CTA Text</Label>
                                <Input
                                    value={selectedBlock.content.ctaText || ''}
                                    onChange={(e) => handleUpdate('ctaText', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>CTA Link</Label>
                                <Input
                                    value={selectedBlock.content.ctaLink || ''}
                                    onChange={(e) => handleUpdate('ctaLink', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 border-t pt-4">
                            <Label>Stats / Counters</Label>
                            {(selectedBlock.content.stats || []).map((stat: any, index: number) => (
                                <div key={index} className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded border relative">
                                    <Button variant="ghost" size="sm" className="absolute -top-3 -right-3 h-6 w-6 p-0 text-red-500 rounded-full bg-white shadow border" onClick={() => {
                                        const newStats = [...(selectedBlock.content.stats || [])]
                                        newStats.splice(index, 1)
                                        handleUpdate('stats', newStats)
                                    }}>
                                        <X className="h-3 w-3" />
                                    </Button>
                                    <div>
                                        <Label className="text-xs">Value (e.g. 500+)</Label>
                                        <Input
                                            className="h-8 text-sm"
                                            value={stat.value || ''}
                                            onChange={(e) => {
                                                const newStats = [...(selectedBlock.content.stats || [])]
                                                newStats[index] = { ...newStats[index], value: e.target.value }
                                                handleUpdate('stats', newStats)
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Label (e.g. Students)</Label>
                                        <Input
                                            className="h-8 text-sm"
                                            value={stat.label || ''}
                                            onChange={(e) => {
                                                const newStats = [...(selectedBlock.content.stats || [])]
                                                newStats[index] = { ...newStats[index], label: e.target.value }
                                                handleUpdate('stats', newStats)
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                    const newStats = [...(selectedBlock.content.stats || []), { value: "100", label: "Metric" }]
                                    handleUpdate('stats', newStats)
                                }}
                            >
                                + Add Stat
                            </Button>
                        </div>
                    </div>
                )}


                {/* Generic fallback for remaining unknown types */}
                {!['hero', 'text', 'features', 'news-grid', 'staff-grid', 'calendar', 'download', 'image', 'gallery', 'carousel', 'separator', 'cards', 'contact', 'columns', 'about', 'prodi-grid', 'tracer-stats'].includes(selectedBlock.type) && (
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
