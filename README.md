# Birthday site (Sanskar → Ruu)

Private birthday page with photos, videos, letter, and a gift picker.

## Local

```bash
npm install
npm run sync-media   # if you add photos/videos under public/
npm run dev
```

Gift picks save to `data/gift-picks.txt` while the dev server or `npm run start` is running.

## Deploy on Railway (recommended)

1. Push this repo to GitHub.
2. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub** → select **Birthday**.
3. **Variables:** `GIFTS_VIEW_SECRET` = a long random string (you use this to read picks).
4. **Volume (optional but good):** mount path `/app/data`, then add variable `DATA_DIR` = `/app/data`.
5. Railway builds the Dockerfile and runs `npm run start`. Open the generated URL.

**Read Ruu’s picks**

- Browser: `https://YOUR-RAILWAY-URL/api/gift-picks?key=YOUR_GIFTS_VIEW_SECRET`
- On disk (with volume): `data/gift-picks.txt` on the mounted volume

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Vite dev + gift API |
| `npm run build` | Production `dist/` |
| `npm run start` | Serve `dist/` + gift API (port `PORT` or 4173) |

See `docs/deploy.md` for other hosts.
