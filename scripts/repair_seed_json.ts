
import fs from 'fs';
import path from 'path';

const seedPath = path.join(process.cwd(), 'prisma', 'seed_data.json');

if (!fs.existsSync(seedPath)) {
    console.error('seed_data.json not found!');
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
let fixedCount = 0;

// Helper to fix a raw Postgres COPY string
const fixPostgresString = (val: string): any => {
    // 1. Unescape Postgres sequences
    // \n -> newline, \t -> tab, etc.
    // Note: In JSON, real newlines are fine.

    // We strictly replace the Postgres escape sequences
    const unescaped = val.replace(/\\([bfnrtv\\])/g, (match, char) => {
        switch (char) {
            case 'b': return '\b';
            case 'f': return '\f';
            case 'n': return '\n';
            case 'r': return '\r';
            case 't': return '\t';
            case 'v': return '\v';
            case '\\': return '\\';
                return char;
        }
    });

    try {
        // 2. Try to parse as JSON
        if (unescaped.trim().startsWith('{') || unescaped.trim().startsWith('[')) {
            return JSON.parse(unescaped);
        }
    } catch (e) {
        // If parse fails, return the unescaped string (better than the escaped one)
        // or maybe return original if unsure?
        // But for Page.content, we EXPECT valid JSON.
        // Let's return unescaped string so at least \n are real newlines.
        return unescaped;
    }
    return unescaped;
};

// Fix Page.content
if (data.Page) {
    for (const page of data.Page) {
        if (typeof page.content === 'string') {
            console.log(`Fixing Page content for: ${page.slug}`);
            const original = page.content;
            const fixed = fixPostgresString(original);

            if (typeof fixed !== 'string') {
                page.content = fixed;
                fixedCount++;
                console.log(' -> Success: Parsed as JSON object');
            } else {
                console.log(' -> Warning: Unescaped, but still boolean/string or invalid JSON. Kept as string.');
                // Update anyway to at least fix the visual \n issue
                page.content = fixed;
                fixedCount++;
            }
        }
    }
}

// Fix Site fields (headers, footers, etc can be JSON)
if (data.Site) {
    for (const site of data.Site) {
        ['headerLinks', 'footerConfig', 'aiConfig', 'enabledBlocks', 'enabledSidebarItems', 'colors', 'fonts'].forEach(field => {
            if (site[field] && typeof site[field] === 'string') {
                console.log(`Fixing Site.${field} for ${site.subdomain}`);
                const fixed = fixPostgresString(site[field]);
                site[field] = fixed;
                fixedCount++;
            }
        });
    }
}

// Fix other tables with JSON fields if needed (e.g. ProgramStudi.curriculum)
if (data.ProgramStudi) {
    for (const prodi of data.ProgramStudi) {
        if (prodi.curriculum && typeof prodi.curriculum === 'string') {
            console.log(`Fixing ProgramStudi.curriculum for ${prodi.code}`);
            prodi.curriculum = fixPostgresString(prodi.curriculum);
            fixedCount++;
        }
    }
}

if (fixedCount > 0) {
    fs.writeFileSync(seedPath, JSON.stringify(data, null, 2));
    console.log(`\nFixed ${fixedCount} fields in seed_data.json`);
} else {
    console.log('\nNo fields needed fixing.');
}
