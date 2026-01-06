"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface TracerExportButtonProps {
    data: any[]
}

export function TracerExportButton({ data }: TracerExportButtonProps) {
    const handleExport = () => {
        if (!data || data.length === 0) {
            alert("No data to export")
            return
        }

        // Define headers
        const headers = [
            "NIM", "Nama", "Prodi", "Tahun Lulus", "HP", "Email",
            "Status", "Bidang Kerja", "Perusahaan", "Instansi",
            "Jabatan", "Waktu Tunggu (Bln)", "Gaji", "Kesesuaian", "Feedback", "Submitted At"
        ]

        // Map data to CSV rows
        const rows = data.map(item => [
            item.nim,
            `"${item.nama}"`, // Quote strings that might contain commas
            item.kodeProdi,
            item.tahunLulus,
            `'${item.nomorHP || ""}`, // Force string for phone numbers in Excel
            item.email || "",
            item.status,
            item.bidangKerja || "",
            `"${item.namaPerusahaan || ""}"`,
            item.jenisInstansi || "",
            `"${item.jabatan || ""}"`,
            item.waktuTunggu ?? "",
            item.gaji || "",
            item.kesesuaianBidang || "",
            `"${(item.feedback || "").replace(/"/g, '""')}"`, // Escape quotes in feedback
            new Date(item.createdAt).toISOString()
        ])

        // Combine headers and rows
        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n")

        // Create blob and download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `tracer_export_${new Date().toISOString().slice(0, 10)}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
        </Button>
    )
}
