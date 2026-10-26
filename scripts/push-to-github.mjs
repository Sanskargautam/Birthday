import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokenPath = join(root, '.github-push-token');
const configPath = join(root, 'github-push.config.json');

function readToken() {
  const fromEnv = process.env.GITHUB_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  if (!existsSync(tokenPath)) {
    console.error(
      'Missing token: create birthday-site/.github-push-token (one line, Uska GitHub PAT)\n' +
        'Or run: GITHUB_TOKEN=ghp_... npm run push:github',
    );
    process.exit(1);
  }
  return readFileSync(tokenPath, 'utf8').trim();
}

let owner = process.env.GITHUB_OWNER?.trim();
let repo = (process.env.GITHUB_REPO || 'Birthday').trim();

if (existsSync(configPath)) {
  const cfg = JSON.parse(readFileSync(configPath, 'utf8'));
  owner = owner || cfg.owner?.trim();
  repo = cfg.repo?.trim() || repo;
}

if (!owner) {
  console.error('Set GitHub username in github-push.config.json → "owner" (Uska account that owns the repo).');
  process.exit(1);
}

const token = readToken();
const pushUrl = `https://x-access-token:${token}@github.com/${owner}/${repo}.git`;
const safeRemote = `https://github.com/${owner}/${repo}.git`;

console.log(`Pushing main → ${owner}/${repo} …`);

execFileSync('git', ['push', pushUrl, 'HEAD:main'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
});

execFileSync('git', ['remote', 'set-url', 'origin', safeRemote], { cwd: root, stdio: 'inherit' });
try {
  execFileSync('git', ['branch', '--set-upstream-to', 'origin/main', 'main'], {
    cwd: root,
    stdio: 'ignore',
  });
} catch {
  // ponytail: first push to empty repo — upstream set on next fetch
}
console.log('Done. origin is', safeRemote);
