"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, CheckCircle2 } from "lucide-react"

export default function TracerPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [prodis, setProdis] = useState<{ code: string, name: string }[]>([])

    useEffect(() => {
        fetch('/api/prodi')
            .then(res => res.json())
            .then(data => setProdis(data))
            .catch(err => console.error("Failed to fetch prodis", err))
    }, [])

    const [formData, setFormData] = useState({
        nim: "",
        nama: "",
        kodeProdi: "",
        tahunLulus: "",
        nomorHP: "",
        email: "",
        status: "",
        bidangKerja: "",
        namaPerusahaan: "",
        jenisInstansi: "",
        jabatan: "",
        waktuTunggu: "",
        gaji: "",
        kesesuaianBidang: "",
        feedback: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value })
    }

    const nextStep = () => setStep(step + 1)
    const prevStep = () => setStep(step - 1)

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/tracer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (!res.ok) throw new Error("Failed to submit")

            setSubmitted(true)
            toast.success("Terima kasih! Data tracer study berhasil disimpan.")
        } catch (error) {
            toast.error("Gagal menyimpan data. Silakan coba lagi.")
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="container max-w-lg py-20 text-center mx-auto">
                <div className="flex justify-center mb-6">
                    <CheckCircle2 className="h-20 w-20 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Terima Kasih!</h1>
                <p className="text-muted-foreground mb-8">
                    Data Anda telah kami terima. Kontribusi Anda sangat berharga bagi pengembangan kampus kami.
                </p>
                <Button onClick={() => router.push('/')} variant="outline">Kembali ke Beranda</Button>
            </div>
        )
    }

    return (
        <div className="container max-w-2xl py-12 mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold">Tracer Study Alumni</h1>
                <p className="text-muted-foreground mt-2">
                    Mohon kesediaan Anda mengisi kuesioner ini untuk pendataan alumni dan evaluasi kurikulum.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Langkah {step} dari 3</CardTitle>
                    <CardDescription>
                        {step === 1 && "Identitas Diri & Akademik"}
                        {step === 2 && "Status & Pekerjaan"}
                        {step === 3 && "Feedback & Saran"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {step === 1 && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>NIM *</Label>
                                    <Input name="nim" value={formData.nim} onChange={handleChange} placeholder="Contoh: 201801001" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tahun Lulus *</Label>
                                    <Input name="tahunLulus" type="number" value={formData.tahunLulus} onChange={handleChange} placeholder="2023" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Nama Lengkap *</Label>
                                <Input name="nama" value={formData.nama} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Program Studi *</Label>
                                <Select onValueChange={(v) => handleSelectChange("kodeProdi", v)} value={formData.kodeProdi}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Prodi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {prodis.length === 0 ? (
                                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                                        ) : (
                                            prodis.map((p) => (
                                                <SelectItem key={p.code} value={p.code}>{p.name}</SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input name="email" type="email" value={formData.email} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nomor HP / WA</Label>
                                    <Input name="nomorHP" value={formData.nomorHP} onChange={handleChange} />
                                </div>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="space-y-2">
                                <Label>Status Saat Ini (f8) *</Label>
                                <Select onValueChange={(v) => handleSelectChange("status", v)} value={formData.status}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Kerja">Bekerja (Full Time / Part Time)</SelectItem>
                                        <SelectItem value="Wirausaha">Wirausaha</SelectItem>
                                        <SelectItem value="Studi">Melanjutkan Pendidikan</SelectItem>
                                        <SelectItem value="Mencari">Sedang Mencari Kerja</SelectItem>
                                        <SelectItem value="Tidak">Belum Memungkinkan Bekerja</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {(formData.status === "Kerja" || formData.status === "Wirausaha") && (
                                <div className="space-y-4 pt-4 border-t">
                                    <div className="space-y-2">
                                        <Label>Nama Perusahaan / Usaha</Label>
                                        <Input name="namaPerusahaan" value={formData.namaPerusahaan} onChange={handleChange} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Jenis Instansi (f1101)</Label>
                                            <Select onValueChange={(v) => handleSelectChange("bidangKerja", v)} value={formData.bidangKerja}>
                                                <SelectTrigger><SelectValue placeholder="Pilih Jenis" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Swasta">Perusahaan Swasta</SelectItem>
                                                    <SelectItem value="Pemerintah">Instansi Pemerintah</SelectItem>
                                                    <SelectItem value="BUMN">BUMN / BUMD</SelectItem>
                                                    <SelectItem value="Sendiri">Wiraswasta / Sendiri</SelectItem>
                                                    <SelectItem value="NGO">Organisasi Non-Profit / NGO</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Jabatan / Posisi</Label>
                                            <Input name="jabatan" value={formData.jabatan} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Waktu Tunggu (Bulan) (f502)</Label>
                                            <Input name="waktuTunggu" type="number" placeholder="0" value={formData.waktuTunggu} onChange={handleChange} />
                                            <p className="text-[10px] text-muted-foreground">Berapa bulan mendapatkan pekerjaan pertama?</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Pendapatan Bulanan (f505)</Label>
                                            <Select onValueChange={(v) => handleSelectChange("gaji", v)} value={formData.gaji}>
                                                <SelectTrigger><SelectValue placeholder="Range Gaji" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="< 3 Juta">&lt; 3 Juta</SelectItem>
                                                    <SelectItem value="3 - 5 Juta">3 - 5 Juta</SelectItem>
                                                    <SelectItem value="5 - 10 Juta">5 - 10 Juta</SelectItem>
                                                    <SelectItem value="> 10 Juta">&gt; 10 Juta</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Kesesuaian dengan Prodi</Label>
                                        <Select onValueChange={(v) => handleSelectChange("kesesuaianBidang", v)} value={formData.kesesuaianBidang}>
                                            <SelectTrigger><SelectValue placeholder="Seberapa Sesuai?" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Sangat Sesuai">Sangat Sesuai</SelectItem>
                                                <SelectItem value="Sesuai">Sesuai</SelectItem>
                                                <SelectItem value="Kurang">Kurang Sesuai</SelectItem>
                                                <SelectItem value="Tidak">Tidak Sesuai</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Saran & Masukan untuk Kampus</Label>
                                <Textarea
                                    name="feedback"
                                    value={formData.feedback}
                                    onChange={handleChange}
                                    placeholder="Tuliskan saran Anda mengenai kurikulum, fasilitas, atau pelayanan..."
                                    className="min-h-[150px]"
                                />
                            </div>
                            <div className="bg-yellow-50 p-4 rounded text-sm text-yellow-800 border border-yellow-100">
                                <p>Pastikan data yang Anda isi sudah benar sebelum mengirim.</p>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    {step > 1 ? (
                        <Button variant="outline" onClick={prevStep}>Kembali</Button>
                    ) : <div></div>}

                    {step < 3 ? (
                        <Button onClick={nextStep} disabled={step === 1 && (!formData.nim || !formData.nama)}>Selanjutnya</Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Kirim Data Tracer
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
