import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';

// Setup __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load and parse CSV
const csv = fs.readFileSync(path.join(__dirname, 'master_data.csv'), 'utf8');
const rows = parse(csv, {
  columns: true,
  skip_empty_lines: true,
  trim: true
});

const pacts = {}; // key = kommun

for (const row of rows) {
  const municipality = row.kommun?.trim();
  const childGrades = row.child_grade
    ? row.child_grade.split(',').map(g => g.trim()).filter(Boolean)
    : [];

  if (!municipality) continue;

  const pact = pacts[municipality] ||= {
    id: randomUUID(),
    name: municipality,
    municipality,
    coordinates: null,
    contact: null,
    studentCount: 0,
    parentCount: 0
  };

  pact.studentCount += childGrades.length;
  pact.parentCount += 1;
}

fs.writeFileSync('pacts_from_csv.json', JSON.stringify(Object.values(pacts), null, 2));
console.log('✅ Saved pacts_from_csv.json (without schools)');
