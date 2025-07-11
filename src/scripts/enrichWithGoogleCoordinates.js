import fs from 'fs';

const groups = JSON.parse(fs.readFileSync('grouped_submissions_with_years.json', 'utf8'));
const cachePath = 'geocode_cache.json';
const apiKey = process.env.GOOGLE_API_KEY;

let cache = fs.existsSync(cachePath)
  ? JSON.parse(fs.readFileSync(cachePath, 'utf8'))
  : {};

async function geocode(query) {
  // Use cached value if available
  if (cache[query]) return cache[query];

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;
  const res = await fetch(url);

  if (!res.ok) {
    console.error(`❌ Error geocoding "${query}": ${res.statusText}`);
    return null;
  }

  const data = await res.json();
  const loc = data?.results?.[0]?.geometry?.location;

  const coordinates = loc ? [loc.lat, loc.lng] : null;
  cache[query] = coordinates;

  // Write updated cache to disk after each geocode
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  return coordinates;
}

(async () => {
  for (const group of groups) {
    const query = `${group.school}, ${group.municipality}, Sweden`;

    console.log(`📍 Geocoding: ${query}`);
    const coords = await geocode(query);
    if (coords) {
      group.coordinates = coords;
    } else {
      console.warn(`⚠️ No coordinates found for: ${query}`);
    }

    // Respect API QPS limits
    await new Promise(r => setTimeout(r, 100));
  }

  fs.writeFileSync('grouped_with_google_coordinates.json', JSON.stringify(groups, null, 2));
  console.log('✅ Saved to grouped_with_google_coordinates.json');
})();
