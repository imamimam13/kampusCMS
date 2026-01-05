"use client"

import { useState } from "react"
import Papa from "papaparse"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, AlertCircle, CheckCircle } from "lucide-react"

export function CsvImporter() {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                setData(results.data)
                setResult(null)
            },
            error: (error: any) => {
                console.error(error)
                alert("Error parsing CSV")
            }
        })
    }

    const handleImport = async () => {
        if (data.length === 0) return
        setLoading(true)
        try {
            // Map keys to expected format just in case
            // Assuming CSV headers: Name, Email, NIDN, Bio
            const formattedData = data.map((row: any) => ({
                name: row.Name || row.name,
                email: row.Email || row.email,
                nidn: row.NIDN || row.nidn || row.Nidn,
                bio: row.Bio || row.bio
            }))

            const res = await fetch('/api/admin/import-lecturers', {
                method: 'POST',
                body: JSON.stringify({ lecturers: formattedData })
            })

            if (res.ok) {
                const json = await res.json()
                setResult(json)
                if (json.success > 0) setData([]) // Clear on success
            } else {
                alert("Import failed")
            }
        } catch (e) {
            console.error(e)
            alert("Error importing")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 border rounded-lg p-6 bg-card">
            <div className="flex flex-col gap-4">
                <h3 className="font-semibold text-lg">Bulk Import Lecturers</h3>
                <p className="text-sm text-muted-foreground">
                    Upload a CSV file with headers: <code>Name, Email, NIDN</code>.
                    Default password for new accounts will be <code>dosen123</code>.
                </p>

                <div className="flex items-center gap-4">
                    <Input
                        type="file"
                        accept=".csv"
                        className="max-w-xs"
                        onChange={handleFileChange}
                    />
                    {data.length > 0 && (
                        <span className="text-sm font-medium text-green-600">
                            {data.length} records found
                        </span>
                    )}
                </div>

                {data.length > 0 && (
                    <div className="max-h-40 overflow-y-auto border rounded bg-muted/20 p-2 text-xs font-mono">
                        <pre>{JSON.stringify(data.slice(0, 3), null, 2)}</pre>
                        {data.length > 3 && <p className="mt-2 text-muted-foreground">...and {data.length - 3} more</p>}
                    </div>
                )}

                <Button
                    onClick={handleImport}
                    disabled={data.length === 0 || loading}
                    className="w-full sm:w-auto"
                >
                    {loading ? "Importing..." : `Import ${data.length} Lecturers`}
                </Button>

                {result && (
                    <div className={`p-4 rounded-md flex items-start gap-3 ${result.failed > 0 ? "bg-yellow-50 text-yellow-800" : "bg-green-50 text-green-800"}`}>
                        {result.failed > 0 ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                        <div>
                            <p className="font-bold">Import Complete</p>
                            <p>Success: {result.success}</p>
                            <p>Failed: {result.failed}</p>
                            {result.errors?.length > 0 && (
                                <ul className="mt-2 text-xs list-disc pl-4 space-y-1">
                                    {result.errors.map((e: string, i: number) => <li key={i}>{e}</li>)}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
