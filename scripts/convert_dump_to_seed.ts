import fs from 'fs';
import path from 'path';

const sqlPath = path.join(process.cwd(), 'backup_temp', 'database_dump.sql');
const content = fs.readFileSync(sqlPath, 'utf-8');

const tables: Record<string, any[]> = {};

// Regex to match COPY blocks
const copyRegex = /COPY public."(\w+)" \(([^)]+)\) FROM stdin;\n([\s\S]*?)\\\./g;

let match;
while ((match = copyRegex.exec(content)) !== null) {
    const tableName = match[1];
    const columns = match[2].split(', ').map(c => c.replace(/"/g, ''));
    const dataLines = match[3].trim().split('\n');

    const rows = dataLines.map(line => {
        const values = line.split('\t');
        const row: Record<string, any> = {};

        columns.forEach((col, index) => {
            let val: any = values[index];

            // Unescape Postgres COPY format
            // Postgres escapes: \b, \f, \n, \r, \t, \v, \\
            if (val === '\\N') {
                val = null;
            } else {
                val = val.replace(/\\([bfnrtv\\])/g, (match: string, char: string) => {
                    switch (char) {
                        case 'b': return '\b';
                        case 'f': return '\f';
                        case 'n': return ' '; // Replace newline with space for safety in JSON? No, restore literal \n
                        // Wait, if JSON buffer line has \n, it is real newline.
                        case 'n': return '\n';
                        case 'r': return '\r';
                        case 't': return '\t';
                        case 'v': return '\v';
                        case '\\': return '\\';
                            return char;
                    }
                });

                // Try to parse JSON
                try {
                    if (val && (val.startsWith('{') || val.startsWith('['))) {
                        val = JSON.parse(val);
                    }
                } catch (e) {
                    // keep as string
                }

                // Handle boolean
                if (val === 't') val = true;
                if (val === 'f') val = false;
            }
            row[col] = val;
        });
        return row;
    });

    tables[tableName] = rows;
}

// Rename SiteSettings to Site
if (tables['SiteSettings']) {
    tables['Site'] = tables['SiteSettings'].map(row => {
        // Map fields if necessary, currently they look compatible
        // Ensure 'subdomain' exists. Old backup might not have it or it was 'main' implicitly?
        // Checking schema: SiteSettings doesn't have 'subdomain' or 'customDomain'?
        // Let's check the SQL dump view again.
        return {
            ...row,
            subdomain: 'main', // Defaulting to main as this is the primary backup
            // customDomain: 'uwb.ac.id' // Optional: set if we want
        };
    });
    delete tables['SiteSettings'];
}

// Write to seed_data.json
const outputPath = path.join(process.cwd(), 'prisma', 'seed_data.json');
fs.writeFileSync(outputPath, JSON.stringify(tables, null, 2));

console.log('Seed data generated at prisma/seed_data.json');
