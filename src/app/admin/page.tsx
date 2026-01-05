export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8 mt-4 h-96">
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                        Welcome to KampusCMS
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Get started by creating a new page or post.
                    </p>
                </div>
            </div>
        </div>
    )
}
