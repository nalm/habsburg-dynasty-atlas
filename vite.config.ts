import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// Ensure root matches the real filesystem path (resolving junctions/symlinks between C: and D:)
const realRoot = fs.realpathSync(process.cwd())

export default defineConfig({
  root: realRoot,
  base: './',
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
  },
  server: {
    port: 5175,
    open: false,
  },
})
