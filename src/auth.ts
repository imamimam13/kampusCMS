import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
// import { PrismaAdapter } from "@auth/prisma-adapter" // Not strictly needed for Credentials only, but good for sessions if DB strategy used
// import { prisma } from "@/lib/prisma" // We need to create this first

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data
                    // TODO: Verify user against database
                    // const user = await prisma.user.findUnique({ where: { email } });
                    // if (!user) return null;
                    // const passwordsMatch = await bcrypt.compare(password, user.password);
                    // if (passwordsMatch) return user;

                    // MOCK USER FOR NOW
                    if (email === "test@example.com" && password === "password") {
                        return { id: "1", name: "Test User", email: email, role: "admin" }
                    }
                    return null
                }
                return null
            },
        }),
    ],
})
