import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from './context/ToastContext';
import { registerServiceWorker } from './serviceWorker';
import './index.css';
import App from './App.jsx';

// Enregistrer le Service Worker
registerServiceWorker();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HelmetProvider>
            <ToastProvider>
                <App />
            </ToastProvider>
        </HelmetProvider>
    </StrictMode>,
);