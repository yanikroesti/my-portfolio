// Crops the source portrait tightly around the head (bright-pixel bounding box
// against the dark backdrop), pads, downscales and exports public/portrait.webp.
// Rerun after replacing the source: node scripts/prepare-portrait.mjs
import sharp from 'sharp';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'assets-src', 'portrait-source.png');
const OUT = join(root, 'public', 'portrait.webp');

const DETECT_W = 440;

const meta = await sharp(SRC).metadata();
// transparent source: bbox from the alpha channel; opaque source: from luminance
const THRESHOLD = meta.hasAlpha ? 10 : 38;
const detector = sharp(SRC).resize({ width: DETECT_W });
const { data, info } = await (meta.hasAlpha
  ? detector.extractChannel('alpha')
  : detector.grayscale()
)
  .raw()
  .toBuffer({ resolveWithObject: true });

let minX = info.width, minY = info.height, maxX = 0, maxY = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (data[y * info.width + x] > THRESHOLD) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
if (maxX <= minX || maxY <= minY) throw new Error('no subject found — threshold too high?');

const scale = meta.width / info.width;
const bbox = {
  x: minX * scale,
  y: minY * scale,
  w: (maxX - minX + 1) * scale,
  h: (maxY - minY + 1) * scale,
};

// transparent source needs no fade margin — crop tight like the template head;
// opaque source keeps generous padding so a CSS edge-fade mask never touches the head
const padX = bbox.w * (meta.hasAlpha ? 0.04 : 0.2);
const padTop = bbox.h * (meta.hasAlpha ? 0.03 : 0.09);
const padBottom = bbox.h * (meta.hasAlpha ? 0.02 : 0.07);

const left = Math.max(0, Math.round(bbox.x - padX));
const top = Math.max(0, Math.round(bbox.y - padTop));
const width = Math.min(meta.width - left, Math.round(bbox.w + padX * 2));
const height = Math.min(meta.height - top, Math.round(bbox.h + padTop + padBottom));

const out = await sharp(SRC)
  .extract({ left, top, width, height })
  .resize({ height: 1600, withoutEnlargement: true })
  .webp({ quality: 88 })
  .toFile(OUT);

console.log(`head bbox ${Math.round(bbox.w)}x${Math.round(bbox.h)} @ (${Math.round(bbox.x)},${Math.round(bbox.y)}) of ${meta.width}x${meta.height}`);
console.log(`cropped ${width}x${height} -> ${out.width}x${out.height}, ${(out.size / 1024).toFixed(0)} KB, aspect ${(out.width / out.height).toFixed(3)}`);
