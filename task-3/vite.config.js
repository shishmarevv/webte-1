import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
        // Relative paths, so the built app works from any folder on the school server
        base: './',
        plugins: [vue()]
});
