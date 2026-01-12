
import { getSiteData } from "@/lib/sites"
import { PublicLayoutWrapper } from "@/components/layout/public-layout-wrapper"
import { notFound } from "next/navigation"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: { site: string } }): Promise<Metadata> {
    const { site: domain } = await params
    const siteData = await getSiteData(domain)

    if (!siteData) {
        return {
            title: "Site Not Found",
        }
    }

    return {
        title: siteData.name,
        description: siteData.description,
        icons: siteData.logo ? { icon: siteData.logo } : undefined,
    }
}

export default async function SiteLayout({
    params,
    children,
}: {
    params: { site: string }
    children: React.ReactNode
}) {
    const { site: domain } = await params
    const siteData = await getSiteData(domain)

    if (!siteData) {
        return notFound()
    }

    const colors = (siteData.colors as any) || { primary: '#0f172a', secondary: '#3b82f6' }

    return (
        <>
            {siteData?.headCode && (
                <div dangerouslySetInnerHTML={{ __html: siteData.headCode }} />
            )}
            <style>{`
                :root {
                  --primary: ${colors.primary};
                  --secondary: ${colors.secondary};
                }
            `}</style>
            <PublicLayoutWrapper settings={siteData}>
                {children}
            </PublicLayoutWrapper>

            {siteData?.bodyCode && (
                <div dangerouslySetInnerHTML={{ __html: siteData.bodyCode }} />
            )}
        </>
    )
}
