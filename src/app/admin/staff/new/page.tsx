import { StaffForm } from "@/components/staff/staff-form"

export default function NewStaffPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Add New Staff</h1>
            <StaffForm />
        </div>
    )
}
