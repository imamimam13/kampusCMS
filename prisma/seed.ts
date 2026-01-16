
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding from backup ...')

    const seedDataPath = path.join(process.cwd(), 'prisma', 'seed_data.json')
    if (!fs.existsSync(seedDataPath)) {
        console.error('Seed data file not found!')
        return
    }

    const rawData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'))

    // Helper to fix SQL dates (replace space with T for ISO)
    const fixDates = (obj: any): any => {
        if (Array.isArray(obj)) return obj.map(fixDates);
        if (obj !== null && typeof obj === 'object') {
            for (const key in obj) {
                obj[key] = fixDates(obj[key]);
            }
            return obj;
        }
        if (typeof obj === 'string') {
            // Match YYYY-MM-DD HH:mm:ss.SSS or similar
            if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(obj)) {
                return new Date(obj).toISOString();
            }
        }
        return obj;
    }

    const data = fixDates(rawData);

    // 1. Ensure Main Site Exists and Get ID
    let mainSiteId = null;
    if (data.Site && data.Site.length > 0) {
        // Assume the first one with subdomain 'main' is the main one
        const mainSiteData = data.Site.find((s: any) => s.subdomain === 'main') || data.Site[0];

        // Ensure customDomain is set if missing (fixing the original issue)
        if (!mainSiteData.customDomain) {
            mainSiteData.customDomain = 'uwb.ac.id';
        }

        console.log(`Seeding Site: ${mainSiteData.subdomain} (ID: ${mainSiteData.id})`)

        // Check for conflict
        // Check for conflict
        const conflictingSubdomain = await prisma.site.findUnique({ where: { subdomain: mainSiteData.subdomain } })
        if (conflictingSubdomain && conflictingSubdomain.id !== mainSiteData.id) {
            console.log(`Deleting conflicting site (subdomain) ${conflictingSubdomain.id} to allow restore...`)
            // Detach relations if needed or rely on cascade? 
            // Site deletion usually cascades content, let's try direct delete.
            await prisma.site.delete({ where: { id: conflictingSubdomain.id } })
        }

        // Check for customDomain conflict
        if (mainSiteData.customDomain) {
            const conflictingCustom = await prisma.site.findUnique({ where: { customDomain: mainSiteData.customDomain } })
            if (conflictingCustom && conflictingCustom.id !== mainSiteData.id) {
                console.log(`Deleting conflicting site (customDomain) ${conflictingCustom.id} to allow restore...`)
                // Check if it's the same site we just deleted (unlikely given different findUnique, but possible race/logic?)
                // findUnique uses exact match. If we deleted it above, it won't be found here.
                // But wait, what if conflictingSubdomain ID != conflictingCustom ID?
                // That implies TWO other sites preventing restore.
                // We should delete both.
                try {
                    await prisma.site.delete({ where: { id: conflictingCustom.id } })
                } catch (e) {
                    // ignore if already deleted
                }
            }
        }

        const site = await prisma.site.upsert({
            where: { id: mainSiteData.id },
            update: mainSiteData,
            create: mainSiteData
        })
        mainSiteId = site.id;
    } else {
        // Fallback if no site in dump
        const site = await prisma.site.upsert({
            where: { subdomain: 'main' },
            update: {},
            create: {
                name: 'Universitas Wira Bhakti',
                subdomain: 'main',
                customDomain: 'uwb.ac.id'
            }
        })
        mainSiteId = site.id;
    }

    // Helper to attach siteId
    const withSite = (row: any) => {
        // If row doesn't have siteId, attach mainSiteId
        if (!row.siteId && mainSiteId) {
            return { ...row, siteId: mainSiteId };
        }
        return row;
    }

    // Map to track ID changes for Users (Backup ID -> Real ID)
    const userIdMap: Record<string, string> = {};

    // 2. User
    if (data.User) {
        for (const user of data.User) {
            console.log(`Seeding User: ${user.email}`)

            // Check for conflict
            const conflictingUser = await prisma.user.findUnique({ where: { email: user.email } })

            if (conflictingUser && conflictingUser.id !== user.id) {
                console.log(`User email ${user.email} exists! Preserving existing user (Superadmin/Admin) and mapping ID...`)
                console.log(`Map: ${user.id} -> ${conflictingUser.id}`)
                userIdMap[user.id] = conflictingUser.id;
                // SKIP upserting this user to keep the existing one intact
                continue;
            }

            await prisma.user.upsert({
                where: { id: user.id },
                update: withSite(user),
                create: withSite(user)
            })
        }
    }

    // Helper to replace userId or authorId
    const withMappedUser = (row: any, field: 'userId' | 'authorId') => {
        const oldId = row[field];
        if (oldId && userIdMap[oldId]) {
            return { ...row, [field]: userIdMap[oldId] };
        }
        return row;
    }

    // 3. Staff
    if (data.Staff) {
        for (const staff of data.Staff) {
            console.log(`Seeding Staff: ${staff.name}`)
            try {
                // Apply User ID mapping
                const staffData = withSite(withMappedUser(staff, 'userId'));

                // Handle Unique Constraint on userId
                // If the mapped user ALREADY has a staff profile (different ID), we must delete it 
                // to allow this backup staff profile to take its place (and preserve its ID for relations).
                if (staffData.userId) {
                    const existingStaff = await prisma.staff.findUnique({ where: { userId: staffData.userId } })
                    if (existingStaff && existingStaff.id !== staffData.id) {
                        console.log(`Deleting existing staff profile ${existingStaff.id} for user ${staffData.userId} to allow restore...`)
                        await prisma.staff.delete({ where: { id: existingStaff.id } })
                    }
                }

                await prisma.staff.upsert({
                    where: { id: staff.id },
                    update: staffData,
                    create: staffData
                })
            } catch (e: any) { console.error(`Failed to seed staff ${staff.name}`, e.message) }
        }
    }

    // 4. Page
    if (data.Page) {
        for (const page of data.Page) {
            console.log(`Seeding Page: ${page.slug}`)
            // Clean explicit nulls that might violate rules if any
            const pageData = withSite(page);

            await prisma.page.upsert({
                where: { id: page.id },
                update: pageData,
                create: pageData
            })
        }
    }

    // 5. Post
    if (data.Post) {
        for (const post of data.Post) {
            if (!post.slug) continue; // skip empty
            console.log(`Seeding Post: ${post.slug}`)
            try {
                const postData = withSite(withMappedUser(post, 'authorId'));
                await prisma.post.upsert({
                    where: { id: post.id },
                    update: postData,
                    create: postData
                })
            } catch (e: any) { console.error(`Failed to seed post ${post.slug}`, e.message) }
        }
    }

    // 6. Other tables
    const tables = ['GalleryAlbum', 'GalleryImage', 'Event', 'Download', 'Testimonial', 'Alert', 'ProgramStudi']
    for (const table of tables) {
        if (data[table]) {
            for (const row of data[table]) {
                if (!row.id) continue;
                try {
                    const rowData = withSite(row);
                    // @ts-ignore
                    await prisma[table.charAt(0).toLowerCase() + table.slice(1)].upsert({
                        where: { id: row.id },
                        update: rowData,
                        create: rowData
                    })
                } catch (e) {
                    // console.error(`Failed to seed ${table}`, e.message)
                }
            }
        }
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        const prisma = new PrismaClient()
        await prisma.$disconnect()
        process.exit(1)
    })
