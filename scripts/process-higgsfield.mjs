// Take the raw Higgsfield PNG output and produce web-optimized variants:
//   - decorations (bagel mark, sliced bagel, coffee cup) get a luminosity-based
//     alpha mask so near-white pixels become transparent
//   - logo lockup variants keep their colored backgrounds, just shrunk + webp'd
//
// Run with: `node scripts/process-higgsfield.mjs`
import sharp from 'sharp'
import { readdir, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const RAW_DIR = join(__dirname, '..', 'higgsfield-raw')
const OUT_DIR = join(__dirname, '..', 'public', 'photos')

if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true })

// For decoration assets: extract alpha from near-white background.
// Strategy: convert RGB → grayscale luminosity, then anything > threshold = transparent.
async function makeTransparent(inputPath, outputPath, options = {}) {
  const { width = 800, threshold = 245 } = options
  const baseImg = sharp(inputPath).resize({ width, withoutEnlargement: true })

  // Build an alpha mask: black where the image is white, white where it has content
  const mask = await baseImg
    .clone()
    .greyscale()
    .threshold(threshold) // pixels brighter than threshold → 255 (white = will become transparent)
    .negate()             // invert: now content = white (255), background = black (0)
    .blur(0.5)            // soften edges slightly so we don't get jaggies
    .toBuffer()

  // Apply the mask as the alpha channel
  await baseImg
    .clone()
    .joinChannel(mask)
    .webp({ quality: 90, alphaQuality: 95 })
    .toFile(outputPath)
}

const DECORATIONS = [
  { src: 'bagel-mark.png',   out: 'bagel-mark.webp',   width: 800 },
  { src: 'bagel-sliced.png', out: 'bagel-sliced.webp', width: 800 },
  { src: 'coffee-cup.png',   out: 'coffee-cup.webp',   width: 600 },
]

const LOGOS = [
  { src: 'logo-v1-refresh.png',    out: 'logo-v1-refresh.webp',    width: 1200 },
  { src: 'logo-v2-stamp.png',      out: 'logo-v2-stamp.webp',      width: 1200 },
  { src: 'logo-v3-horizontal.png', out: 'logo-v3-horizontal.webp', width: 1600 },
]

const sources = await readdir(RAW_DIR)
console.log(`Found ${sources.length} raw assets in higgsfield-raw/`)

for (const dec of DECORATIONS) {
  console.log(`→ ${dec.src} (decoration, transparent bg)`)
  await makeTransparent(join(RAW_DIR, dec.src), join(OUT_DIR, dec.out), { width: dec.width })
}

for (const logo of LOGOS) {
  console.log(`→ ${logo.src} (logo variant, keep background)`)
  await sharp(join(RAW_DIR, logo.src))
    .resize({ width: logo.width, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(join(OUT_DIR, logo.out))
}

console.log('\n✓ Done. Decorations + logo variants in public/photos/')
