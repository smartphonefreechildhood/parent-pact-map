import fs from 'fs';

// Load JSON files
const submissions = JSON.parse(fs.readFileSync('submissions.json', 'utf8'));
const questions = JSON.parse(fs.readFileSync('questions.json', 'utf8'));

// Step 1: Build questionId → fieldName or title map
const questionMap = {};
for (const question of questions) {
  const key = question.fieldName || question.title || `question_${question.id}`;
  questionMap[question.id] = key;
}

// Step 2: Parse each submission
const parsedSubmissions = submissions.map(sub => {
  const entry = {
    submittedAt: sub.submittedAt,
  };

  for (const response of sub.responses) {
    const questionId = response.questionId;
    const fieldKey = questionMap[questionId] || `question_${questionId}`;

    let answer = response.answer;

    // Flatten single-key objects (e.g. { whatsapp_url: ... })
    if (typeof answer === 'object' && !Array.isArray(answer) && answer !== null) {
      const keys = Object.keys(answer);
      if (keys.length === 1) {
        answer = answer[keys[0]];
      }
    }

    entry[fieldKey] = answer;
  }

  return entry;
});

// Step 3: Save the result
fs.writeFileSync('parsed_submissions.json', JSON.stringify(parsedSubmissions, null, 2));
console.log(`✔ Parsed ${parsedSubmissions.length} submissions to parsed_submissions.json`);
