import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")
    const isOnLogin = req.nextUrl.pathname.startsWith("/login")

    // Block scrapers
    const userAgent = req.headers.get("user-agent") || ""
    const lowerUA = userAgent.toLowerCase()

    // List of blocked user agents (partial matches)
    const blockedAgents = [
        "puppeteer",
        "cheerio",
        "headlesschrome",
        "selenium",
        "playwright",
        "postman", // Optional: block API testers in production if needed
        // "curl",    // Optional: block curl requests
        "wget"
    ]

    if (blockedAgents.some(agent => lowerUA.includes(agent))) {
        return new Response("Forbidden: Automated access denied.", { status: 403 })
    }

    if (isOnAdmin && !isLoggedIn) {
        return Response.redirect(new URL("/login", req.nextUrl))
    }

    if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL("/admin", req.nextUrl))
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
