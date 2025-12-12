import React from 'react';
import { Building2 } from 'lucide-react';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Mentions légales
          </h1>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              Éditeur du logiciel et du site
            </h3>
            <div className="space-y-2 text-neutral-700 dark:text-neutral-300">
              <p className="font-semibold text-neutral-900 dark:text-white">Realpro SA</p>
              <p>Société anonyme de droit suisse</p>
              <p>Siège social : Yverdon-les-Bains</p>
              <p>Canton de Vaud, Suisse</p>
              <p className="mt-4">
                <span className="font-semibold">Email :</span>{' '}
                <a href="mailto:contact@realpro.ch" className="text-brand-600 dark:text-brand-400 hover:underline">
                  contact@realpro.ch
                </a>
              </p>
              <p>
                <span className="font-semibold">Site web :</span>{' '}
                <a href="https://www.realpro.ch" className="text-brand-600 dark:text-brand-400 hover:underline" target="_blank" rel="noopener noreferrer">
                  www.realpro.ch
                </a>
              </p>
              <p className="mt-4">
                <span className="font-semibold">Numéro IDE :</span> CHE-XXX.XXX.XXX
                <span className="text-sm text-neutral-500 ml-2">(à compléter)</span>
              </p>
              <p>
                <span className="font-semibold">Numéro TVA :</span> CHE-XXX.XXX.XXX TVA
                <span className="text-sm text-neutral-500 ml-2">(à compléter)</span>
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              Directeur de la publication
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              [Nom du fondateur / administrateur]
              <span className="text-sm text-neutral-500 ml-2">(à compléter)</span>
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              Hébergement
            </h3>
            <div className="text-neutral-700 dark:text-neutral-300">
              <p>Le logiciel et les données sont hébergés par :</p>
              <p className="mt-2 font-semibold">Supabase Inc.</p>
              <p>Hébergement : Europe (conforme RGPD)</p>
              <p className="mt-2">
                Infrastructure serveur : AWS / Google Cloud Platform
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              Propriété intellectuelle
            </h3>
            <div className="space-y-3 text-neutral-700 dark:text-neutral-300">
              <p>
                Le logiciel <strong>RealPro</strong> et l'ensemble de ses composants sont la propriété exclusive de <strong>Realpro SA</strong>, sous réserve des composants open source utilisés conformément à leurs licences respectives.
              </p>
              <p>
                Toute reproduction, distribution, modification, ou exploitation non autorisée du logiciel ou de sa documentation est interdite sans l'autorisation écrite préalable de Realpro SA.
              </p>
              <p className="font-semibold text-neutral-900 dark:text-white">
                Le logiciel est protégé par :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>La Loi fédérale suisse sur le droit d'auteur (LDA, RS 231.1)</li>
                <li>Le Code des obligations suisse (CO, RS 220)</li>
                <li>Les traités internationaux applicables en matière de propriété intellectuelle</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              Marques
            </h3>
            <div className="text-neutral-700 dark:text-neutral-300">
              <p className="mb-2">Les marques et logos suivants sont protégés :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Realpro</strong></li>
                <li><strong>Realpro SA</strong></li>
                <li><strong>RealPro</strong></li>
                <li>Logos et éléments graphiques associés</li>
              </ul>
              <p className="mt-3 font-semibold text-neutral-900 dark:text-white">
                Toute utilisation sans autorisation écrite est interdite.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              Protection des données
            </h3>
            <div className="space-y-3 text-neutral-700 dark:text-neutral-300">
              <p>
                Realpro SA respecte la <strong>Loi fédérale sur la protection des données (LPD)</strong> ainsi que le <strong>Règlement général sur la protection des données (RGPD)</strong> pour les clients européens.
              </p>
              <p>
                Pour plus d'informations, consultez notre{' '}
                <a
                  href="/legal/privacy"
                  className="text-brand-600 dark:text-brand-400 hover:underline font-semibold"
                >
                  Politique de confidentialité
                </a>.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              Juridiction compétente
            </h3>
            <div className="text-neutral-700 dark:text-neutral-300">
              <p className="mb-2">
                En cas de litige relatif à l'utilisation du logiciel ou du site web, les parties conviennent de la compétence exclusive des :
              </p>
              <p className="font-semibold text-neutral-900 dark:text-white">
                Tribunaux ordinaires du district du Jura-Nord vaudois (Yverdon-les-Bains)
              </p>
              <p className="mt-2">
                Canton de Vaud, Suisse
              </p>
              <p className="mt-2 text-sm">
                Sous réserve d'un recours au Tribunal fédéral selon le droit suisse.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              Contact
            </h3>
            <div className="text-neutral-700 dark:text-neutral-300">
              <p>Pour toute question concernant ces mentions légales :</p>
              <p className="mt-3">
                <strong>Email :</strong>{' '}
                <a href="mailto:legal@realpro.ch" className="text-brand-600 dark:text-brand-400 hover:underline">
                  legal@realpro.ch
                </a>
              </p>
              <p>
                <strong>Adresse postale :</strong><br />
                Realpro SA<br />
                Yverdon-les-Bains<br />
                Canton de Vaud<br />
                Suisse
              </p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700">
            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              <a
                href="/legal/cgu"
                className="text-brand-600 dark:text-brand-400 hover:underline"
              >
                Conditions Générales d'Utilisation
              </a>
              {' · '}
              <a
                href="/legal/cgv"
                className="text-brand-600 dark:text-brand-400 hover:underline"
              >
                Conditions Générales de Vente
              </a>
              {' · '}
              <a
                href="/legal/privacy"
                className="text-brand-600 dark:text-brand-400 hover:underline"
              >
                Politique de confidentialité
              </a>
            </p>
            <p className="text-center text-xs text-neutral-500 dark:text-neutral-500 mt-4">
              © 2025 Realpro SA, Yverdon-les-Bains (VD), Suisse. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
