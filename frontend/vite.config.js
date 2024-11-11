import react from '@vitejs/plugin-react'
import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/api'),
            },
        },
        fs: {
            // Allow Vite to access files in the frontend's src directory and backend's uploads directory
            allow: [
                searchForWorkspaceRoot(process.cwd()), // Allow searching workspace root
                './src', // Ensure Vite can access the src folder
                '../backend/uploads', // Ensure access to the backend uploads folder if needed
            ],
        },
    },
    plugins: [react()],
})
