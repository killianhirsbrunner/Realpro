import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const publicDir = join(projectRoot, 'public');
const logosDir = join(publicDir, 'logos');

// Read the SVG file
const svgPath = join(publicDir, 'favicon.svg');
const svgBuffer = readFileSync(svgPath);

// Define all sizes to generate
const sizes = [
  { name: 'icon-16.png', size: 16 },
  { name: 'icon-32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'og-image.png', size: 1200, height: 630, isOgImage: true },
];

async function generateFavicons() {
  console.log('Generating favicon PNGs from SVG...\n');

  for (const { name, size, height, isOgImage } of sizes) {
    const outputPath = join(logosDir, name);

    if (isOgImage) {
      // For OG image, create a larger canvas with the icon centered
      const iconSize = 400;
      const bgColor = '#ffffff';

      // First render the SVG at desired size
      const iconBuffer = await sharp(svgBuffer)
        .resize(iconSize, iconSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toBuffer();

      // Create the OG image with white background and centered icon
      await sharp({
        create: {
          width: size,
          height: height,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      })
        .composite([{
          input: iconBuffer,
          top: Math.floor((height - iconSize) / 2),
          left: Math.floor((size - iconSize) / 2)
        }])
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated ${name} (${size}x${height})`);
    } else {
      // Regular square icons
      await sharp(svgBuffer)
        .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated ${name} (${size}x${size})`);
    }
  }

  console.log('\n✓ All favicons generated successfully!');
}

generateFavicons().catch(console.error);
