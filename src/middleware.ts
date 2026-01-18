
import { NextResponse, NextRequest } from "next/server"

export default function middleware(req: NextRequest) {
    const url = req.nextUrl
    let hostname = req.headers.get("host") || ""

    // Remove port if present
    hostname = hostname.split(':')[0]

    const searchParams = req.nextUrl.searchParams.toString()
    // Pathname excluding search params
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`

    console.log(`[Middleware] ${req.method} ${url.pathname} (Host: ${hostname})`)

    // List of blocked user agents (partial matches)
    const blockedAgents = [
        "puppeteer", "cheerio", "headlesschrome", "selenium", "playwright", "postman", "wget"
    ]
    const userAgent = req.headers.get("user-agent")?.toLowerCase() || ""
    if (blockedAgents.some(agent => userAgent.includes(agent))) {
        return new NextResponse("Forbidden: Automated access denied.", { status: 403 })
    }

    // Block common bot paths
    const blockedPaths = [
        "/wp-login.php",
        "/xmlrpc.php",
        "/.env",
        "/etc/passwd",
        ".cgi",
        "/cgi-bin",
        "/wls-wsat"
    ]
    if (blockedPaths.some(path => url.pathname.includes(path))) {
        return new NextResponse("Forbidden", { status: 403 })
    }

    // Skip:
    if (
        url.pathname.startsWith("/api") ||
        url.pathname.startsWith("/admin") ||
        url.pathname.startsWith("/login") ||
        url.pathname.startsWith("/setup") ||
        url.pathname.startsWith("/_next") ||
        url.pathname.includes(".") // static files
    ) {
        console.log(`[Middleware] Skipping rewrite for: ${url.pathname}`)
        return NextResponse.next()
    }

    // Rewrite logic
    return NextResponse.rewrite(new URL(`/sites/${hostname}${path}`, req.url))
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
