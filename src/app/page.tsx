
export default function FallbackHome() {
    return (
        <div className="flex h-screen items-center justify-center bg-red-50 text-red-900">
            <div className="text-center">
                <h1 className="text-4xl font-bold">Middleware Bypass Detected</h1>
                <p className="mt-4 text-lg">
                    If you see this page, the request to <code>/</code> was NOT rewritten to <code>/_sites/...</code>.
                </p>
                <p className="mt-2 text-sm text-red-700">
                    This means standard routing is active and middleware failed or matched nothing.
                </p>
            </div>
        </div>
    )
}
