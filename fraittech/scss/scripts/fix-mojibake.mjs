/**
 * Replace U+FFFD (replacement character, shown as �) with intended punctuation/text.
 * Run from repo root: node scripts/fix-mojibake.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const C = "\uFFFD";
const EN = "\u2013";
const EM = "\u2014";
const EL = "\u2026";

const exactReplacements = [
  [`or ${C}make it feel like ___${C}`, "or 'make it feel like ___'"],
  [`Something else ${C} I'll explain below`, "Something else – I'll explain below"],
  [`This is mostly a${C}`, `This is mostly a${EL}`],
  [`e.g. Nanyuki Bakes, EcoTours KE${C}`, `e.g. Nanyuki Bakes, EcoTours KE${EL}`],
  [`placeholder="+254 7${C}"`, `placeholder="+254 7xx xxx xxx"`],
  [`look great on phones${C}"`, `look great on phones${EL}"`],
  [`parents nearby${C}"`, `parents nearby${EL}"`],
  [`integrations${C}"`, `integrations${EL}"`],
  [`data-ft-busy-label="Subscribing${C}"`, `data-ft-busy-label="Subscribing${EL}"`],
  [`data-ft-busy-label="Submitting${C}"`, `data-ft-busy-label="Submitting${EL}"`],
  [`data-ft-busy-label="Sending${C}"`, `data-ft-busy-label="Sending${EL}"`],
  [`</span>Sending${C}'`, `</span>Sending${EL}'`],
  [`deadlines${C}anything`, `deadlines${EM}anything`],
  [`what ${C}final${C} might`, "what 'final' might"],
  [`brands${C}pairing`, `brands${EM}pairing`],
  [`headed${C}so`, `headed${EM}so`],
  [`globally${C}where`, `globally${EM}where`],
  [`progress${C}not`, `progress${EM}not`],
  [`Cost${C}benefit`, `Cost${EN}benefit`],
  [`Small${C}medium`, `Small${EN}medium`],
  [`<!-- Portfolio hero ${C} single`, `<!-- Portfolio hero ${EN} single`],
];

const contractionReplacements = [
  ["What" + C + "s", "What's"],
  ["what" + C + "s", "what's"],
  ["We" + C + "re", "We're"],
  ["We" + C + "ll", "We'll"],
  ["we" + C + "ll", "we'll"],
  ["you" + C + "re", "you're"],
  ["You" + C + "re", "You're"],
  ["you" + C + "ll", "you'll"],
  ["Who" + C + "s", "Who's"],
  ["Let" + C + "s", "Let's"],
  ["Don" + C + "t", "Don't"],
  ["don" + C + "t", "don't"],
  ["won" + C + "t", "won't"],
  ["doesn" + C + "t", "doesn't"],
  ["brand" + C + "s", "brand's"],
];

function fixText(s) {
  let t = s;
  for (const [a, b] of exactReplacements) t = t.split(a).join(b);
  for (const [a, b] of contractionReplacements) t = t.split(a).join(b);

  t = t.replace(/(\d)\uFFFD(\d)/g, (_, a, b) => a + EN + b);
  t = t.replace(/(\d{1,2}:\d{2})\uFFFD(\d{1,2}:\d{2})/g, (_, a, b) => a + EN + b);
  t = t.replace(/Mon\uFFFDSat/g, "Mon" + EN + "Sat");
  t = t.replace(/near\uFFFD24/g, "near-24");
  t = t.replace(/ \uFFFD /g, " " + EN + " ");

  return t;
}

function walkHtmlFiles(dir, out) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name === "node_modules" || name.name === ".git") continue;
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walkHtmlFiles(p, out);
    else if (name.isFile() && name.name.endsWith(".html")) out.push(p);
  }
}

const htmlFiles = [];
walkHtmlFiles(root, htmlFiles);

let totalFiles = 0;

for (const file of htmlFiles) {
  const before = fs.readFileSync(file, "utf8");
  if (!before.includes(C)) continue;
  const after = fixText(before);
  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    totalFiles++;
    const left = (after.match(/\uFFFD/g) || []).length;
    console.log("fixed:", path.relative(root, file), left ? `(still ${left} U+FFFD)` : "");
  }
}

const leftovers = [];
for (const file of htmlFiles) {
  const s = fs.readFileSync(file, "utf8");
  const n = (s.match(/\uFFFD/g) || []).length;
  if (n) leftovers.push([path.relative(root, file), n]);
}

console.log("Files updated:", totalFiles);
if (leftovers.length) {
  console.log("Remaining U+FFFD (needs manual fix):");
  for (const [f, n] of leftovers) console.log(" ", f, n);
  process.exitCode = 1;
} else {
  console.log("No remaining U+FFFD in HTML.");
}
