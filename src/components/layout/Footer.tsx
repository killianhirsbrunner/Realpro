import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
            <Link
              to="/legal/cgu"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Conditions Générales
            </Link>
            <Link
              to="/legal/mentions-legales"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              to="/legal/privacy"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Confidentialité
            </Link>
            <a
              href="mailto:contact@realpro.ch"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Contact
            </a>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-500 text-center md:text-right">
            <p className="font-medium">
              © {currentYear} Realpro SA, Yverdon-les-Bains (VD), Suisse
            </p>
            <p className="mt-1">
              Tous droits réservés · Realpro Suite v1.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
