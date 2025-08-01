import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error('❌ Missing GOOGLE_API_KEY');
  process.exit(1);
}

const pacts = JSON.parse(fs.readFileSync(path.join(__dirname, 'pacts_from_csv.json'), 'utf8'));
const cachePath = path.join(__dirname, 'geocode_cache.json');

let cache = fs.existsSync(cachePath)
  ? JSON.parse(fs.readFileSync(cachePath, 'utf8'))
  : {};

async function geocode(query) {
  if (cache[query]) return cache[query];

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;
  const res = await fetch(url);

  if (!res.ok) {
    console.error(`❌ Failed to fetch ${query}: ${res.statusText}`);
    return null;
  }

  const data = await res.json();
  const loc = data?.results?.[0]?.geometry?.location;
  const coords = loc ? [loc.lat, loc.lng] : null;

  cache[query] = coords;
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  return coords;
}

const enriched = [];

for (const pact of pacts) {
  const query = `${pact.municipality}, Sweden`;
  console.log(`📍 Geocoding ${query}...`);

  const coords = await geocode(query);
  if (coords) {
    pact.coordinates = coords;
  } else {
    console.warn(`⚠️ No coordinates found for ${query}`);
  }

  enriched.push(pact);

  // Respect API limits
  await new Promise(r => setTimeout(r, 100));
}

fs.writeFileSync(path.join(__dirname, 'pacts_with_coordinates.json'), JSON.stringify(enriched, null, 2));
console.log('✅ Saved enriched pacts to pacts_with_coordinates.json');
