"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface ProdiFormProps {
    initialData?: any
    lecturers: { id: string, name: string }[]
}

export function ProdiForm({ initialData, lecturers }: ProdiFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Basic Fields
    const [code, setCode] = useState(initialData?.code || "")
    const [name, setName] = useState(initialData?.name || "")
    const [degree, setDegree] = useState(initialData?.degree || "S1")
    const [accreditation, setAccreditation] = useState(initialData?.accreditation || "")
    const [headOfProdiId, setHeadOfProdiId] = useState(initialData?.headOfProdiId || "")

    // Rich Text
    const [vision, setVision] = useState(initialData?.vision || "")
    const [mission, setMission] = useState(initialData?.mission || "")

    // Curriculum: Array of Semesters
    const [curriculum, setCurriculum] = useState<any[]>(
        Array.isArray(initialData?.curriculum) ? initialData.curriculum : []
    )

    const handleAddSemester = () => {
        setCurriculum([...curriculum, { semester: curriculum.length + 1, courses: [] }])
    }

    const handleAddCourse = (semIndex: number) => {
        const newCurr = [...curriculum]
        newCurr[semIndex].courses.push({ code: "", name: "", credits: 3 })
        setCurriculum(newCurr)
    }

    const handleCourseChange = (semIndex: number, courseIndex: number, field: string, value: any) => {
        const newCurr = [...curriculum]
        newCurr[semIndex].courses[courseIndex][field] = value
        setCurriculum(newCurr)
    }

    const handleRemoveCourse = (semIndex: number, courseIndex: number) => {
        const newCurr = [...curriculum]
        newCurr[semIndex].courses.splice(courseIndex, 1)
        setCurriculum(newCurr)
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const body = {
                id: initialData?.id,
                code, name, degree, accreditation,
                headOfProdiId: headOfProdiId === "none" ? null : (headOfProdiId || null),
                vision, mission,
                curriculum
            }

            const method = initialData ? "PUT" : "POST"

            const res = await fetch("/api/prodi", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            if (!res.ok) throw new Error("Failed to save")

            router.push("/admin/prodi")
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8 max-w-4xl">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Program Code (Kode Prodi)</Label>
                    <Input value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. TI-S1" required />
                </div>
                <div className="space-y-2">
                    <Label>Degree (Jenjang)</Label>
                    <Select value={degree} onValueChange={setDegree}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Degree" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="D3">D3 (Diploma 3)</SelectItem>
                            <SelectItem value="D4">D4 (Diploma 4)</SelectItem>
                            <SelectItem value="S1">S1 (Sarjana)</SelectItem>
                            <SelectItem value="S2">S2 (Magister)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2 col-span-2">
                    <Label>Program Name (Nama Prodi)</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Teknik Informatika" required />
                </div>
                <div className="space-y-2">
                    <Label>Accreditation</Label>
                    <Select value={accreditation} onValueChange={setAccreditation}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Unggul">Unggul</SelectItem>
                            <SelectItem value="Baik Sekali">Baik Sekali</SelectItem>
                            <SelectItem value="Baik">Baik</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                            <SelectItem value="-">Belum Terakreditasi</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Head of Program (Kaprodi)</Label>
                    <Select value={headOfProdiId} onValueChange={setHeadOfProdiId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Lecturer" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {lecturers.map(l => (
                                <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-4">
                <Label>Vision (Visi)</Label>
                <RichTextEditor value={vision} onChange={setVision} />
            </div>

            <div className="space-y-4">
                <Label>Mission (Misi)</Label>
                <RichTextEditor value={mission} onChange={setMission} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-lg">Curriculum</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddSemester}>
                        <Plus className="mr-2 h-4 w-4" /> Add Semester
                    </Button>
                </div>

                {curriculum.map((sem, sIdx) => (
                    <Card key={sIdx}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Semester {sem.semester}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {sem.courses.map((course: any, cIdx: number) => (
                                <div key={cIdx} className="flex gap-2 items-center">
                                    <Input
                                        placeholder="Code"
                                        className="w-24"
                                        value={course.code}
                                        onChange={e => handleCourseChange(sIdx, cIdx, 'code', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Course Name"
                                        className="flex-1"
                                        value={course.name}
                                        onChange={e => handleCourseChange(sIdx, cIdx, 'name', e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="SKS"
                                        className="w-20"
                                        value={course.credits}
                                        onChange={e => handleCourseChange(sIdx, cIdx, 'credits', parseInt(e.target.value))}
                                    />
                                    <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => handleRemoveCourse(sIdx, cIdx)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="secondary" size="sm" className="w-full" onClick={() => handleAddCourse(sIdx)}>
                                + Add Course
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-between pt-4 border-t">
                {initialData?.id && (
                    <Button type="button" variant="destructive" onClick={async () => {
                        if (!confirm("Delete this Prodi?")) return
                        await fetch(`/api/prodi?id=${initialData.id}`, { method: 'DELETE' })
                        router.push("/admin/prodi")
                        router.refresh()
                    }}>
                        Delete Prodi
                    </Button>
                )}
                <Button type="submit" disabled={loading} className="ml-auto">
                    {loading ? "Saving..." : "Save Program Studi"}
                </Button>
            </div>
        </form>
    )
}
