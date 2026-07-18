import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { CLI_UA, PRETTY_PATHS, nodeHandler } from './content/api.js'

// Serves the site's real API in dev, mirroring the Vercel setup:
//  - /api/* always answers with JSON
//  - pretty paths (/projects, /whoami, ...) answer with JSON for
//    curl / wget / httpie / Postman, and fall through to the SPA for browsers
function siteApi() {
  return {
    name: 'site-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = (req.url || '/').split('?')[0]
        const isApi = url === '/api' || url.startsWith('/api/')
        const isCli = CLI_UA.test(req.headers['user-agent'] || '')
        const isPretty = PRETTY_PATHS.includes(url)
        if (!isApi && !(isCli && isPretty)) return next()
        const path = isApi ? url.slice(4) || '/' : url
        await nodeHandler(path)(req, res)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteApi()],
  server: {
    port: 4000,
  },
})
