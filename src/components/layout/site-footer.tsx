export function SiteFooter({ settings }: { settings: any }) {
    const { footerText, name } = settings || {}

    return (
        <footer className="border-t bg-slate-50 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">{name || "KampusCMS"}</h3>
                        <p className="text-sm text-slate-500 max-w-xs">
                            A modern content management system tailored for educational institutions.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><a href="/news" className="hover:underline">News & Events</a></li>
                            <li><a href="/gallery" className="hover:underline">Gallery</a></li>
                            <li><a href="/staff" className="hover:underline">Staff Directory</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><a href="/download" className="hover:underline">Download Center</a></li>
                            <li><a href="/academic" className="hover:underline">Academic Calendar</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Contact</h4>
                        <p className="text-sm text-slate-600">
                            Jl. Kampus Merdeka No. 123<br />
                            Jakarta, Indonesia<br />
                            info@kampus.ac.id
                        </p>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t text-center text-sm text-slate-500">
                    {footerText || `© ${new Date().getFullYear()} ${name || 'KampusCMS'}. All rights reserved.`}
                </div>
            </div>
        </footer>
    )
}
