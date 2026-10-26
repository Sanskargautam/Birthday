import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = process.env.DATA_DIR ? join(process.env.DATA_DIR) : join(root, 'data');
const txtPath = join(dataDir, 'gift-picks.txt');
const jsonlPath = join(dataDir, 'gift-picks.jsonl');

export function appendGiftPick({ iso, name, gifts, giftIds, whisper }) {
  mkdirSync(dataDir, { recursive: true });
  const giftList = Array.isArray(gifts) ? gifts : [];
  const ids = Array.isArray(giftIds) ? giftIds : [];

  appendFileSync(jsonlPath, `${JSON.stringify({ iso, name, gifts: giftList, giftIds: ids, whisper: whisper ?? '' })}\n`);

  const block = [
    `--- ${iso} ---`,
    `From: ${name}`,
    `Picks: ${giftList.length ? giftList.join(' · ') : '(none)'}`,
    ids.length ? `Option IDs: ${ids.join(', ')}` : '',
    whisper?.trim() ? `Whisper:\n${whisper.trim()}` : '',
    '',
  ]
    .filter(Boolean)
    .join('\n');

  appendFileSync(txtPath, `${block}\n`);
}

export function readGiftPicksTxt() {
  if (!existsSync(txtPath)) {
    return '(No picks saved yet.)\n';
  }
  return readFileSync(txtPath, 'utf8');
}
