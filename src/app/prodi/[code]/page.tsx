
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, GraduationCap, User } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params
    const prodi = await prisma.programStudi.findUnique({ where: { code } })
    if (!prodi) return { title: "Program Not Found" }
    return {
        title: `${prodi.name} (${prodi.degree})`,
        description: `Learn about the ${prodi.name} program.`
    }
}

export default async function ProdiDetailPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params
    const prodi = await prisma.programStudi.findUnique({
        where: { code },
        include: {
            headOfProdi: true
        }
    })

    if (!prodi) notFound()

    const curriculum = Array.isArray(prodi.curriculum) ? prodi.curriculum : []

    // Calculate total SKS
    const totalSKS = curriculum.reduce((acc: number, sem: any) => {
        return acc + (sem.courses?.reduce((sAcc: number, c: any) => sAcc + (Number(c.credits) || 0), 0) || 0)
    }, 0)

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="bg-primary text-primary-foreground py-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex gap-3 mb-4">
                                <Badge variant="secondary" className="text-lg px-4 py-1">{prodi.degree}</Badge>
                                <Badge variant="outline" className="text-lg px-4 py-1 text-white border-white/30">{prodi.code}</Badge>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{prodi.name}</h1>
                            {prodi.accreditation && (
                                <p className="text-xl opacity-90">Accreditation: {prodi.accreditation}</p>
                            )}
                        </div>
                        {prodi.headOfProdi && (
                            <div className="bg-white/10 backdrop-blur p-4 rounded-xl flex items-center gap-4 border border-white/20">
                                <div className="h-16 w-16 rounded-full bg-slate-200 overflow-hidden relative">
                                    {prodi.headOfProdi.image ? (
                                        <Image src={prodi.headOfProdi.image} alt={prodi.headOfProdi.name} fill className="object-cover" />
                                    ) : (
                                        <User className="h-full w-full p-3 text-slate-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider opacity-70">Kaprodi</p>
                                    <p className="font-semibold">{prodi.headOfProdi.name}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl py-12 px-4 -mt-10">
                <Tabs defaultValue="overview" className="space-y-8">
                    <TabsList className="bg-white shadow-sm p-1 h-auto rounded-xl border">
                        <TabsTrigger value="overview" className="py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
                        <TabsTrigger value="curriculum" className="py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Curriculum</TabsTrigger>
                        <TabsTrigger value="lecturers" className="py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Lecturers</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {prodi.vision && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        Vision
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: prodi.vision }} />
                                </CardContent>
                            </Card>
                        )}

                        {prodi.mission && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5 text-blue-500" />
                                        Mission
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: prodi.mission }} />
                                </CardContent>
                            </Card>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <Card className="text-center py-6">
                                <p className="text-sm text-muted-foreground uppercase">Degree</p>
                                <p className="text-3xl font-bold text-primary">{prodi.degree}</p>
                            </Card>
                            <Card className="text-center py-6">
                                <p className="text-sm text-muted-foreground uppercase">Total SKS</p>
                                <p className="text-3xl font-bold text-primary">{totalSKS}</p>
                            </Card>
                            <Card className="text-center py-6">
                                <p className="text-sm text-muted-foreground uppercase">Semesters</p>
                                <p className="text-3xl font-bold text-primary">{curriculum.length}</p>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="curriculum" className="space-y-6">
                        {curriculum.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">No curriculum data available.</div>
                        ) : (
                            <div className="grid gap-6">
                                {curriculum.map((sem: any, i: number) => (
                                    <Card key={i}>
                                        <CardHeader className="bg-slate-50/50 border-b pb-4">
                                            <CardTitle className="text-lg">Semester {sem.semester}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-muted-foreground uppercase bg-slate-50">
                                                    <tr>
                                                        <th className="px-6 py-3 font-medium">Code</th>
                                                        <th className="px-6 py-3 font-medium">Course Name</th>
                                                        <th className="px-6 py-3 font-medium text-right">SKS</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {sem.courses?.map((c: any, j: number) => (
                                                        <tr key={j} className="hover:bg-slate-50/50">
                                                            <td className="px-6 py-4 font-mono text-xs">{c.code}</td>
                                                            <td className="px-6 py-4 font-medium">{c.name}</td>
                                                            <td className="px-6 py-4 text-right">{c.credits}</td>
                                                        </tr>
                                                    ))}
                                                    {(!sem.courses || sem.courses.length === 0) && (
                                                        <tr>
                                                            <td colSpan={3} className="px-6 py-4 text-center text-muted-foreground italic">
                                                                No courses listed
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="lecturers">
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                Feature coming soon: Filter lecturers by this study program.
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
