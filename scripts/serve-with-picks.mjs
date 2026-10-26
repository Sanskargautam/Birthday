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

function sendFile(res, filePath) {
  const ext = extname(filePath);
  res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
  createReadStream(filePath).pipe(res);
}

if (!existsSync(dist)) {
  console.error('Run npm run build first — dist/ is missing.');
  process.exit(1);
}

createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const handled = await handleGiftPicksApi(req, res, url.pathname, url.searchParams);
  if (handled) return;

  let path = join(dist, url.pathname === '/' ? 'index.html' : url.pathname);
  if (!existsSync(path) || !statSync(path).isFile()) {
    path = join(dist, 'index.html');
  }
  sendFile(res, path);
}).listen(port, () => {
  console.log(`Site + gift log API → http://localhost:${port}`);
  console.log(`Picks file on disk → data/gift-picks.txt`);
  console.log(`Read log in browser → /api/gift-picks?key=${process.env.GIFTS_VIEW_SECRET || 'ruu-27-local'}`);
});
