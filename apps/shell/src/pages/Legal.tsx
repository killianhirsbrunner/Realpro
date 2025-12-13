import { Link, useParams, Navigate } from 'react-router-dom';
import { Shield, FileText, Scale, Cookie, AlertCircle } from 'lucide-react';

// Legal pages content
const legalPages = {
  'terms': {
    title: 'Conditions Générales d\'Utilisation',
    subtitle: 'CGU de Realpro Suite',
    icon: Scale,
    lastUpdate: '1er décembre 2024',
    sections: [
      {
        title: '1. Objet',
        content: `Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'utilisation de la plateforme Realpro Suite (ci-après "la Plateforme") éditée par Realpro SA, société anonyme de droit suisse dont le siège est à Genève.

En accédant à la Plateforme ou en utilisant nos services, vous acceptez d'être lié par les présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser la Plateforme.`,
      },
      {
        title: '2. Description des services',
        content: `Realpro Suite propose trois applications de gestion immobilière :
• PPE Admin : gestion de copropriétés et syndic
• Promoteur : gestion de projets de promotion immobilière
• Régie : gérance immobilière et locative

Les fonctionnalités disponibles varient selon le plan souscrit (Starter, Pro, Enterprise). Les détails des fonctionnalités sont disponibles sur notre page Tarifs.`,
      },
      {
        title: '3. Création de compte',
        content: `Pour utiliser la Plateforme, vous devez créer un compte utilisateur. Vous vous engagez à :
• Fournir des informations exactes et à jour
• Maintenir la confidentialité de vos identifiants
• Notifier immédiatement tout accès non autorisé
• Ne pas partager votre compte avec des tiers

Vous êtes seul responsable de toutes les activités effectuées sous votre compte.`,
      },
      {
        title: '4. Utilisation acceptable',
        content: `Vous vous engagez à utiliser la Plateforme conformément aux lois applicables et aux présentes CGU. Il est notamment interdit de :
• Utiliser la Plateforme à des fins illégales
• Transmettre des données malveillantes (virus, malware)
• Tenter d'accéder sans autorisation à d'autres comptes
• Surcharger intentionnellement nos serveurs
• Copier, modifier ou distribuer le contenu de la Plateforme
• Utiliser des robots ou systèmes automatisés non autorisés`,
      },
      {
        title: '5. Propriété intellectuelle',
        content: `Tous les éléments de la Plateforme (logiciels, interfaces, textes, graphiques, logos) sont la propriété exclusive de Realpro SA ou de ses partenaires. Toute reproduction, représentation ou exploitation non autorisée est interdite.

Vous conservez la propriété de vos données. En utilisant la Plateforme, vous accordez à Realpro SA une licence limitée pour traiter vos données dans le cadre de la fourniture des services.`,
      },
      {
        title: '6. Abonnement et paiement',
        content: `Les tarifs des abonnements sont indiqués sur notre site en CHF hors taxes. La TVA suisse s'applique selon les taux en vigueur.

Les abonnements sont renouvelés automatiquement. Vous pouvez résilier à tout moment depuis votre compte, la résiliation prenant effet à la fin de la période en cours.

En cas de non-paiement, Realpro SA se réserve le droit de suspendre l'accès aux services après mise en demeure.`,
      },
      {
        title: '7. Protection des données',
        content: `Le traitement de vos données personnelles est régi par notre Politique de Confidentialité. En utilisant la Plateforme, vous consentez au traitement de vos données conformément à cette politique.

Pour les données de vos clients (locataires, copropriétaires, acquéreurs), vous agissez en qualité de responsable de traitement et Realpro SA en qualité de sous-traitant. Un Accord de Traitement des Données (DPA) est disponible sur demande.`,
      },
      {
        title: '8. Disponibilité et maintenance',
        content: `Realpro SA s'efforce d'assurer une disponibilité de 99.9% de la Plateforme. Des interruptions peuvent survenir pour maintenance, avec notification préalable dans la mesure du possible.

Realpro SA ne garantit pas un fonctionnement exempt de toute erreur et ne saurait être tenue responsable des conséquences d'une indisponibilité temporaire.`,
      },
      {
        title: '9. Limitation de responsabilité',
        content: `Dans les limites permises par la loi suisse, la responsabilité de Realpro SA est limitée au montant des sommes versées par l'utilisateur au cours des 12 derniers mois.

Realpro SA ne saurait être tenue responsable des dommages indirects, pertes de données, manque à gagner ou préjudices consécutifs à l'utilisation de la Plateforme.`,
      },
      {
        title: '10. Modification des CGU',
        content: `Realpro SA se réserve le droit de modifier les présentes CGU. Les utilisateurs seront informés par email ou notification dans l'application. L'utilisation continue de la Plateforme après modification vaut acceptation des nouvelles CGU.`,
      },
      {
        title: '11. Résiliation',
        content: `Realpro SA peut suspendre ou résilier votre accès en cas de violation des présentes CGU. En cas de résiliation, vos données restent accessibles en lecture pendant 30 jours, puis sont supprimées définitivement.`,
      },
      {
        title: '12. Droit applicable et juridiction',
        content: `Les présentes CGU sont régies par le droit suisse. Tout litige relatif à l'interprétation ou l'exécution des présentes sera soumis aux tribunaux compétents du canton de Genève, sous réserve d'un recours au Tribunal fédéral.`,
      },
    ],
  },
  'privacy': {
    title: 'Politique de Confidentialité',
    subtitle: 'Protection de vos données personnelles',
    icon: Shield,
    lastUpdate: '1er décembre 2024',
    sections: [
      {
        title: '1. Introduction',
        content: `Realpro SA ("nous", "notre", "nos") s'engage à protéger la confidentialité et la sécurité de vos données personnelles. Cette Politique de Confidentialité décrit comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez Realpro Suite.

Cette politique est conforme à la Loi fédérale sur la Protection des Données (LPD) suisse et au Règlement Général sur la Protection des Données (RGPD) européen.`,
      },
      {
        title: '2. Responsable du traitement',
        content: `Realpro SA
Rue du Marché 12
1003 Lausanne
Suisse

Email : privacy@realpro.ch
Téléphone : +41 21 123 45 67`,
      },
      {
        title: '3. Données collectées',
        content: `Nous collectons les catégories de données suivantes :

**Données d'identification** : nom, prénom, adresse email, numéro de téléphone, adresse postale, entreprise.

**Données de connexion** : adresse IP, type de navigateur, pages visitées, horodatages.

**Données métier** : selon l'application utilisée, les données relatives à vos immeubles, copropriétaires, locataires, projets, etc. Ces données sont traitées en votre qualité de responsable de traitement.

**Données de paiement** : les paiements sont traités par notre prestataire Stripe. Nous ne stockons pas vos numéros de carte.`,
      },
      {
        title: '4. Finalités du traitement',
        content: `Vos données sont traitées pour les finalités suivantes :
• Fourniture et amélioration de nos services
• Gestion de votre compte utilisateur
• Facturation et paiements
• Support client
• Envoi de communications relatives à votre compte
• Analyse et amélioration de nos services (données anonymisées)
• Respect de nos obligations légales`,
      },
      {
        title: '5. Base légale',
        content: `Nos traitements sont fondés sur :
• L'exécution du contrat (fourniture des services)
• Votre consentement (communications marketing)
• Nos intérêts légitimes (amélioration des services, sécurité)
• Nos obligations légales (facturation, comptabilité)`,
      },
      {
        title: '6. Partage des données',
        content: `Vos données peuvent être partagées avec :
• Nos sous-traitants techniques (hébergement, paiement, email) sous contrat de confidentialité
• Les autorités compétentes sur requête légale

Nous ne vendons jamais vos données à des tiers. Nos sous-traitants sont tous situés en Suisse ou dans l'UE/EEE avec garanties appropriées.`,
      },
      {
        title: '7. Hébergement et sécurité',
        content: `Toutes les données sont hébergées en Suisse, dans des datacenters certifiés ISO 27001.

Mesures de sécurité appliquées :
• Chiffrement SSL/TLS pour les transmissions
• Chiffrement AES-256 pour les données au repos
• Authentification forte (2FA disponible)
• Audits de sécurité réguliers
• Sauvegardes quotidiennes redondantes
• Journalisation des accès`,
      },
      {
        title: '8. Conservation des données',
        content: `Vos données sont conservées pendant :
• Données de compte : durée de la relation contractuelle + 1 an
• Données de facturation : 10 ans (obligation légale suisse)
• Logs de connexion : 12 mois
• Données métier : durée de l'abonnement + 30 jours

Après résiliation, vos données sont exportables pendant 30 jours puis supprimées définitivement.`,
      },
      {
        title: '9. Vos droits',
        content: `Conformément à la LPD et au RGPD, vous disposez des droits suivants :
• **Droit d'accès** : obtenir une copie de vos données
• **Droit de rectification** : corriger des données inexactes
• **Droit d'effacement** : demander la suppression de vos données
• **Droit à la portabilité** : recevoir vos données dans un format standard
• **Droit d'opposition** : vous opposer à certains traitements
• **Droit de retirer votre consentement** à tout moment

Pour exercer vos droits : privacy@realpro.ch`,
      },
      {
        title: '10. Cookies',
        content: `Notre site utilise des cookies pour :
• Assurer le fonctionnement technique (cookies essentiels)
• Mémoriser vos préférences (cookies fonctionnels)
• Analyser l'utilisation du site (cookies analytiques)

Vous pouvez gérer vos préférences cookies depuis notre bandeau de consentement. Pour plus de détails, consultez notre Politique Cookies.`,
      },
      {
        title: '11. Modifications',
        content: `Cette politique peut être mise à jour. En cas de modification substantielle, nous vous informerons par email. La date de dernière mise à jour figure en haut de ce document.`,
      },
      {
        title: '12. Contact',
        content: `Pour toute question relative à cette politique ou à vos données personnelles :

Email : privacy@realpro.ch
Courrier : Realpro SA - Protection des données - Rue du Marché 12, 1003 Lausanne

Vous avez également le droit d'introduire une réclamation auprès du Préposé fédéral à la protection des données et à la transparence (PFPDT).`,
      },
    ],
  },
  'cookies': {
    title: 'Politique Cookies',
    subtitle: 'Utilisation des cookies sur notre site',
    icon: Cookie,
    lastUpdate: '1er décembre 2024',
    sections: [
      {
        title: '1. Qu\'est-ce qu\'un cookie ?',
        content: `Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, tablette, smartphone) lors de votre visite sur notre site. Les cookies permettent au site de mémoriser vos actions et préférences pendant une certaine durée.`,
      },
      {
        title: '2. Types de cookies utilisés',
        content: `**Cookies essentiels (obligatoires)**
Ces cookies sont nécessaires au fonctionnement du site. Ils permettent l'authentification, la sécurité et la mémorisation de vos choix de cookies. Durée : session.

**Cookies fonctionnels**
Ces cookies mémorisent vos préférences (langue, région) pour améliorer votre expérience. Durée : 1 an.

**Cookies analytiques**
Nous utilisons des outils d'analyse (anonymisés) pour comprendre comment notre site est utilisé et l'améliorer. Durée : 13 mois.`,
      },
      {
        title: '3. Cookies tiers',
        content: `Certains cookies sont déposés par des services tiers :
• **Analyse** : nous utilisons un outil d'analyse respectueux de la vie privée, hébergé en Suisse
• **Chat support** : cookies de notre solution de chat pour le support client
• **Vidéos** : si vous visualisez des vidéos intégrées (YouTube), des cookies peuvent être déposés`,
      },
      {
        title: '4. Gestion des cookies',
        content: `Lors de votre première visite, un bandeau vous permet de choisir les cookies que vous acceptez. Vous pouvez modifier vos préférences à tout moment en cliquant sur "Paramètres cookies" en bas de page.

Vous pouvez également configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités du site pourraient ne pas fonctionner correctement.`,
      },
      {
        title: '5. Contact',
        content: `Pour toute question sur notre utilisation des cookies : privacy@realpro.ch`,
      },
    ],
  },
  'legal-notice': {
    title: 'Mentions Légales',
    subtitle: 'Informations légales',
    icon: FileText,
    lastUpdate: '1er décembre 2024',
    sections: [
      {
        title: 'Éditeur du site',
        content: `Realpro SA
Société anonyme de droit suisse
Capital social : CHF 100'000.-

Siège social :
Rue du Marché 12
1003 Lausanne
Suisse

IDE : CHE-123.456.789
Registre du Commerce du Canton de Vaud`,
      },
      {
        title: 'Direction',
        content: `Directeur de la publication : Thomas Weber, CEO
Contact : contact@realpro.ch
Téléphone : +41 21 123 45 67`,
      },
      {
        title: 'Hébergement',
        content: `Le site est hébergé par :
Infomaniak Network SA
Rue Eugène-Marziano 25
1227 Les Acacias - Genève
Suisse`,
      },
      {
        title: 'Propriété intellectuelle',
        content: `L'ensemble du contenu de ce site (textes, images, logos, icônes, logiciels) est la propriété exclusive de Realpro SA ou de ses partenaires et est protégé par les lois suisses et internationales relatives à la propriété intellectuelle.

Toute reproduction, représentation, modification ou adaptation, totale ou partielle, du site ou de son contenu, par quelque procédé que ce soit, est interdite sans l'autorisation préalable écrite de Realpro SA.`,
      },
      {
        title: 'Crédits',
        content: `Design et développement : Realpro SA
Icônes : Lucide Icons (licence MIT)
Photos : Unsplash (licence Unsplash)`,
      },
    ],
  },
};

// Navigation for legal pages
const legalNav = [
  { id: 'terms', label: 'CGU', icon: Scale },
  { id: 'privacy', label: 'Confidentialité', icon: Shield },
  { id: 'cookies', label: 'Cookies', icon: Cookie },
  { id: 'legal-notice', label: 'Mentions légales', icon: FileText },
];

export function LegalPage() {
  const { page } = useParams<{ page: string }>();
  const currentPage = page || 'terms';

  const content = legalPages[currentPage as keyof typeof legalPages];

  if (!content) {
    return <Navigate to="/legal/terms" replace />;
  }

  const Icon = content.icon;

  return (
    <div className="pt-16 lg:pt-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#3DAABD]/10 flex items-center justify-center">
              <Icon className="h-6 w-6 text-[#3DAABD]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{content.title}</h1>
              <p className="text-gray-600">{content.subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Documents légaux
              </h3>
              <nav className="space-y-1">
                {legalNav.map((item) => (
                  <Link
                    key={item.id}
                    to={`/legal/${item.id}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-[#3DAABD]/10 text-[#3DAABD]'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-2 text-sm text-gray-500">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>Dernière mise à jour : {content.lastUpdate}</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="prose prose-gray max-w-none">
                {content.sections.map((section, index) => (
                  <div key={index} className="mb-8 last:mb-0">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                    <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                      {section.content.split('\n').map((paragraph, pIndex) => {
                        // Handle bold text with **text**
                        if (paragraph.includes('**')) {
                          const parts = paragraph.split(/\*\*(.*?)\*\*/g);
                          return (
                            <p key={pIndex} className="mb-3">
                              {parts.map((part, i) =>
                                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                              )}
                            </p>
                          );
                        }
                        // Handle bullet points
                        if (paragraph.startsWith('•')) {
                          return (
                            <p key={pIndex} className="mb-1 pl-4">
                              {paragraph}
                            </p>
                          );
                        }
                        return paragraph ? (
                          <p key={pIndex} className="mb-3">
                            {paragraph}
                          </p>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Print / Download */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => window.print()}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Imprimer cette page
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
