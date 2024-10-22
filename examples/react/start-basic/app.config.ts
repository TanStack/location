import { defineConfig } from '@tanstack/start/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  tsr: {
    appDirectory
  }
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
})
