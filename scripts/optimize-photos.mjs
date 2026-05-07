// One-off: take the giant source webps the client provided and emit
// web-friendly variants into public/photos.
//
// Run with: `node scripts/optimize-photos.mjs`
import sharp from 'sharp'
import { readdir, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SOURCE_DIR = join(__dirname, '..', '..')   // ../.. => the website folder
const OUT_DIR    = join(__dirname, '..', 'public', 'photos')

if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true })

// Map original filenames → semantic web names
const MAPPING = {
  '01StoreFrontWide.webp': 'storefront',
  '01Sign.webp':           'sign',
  '01Inside.webp':         'inside-1',
  '01Inside2.webp':        'inside-2',
  '01Inside3.webp':        'inside-3',
  '01InsideCounter.webp':  'counter',
  '01Food.webp':           'food',
}

const files = await readdir(SOURCE_DIR)
const targets = files.filter((f) => MAPPING[f])

if (!targets.length) {
  console.error('No source photos found in', SOURCE_DIR)
  process.exit(1)
}

for (const filename of targets) {
  const slug = MAPPING[filename]
  const inputPath = join(SOURCE_DIR, filename)
  console.log(`→ ${filename}  →  ${slug}-{1600,800}.webp`)

  await sharp(inputPath, { failOn: 'none' })
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(join(OUT_DIR, `${slug}-1600.webp`))

  await sharp(inputPath, { failOn: 'none' })
    .rotate()
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 76 })
    .toFile(join(OUT_DIR, `${slug}-800.webp`))
}

console.log('\n✓ Done. Optimized photos in public/photos/')
console.log('  Original:   ' + basename(SOURCE_DIR))
console.log('  Output dir: ' + OUT_DIR)
