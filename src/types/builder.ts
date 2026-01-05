export type BlockType = 'hero' | 'features' | 'news-grid' | 'staff-grid' | 'text' | 'image' | 'video' | 'calendar' | 'download' | 'gallery'

export interface BlockData {
    id: string
    type: BlockType
    content: any // Flexible JSON content depending on type
}

export interface PageLayout {
    blocks: BlockData[]
}

// Default content for new blocks
export const defaultBlockContent: Record<BlockType, any> = {
    hero: {
        title: "Welcome to Our Campus",
        subtitle: "Excellence in Education",
        backgroundImage: "/placeholder.jpg",
        ctaText: "Learn More",
        ctaLink: "#"
    },
    features: {
        title: "Why Choose Us?",
        items: [
            { title: "Expert Faculty", description: "Learn from the best." },
            { title: "Modern Facilities", description: "State of the art labs." },
            { title: "Global Network", description: "Connect with the world." }
        ]
    },
    "news-grid": {
        title: "Latest News",
        count: 3
    },
    "staff-grid": {
        title: "Meet Our Team",
        count: 4 // Number of staff to show (or 'all')
    },
    text: {
        html: "<p>Write your content here...</p>"
    },
    image: {
        url: "/placeholder.jpg",
        alt: "Placeholder"
    },
    video: {
        url: "https://www.youtube.com/watch?v=placeholder"
    },
    calendar: {
        title: "Upcoming Events"
    },
    download: {
        title: "Downloads"
    },
    gallery: {
        title: "Campus Gallery",
        subtitle: "Latest photos",
        count: 3
    }
}
