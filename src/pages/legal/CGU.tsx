import React from 'react';
import { FileText } from 'lucide-react';

export default function CGU() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Conditions Générales d'Utilisation & de Service
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 space-y-8">
          <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              RealPro
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Édité par <strong>Realpro SA</strong>, société anonyme de droit suisse
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Siège : Yverdon-les-Bains (VD), Suisse
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              Dernière mise à jour : 3 décembre 2025
            </p>
          </div>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Définitions
            </h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>
                <strong>« Realpro SA »</strong> : l'éditeur du logiciel, société anonyme suisse dont le siège est à Yverdon-les-Bains, canton de Vaud.
              </p>
              <p>
                <strong>« Logiciel » ou « RealPro »</strong> : la plateforme SaaS de gestion de projets immobiliers développée et exploitée par Realpro SA.
              </p>
              <p>
                <strong>« Client »</strong> : toute entreprise, entité ou personne morale ayant souscrit un abonnement SaaS auprès de Realpro SA.
              </p>
              <p>
                <strong>« Utilisateur »</strong> : toute personne physique utilisant le logiciel sous la responsabilité du Client (promoteur, EG, architecte, courtier, notaire, acheteur, fournisseur, investisseur, etc.).
              </p>
              <p>
                <strong>« Abonnement »</strong> : la formule commerciale donnant accès au Logiciel.
              </p>
              <p>
                <strong>« Projet immobilier »</strong> : toute opération immobilière gérée à travers RealPro.
              </p>
              <p>
                <strong>« Données du Client »</strong> : informations, documents, fichiers, plans, contrats, factures, photos, données techniques et données personnelles importées dans le Logiciel.
              </p>
              <p>
                <strong>« Modules »</strong> : fonctionnalités du logiciel (ventes, CRM, notaires, CFC, budgets, EG, soumissions, adjudications, SAV, rendez-vous fournisseurs, etc.).
              </p>
              <p>
                <strong>« PSP »</strong> : fournisseur de services de paiement, tel que Datatrans utilisé pour les abonnements.
              </p>
              <p>
                <strong>« Facture QR »</strong> : facture suisse conforme au Swiss QR-bill, générée dans le Logiciel.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Objet
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Les présentes CGU régissent :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>l'accès au Logiciel RealPro,</li>
              <li>les droits et obligations des Clients et Utilisateurs,</li>
              <li>les conditions d'abonnement,</li>
              <li>la gestion des données,</li>
              <li>la propriété intellectuelle,</li>
              <li>la responsabilité et les garanties.</li>
            </ul>
            <p className="text-gray-900 dark:text-white font-semibold mt-4">
              L'utilisation du Logiciel implique l'acceptation pleine et entière des présentes CGU.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Accès au Logiciel
            </h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3.1 Conditions d'accès</h4>
                <p className="mb-2">L'accès au Logiciel nécessite :</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>un abonnement actif,</li>
                  <li>la création d'un compte utilisateur,</li>
                  <li>une connexion internet stable.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3.2 Multi-rôles</h4>
                <p className="mb-2">Les rôles sont attribués par le Client ou par le promoteur/propriétaire du projet :</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Promoteur / Développeur</li>
                  <li>Entreprise Générale (EG)</li>
                  <li>Architecte</li>
                  <li>Ingénieur / bureau technique</li>
                  <li>Notaire</li>
                  <li>Courtier</li>
                  <li>Acheteur / copropriétaire</li>
                  <li>Fournisseur (showroom)</li>
                  <li>Entreprise soumissionnaire</li>
                  <li>Investisseur</li>
                  <li>Administrateur Realpro</li>
                </ul>
                <p className="font-semibold mt-2">Chaque rôle dispose d'un niveau d'accès spécifique.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3.3 Restriction multi-projet</h4>
                <p>Un utilisateur ne voit que les projets auxquels il a été assigné.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3.4 Restrictions spécifiques</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Les acheteurs ne peuvent pas consulter les données d'autres lots.</li>
                  <li>Les entreprises soumissionnaires n'ont accès qu'à leurs propres soumissions.</li>
                  <li>Les EG ne peuvent pas consulter les données commerciales confidentielles (prix de vente PPE, acheteurs, etc.), sauf autorisation du promoteur.</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Abonnement et Paiements
            </h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4.1 Gestion via Datatrans</h4>
                <p className="mb-2">Les paiements d'abonnement sont gérés via le PSP suisse Datatrans :</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>cartes de crédit (Visa, Mastercard, AMEX),</li>
                  <li>TWINT,</li>
                  <li>PostFinance Card / E-Finance,</li>
                  <li>autres moyens de paiement supportés par Datatrans.</li>
                </ul>
                <p className="font-semibold mt-2">Realpro SA ne stocke aucune donnée de carte bancaire.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4.2 Facturation</h4>
                <p>Une facture mensuelle ou annuelle est générée à chaque renouvellement d'abonnement.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4.3 Suspension de compte</h4>
                <p className="mb-2">En cas de non-paiement :</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>accès suspendu après 14 jours,</li>
                  <li>suppression des accès utilisateurs,</li>
                  <li>réactivation dès réception du paiement.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4.4 Résiliation</h4>
                <p>Le Client peut résilier son abonnement à tout moment, mais aucun remboursement n'est dû pour la période en cours.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Modules financiers – Acomptes, Factures QR et EG
            </h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>RealPro permet :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>la génération de factures QR pour les acheteurs,</li>
                <li>le suivi des acomptes et paiements,</li>
                <li>la gestion des factures EG (sous-traitants),</li>
                <li>la ventilation des budgets CFC,</li>
                <li>l'export comptable.</li>
              </ul>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5.1 Responsabilité des montants</h4>
                <p className="mb-2">Les montants, taux TVA, dates d'échéance et références QR sont fournis par le Client.</p>
                <p className="font-semibold">Realpro SA n'est pas responsable :</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>d'erreurs de montant,</li>
                  <li>d'erreurs dans les données bancaires,</li>
                  <li>des délais de paiement des acheteurs.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5.2 Transmission aux acheteurs</h4>
                <p className="mb-2">Les factures QR peuvent être :</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>téléchargées par l'acheteur,</li>
                  <li>envoyées directement par le promoteur depuis le Logiciel.</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Propriété intellectuelle
            </h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">10.1 Logiciel</h4>
                <p className="mb-2">Le Logiciel RealPro est la propriété exclusive de :</p>
                <p className="font-bold text-gray-900 dark:text-white">
                  Realpro SA<br />
                  Yverdon-les-Bains<br />
                  Vaud, Suisse
                </p>
                <p className="mt-2">Protection basée sur :</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>la Loi fédérale sur le droit d'auteur (LDA),</li>
                  <li>le Code des obligations suisse (CO),</li>
                  <li>les traités internationaux applicables.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">10.2 Interdictions</h4>
                <p className="mb-2">Il est strictement interdit de :</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>copier, modifier, décompiler ou reproduire le logiciel,</li>
                  <li>réutiliser les éléments graphiques ou codes sources,</li>
                  <li>revendre ou redistribuer le logiciel,</li>
                  <li>utiliser la marque Realpro sans autorisation.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">10.3 Marques</h4>
                <p className="mb-2">Les dénominations :</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Realpro,</li>
                  <li>Realpro SA,</li>
                  <li>RealPro,</li>
                  <li>les logos associés</li>
                </ul>
                <p className="font-semibold mt-2">sont des marques protégées.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              12. Responsabilité
            </h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>Realpro SA n'assume aucune responsabilité pour :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>les erreurs de saisie du Client,</li>
                <li>les montants incorrects dans les factures QR,</li>
                <li>les documents téléchargés par les utilisateurs,</li>
                <li>les décisions d'adjudication, ventes ou réservations,</li>
                <li>les retards de paiement des acheteurs,</li>
                <li>la conformité juridique des contrats importés.</li>
              </ul>
              <p className="font-semibold text-gray-900 dark:text-white mt-4">
                Responsabilité maximale : montant annuel de l'abonnement payé.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              15. Droit applicable et Juridiction
            </h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>Les présentes CGU sont régies par <strong className="text-gray-900 dark:text-white">le droit suisse</strong>.</p>
              <p>En cas de litige :</p>
              <p className="font-bold text-gray-900 dark:text-white">
                Tribunaux ordinaires du district du Jura-Nord vaudois (Yverdon-les-Bains),<br />
                sous réserve d'un recours au Tribunal fédéral.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              16. Acceptation
            </h3>
            <p className="text-gray-900 dark:text-white font-semibold">
              En utilisant RealPro, le Client et les Utilisateurs déclarent accepter sans réserve les présentes CGU.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              <a
                href="/legal/cgv"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Conditions Générales de Vente
              </a>
              {' · '}
              <a
                href="/legal/mentions-legales"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Mentions légales
              </a>
              {' · '}
              <a
                href="/legal/privacy"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Politique de confidentialité
              </a>
            </p>
            <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-4">
              © 2025 Realpro SA, Yverdon-les-Bains (VD), Suisse. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
