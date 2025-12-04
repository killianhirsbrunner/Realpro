import React from 'react';
import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Politique de confidentialité
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 space-y-8">
          <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-6">
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Realpro SA</strong> s'engage à protéger la vie privée de ses utilisateurs
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Dernière mise à jour : 3 décembre 2025
            </p>
          </div>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Responsable du traitement
            </h3>
            <div className="text-gray-700 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-white">Realpro SA</p>
              <p>Yverdon-les-Bains</p>
              <p>Canton de Vaud, Suisse</p>
              <p className="mt-3">
                Email : <a href="mailto:privacy@realpro.ch" className="text-brand-600 dark:text-brand-400 hover:underline">privacy@realpro.ch</a>
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Cadre légal
            </h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>
                La présente politique de confidentialité est établie conformément à :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>La <strong>Loi fédérale suisse sur la protection des données (LPD, RS 235.1)</strong></li>
                <li>L'<strong>Ordonnance relative à la loi fédérale sur la protection des données (OLPD)</strong></li>
                <li>Le <strong>Règlement général sur la protection des données (RGPD)</strong> pour les clients européens</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Données collectées
            </h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3.1 Données d'identification</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Nom, prénom</li>
                  <li>Adresse email professionnelle</li>
                  <li>Numéro de téléphone (optionnel)</li>
                  <li>Raison sociale de l'entreprise</li>
                  <li>Rôle et fonction</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3.2 Données de connexion</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Adresse IP</li>
                  <li>Logs de connexion (date, heure)</li>
                  <li>Type de navigateur et appareil utilisé</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3.3 Données métiers</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Projets immobiliers créés et gérés</li>
                  <li>Documents téléversés (plans, contrats, factures)</li>
                  <li>Communications internes (messages, notifications)</li>
                  <li>Données de facturation et paiements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3.4 Données de paiement</h4>
                <p>
                  Les paiements sont traités par <strong>Datatrans SA</strong>, prestataire de services de paiement agréé en Suisse.
                </p>
                <p className="font-semibold text-gray-900 dark:text-white mt-2">
                  Realpro SA ne stocke AUCUNE donnée de carte bancaire.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Finalités du traitement
            </h3>
            <div className="text-gray-700 dark:text-gray-300">
              <p className="mb-3">Les données sont collectées pour :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fournir l'accès et l'utilisation du logiciel RealPro</li>
                <li>Gérer les comptes utilisateurs et les abonnements</li>
                <li>Traiter les paiements et générer les factures</li>
                <li>Assurer le support technique et client</li>
                <li>Améliorer les fonctionnalités du logiciel</li>
                <li>Envoyer des communications administratives et techniques</li>
                <li>Respecter les obligations légales et réglementaires</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Base légale du traitement
            </h3>
            <div className="text-gray-700 dark:text-gray-300">
              <p className="mb-3">Le traitement des données repose sur :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>L'exécution du contrat</strong> : fourniture du service SaaS</li>
                <li><strong>L'intérêt légitime</strong> : sécurité, amélioration du logiciel</li>
                <li><strong>Le consentement</strong> : communications marketing (optionnel)</li>
                <li><strong>L'obligation légale</strong> : facturation, conformité fiscale</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Partage des données
            </h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-white">
                Realpro SA ne vend JAMAIS vos données à des tiers.
              </p>
              <p>Les données peuvent être partagées uniquement avec :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Datatrans SA</strong> : traitement sécurisé des paiements
                </li>
                <li>
                  <strong>Hébergeur (Supabase / AWS)</strong> : stockage sécurisé des données
                </li>
                <li>
                  <strong>Autorités compétentes</strong> : sur réquisition judiciaire
                </li>
              </ul>
              <p className="mt-3">
                Tous les sous-traitants sont liés par des accords de confidentialité et de protection des données conformes à la LPD et au RGPD.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Sécurité des données
            </h3>
            <div className="text-gray-700 dark:text-gray-300">
              <p className="mb-3">Realpro SA met en œuvre des mesures de sécurité techniques et organisationnelles :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Chiffrement SSL/TLS pour toutes les connexions</li>
                <li>Authentification sécurisée (mots de passe hashés)</li>
                <li>Contrôle d'accès basé sur les rôles (RBAC)</li>
                <li>Sauvegardes régulières et chiffrées</li>
                <li>Hébergement dans des datacenters certifiés (ISO 27001)</li>
                <li>Surveillance et logs d'accès</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Conservation des données
            </h3>
            <div className="text-gray-700 dark:text-gray-300">
              <p className="mb-3">Les données sont conservées :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Données de compte</strong> : pendant toute la durée du contrat + 30 jours après résiliation</li>
                <li><strong>Données de facturation</strong> : 10 ans (obligation légale suisse)</li>
                <li><strong>Logs de connexion</strong> : 12 mois maximum</li>
                <li><strong>Données métiers</strong> : 30 jours après résiliation (possibilité d'export préalable)</li>
              </ul>
              <p className="mt-3 font-semibold text-gray-900 dark:text-white">
                Après ce délai, les données sont supprimées de manière irréversible.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Vos droits
            </h3>
            <div className="text-gray-700 dark:text-gray-300">
              <p className="mb-3">Conformément à la LPD et au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
                <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
                <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
                <li><strong>Droit à la portabilité</strong> : récupérer vos données dans un format structuré</li>
                <li><strong>Droit d'opposition</strong> : refuser certains traitements</li>
                <li><strong>Droit de retrait du consentement</strong> : retirer votre consentement à tout moment</li>
              </ul>
              <p className="mt-4">
                Pour exercer vos droits, contactez-nous à :{' '}
                <a href="mailto:privacy@realpro.ch" className="text-brand-600 dark:text-brand-400 hover:underline font-semibold">
                  privacy@realpro.ch
                </a>
              </p>
              <p className="mt-2 text-sm">
                Nous répondrons dans un délai de <strong>30 jours</strong> conformément à la législation suisse.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Transferts internationaux
            </h3>
            <div className="text-gray-700 dark:text-gray-300">
              <p>
                Les données sont hébergées en <strong>Europe (Suisse ou UE)</strong> conformément au RGPD.
              </p>
              <p className="mt-2">
                Aucun transfert de données hors de l'Espace Économique Européen (EEE) ou de la Suisse n'est effectué, sauf avec des garanties appropriées (clauses contractuelles types).
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              11. Cookies et technologies similaires
            </h3>
            <div className="text-gray-700 dark:text-gray-300">
              <p className="mb-3">RealPro utilise des cookies strictement nécessaires au fonctionnement du service :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Cookie de session (authentification)</li>
                <li>Cookie de préférence (thème clair/sombre, langue)</li>
              </ul>
              <p className="mt-3">
                <strong>Aucun cookie de tracking ou de publicité n'est utilisé.</strong>
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              12. Modifications de la politique
            </h3>
            <div className="text-gray-700 dark:text-gray-300">
              <p>
                Realpro SA se réserve le droit de modifier la présente politique de confidentialité à tout moment.
              </p>
              <p className="mt-2">
                En cas de modification substantielle, les utilisateurs seront informés par email ou notification dans l'application.
              </p>
              <p className="mt-2">
                La version en vigueur est toujours consultable à l'adresse : <strong>/legal/privacy</strong>
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              13. Autorité de contrôle
            </h3>
            <div className="text-gray-700 dark:text-gray-300">
              <p className="mb-2">
                En cas de litige, vous pouvez déposer une plainte auprès de :
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                Préposé fédéral à la protection des données et à la transparence (PFPDT)
              </p>
              <p className="mt-2">
                Feldeggweg 1<br />
                CH-3003 Berne<br />
                Suisse
              </p>
              <p className="mt-2">
                Site web :{' '}
                <a
                  href="https://www.edoeb.admin.ch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 dark:text-brand-400 hover:underline"
                >
                  www.edoeb.admin.ch
                </a>
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              14. Contact
            </h3>
            <div className="text-gray-700 dark:text-gray-300">
              <p>Pour toute question concernant cette politique de confidentialité :</p>
              <p className="mt-3">
                <strong>Realpro SA</strong><br />
                Délégué à la protection des données<br />
                Yverdon-les-Bains, Canton de Vaud, Suisse
              </p>
              <p className="mt-3">
                Email :{' '}
                <a href="mailto:privacy@realpro.ch" className="text-brand-600 dark:text-brand-400 hover:underline">
                  privacy@realpro.ch
                </a>
              </p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
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
                href="/legal/mentions-legales"
                className="text-brand-600 dark:text-brand-400 hover:underline"
              >
                Mentions légales
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
