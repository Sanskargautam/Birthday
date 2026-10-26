/**
 * Shrink gallery + web videos for mobile (run locally, then npm run sync-media).
 * ponytail: macOS sips for photos; ffmpeg-static for PNG→JPEG and video.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, renameSync, statSync, unlinkSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicGallery = join(root, 'public', 'gallery');
const publicVideos = join(root, 'public', 'videos');
const publicVideosWeb = join(publicVideos, 'web');

/** Mobile-first: small files load on slow LTE + cold Render deploys. */
const MAX_IMAGE_PX = 1200;
const JPEG_QUALITY = 72;
const PNG_TO_JPEG_MIN_BYTES = 400_000;
const VIDEO_MAX_H = 720;
const VIDEO_CRF = 31;
const VIDEO_MAXRATE = '900k';
const AUDIO_BITRATE = '64k';

const IMAGE_RE = /\.(jpe?g|png|gif|webp)$/i;
const PLACEHOLDER_RE = /^gallery-\d+\.(jpe?g|png)$/i;
const VIDEO_IN_WEB = /\.mp4$/i;

function isTinyPlaceholder(file) {
  if (!PLACEHOLDER_RE.test(file)) return false;
  try {
    return statSync(join(publicGallery, file)).size < 2048;
  } catch {
    return true;
  }
}

function runFfmpeg(args) {
  if (!ffmpegPath) throw new Error('ffmpeg-static missing');
  execFileSync(ffmpegPath, args, { stdio: 'pipe' });
}

function compressJpeg(filePath) {
  const before = statSync(filePath).size;
  execFileSync('sips', ['-Z', String(MAX_IMAGE_PX), filePath], { stdio: 'pipe' });
  execFileSync(
    'sips',
    ['-s', 'format', 'jpeg', '-s', 'formatOptions', String(JPEG_QUALITY), filePath],
    { stdio: 'pipe' },
  );
  const after = statSync(filePath).size;
  return { before, after };
}

function pngToJpegIfLarge(file, dir) {
  const input = join(dir, file);
  const before = statSync(input).size;
  if (before < PNG_TO_JPEG_MIN_BYTES) {
    execFileSync('sips', ['-Z', String(MAX_IMAGE_PX), input], { stdio: 'pipe' });
    return { file, before, after: statSync(input).size, converted: false };
  }
  const base = file.replace(/\.png$/i, '');
  const output = join(dir, `${base}.jpg`);
  const tmp = join(dir, `.compress-${base}.jpg`);
  runFfmpeg([
    '-y',
    '-i',
    input,
    '-vf',
    `scale='min(${MAX_IMAGE_PX},iw)':-2`,
    '-q:v',
    '4',
    tmp,
  ]);
  unlinkSync(input);
  renameSync(tmp, output);
  return { file: `${base}.jpg`, before, after: statSync(output).size, converted: true };
}

function compressGallery() {
  const files = readdirSync(publicGallery).filter((f) => IMAGE_RE.test(f) && !isTinyPlaceholder(f));
  let saved = 0;
  for (const file of files) {
    const path = join(publicGallery, file);
    try {
      if (/\.png$/i.test(file)) {
        const r = pngToJpegIfLarge(file, publicGallery);
        saved += r.before - r.after;
        if (r.converted) console.log(`PNG→JPEG ${file} → ${r.file} (${fmt(r.before)} → ${fmt(r.after)})`);
        else console.log(`PNG resize ${file} (${fmt(r.before)} → ${fmt(r.after)})`);
      } else if (/\.(jpe?g)$/i.test(file)) {
        const r = compressJpeg(path);
        saved += r.before - r.after;
        console.log(`JPEG ${file} (${fmt(r.before)} → ${fmt(r.after)})`);
      }
    } catch (err) {
      console.warn(`Skip ${file}:`, err.message ?? err);
    }
  }
  console.log(`Gallery saved ~${fmt(saved)}`);
}

function compressWebVideo(file) {
  const input = join(publicVideosWeb, file);
  const before = statSync(input).size;
  const tmp = join(publicVideosWeb, `.tmp-${file}`);
  runFfmpeg([
    '-y',
    '-i',
    input,
    '-vf',
    `scale=-2:'min(${VIDEO_MAX_H},ih)'`,
    '-c:v',
    'libx264',
    '-profile:v',
    'main',
    '-level',
    '4.0',
    '-crf',
    String(VIDEO_CRF),
    '-maxrate',
    VIDEO_MAXRATE,
    '-bufsize',
    '1800k',
    '-preset',
    'medium',
    '-c:a',
    'aac',
    '-b:a',
    AUDIO_BITRATE,
    '-movflags',
    '+faststart',
    '-pix_fmt',
    'yuv420p',
    tmp,
  ]);
  renameSync(tmp, input);
  const after = statSync(input).size;
  return { before, after };
}

function compressVideos() {
  if (!existsSync(publicVideosWeb)) return;
  let saved = 0;
  for (const file of readdirSync(publicVideosWeb).filter((f) => VIDEO_IN_WEB.test(f))) {
    if (file.startsWith('.tmp-')) continue;
    try {
      const r = compressWebVideo(file);
      saved += r.before - r.after;
      console.log(`Video web/${file} (${fmt(r.before)} → ${fmt(r.after)})`);
    } catch (err) {
      console.warn(`Skip web/${file}:`, err.message ?? err);
    }
  }
  console.log(`Web videos saved ~${fmt(saved)}`);
}

function removeHeavyDuplicates() {
  let removed = 0;
  for (const dir of [publicGallery, publicVideos]) {
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir)) {
      if (!/\.(mov|MOV|mp4|MP4)$/i.test(file) || file === 'web') continue;
      const p = join(dir, file);
      try {
        const size = statSync(p).size;
        unlinkSync(p);
        removed += size;
        console.log(`Removed duplicate source ${file} (${fmt(size)})`);
      } catch {
        /* ignore */
      }
    }
  }
  const stale = ['ruu-01.mp4', 'ruu-02.mp4', 'ruu-03.mp4', 'ruu-04.mp4'];
  for (const file of stale) {
    const p = join(publicVideosWeb, file);
    if (!existsSync(p)) continue;
    try {
      const size = statSync(p).size;
      unlinkSync(p);
      removed += size;
      console.log(`Removed stale web/${file}`);
    } catch {
      /* ignore */
    }
  }
  console.log(`Removed ~${fmt(removed)} duplicate/stale video files`);
}

function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

console.log(
  `Mobile-low preset: images ≤${MAX_IMAGE_PX}px @ q${JPEG_QUALITY}, video ≤${VIDEO_MAX_H}p crf${VIDEO_CRF}`,
);
console.log('Compressing gallery images…');
compressGallery();
console.log('Compressing web videos (may take several minutes)…');
compressVideos();
console.log('Removing duplicate phone .mov/.MOV from gallery and videos/…');
removeHeavyDuplicates();
console.log('Done. Run: npm run sync-media');
