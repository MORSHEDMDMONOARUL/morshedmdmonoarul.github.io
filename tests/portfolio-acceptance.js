const fs = require("node:fs");
const path = require("node:path");

const htmlPath = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");
const visibleText = html
  .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/\s+/g, " ");

const requiredSnippets = [
  "data-design=\"neural-evidence-lab\"",
  "Neural Evidence Lab",
  "AI &amp; Computer Vision Engineer",
  "practical, secure, and efficient intelligent systems",
  "Sejong University CSE profile",
  "View Research Work",
  "Contact for Collaboration",
  "Research Fit",
  "Technical Evidence",
  "ExamShield Case Study",
  "Capability Matrix",
  "Vision Systems",
  "AI Workflows",
  "Edge &amp; IoT",
  "Teaching &amp; Communication",
  "funded graduate research opportunities",
  "thesis-based or research-oriented graduate opportunities",
  "Europe-based research environments",
  "Research systems cockpit",
  "evidence-led",
  "Research Agenda",
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
  "European candidate",
  "Europe candidate",
  "Candidate file",
  "Candidate research dossier",
  "EU Research Direction",
  "EU lab",
  "EU scholarship",
  "scholarship committees",
  "scholarship reviewers",
  "graduate reviewers",
  "CSE student",
  "CS Student",
  "Live research cockpit",
  ">online</span>",
];
const forbiddenDesignSnippets = ["gradient orb", "bokeh", "rounded-full blur-", "emoji"];

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
  if (html.toLowerCase().includes(snippet.toLowerCase()) || visibleText.toLowerCase().includes(snippet.toLowerCase())) {
    failures.push(`Found direct candidate positioning: ${snippet}`);
  }
}

for (const snippet of forbiddenDesignSnippets) {
  if (html.toLowerCase().includes(snippet.toLowerCase())) {
    failures.push(`Found forbidden design artifact: ${snippet}`);
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

const visionBoxes = html.match(/<span class="vision-box[^>]+>/g) || [];
if (visionBoxes.length < 2 || visionBoxes.some((box) => !/aria-hidden="true"/.test(box))) {
  failures.push("Decorative vision-box overlays must be hidden from assistive tech");
}

if (/[😀-🙏🌀-🗿🚀-🛿]/u.test(visibleText)) {
  failures.push("Visible emoji are not allowed in the professional UI");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Portfolio acceptance checks passed.");
