"use client"
import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { BlockData } from "@/types/builder"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CarouselBlock({ data }: { data: BlockData }) {
    const { slides, autoplay } = data.content
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, autoplay ? [Autoplay({ delay: 5000 })] : [])
    const [selectedIndex, setSelectedIndex] = useState(0)

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('select', onSelect)
        return () => {
            emblaApi.off('select', onSelect)
        }
    }, [emblaApi, onSelect])

    if (!slides || slides.length === 0) {
        return <div className="p-8 text-center border rounded bg-slate-50 text-muted-foreground">Empty Carousel</div>
    }

    return (
        <div className="relative group overflow-hidden rounded-xl">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {slides.map((slide: any, index: number) => (
                        <div className="relative flex-[0_0_100%] min-w-0 h-[400px] md:h-[500px]" key={index}>
                            <img
                                src={slide.image || '/placeholder.jpg'}
                                alt={slide.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center p-6">
                                <div className="max-w-3xl space-y-4 text-white">
                                    {slide.subtitle && (
                                        <p className="text-lg md:text-xl font-medium text-white/90 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                                            {slide.subtitle}
                                        </p>
                                    )}
                                    {slide.title && (
                                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                                            {slide.title}
                                        </h2>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-black/20 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={scrollPrev}
            >
                <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-black/20 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={scrollNext}
            >
                <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_: any, index: number) => (
                    <button
                        key={index}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${index === selectedIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
                            }`}
                        onClick={() => emblaApi && emblaApi.scrollTo(index)}
                    />
                ))}
            </div>
        </div>
    )
}
