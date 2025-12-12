import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function CGV() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Conditions Générales de Vente
          </h1>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8 space-y-8">
          <div className="text-center border-b border-neutral-200 dark:border-neutral-700 pb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              RealPro
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Édité par <strong>Realpro SA</strong>, société anonyme de droit suisse
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              Siège : Yverdon-les-Bains (VD), Suisse
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-4">
              Dernière mise à jour : 3 décembre 2025 · Version 1.0
            </p>
          </div>

          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              2. Objet
            </h3>
            <div className="space-y-3 text-neutral-700 dark:text-neutral-300">
              <p>Les présentes Conditions Générales de Vente (CGV) encadrent :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>la souscription et le renouvellement des abonnements,</li>
                <li>les modalités de paiement via Datatrans,</li>
                <li>les obligations contractuelles entre Realpro SA et le Client,</li>
                <li>les limitations de responsabilité commerciale,</li>
                <li>les règles de facturation et de résiliation.</li>
              </ul>
              <p className="font-semibold text-neutral-900 dark:text-white mt-4">
                Les présentes CGV complètent les{' '}
                <a href="/legal/cgu" className="text-brand-600 dark:text-brand-400 hover:underline">
                  CGU (Conditions Générales d'Utilisation)
                </a>{' '}
                qui régissent l'usage du Logiciel.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              3. Offres et Tarifs
            </h3>
            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
              <p>Realpro SA propose plusieurs formules d'abonnement :</p>

              <div className="grid gap-4">
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Basic</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                    <li>Petits promoteurs et indépendants</li>
                    <li>Nombre limité de projets actifs</li>
                    <li>Fonctionnalités essentielles</li>
                    <li>Support standard par email</li>
                  </ul>
                </div>

                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Professional</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                    <li>Promoteurs standards et moyennes entreprises</li>
                    <li>Projets actifs illimités</li>
                    <li>Fonctionnalités étendues (CRM, notaires, EG, courtiers)</li>
                    <li>Support prioritaire</li>
                  </ul>
                </div>

                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Enterprise</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                    <li>Grandes sociétés et groupes immobiliers</li>
                    <li>Tous les modules avancés inclus</li>
                    <li>Multi-organisations</li>
                    <li>SLA renforcé avec support dédié</li>
                  </ul>
                </div>

                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Custom</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                    <li>Fonctionnalités sur-mesure</li>
                    <li>Intégrations API personnalisées</li>
                    <li>Formation et accompagnement</li>
                    <li>Hébergement dédié (option)</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-lg">
                <p className="text-sm">
                  <strong>Tous les prix sont affichés en CHF hors TVA.</strong> La TVA suisse (8,1%) sera ajoutée selon le taux en vigueur.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">3.3 Périodicité</h4>
                <p>Les abonnements peuvent être souscrits :</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li><strong>Mensuellement</strong> : renouvellement automatique chaque mois</li>
                  <li><strong>Annuellement</strong> : renouvellement automatique chaque année, avec tarif préférentiel (équivalent à 10 mois)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">3.4 Évolution des prix</h4>
                <p>
                  Realpro SA se réserve le droit de modifier ses tarifs. En cas d'augmentation, le Client sera informé <strong>30 jours avant</strong> l'application du nouveau tarif et pourra résilier sans frais si le nouveau tarif ne lui convient pas.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              4. Souscription et Période d'essai
            </h3>
            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Période d'essai gratuite</h4>
                <p>
                  Selon la formule choisie, une <strong>période d'essai gratuite de 14 jours</strong> peut être proposée.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Aucune obligation de paiement pendant la période d'essai</li>
                  <li>Accès complet aux fonctionnalités de la formule choisie</li>
                  <li>Résiliation possible à tout moment sans justification</li>
                  <li>Si non résiliée, la souscription payante débute automatiquement</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              5. Paiement
            </h3>
            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">5.1 Prestataire de paiement</h4>
                <p>Tous les paiements sont gérés par :</p>
                <p className="font-semibold text-neutral-900 dark:text-white mt-2">Datatrans AG</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Prestataire de services de paiement suisse agréé</li>
                  <li>Certifié PCI-DSS niveau 1 (norme de sécurité bancaire)</li>
                </ul>
                <p className="font-semibold text-neutral-900 dark:text-white mt-3">
                  Realpro SA ne stocke AUCUNE donnée de carte bancaire.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">5.2 Moyens de paiement acceptés</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Cartes de crédit</strong> : Visa, Mastercard, American Express</li>
                  <li><strong>PostFinance Card</strong> et PostFinance E-Finance</li>
                  <li><strong>TWINT</strong></li>
                  <li><strong>Prélèvement automatique (LSV/DD)</strong> : sur demande pour les abonnements Enterprise</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">5.4 Renouvellement automatique</h4>
                <p>
                  Les abonnements se renouvellent automatiquement à chaque échéance. Le Client autorise Realpro SA à débiter le montant de l'abonnement le même jour chaque mois (mensuel) ou à la date anniversaire (annuel).
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">5.5 Échec de paiement</h4>
                <div className="space-y-2">
                  <p><strong>Jour 0 :</strong> Échec du prélèvement → notification au Client</p>
                  <p><strong>Jour 3 :</strong> Nouvelle tentative de prélèvement</p>
                  <p><strong>Jour 7 :</strong> Deuxième tentative</p>
                  <p><strong>Jour 14 :</strong> Suspension de l'accès au Logiciel</p>
                  <p><strong>Jour 30 :</strong> Résiliation définitive et suppression programmée des données</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              8. Résiliation
            </h3>
            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">8.1 Résiliation par le Client</h4>
                <p>Le Client peut résilier son abonnement <strong>à tout moment</strong> et <strong>sans justification</strong>.</p>

                <div className="mt-3 space-y-2">
                  <p><strong>Abonnement mensuel :</strong></p>
                  <ul className="list-disc list-inside ml-4">
                    <li>Résiliation effective à la fin du mois en cours</li>
                    <li>Aucun remboursement pour le mois entamé</li>
                  </ul>

                  <p className="mt-2"><strong>Abonnement annuel :</strong></p>
                  <ul className="list-disc list-inside ml-4">
                    <li>Résiliation effective à la date anniversaire</li>
                    <li>Notification au moins 30 jours avant la date anniversaire</li>
                    <li>Aucun remboursement pour la période restante (sauf exceptions légales)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">8.2 Procédure de résiliation</h4>
                <p>La résiliation s'effectue :</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Via l'<strong>espace Client</strong> (bouton « Résilier mon abonnement »), ou</li>
                  <li>Par <strong>email</strong> à : <a href="mailto:contact@realpro.ch" className="text-brand-600 dark:text-brand-400 hover:underline">contact@realpro.ch</a></li>
                </ul>
                <p className="mt-2">Un email de confirmation sera envoyé sous 48 heures.</p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">8.4 Conséquences de la résiliation</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Accès au Logiciel suspendu immédiatement</li>
                  <li>Données conservées 30 jours (possibilité d'export par le Client)</li>
                  <li>Suppression définitive après 30 jours (irréversible)</li>
                  <li>Aucun remboursement pour la période en cours</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              9. Support et Assistance
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-neutral-200 dark:border-neutral-700">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-700">
                    <th className="border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-left text-neutral-900 dark:text-white">Formule</th>
                    <th className="border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-left text-neutral-900 dark:text-white">Canal</th>
                    <th className="border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-left text-neutral-900 dark:text-white">Délai de réponse</th>
                    <th className="border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-left text-neutral-900 dark:text-white">Disponibilité</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-700 dark:text-neutral-300">
                  <tr>
                    <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2 font-semibold">Basic</td>
                    <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2">Email / Ticket</td>
                    <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2">48h ouvrées</td>
                    <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2">Jours ouvrés</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2 font-semibold">Professional</td>
                    <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2">Email / Ticket / Chat</td>
                    <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2">24h ouvrées</td>
                    <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2">Jours ouvrés</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2 font-semibold">Enterprise</td>
                    <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2">Email / Ticket / Chat / Téléphone</td>
                    <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2">4h ouvrées</td>
                    <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2">8h-18h + Astreinte</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2 font-semibold">Custom</td>
                    <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2">Dédié + SLA personnalisé</td>
                    <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2">Selon contrat</td>
                    <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2">Selon contrat</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm mt-3 text-neutral-600 dark:text-neutral-400">
              Langues supportées : Français, Allemand, Italien, Anglais
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              10. Garanties et Responsabilités
            </h3>
            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Garanties</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Disponibilité du service : 99,5% (hors maintenance programmée)</li>
                  <li>Sauvegardes quotidiennes automatiques</li>
                  <li>Sécurité des données selon standards ISO 27001</li>
                  <li>Conformité LPD et RGPD</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Limitation de responsabilité</h4>
                <p className="font-semibold text-neutral-900 dark:text-white">
                  Responsabilité maximale : montant total versé au cours des 12 derniers mois.
                </p>
                <p className="mt-2">Realpro SA n'est pas responsable de :</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Pertes de profits ou de chiffre d'affaires</li>
                  <li>Erreurs de saisie du Client</li>
                  <li>Décisions commerciales prises sur base des données</li>
                  <li>Interruptions dues à des tiers (hébergeur, FAI, etc.)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              14. Droit applicable et Juridiction
            </h3>
            <div className="space-y-3 text-neutral-700 dark:text-neutral-300">
              <p>Les présentes CGV sont régies par le <strong className="text-neutral-900 dark:text-white">droit suisse</strong>.</p>
              <p>En cas de litige :</p>
              <p className="font-bold text-neutral-900 dark:text-white">
                Tribunaux ordinaires du district du Jura-Nord vaudois (Yverdon-les-Bains),<br />
                Canton de Vaud, Suisse
              </p>
              <p className="text-sm">Sous réserve d'un recours au Tribunal fédéral selon le droit suisse.</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              15. Contact
            </h3>
            <div className="text-neutral-700 dark:text-neutral-300 space-y-2">
              <p><strong>Email commercial :</strong> <a href="mailto:contact@realpro.ch" className="text-brand-600 dark:text-brand-400 hover:underline">contact@realpro.ch</a></p>
              <p><strong>Email facturation :</strong> <a href="mailto:billing@realpro.ch" className="text-brand-600 dark:text-brand-400 hover:underline">billing@realpro.ch</a></p>
              <p><strong>Email juridique :</strong> <a href="mailto:legal@realpro.ch" className="text-brand-600 dark:text-brand-400 hover:underline">legal@realpro.ch</a></p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              16. Acceptation
            </h3>
            <p className="text-neutral-900 dark:text-white font-semibold">
              En souscrivant un abonnement à RealPro, le Client déclare avoir lu, compris et accepté sans réserve les présentes Conditions Générales de Vente ainsi que les Conditions Générales d'Utilisation.
            </p>
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
                href="/legal/mentions-legales"
                className="text-brand-600 dark:text-brand-400 hover:underline"
              >
                Mentions légales
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
