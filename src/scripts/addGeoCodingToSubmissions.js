import fs from 'fs';

const apiKey = process.env.OPENCAGE_API_KEY;
const groups = JSON.parse(fs.readFileSync('grouped_submissions_with_years.json', 'utf8'));

// Optional: hardcoded municipality fallbacks
const municipalityCoords = {
  // Add more as needed...
};

// Geocode helper using OpenCage
async function geocode(query) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}&limit=1&countrycode=se`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'my-coordinates-script/1.0'
    }
  });

  if (!res.ok) {
    console.error(`Failed to fetch: ${res.statusText}`);
    return null;
  }

  const data = await res.json();
  if (data?.results?.[0]?.geometry) {
    const { lat, lng } = data.results[0].geometry;
    return [lat, lng];
  }

  return null;
}

(async () => {
  for (const group of groups) {
    const { municipality, school } = group;
    const query = `${school}, ${municipality}, Sweden`;

    // Try school + municipality first
    let coords = await geocode(query);

    // Fallback to municipality only
    if (!coords && municipalityCoords[municipality]) {
      coords = municipalityCoords[municipality];
    } else if (!coords) {
      coords = await geocode(`${municipality}, Sweden`);
    }
    console.log(coords)

    group.coordinates = coords || null;
  }

  fs.writeFileSync('grouped_with_coordinates.json', JSON.stringify(groups, null, 2));
  console.log(`✅ Saved to grouped_with_coordinates.json with coordinates`);
})();
