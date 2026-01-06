import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RunningText } from "@/components/alerts/running-text";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findFirst()
  return {
    title: settings?.name || "KampusCMS",
    description: settings?.description || "Campus Management System",
  }
}

import { prisma } from "@/lib/prisma"
import { PublicLayoutWrapper } from "@/components/layout/public-layout-wrapper"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await prisma.siteSettings.findFirst()
  const colors = (settings?.colors as any) || { primary: '#0f172a', secondary: '#3b82f6' }

  return (
    <html lang="en">
      <head>
        {settings?.headCode && (
          <div dangerouslySetInnerHTML={{ __html: settings.headCode }} />
        )}
        <style>{`
            :root {
              --primary: ${colors.primary};
              --secondary: ${colors.secondary};
            }
          `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <PublicLayoutWrapper settings={settings}>
          {children}
        </PublicLayoutWrapper>

        {settings?.bodyCode && (
          <div dangerouslySetInnerHTML={{ __html: settings.bodyCode }} />
        )}
      </body>
    </html>
  );
}
