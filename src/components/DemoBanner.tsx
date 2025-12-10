import { useState } from 'react';
import { Sparkles, X, ChevronRight, Rocket } from 'lucide-react';
import { useIsDemoMode } from '../hooks/useDemoMode';
import { Link } from 'react-router-dom';

export function DemoBanner() {
  const isDemoMode = useIsDemoMode();
  const [isDismissed, setIsDismissed] = useState(false);

  // Ne rien afficher si pas en mode démo ou si le banner est fermé
  if (!isDemoMode || isDismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white px-4 py-2.5 relative overflow-hidden">
      {/* Effet de brillance animé */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Mode Démo</span>
          </div>
          <span className="text-sm font-medium hidden sm:inline">
            Explorez toutes les fonctionnalités de RealPro sans engagement
          </span>
          <span className="text-sm font-medium sm:hidden">
            Accès complet gratuit
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Lien vers la création de projet */}
          <Link
            to="/projects/new"
            className="group flex items-center gap-1.5 bg-white text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
          >
            <Rocket className="w-4 h-4" />
            <span className="hidden sm:inline">Créer un projet</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Bouton de fermeture */}
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Fermer le banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant badge démo plus petit pour les endroits où un banner complet serait trop
export function DemoBadge() {
  const isDemoMode = useIsDemoMode();

  if (!isDemoMode) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full text-xs font-semibold">
      <Sparkles className="w-3 h-3" />
      <span>Démo</span>
    </div>
  );
}
