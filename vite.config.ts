import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ghPages } from 'vite-plugin-gh-pages';

export default defineConfig({
    plugins: [
        react(),
        ghPages(), // Add the GitHub Pages plugin here
    ],
    base: '/confessio/', // Replace 'confessio' with your repo name
});