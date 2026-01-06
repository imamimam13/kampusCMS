import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

import { TracerExportButton } from "@/components/admin/tracer-export-button"
import { TracerDeleteButton } from "@/components/admin/tracer-delete-button"

export const dynamic = 'force-dynamic'

export default async function TracerAdmin() {
    const responses = await prisma.tracerResponse.findMany({
        orderBy: { createdAt: 'desc' }
    })

    const total = responses.length
    const employed = responses.filter((r: any) => r.status === 'Kerja').length
    const entrepreneur = responses.filter((r: any) => r.status === 'Wirausaha').length
    const studying = responses.filter((r: any) => r.status === 'Studi').length
    const seeking = responses.filter((r: any) => r.status === 'Mencari').length

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Tracer Study Report</h1>
                <TracerExportButton data={responses} />
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Respondents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Employed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{employed}</div>
                        <p className="text-xs text-muted-foreground">{((employed / (total || 1)) * 100).toFixed(1)}%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Seeking Job</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{seeking}</div>
                        <p className="text-xs text-muted-foreground">{((seeking / (total || 1)) * 100).toFixed(1)}%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Entrepreneur</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{entrepreneur}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Responses</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px] w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Prodi</TableHead>
                                    <TableHead>Year</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Company / Inst</TableHead>
                                    <TableHead>Salary</TableHead>
                                    <TableHead>Waited (Mo)</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {responses.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center h-24 text-muted-foreground">
                                            No responses yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    responses.map((r: any) => (
                                        <TableRow key={r.id}>
                                            <TableCell className="font-mono text-xs">{r.nim}</TableCell>
                                            <TableCell className="font-medium">{r.nama}</TableCell>
                                            <TableCell>{r.kodeProdi}</TableCell>
                                            <TableCell>{r.tahunLulus}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        r.status === 'Kerja' ? 'default' :
                                                            r.status === 'Mencari' ? 'destructive' :
                                                                r.status === 'Wirausaha' ? 'secondary' : 'outline'
                                                    }
                                                >
                                                    {r.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{r.namaPerusahaan || '-'}</TableCell>
                                            <TableCell className="text-xs">{r.gaji || '-'}</TableCell>
                                            <TableCell className="text-center">{r.waktuTunggu ?? '-'}</TableCell>
                                            <TableCell>
                                                <TracerDeleteButton id={r.id} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
