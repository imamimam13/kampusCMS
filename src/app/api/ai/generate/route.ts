import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json()
        const settings = await prisma.siteSettings.findFirst()
        const config = (settings?.aiConfig as any) || {}

        if (!config.provider) {
            return NextResponse.json({ error: "AI Configuration missing" }, { status: 400 })
        }

        let result = ""

        // GOOGLE GEMINI
        if (config.provider === 'gemini') {
            if (!config.geminiKey) return NextResponse.json({ error: "Gemini API Key missing" }, { status: 400 })

            const model = config.geminiModel || "gemini-pro"
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.geminiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            })

            const data = await response.json()
            if (data.error) throw new Error(data.error.message)
            result = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
        }

        // OPENAI (GPT)
        else if (config.provider === 'openai') {
            if (!config.openaiKey) return NextResponse.json({ error: "OpenAI API Key missing" }, { status: 400 })

            const model = config.openaiModel || "gpt-3.5-turbo"
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${config.openaiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7
                })
            })

            const data = await response.json()
            if (data.error) throw new Error(data.error.message)
            result = data.choices?.[0]?.message?.content || ""
        }

        // OPENROUTER
        else if (config.provider === 'openrouter') {
            if (!config.openRouterKey) return NextResponse.json({ error: "OpenRouter API Key missing" }, { status: 400 })

            const model = config.openRouterModel || "openai/gpt-3.5-turbo"

            // Using Standard OpenAI Compatible Endpoint
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${config.openRouterKey}`,
                    "HTTP-Referer": "https://kampuscms.local", // Required by OpenRouter
                    "X-Title": "KampusCMS"
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7
                })
            })

            const data = await response.json()
            if (data.error) throw new Error(typeof data.error === 'string' ? data.error : data.error.message)
            result = data.choices?.[0]?.message?.content || ""
        }

        return NextResponse.json({ result })

    } catch (error: any) {
        console.error("AI Error:", error)
        return NextResponse.json({ error: error.message || "Internal AI Error" }, { status: 500 })
    }
}
