
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { GraduationCap, ArrowRight } from "lucide-react"

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Program Studi - Academic Framework",
    description: "Explore our academic study programs."
}

export default async function ProdiListPage() {
    const prodiList = await prisma.programStudi.findMany({
        orderBy: { name: 'asc' },
        include: { headOfProdi: { select: { name: true, image: true } } }
    })

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Academic Programs</h1>
                <p className="text-muted-foreground text-lg">
                    Discover our diverse range of accredited study programs designed to prepare you for the future.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prodiList.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        No programs found.
                    </div>
                ) : (
                    prodiList.map((prodi: any) => (
                        <Card key={prodi.id} className="hover:shadow-md transition-shadow group">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className="font-mono">{prodi.code}</Badge>
                                    <Badge>{prodi.degree}</Badge>
                                </div>
                                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                                    <Link href={`/prodi/${prodi.code}`}>
                                        {prodi.name}
                                    </Link>
                                </CardTitle>
                                {prodi.accreditation && (
                                    <CardDescription>
                                        Accreditation: <span className="font-medium text-foreground">{prodi.accreditation}</span>
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                {prodi.headOfProdi && (
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 overflow-hidden relative">
                                            {prodi.headOfProdi.image ? (
                                                <img src={prodi.headOfProdi.image} alt={prodi.headOfProdi.name} className="object-cover h-full w-full" />
                                            ) : (
                                                <GraduationCap className="p-1.5 h-full w-full text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs">Head of Program</p>
                                            <p className="font-medium text-foreground">{prodi.headOfProdi.name}</p>
                                        </div>
                                    </div>
                                )}

                                <Button asChild variant="secondary" className="w-full">
                                    <Link href={`/prodi/${prodi.code}`}>
                                        View Curriculum <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

import { Button } from "@/components/ui/button"
