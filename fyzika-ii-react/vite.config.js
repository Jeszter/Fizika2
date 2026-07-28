import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/Fizika2/',
    server: {
        port: 3000,
        open: true
    },
    css: {
        postcss: './postcss.config.js',
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false
    }
})