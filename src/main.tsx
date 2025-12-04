/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RealPro – Plateforme SaaS de Gestion de Projets Immobiliers
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * © 2024-2025 Realpro SA. Tous droits réservés.
 *
 * Ce fichier fait partie du logiciel propriétaire RealPro.
 * L'utilisation, la copie, la modification et la distribution de ce fichier
 * sont soumises à l'autorisation écrite préalable de Realpro SA.
 *
 * Contact : contact@realpro.ch | https://www.realpro.ch
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

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
