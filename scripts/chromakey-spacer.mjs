// Strip the teal background from bagel-spacer.png by replacing pixels close
// to the brand teal with transparency. Outputs an actually-transparent webp.
import sharp from 'sharp'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = join(__dirname, '..', 'public', 'photos', 'bagel-spacer.png')
const OUT = join(__dirname, '..', 'public', 'photos', 'bagel-spacer.webp')

const target = { r: 0x4c, g: 0xb9, b: 0xc9 } // brand teal #4cb9c9
const innerThreshold = 70   // distance below this → fully transparent
const outerThreshold = 130  // distance above this → fully opaque, smooth ramp between

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const out = Buffer.from(data)
let stripped = 0
let total = 0
for (let i = 0; i < out.length; i += 4) {
  const r = out[i], g = out[i + 1], b = out[i + 2]
  const dist = Math.sqrt((r - target.r) ** 2 + (g - target.g) ** 2 + (b - target.b) ** 2)
  total++
  if (dist < innerThreshold) {
    out[i + 3] = 0
    stripped++
  } else if (dist < outerThreshold) {
    const ratio = (dist - innerThreshold) / (outerThreshold - innerThreshold)
    out[i + 3] = Math.round(out[i + 3] * ratio)
  }
}

console.log(
  `Stripped ${stripped} of ${total} pixels (${(100 * stripped / total).toFixed(1)}%)`,
)

await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
  .resize({ width: 2400, withoutEnlargement: true })
  .webp({ quality: 90, alphaQuality: 95 })
  .toFile(OUT)

console.log(`✓ ${OUT}`)
