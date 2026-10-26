# Deploy

The site is ~300MB with photos/videos. Use a host that runs the **Dockerfile** (or `npm run build` + `npm run start`), not static-only, so gift picks work.

## Render (recommended if Railway signup fails)

1. [render.com](https://render.com) → sign up with **GitHub** (often easier than Railway).
2. **New** → **Blueprint** → connect repo **Sanskargautam/Birthday** (uses `render.yaml` in repo root).
   - Or **New Web Service** → same repo → **Language: Docker** → Dockerfile path `./Dockerfile`.
3. Add env **`GIFTS_VIEW_SECRET`** (long random string) in the dashboard.
4. Deploy. Open the `*.onrender.com` URL.

**Gift log:** `https://YOUR-SERVICE.onrender.com/api/gift-picks?key=YOUR_SECRET`

Free tier sleeps after ~15 min idle (first visit may take ~30s to wake). Gift files on free disk can reset on redeploy; for a birthday week that’s usually fine.

## Fly.io (persistent disk, more technical)

1. [fly.io](https://fly.io) → sign up → install `flyctl`.
2. In project folder: `fly launch` (use existing Dockerfile), `fly volumes create birthday_data --size 1`, mount at `/app/data`, set `DATA_DIR=/app/data` and `GIFTS_VIEW_SECRET`.

## Railway

See [README.md](../README.md). Dockerfile + `railway.toml` included.

## Vercel / Netlify / GitHub Pages

Static only — **gift saves will not work** without a separate backend.

## After deploy

- Test gift save on your phone.
- Bookmark `/api/gift-picks?key=…` for yourself only.
- Run `npm run sync-media` locally before pushing if you change `public/gallery` or `public/videos`.
