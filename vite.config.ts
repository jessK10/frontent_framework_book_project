import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // loads VITE_* keys

  const apiBase = env.VITE_API_BASE_URL || 'http://localhost:5000'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // <-- required for shadcn/ui
      },
    },
    server: {
      proxy: {
        // Forward all /api/* calls to your backend during `npm run dev`
        '/api': {
          target: apiBase,
          changeOrigin: true,
          // if your backend is http or has self-signed https, set secure:false
          secure: apiBase.startsWith('https'),
          // optional: if your backend is mounted at root, keep the path:
          // rewrite: (p) => p, // default; not needed unless you want to adjust
        },
      },
    },
  }
})
