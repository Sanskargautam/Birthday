import { createServer } from 'node:http';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleGiftPicksApi } from './gift-picks-api.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const port = Number(process.env.PORT || 4173);

function loadEnvFiles() {
  for (const file of ['.env.local', '.env']) {
    const path = join(root, file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

loadEnvFiles();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.woff2': 'font/woff2',
};

function mimeFor(filePath) {
  const ext = extname(filePath).toLowerCase();
  return MIME[ext] || 'application/octet-stream';
}

/** iOS Safari needs byte-range responses for video (and large images). */
function resolveDistFile(pathname) {
  let rel = decodeURIComponent(pathname.split('?')[0] || '/');
  if (rel === '/' || rel === '') return join(dist, 'index.html');
  if (rel.startsWith('/')) rel = rel.slice(1);
  const filePath = join(dist, rel);
  if (!filePath.startsWith(dist)) return join(dist, 'index.html');
  if (existsSync(filePath) && statSync(filePath).isFile()) return filePath;
  return join(dist, 'index.html');
}

function sendStatic(req, res, filePath) {
  const stat = statSync(filePath);
  const fileSize = stat.size;
  const contentType = mimeFor(filePath);
  const range = req.headers.range;

  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Type', contentType);

  if (/\.(mp4|mov|jpe?g|png|webp|gif|js|css|woff2)$/i.test(filePath)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }

  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match) {
      res.statusCode = 416;
      res.setHeader('Content-Range', `bytes */${fileSize}`);
      res.end();
      return;
    }
    const start = match[1] === '' ? 0 : Number.parseInt(match[1], 10);
    const end = match[2] === '' ? fileSize - 1 : Number.parseInt(match[2], 10);
    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= fileSize) {
      res.statusCode = 416;
      res.setHeader('Content-Range', `bytes */${fileSize}`);
      res.end();
      return;
    }
    const chunkEnd = Math.min(end, fileSize - 1);
    const chunkSize = chunkEnd - start + 1;
    res.statusCode = 206;
    res.setHeader('Content-Range', `bytes ${start}-${chunkEnd}/${fileSize}`);
    res.setHeader('Content-Length', String(chunkSize));
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    createReadStream(filePath, { start, end: chunkEnd }).pipe(res);
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Length', String(fileSize));
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  createReadStream(filePath).pipe(res);
}

if (!existsSync(dist)) {
  console.error('Run npm run build first — dist/ is missing.');
  process.exit(1);
}

createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const handled = await handleGiftPicksApi(req, res, url.pathname, url.searchParams);
  if (handled) return;

  const filePath = resolveDistFile(url.pathname);
  sendStatic(req, res, filePath);
}).listen(port, () => {
  console.log(`Site + gift log API → http://localhost:${port}`);
  console.log(`Picks file on disk → data/gift-picks.txt`);
  console.log(`Read log in browser → /api/gift-picks?key=${process.env.GIFTS_VIEW_SECRET || 'ruu-27-local'}`);
});
