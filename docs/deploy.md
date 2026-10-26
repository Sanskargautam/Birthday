# Deploy

The site is ~300MB with photos/videos. Use a host that can run **Node** (`npm run start`), not static-only, so gift picks save correctly.

## Railway (recommended)

See root [README.md](../README.md). Dockerfile + `railway.toml` are included.

1. Import `Sanskargautam/Birthday` from GitHub.
2. Set `GIFTS_VIEW_SECRET`.
3. Add a volume at `/app/data` and `DATA_DIR=/app/data` if you want picks to survive redeploys.

## Vercel / Netlify / GitHub Pages

Static deploy works for photos and video, but **gift saves will fail** (no `/api/gift-picks`). Use Railway or run `npm run start` on a VPS instead.

## After deploy

- Test gift save on your phone.
- Bookmark `/api/gift-picks?key=…` for yourself only.
- Run `npm run sync-media` locally before pushing if you change `public/gallery` or `public/videos`.
