import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Scanning KampusCMS database for obfuscated script injections...");

    let totalCleaned = 0;

    // 1. Scan Sites
    const sites = await prisma.site.findMany();
    for (const site of sites) {
        let updateData: any = {};
        if (site.headCode && (site.headCode.includes('_bHpB6q3A') || site.headCode.includes('recaptcha') || site.headCode.includes('<script'))) {
            console.log(`[CLEANUP] Found suspicious headCode in site '${site.name}' (${site.id}). Cleaning...`);
            updateData.headCode = null;
        }
        if (site.bodyCode && (site.bodyCode.includes('_bHpB6q3A') || site.bodyCode.includes('recaptcha') || site.bodyCode.includes('<script'))) {
            console.log(`[CLEANUP] Found suspicious bodyCode in site '${site.name}' (${site.id}). Cleaning...`);
            updateData.bodyCode = null;
        }

        if (Object.keys(updateData).length > 0) {
            await prisma.site.update({
                where: { id: site.id },
                data: updateData
            });
            totalCleaned++;
        }
    }

    // 2. Scan Posts
    const posts = await prisma.post.findMany({
        where: {
            OR: [
                { content: { contains: '_bHpB6q3A' } },
                { content: { contains: '_ArcN2PuE' } },
                { content: { contains: '_12TPWMcw' } },
                { content: { contains: 'I\'m not a robot' } },
                { content: { contains: 'reCAPTCHA' } }
            ]
        }
    });

    for (const post of posts) {
        console.log(`[CLEANUP] Found suspicious post content in '${post.title}' (${post.id}). Cleaning post...`);
        await prisma.post.update({
            where: { id: post.id },
            data: { published: false } // Unpublish infected post for admin review
        });
        totalCleaned++;
    }

    console.log(`\n✅ Scan and cleanup finished. Total items updated/cleaned: ${totalCleaned}`);
}

main()
    .catch((e) => {
        console.error("Cleanup error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
