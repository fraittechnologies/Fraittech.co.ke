'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMG = path.join(ROOT, 'img');
const EXT = new Set(['.jpg', '.jpeg', '.png']);

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

async function main() {
  const all = walk(IMG);
  const sources = all.filter((f) => {
    const ext = path.extname(f).toLowerCase();
    if (!EXT.has(ext)) return false;
    if (f.endsWith('.ico')) return false;
    return true;
  });

  for (const src of sources) {
    const dest = src.replace(/\.(jpe?g|png)$/i, '.webp');
    await sharp(src).webp({ quality: 85, effort: 4 }).toFile(dest);
    process.stdout.write(`OK ${path.relative(ROOT, src)}\n`);
    fs.unlinkSync(src);
  }

  const h1 = path.join(IMG, 'hero-slide-1.webp');
  if (fs.existsSync(h1)) {
    for (const n of ['hero-slide-2.webp', 'hero-slide-3.webp']) {
      const p = path.join(IMG, n);
      if (!fs.existsSync(p)) {
        fs.copyFileSync(h1, p);
        process.stdout.write(`COPY ${n} from hero-slide-1.webp\n`);
      }
    }
  }

  const aboutW = path.join(IMG, 'about.webp');
  const featureW = path.join(IMG, 'feature.webp');
  if (fs.existsSync(aboutW) && !fs.existsSync(featureW)) {
    fs.copyFileSync(aboutW, featureW);
    process.stdout.write(`COPY feature.webp from about.webp\n`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
