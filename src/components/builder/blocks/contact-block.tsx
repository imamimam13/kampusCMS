import { BlockData } from "@/types/builder"
import { Mail, MapPin, Phone } from "lucide-react"

export function ContactBlock({ data }: { data: BlockData }) {
    const { title, address, phone, email, mapUrl } = data.content

    return (
        <div className="py-12 bg-slate-50 rounded-lg">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        {title && <h2 className="text-3xl font-bold">{title}</h2>}

                        <div className="space-y-4">
                            {address && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-purple-600 mt-1 shrink-0" />
                                    <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: address }} />
                                </div>
                            )}

                            {phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-purple-600 shrink-0" />
                                    <span className="text-gray-700">{phone}</span>
                                </div>
                            )}

                            {email && (
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-purple-600 shrink-0" />
                                    <a href={`mailto:${email}`} className="text-purple-600 hover:underline">{email}</a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Map */}
                    <div className="bg-white p-2 rounded-lg shadow-sm border h-[300px] md:h-[400px]">
                        {mapUrl ? (
                            <iframe
                                src={mapUrl}
                                className="w-full h-full rounded"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">
                                No Map URL provided
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
