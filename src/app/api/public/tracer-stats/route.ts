import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const responses = await prisma.tracerResponse.findMany()
        const total = responses.length

        if (total === 0) {
            return NextResponse.json({
                total: 0,
                employedRate: 0,
                fastHiredRate: 0,
                relevantJobRate: 0
            })
        }

        // Employment Rate (Kerja + Wirausaha / Total)
        const workingCount = responses.filter((r: any) => ['Kerja', 'Wirausaha'].includes(r.status)).length
        const employedRate = Math.round((workingCount / total) * 100)

        // Fast Hired (< 6 months) - Denominator is only those who are working
        const fastHiredCount = responses.filter((r: any) =>
            ['Kerja', 'Wirausaha'].includes(r.status) &&
            r.waktuTunggu !== null &&
            r.waktuTunggu <= 6
        ).length
        const fastHiredRate = workingCount > 0 ? Math.round((fastHiredCount / workingCount) * 100) : 0

        // Relevant Job (Sangat Sesuai + Sesuai) - Denominator is only those who are working
        const relevantCount = responses.filter((r: any) =>
            ['Kerja', 'Wirausaha'].includes(r.status) &&
            ['Sangat Sesuai', 'Sesuai'].includes(r.kesesuaianBidang || '')
        ).length
        const relevantJobRate = workingCount > 0 ? Math.round((relevantCount / workingCount) * 100) : 0

        return NextResponse.json({
            total,
            employedRate,
            fastHiredRate,
            relevantJobRate
        })
    } catch (error) {
        return new NextResponse("Internal server error", { status: 500 })
    }
}
