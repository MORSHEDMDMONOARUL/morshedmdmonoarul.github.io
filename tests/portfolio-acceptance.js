const fs = require("node:fs");
const path = require("node:path");

const htmlPath = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");

const requiredSnippets = [
  "data-design=\"international-research-portfolio\"",
  "International Research Portfolio",
  "AI &amp; Computer Vision Systems Builder",
  "Graduate Funding &amp; Research Fit",
  "funded graduate study",
  "European research programs",
  "Research Agenda",
  "Evidence Dossier",
  "Academic Timeline",
  "Teaching Assistant",
  "Sejong University",
  "ExamShield",
  "Prompt-Studio",
  "PDF Quiz Generator",
  "SJ MART",
  "YOLOv8",
  "ESP32",
  "NVIDIA NIM",
  "Computer Vision",
  "morshedmdmonoarul@gmail.com",
  "https://github.com/MORSHEDMDMONOARUL/ExamShield",
  "https://github.com/MORSHEDMDMONOARUL/Prompt-Studio",
  "https://github.com/MORSHEDMDMONOARUL/PDF_Quiz_Generator",
  "https://github.com/MORSHEDMDMONOARUL/SJ_MART",
  "https://github.com/MORSHEDMDMONOARUL/SJ_MART_MORSHED",
  "https://www.linkedin.com/in/md-monoarul-morshed-6a07a6263",
];

const forbiddenSnippets = ["TBD", "TODO", "your-", "placeholder"];
const forbiddenIdentitySnippets = [
  "EU Research Candidate",
  "AI &amp; Computer Vision Research Candidate",
  "eu-research-candidate",
  "morshed@eu-research",
  "EU candidate",
  "EU Candidate",
  "Candidate file",
  "Candidate research dossier",
  "EU Research Direction",
  "EU lab",
  "EU scholarship",
  "scholarship committees",
  "scholarship reviewers",
  "graduate reviewers",
];

const failures = [];

for (const snippet of requiredSnippets) {
  if (!html.includes(snippet)) {
    failures.push(`Missing required snippet: ${snippet}`);
  }
}

for (const snippet of forbiddenSnippets) {
  if (html.toLowerCase().includes(snippet.toLowerCase())) {
    failures.push(`Found forbidden placeholder text: ${snippet}`);
  }
}

for (const snippet of forbiddenIdentitySnippets) {
  if (html.includes(snippet)) {
    failures.push(`Found direct candidate positioning: ${snippet}`);
  }
}

const h1Count = (html.match(/<h1\b/gi) || []).length;
if (h1Count !== 1) {
  failures.push(`Expected exactly one h1, found ${h1Count}`);
}

if (!/<main\b[^>]*id="main"/i.test(html)) {
  failures.push("Missing accessible main landmark with id=\"main\"");
}

if (!/prefers-reduced-motion/.test(html)) {
  failures.push("Missing reduced motion CSS guard");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Portfolio acceptance checks passed.");
