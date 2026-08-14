'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const PAIRS = [
  ['https://fraittech.co.ke/img/Latest logo.png', 'https://fraittech.co.ke/img/Latest logo.webp'],
  ['img/Latest logo.png', 'img/Latest logo.webp'],
  ['img/favicon/favicon-96x96.png', 'img/favicon/favicon-96x96.webp'],
  ['img/favicon/apple-touch-icon.png', 'img/favicon/apple-touch-icon.webp'],
  ['type="image/png" sizes="96x96"', 'type="image/webp" sizes="96x96"'],
  ['img/hero-slide-1.jpg', 'img/hero-slide-1.webp'],
  ['img/hero-slide-2.jpg', 'img/hero-slide-2.webp'],
  ['img/hero-slide-3.jpg', 'img/hero-slide-3.webp'],
  ['img/web_dev.jpg', 'img/web_dev.webp'],
  ['img/web design.jpg', 'img/web design.webp'],
  ['img/it-2.jpg', 'img/it-2.webp'],
  ['img/graphoc-design-4.jpg', 'img/graphoc-design-4.webp'],
  ['img/digital solutions.jpg', 'img/digital solutions.webp'],
  ['img/about.png', 'img/about.webp'],
  ['img/frank.png', 'img/frank.webp'],
  ['img/woman 2.jpg', 'img/woman 2.webp'],
  ['img/team-3.jpg', 'img/team-3.webp'],
  ['img/feature.jpg', 'img/feature.webp'],
  ['img/Projects/website/tasksfy.jpg', 'img/Projects/website/tasksfy.webp'],
  ['img/Projects/website/food.jpg', 'img/Projects/website/food.webp'],
  ['img/Projects/website/Lasatarah.jpg', 'img/Projects/website/Lasatarah.webp'],
  ['img/Projects/website/all.jpg', 'img/Projects/website/all.webp'],
  ['img/projects/web development/All things grand .jpg', 'img/Projects/website/all.webp'],
  ['img/clients/larpei.png', 'img/clients/larpei.webp'],
  ['img/clients/Latest_utamu_logo.jpeg', 'img/clients/Latest_utamu_logo.webp'],
  ['img/clients/logo2.png', 'img/clients/logo2.webp'],
  ['img/clients/favicon-96x96.png', 'img/clients/favicon-96x96.webp'],
  ['img/Projects/graphics/2.png', 'img/Projects/graphics/2.webp'],
  ['img/Projects/graphics/mashujaa.png', 'img/Projects/graphics/mashujaa.webp'],
  ['img/Projects/graphics/Sax.jpg', 'img/Projects/graphics/Sax.webp'],
  ['img/Projects/website/larpei.png', 'img/Projects/website/larpei.webp'],
  ['img/Projects/graphics/blue.png', 'img/Projects/graphics/blue.webp'],
  ['img/Projects/graphics/christmas2.png', 'img/Projects/graphics/christmas2.webp'],
  ['img/Projects/graphics/Christmas.png', 'img/Projects/graphics/Christmas.webp'],
  ['img/Projects/graphics/Irie_with_barcode.png', 'img/Projects/graphics/Irie_with_barcode.webp'],
  ['img/Projects/graphics/larpei.png', 'img/Projects/graphics/larpei.webp'],
  ['img/Projects/graphics/MENU.png', 'img/Projects/graphics/MENU.webp'],
  ['img/Projects/graphics/merry.png', 'img/Projects/graphics/merry.webp'],
  ['img/Projects/graphics/retro.png', 'img/Projects/graphics/retro.webp'],
  ['img/Projects/graphics/replay.png', 'img/Projects/graphics/replay.webp'],
  ['img/Projects/graphics/Bee_hype.jpg', 'img/Projects/graphics/Bee_hype.webp'],
  ['img/Projects/graphics/weekend.png', 'img/Projects/graphics/weekend.webp'],
  ['img/Projects/graphics/c3dc729130c8f2a67c45dc721ea97db0.jpg', 'img/Projects/graphics/c3dc729130c8f2a67c45dc721ea97db0.webp'],
];

function walk(dir, out = []) {
  const skip = new Set(['node_modules', '.git']);
  for (const name of fs.readdirSync(dir)) {
    if (skip.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else {
      if (/\.(html|js|css|php|json|webmanifest)$/i.test(name)) out.push(full);
    }
  }
  return out;
}

function patch(content) {
  let s = content;
  for (const [a, b] of PAIRS) {
    if (s.includes(a)) s = s.split(a).join(b);
  }
  return s;
}

for (const file of walk(ROOT)) {
  const raw = fs.readFileSync(file, 'utf8');
  const next = patch(raw);
  if (next !== raw) {
    fs.writeFileSync(file, next, 'utf8');
    process.stdout.write(`${path.relative(ROOT, file)}\n`);
  }
}
