import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { join, parse } from 'path';

const SRC = '../assets/portfolio';
const OUT = '../assets/portfolio/thumbs';

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter(f => /\.webp$/i.test(f));

let total = 0, totalOut = 0;
for (const f of files) {
  const inPath = join(SRC, f);
  const outPath = join(OUT, parse(f).name + '.webp');
  const inStat = await stat(inPath);
  total += inStat.size;
  try {
    await sharp(inPath)
      .resize({ width: 720, withoutEnlargement: true })
      .webp({ quality: 70, effort: 5 })
      .toFile(outPath);
    const outStat = await stat(outPath);
    totalOut += outStat.size;
    console.log(`${f}: ${(inStat.size/1024).toFixed(0)}KB -> ${(outStat.size/1024).toFixed(0)}KB`);
  } catch (e) {
    console.error(`fail ${f}:`, e.message);
  }
}
console.log(`\nTotal: ${(total/1024/1024).toFixed(1)}MB -> ${(totalOut/1024/1024).toFixed(1)}MB`);
