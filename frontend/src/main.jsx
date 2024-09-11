import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './assets/styles/index.css'

// Create the root element and render the application
createRoot(document.getElementById('root')).render(
    // <StrictMode>
        <App />
    // </StrictMode>
)
