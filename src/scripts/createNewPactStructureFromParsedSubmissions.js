import fs from 'fs';
import { randomUUID } from 'crypto';

const submissions = JSON.parse(fs.readFileSync('parsed_submissions.json', 'utf8'));
const geoGroups = JSON.parse(fs.readFileSync('grouped_with_google_coordinates.json', 'utf8'));

// Build lookup: municipality + school → coordinates
const coordsMap = {};
for (const grp of geoGroups) {
  const key = `${grp.municipality}||${grp.school}`;
  coordsMap[key] = grp.coordinates || null;
}

const pacts = {}; // key = whatsapp_url

for (const entry of submissions) {
  const rawMunicipality = entry.municipality;
  const rawSchool = entry.school;
  const municipality = Array.isArray(rawMunicipality) ? rawMunicipality[0] : rawMunicipality;
  const school = Array.isArray(rawSchool) ? rawSchool[0] : rawSchool;
  const whatsapp_url = entry.whatsapp_url;
  const schoolYears = Array.isArray(entry.schoolYears) ? entry.schoolYears : [entry.schoolYears];

  if (!municipality || !school || !whatsapp_url) continue;

  const studentCount = schoolYears.length;
  const parentCount = 1;

  let pact = pacts[whatsapp_url];

  if (!pact) {
    const id = randomUUID();

    pact = {
      id,
      name: whatsapp_url.split('/').pop(),
      municipality,
      coordinates: null,      // set later from first school
      contact: whatsapp_url,
      schools: [],
      studentCount: 0,
      parentCount: 0,
    };

    pacts[whatsapp_url] = pact;
  }

  let schoolObj = pact.schools.find(s => s.name === school);
  if (!schoolObj) {
    schoolObj = {
      name: school,
      schoolYears: {},
      coordinates: coordsMap[`${municipality}||${school}`] || null,
      contact: whatsapp_url,
      studentCount: 0,
      parentCount: 0,
      pactId: pact.id,
    };
    pact.schools.push(schoolObj);

    // Set pact coordinates if this is the first school
    if (!pact.coordinates && schoolObj.coordinates) {
      pact.coordinates = schoolObj.coordinates;
    }
  }

  for (const year of schoolYears) {
    if (!year) continue;
    schoolObj.schoolYears[year] = (schoolObj.schoolYears[year] || 0) + 1;
    schoolObj.studentCount += 1;
    pact.studentCount += 1;
  }

  schoolObj.parentCount += 1;
  pact.parentCount += 1;
}

fs.writeFileSync('pacts.json', JSON.stringify(Object.values(pacts), null, 2));
console.log('✅ Saved pacts.json with UUIDs and pactId references');
