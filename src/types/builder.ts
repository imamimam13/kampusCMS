export type BlockType = 'hero' | 'features' | 'news-grid' | 'staff-grid' | 'text' | 'image' | 'video' | 'calendar' | 'download' | 'gallery' | 'carousel' | 'separator' | 'cards' | 'contact' | 'columns' | 'about' | 'prodi-grid' | 'tracer-stats' | 'rss' | 'social'

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
    "prodi-grid": {
        title: "Our Academic Programs",
        description: "Explore our wide range of study programs.",
        count: 6
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
    },
    carousel: {
        slides: [
            { title: "Slide 1", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f", subtitle: "Welcome" },
            { title: "Slide 2", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1", subtitle: "Campus Life" }
        ],
        autoplay: true
    },
    separator: {
        height: 20, // px
        color: 'transparent',
        showLine: false
    },
    cards: {
        title: "Our Programs",
        columns: 3, // 2, 3, or 4
        items: [
            { title: "Card 1", description: "Description here", image: "", link: "#" },
            { title: "Card 2", description: "Description here", image: "", link: "#" },
            { title: "Card 3", description: "Description here", image: "", link: "#" }
        ]
    },
    contact: {
        title: "Contact Us",
        address: "<p>123 Campus Dr, City, State</p>",
        phone: "+1 234 567 890",
        email: "info@campus.edu",
        mapUrl: "https://www.google.com/maps/embed?pb=..." // Placeholder
    },
    columns: {
        count: 2, // 2 or 3
        columns: [
            { html: "<p>Column 1 content...</p>" },
            { html: "<p>Column 2 content...</p>" },
            { html: "<p>Column 3 content...</p>" }
        ]
    },
    about: {
        title: "About Our University",
        description: "<p>We are a leading institution seeking to improve the world through education.</p>",
        image: "https://images.unsplash.com/photo-1562774053-701939374585",
        ctaText: "Read More",
        ctaLink: "/about",
        stats: [
            { label: "Students", value: "5000+" },
            { label: "Faculty", value: "300+" },
            { label: "Years", value: "50" }
        ]
    },
    'tracer-stats': {
        title: "Alumni Success",
        description: "See how our graduates are performing in the professional world."
    },
    rss: {
        title: "Latest Updates",
        count: 6,
        layout: "grid",
        keyword: "Pendidikan Tinggi Indonesia" // Default keyword for instant gratification
    },
    social: {
        title: "Follow Us",
        mode: "url",
        platform: "instagram",
        url: "https://www.instagram.com/p/C-uX___v_7z/" // Placeholder post
    }
}
