
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import i18n from '@/lib/i18n';
import { clearAllCaches } from '@/utils/productionCleanup';

// Clear stale caches on app start
const CACHE_VERSION = 'v2';
const lastCacheVersion = localStorage.getItem('cache_version');
if (lastCacheVersion !== CACHE_VERSION) {
  clearAllCaches().then(() => {
    localStorage.setItem('cache_version', CACHE_VERSION);
  });
}

// Register service worker only in production; unregister in dev to avoid HMR issues
if ('serviceWorker' in navigator) {
  if (import.meta.env && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  } else {
    // In development, ensure no SW controls the page (prevents Vite HMR token errors)
    navigator.serviceWorker.getRegistrations()
      .then((regs) => regs.forEach((r) => r.unregister()))
      .catch((e) => console.log('SW unregister failed:', e));
  }
}

// Initialize document language and direction based on i18n
const setDocLangDir = (lng: string) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
};
setDocLangDir(i18n.language);
i18n.on('languageChanged', setDocLangDir);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
