import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/tests/setup.js'],
        include: ['src/tests/**/*.test.js'],
        exclude: [
            'src/tests/e2e/**',
            'backend/**',
            'node_modules/**'
        ],
        coverage: {
            reporter: ['text', 'html'],
            exclude: ['node_modules/', 'src/tests/']
        }
    }
});
