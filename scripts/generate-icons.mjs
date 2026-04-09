import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const svgPath = join(publicDir, 'favicon.svg');
const svg = readFileSync(svgPath);

const sizes = [192, 512, 180]; // 180 = apple-touch-icon

for (const size of sizes) {
  const name = size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`;
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(join(publicDir, name));
  console.log(`Generated ${name}`);
}

console.log('Done!');
