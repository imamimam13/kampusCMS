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
            let val = values[index];
            if (val === '\\N') {
                val = null;
            } else {
                // Try to parse JSON
                try {
                    if (val.startsWith('{') || val.startsWith('[')) {
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
