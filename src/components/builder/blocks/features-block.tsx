import { BlockData } from "@/types/builder"
import { cn } from "@/lib/utils"
// import { Check, Star, Trophy, Users } from "lucide-react" 
// We can make icons dynamic later, for now simple cards.

export function FeaturesBlock({ data }: { data: BlockData }) {
    const { title, subtitle, items } = data.content || {}

    // Default features if none provided (for preview)
    const featuresList = items || [
        { title: "Academic Excellence", description: "Our curriculum is designed to challenge and inspire." },
        { title: "Global Community", description: "Students from over 50 countries study here." },
        { title: "Modern Facilities", description: "State-of-the-art labs and classrooms." }
    ]

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">{title || "Why Choose Us"}</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle || "We offer world-class education with a focus on practical skills."}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuresList.map((item: any, i: number) => (
                        <div key={i} className="p-6 border rounded-xl hover:shadow-lg transition-shadow bg-slate-50">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600 font-bold">
                                {i + 1}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-slate-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
