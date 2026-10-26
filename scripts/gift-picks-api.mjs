import { appendGiftPick, readGiftPicksTxt } from './gift-picks-store.mjs';

function viewSecret() {
  return process.env.GIFTS_VIEW_SECRET || 'ruu-27-local';
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

/** @returns {boolean} handled */
export async function handleGiftPicksApi(req, res, pathname, searchParams) {
  if (pathname !== '/api/gift-picks') return false;

  if (req.method === 'GET') {
    if (searchParams.get('key') !== viewSecret()) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Unauthorized — use ?key= with GIFTS_VIEW_SECRET from your server env.\n');
      return true;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(readGiftPicksTxt());
    return true;
  }

  if (req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const name = String(body.name ?? '').trim() || 'Ruu';
      const gifts = Array.isArray(body.gifts) ? body.gifts.map(String) : [];
      const giftIds = Array.isArray(body.giftIds) ? body.giftIds.map(String) : [];
      const whisper = String(body.whisper ?? '');
      const iso = new Date().toISOString();

      if (gifts.length === 0 && !whisper.trim()) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, error: 'empty' }));
        return true;
      }

      appendGiftPick({ iso, name, gifts, giftIds, whisper });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, iso }));
    } catch {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, error: 'bad_json' }));
    }
    return true;
  }

  res.statusCode = 405;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('Method not allowed\n');
  return true;
}
