import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, searchForWorkspaceRoot } from 'vite'

export default defineConfig(({ mode }) => {
    // Load environment variables
    const env = loadEnv(mode, process.cwd())

    return {
        server: {
            proxy: {
                '/api': {
                    target: env.VITE_SERVER_URL,
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
        plugins: [react(), tailwindcss()],
    }
})
