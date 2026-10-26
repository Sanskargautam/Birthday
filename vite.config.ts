import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GIFTS_VIEW_SECRET) {
    process.env.GIFTS_VIEW_SECRET = env.GIFTS_VIEW_SECRET
  }

  return {
    plugins: [
      react(),
      {
        name: 'gift-picks-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            // @ts-expect-error ponytail: Node .mjs helper
            const { handleGiftPicksApi } = await import('./scripts/gift-picks-api.mjs')
            const url = new URL(req.url || '/', 'http://localhost')
            const handled = await handleGiftPicksApi(req, res, url.pathname, url.searchParams)
            if (!handled) next()
          })
        },
      },
    ],
  }
})
