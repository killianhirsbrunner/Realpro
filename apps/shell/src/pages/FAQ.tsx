import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Search,
  HelpCircle,
  CreditCard,
  Shield,
  Settings,
  Users,
  ArrowRight,
  MessageCircle
} from 'lucide-react';

// FAQ categories
const faqCategories = [
  {
    id: 'general',
    name: 'Questions générales',
    icon: HelpCircle,
    questions: [
      {
        q: 'Qu\'est-ce que Realpro Suite ?',
        a: 'Realpro Suite est une plateforme logicielle suisse composée de 3 applications indépendantes : PPE Admin pour la gestion de copropriétés, Promoteur pour les projets de promotion immobilière, et Régie pour la gérance locative. Chaque application peut être utilisée séparément selon vos besoins.',
      },
      {
        q: 'Les applications sont-elles indépendantes ?',
        a: 'Oui, chaque application (PPE Admin, Promoteur, Régie) est totalement indépendante. Vous pouvez souscrire à une, deux ou trois applications selon votre activité. Si vous utilisez plusieurs applications, elles partagent un compte unique et peuvent échanger des données.',
      },
      {
        q: 'Faut-il installer un logiciel ?',
        a: 'Non, Realpro Suite est une solution 100% cloud. Vous accédez à vos applications directement depuis votre navigateur web (Chrome, Firefox, Safari, Edge). Aucune installation n\'est requise et vous pouvez travailler depuis n\'importe quel appareil.',
      },
      {
        q: 'Les applications sont-elles disponibles en plusieurs langues ?',
        a: 'Oui, toutes nos applications sont disponibles en français, allemand, anglais et italien. Vous pouvez changer de langue à tout moment depuis les paramètres de votre compte.',
      },
      {
        q: 'Puis-je accéder aux applications depuis mon smartphone ?',
        a: 'Absolument. Nos applications sont entièrement responsive et s\'adaptent à tous les écrans : ordinateur, tablette et smartphone. Vous pouvez gérer vos affaires en déplacement.',
      },
    ],
  },
  {
    id: 'pricing',
    name: 'Tarifs & facturation',
    icon: CreditCard,
    questions: [
      {
        q: 'Comment fonctionne la période d\'essai ?',
        a: 'Chaque application propose un essai gratuit de 30 jours sans engagement et sans carte de crédit. Vous avez accès à toutes les fonctionnalités pendant cette période. À la fin de l\'essai, vous choisissez de souscrire ou votre compte est simplement désactivé.',
      },
      {
        q: 'Y a-t-il un engagement minimum ?',
        a: 'Non, tous nos plans sont sans engagement. Vous pouvez résilier votre abonnement à tout moment. La résiliation prend effet à la fin de la période de facturation en cours.',
      },
      {
        q: 'Comment sont facturés les abonnements ?',
        a: 'Les abonnements sont facturés mensuellement ou annuellement (avec 2 mois offerts). Nous acceptons les paiements par carte de crédit et par facture (pour les plans Enterprise).',
      },
      {
        q: 'Puis-je changer de plan en cours d\'abonnement ?',
        a: 'Oui, vous pouvez passer à un plan supérieur à tout moment. Le changement est effectif immédiatement et le prorata est calculé automatiquement. Pour passer à un plan inférieur, le changement prendra effet au prochain cycle de facturation.',
      },
      {
        q: 'Proposez-vous des tarifs pour les grandes structures ?',
        a: 'Oui, notre plan Enterprise est conçu pour les grandes régies, promoteurs et syndics. Il offre des tarifs sur mesure, des fonctionnalités avancées (SSO, multi-entités) et un accompagnement dédié. Contactez-nous pour un devis personnalisé.',
      },
      {
        q: 'Les prix incluent-ils la TVA ?',
        a: 'Tous les prix affichés sur notre site sont en CHF hors taxes. La TVA suisse (8.1%) sera ajoutée sur les factures pour les clients domiciliés en Suisse.',
      },
    ],
  },
  {
    id: 'security',
    name: 'Sécurité & données',
    icon: Shield,
    questions: [
      {
        q: 'Où sont hébergées mes données ?',
        a: 'Toutes les données sont hébergées exclusivement en Suisse, dans des datacenters certifiés ISO 27001 situés à Genève et Zurich. Vos données ne quittent jamais le territoire suisse.',
      },
      {
        q: 'Mes données sont-elles sécurisées ?',
        a: 'Oui, nous appliquons les plus hauts standards de sécurité : chiffrement SSL/TLS pour les transmissions, chiffrement AES-256 pour les données au repos, authentification forte (2FA), audits de sécurité réguliers et sauvegardes quotidiennes redondantes.',
      },
      {
        q: 'Êtes-vous conforme au RGPD et à la LPD ?',
        a: 'Absolument. Realpro est pleinement conforme au Règlement Général sur la Protection des Données (RGPD) européen et à la Loi fédérale sur la Protection des Données (LPD) suisse. Nous fournissons tous les outils nécessaires pour exercer vos droits et ceux de vos clients.',
      },
      {
        q: 'Puis-je exporter mes données ?',
        a: 'Oui, vous pouvez exporter l\'intégralité de vos données à tout moment depuis les paramètres de chaque application. Les exports sont disponibles en formats standards (CSV, Excel, PDF) pour garantir la portabilité de vos données.',
      },
      {
        q: 'Que se passe-t-il si je résilie mon abonnement ?',
        a: 'En cas de résiliation, vos données restent accessibles en lecture seule pendant 30 jours. Vous pouvez exporter vos données pendant cette période. Après 30 jours, les données sont définitivement supprimées de nos serveurs.',
      },
      {
        q: 'Proposez-vous l\'authentification SSO ?',
        a: 'Oui, l\'authentification SSO (Single Sign-On) via SAML 2.0 ou OpenID Connect est disponible pour les plans Enterprise. Cela permet d\'intégrer Realpro à votre système d\'authentification existant (Azure AD, Google Workspace, etc.).',
      },
    ],
  },
  {
    id: 'features',
    name: 'Fonctionnalités',
    icon: Settings,
    questions: [
      {
        q: 'Quelles sont les fonctionnalités de PPE Admin ?',
        a: 'PPE Admin couvre l\'ensemble des besoins d\'un syndic : gestion des immeubles et lots, registre des copropriétaires, organisation des assemblées générales (convocations, votes, PV), répartition des charges, budget prévisionnel, comptabilité PPE, fonds de rénovation, gestion des travaux et portail copropriétaires.',
      },
      {
        q: 'Quelles sont les fonctionnalités de Promoteur ?',
        a: 'Promoteur gère l\'intégralité du cycle de promotion : définition des projets et lots, CRM acquéreurs, processus de vente, suivi financier CFC, gestion des soumissions, suivi de chantier, configurateur en ligne pour les choix clients, relation notaire et service après-vente.',
      },
      {
        q: 'Quelles sont les fonctionnalités de Régie ?',
        a: 'Régie couvre toute la gérance locative : gestion des immeubles et objets, registre des propriétaires, gestion des locataires, baux et contrats, encaissements et rappels, décomptes de charges, états des lieux digitaux, maintenance et tickets, comptabilité gérance et portails web.',
      },
      {
        q: 'Les applications s\'intègrent-elles à d\'autres logiciels ?',
        a: 'Oui, nous proposons des intégrations natives avec les principaux logiciels comptables suisses (Abacus, Sage), les banques (PostFinance, UBS) et les outils bureautiques (Office 365, Google Workspace). Une API RESTful est également disponible pour les intégrations personnalisées.',
      },
      {
        q: 'Puis-je personnaliser les modèles de documents ?',
        a: 'Oui, tous les documents générés (contrats, lettres, décomptes, PV) sont personnalisables. Vous pouvez modifier les templates avec votre logo, vos couleurs et adapter les textes selon vos besoins.',
      },
    ],
  },
  {
    id: 'support',
    name: 'Support & formation',
    icon: Users,
    questions: [
      {
        q: 'Quel support est inclus ?',
        a: 'Tous les plans incluent un support par email avec réponse sous 24h ouvrées. Les plans Pro incluent en plus un support téléphonique prioritaire. Les plans Enterprise bénéficient d\'un account manager dédié et d\'un support 24/7.',
      },
      {
        q: 'Proposez-vous des formations ?',
        a: 'Oui, nous proposons plusieurs options : tutoriels vidéo accessibles depuis l\'application, webinaires mensuels gratuits, formations en ligne personnalisées et formations sur site (plans Enterprise). Notre équipe Customer Success vous accompagne pour garantir votre réussite.',
      },
      {
        q: 'Comment signaler un bug ou suggérer une amélioration ?',
        a: 'Vous pouvez soumettre vos retours directement depuis l\'application via le bouton "Feedback" ou par email à support@realpro.ch. Nous lisons chaque suggestion et les priorisons selon les votes de la communauté.',
      },
      {
        q: 'Y a-t-il une communauté d\'utilisateurs ?',
        a: 'Oui, nous animons une communauté active sur LinkedIn où les utilisateurs peuvent échanger, partager leurs bonnes pratiques et être informés des nouveautés. Des événements networking sont également organisés plusieurs fois par an.',
      },
      {
        q: 'Comment se déroule la migration depuis un autre logiciel ?',
        a: 'Notre équipe vous accompagne dans la migration de vos données. Nous proposons un service d\'import qui prend en charge la plupart des formats (Excel, CSV, exports des principaux concurrents). Pour les plans Pro et Enterprise, un consultant dédié supervise la migration.',
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full py-5 flex items-center justify-between text-left hover:text-[#3DAABD] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-5 pr-12">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter questions based on search
  const filteredCategories = faqCategories.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  const displayCategories = searchQuery ? filteredCategories : faqCategories;

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Questions fréquentes</h1>
            <p className="text-xl text-slate-300 mb-8">
              Trouvez rapidement les réponses à vos questions sur Realpro Suite
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une question..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:ring-2 focus:ring-[#3DAABD] focus:bg-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category navigation */}
      <section className="sticky top-16 lg:top-20 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeCategory === null
                  ? 'bg-[#3DAABD] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-[#3DAABD] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {displayCategories
            .filter((cat) => !activeCategory || cat.id === activeCategory)
            .map((category) => (
              <div key={category.id} className="mb-12" id={category.id}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#3DAABD]/10 flex items-center justify-center">
                    <category.icon className="h-5 w-5 text-[#3DAABD]" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200">
                  {category.questions.map((item, index) => (
                    <div key={index} className="px-6">
                      <FAQItem question={item.q} answer={item.a} />
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {searchQuery && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun résultat trouvé
              </h3>
              <p className="text-gray-600">
                Essayez avec d'autres termes ou{' '}
                <Link to="/contact" className="text-[#3DAABD] hover:underline">
                  contactez-nous
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#3DAABD]/10 flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-8 w-8 text-[#3DAABD]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Vous n'avez pas trouvé votre réponse ?
            </h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Notre équipe est disponible pour répondre à toutes vos questions
              et vous accompagner dans votre projet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3DAABD] px-6 py-3 font-semibold text-white hover:bg-[#2E8A9A] transition-colors"
              >
                Nous contacter
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="mailto:support@realpro.ch"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:border-gray-300 transition-colors"
              >
                support@realpro.ch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
