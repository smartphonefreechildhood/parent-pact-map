import fs from 'fs';

const API_KEY = process.env.TALLY_API_KEY;
const FORM_ID = 'w755GR';
const BASE_URL = `https://api.tally.so/forms/${FORM_ID}/submissions`;

async function fetchAllSubmissions() {
  let submissions = [];
  let hasMore = true;
  let page = 1;

  while (hasMore) {
    const url = new URL(BASE_URL);
    url.searchParams.set('page', page);

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
        },
      });

      const data = await response.json();
      console.log(data);
      submissions.push(...(data.submissions || []));
      hasMore = data.hasMore;
      page++;
      console.log(page);
      console.log(hasMore);
    } catch (error) {
      console.error('Error fetching:', error.message);
      break;
    }
  }

  fs.writeFileSync('submissions.json', JSON.stringify(submissions, null, 2));
  console.log(`Saved ${submissions.length} submissions.`);
}

fetchAllSubmissions();