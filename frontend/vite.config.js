import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    build: {
        minify: 'esbuild',
        chunkSizeWarningLimit: 1000,
        sourcemap: false,
    },
    server: {
        port: 5176,
        host: true,
        strictPort: false,
        hmr: {
            protocol: 'ws',
            host: 'localhost',
            port: 5176,
        },
    },
});