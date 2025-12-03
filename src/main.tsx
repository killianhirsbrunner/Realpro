import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/i18n/config';

const savedLang = localStorage.getItem('preferredLanguage');
if (savedLang) {
  import('./lib/i18n/config').then(({ default: i18n }) => {
    i18n.changeLanguage(savedLang);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
