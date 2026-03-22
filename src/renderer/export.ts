import sharp from 'sharp';
import { join } from 'node:path';
import { mkdir } from 'node:fs/promises';

export interface ExportOptions {
  outputDir: string;
  id: string;
  platform: string;
  width: number;
  height: number;
}

export async function processScreenshot(
  screenshotBuffer: Buffer,
  options: ExportOptions,
): Promise<Record<string, string>> {
  const { outputDir, id, platform, width, height } = options;

  const platformDir = join(outputDir, platform);
  await mkdir(platformDir, { recursive: true });

  const files: Record<string, string> = {};

  // Full-size optimized PNG
  const fullPath = join(platformDir, `${id}.png`);
  await sharp(screenshotBuffer)
    .resize(width, height, { fit: 'cover' })
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(fullPath);
  files.full = fullPath;

  // Thumbnail (200x200 for previews)
  const thumbPath = join(platformDir, `${id}_thumb.png`);
  await sharp(screenshotBuffer)
    .resize(200, 200, { fit: 'cover' })
    .png({ quality: 80 })
    .toFile(thumbPath);
  files.thumbnail = thumbPath;

  return files;
}

export async function createPreviewGrid(
  imagePaths: string[],
  outputPath: string,
  columns: number = 4,
): Promise<void> {
  if (imagePaths.length === 0) return;

  const thumbSize = 200;
  const padding = 10;
  const rows = Math.ceil(imagePaths.length / columns);
  const gridWidth = columns * (thumbSize + padding) + padding;
  const gridHeight = rows * (thumbSize + padding) + padding;

  const composites: sharp.OverlayOptions[] = [];

  for (let i = 0; i < imagePaths.length; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const thumb = await sharp(imagePaths[i])
      .resize(thumbSize, thumbSize, { fit: 'cover' })
      .toBuffer();

    composites.push({
      input: thumb,
      left: padding + col * (thumbSize + padding),
      top: padding + row * (thumbSize + padding),
    });
  }

  await sharp({
    create: {
      width: gridWidth,
      height: gridHeight,
      channels: 4,
      background: { r: 20, g: 20, b: 20, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toFile(outputPath);
}
