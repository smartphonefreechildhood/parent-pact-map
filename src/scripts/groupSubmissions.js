import fs from 'fs';

// Load parsed submissions
const submissions = JSON.parse(fs.readFileSync('parsed_submissions.json', 'utf8'));

const groups = {};

for (const sub of submissions) {
  const municipalities = Array.isArray(sub.municipality) ? sub.municipality : [sub.municipality];
  const schools = Array.isArray(sub.school) ? sub.school : [sub.school];
  const whatsapp = sub.whatsapp_url;
  const schoolYears = Array.isArray(sub.schoolYears) ? sub.schoolYears : [sub.schoolYears];

  for (const municipality of municipalities) {
    for (const school of schools) {
      const key = `${municipality}||${school}`;
      if (!groups[key]) {
        groups[key] = {
          municipality,
          school,
          whatsapp_urls: new Set(),
          schoolYears: {},
          count: 0,
        };
      }

      if (whatsapp) {
        groups[key].whatsapp_urls.add(whatsapp);
      }

      for (const year of schoolYears) {
        if (year) {
          groups[key].schoolYears[year] = (groups[key].schoolYears[year] || 0) + 1;
          groups[key].count += 1; // increment count per schoolYear
        }
      }
    }
  }
}

// Format output
const result = Object.values(groups).map(group => ({
  municipality: group.municipality,
  school: group.school,
  whatsapp_urls: Array.from(group.whatsapp_urls),
  schoolYears: group.schoolYears,
  count: group.count,
}));

fs.writeFileSync('grouped_submissions_with_years.json', JSON.stringify(result, null, 2));
console.log(`✔ Grouped data saved to grouped_submissions_with_years.json`);
