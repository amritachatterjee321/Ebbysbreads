import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  const isStaging = mode === 'staging'
  const isTest = mode === 'test'
  
  return {
    plugins: [react()],
    define: {
      __APP_ENV__: JSON.stringify(mode),
    },
    build: {
      outDir: isProduction ? 'dist' : isStaging ? 'dist-staging' : 'dist-test',
      sourcemap: !isProduction,
      minify: isProduction,
    },
    server: {
      port: isTest ? 3001 : isStaging ? 3000 : 5173,
      host: true,
    },
    preview: {
      port: isTest ? 3001 : isStaging ? 3000 : 5173,
      host: true,
    },
    envDir: '.',
    envPrefix: 'VITE_',
  }
}) 