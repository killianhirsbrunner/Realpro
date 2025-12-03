# 📜 Guide Juridique - Protection de la Propriété Intellectuelle

**Realpro Suite | Realpro SA**

---

## 🎯 Objectif de ce document

Ce guide vous aide à :

1. **Positionner juridiquement** le logiciel Realpro Suite
2. **Protéger** votre propriété intellectuelle
3. **Encadrer** vos relations avec développeurs et clients
4. **Prévenir** les risques juridiques liés au code source

---

## 1️⃣ Positionnement Juridique du Logiciel

### Qui est propriétaire ?

```
┌─────────────────────────────────────────────────────────────┐
│                    REALPRO SUITE                            │
│                                                             │
│  Code Source + UI + Documentation + Spécifications         │
│                                                             │
│              👇 PROPRIÉTÉ EXCLUSIVE 👇                      │
│                                                             │
│                      REALPRO SA                             │
└─────────────────────────────────────────────────────────────┘
```

### Modèle choisi

✅ **Logiciel Propriétaire** (non open source)
- Copyright © Realpro SA
- Tous droits réservés
- Code source confidentiel
- Licence commerciale payante

❌ **NON open source** (MIT, Apache, GPL, etc.)

### Que possède Realpro SA exactement ?

| Élément | Propriété Realpro SA | Description |
|---------|---------------------|-------------|
| Code source | ✅ Oui | Tout le code TypeScript, SQL, etc. |
| Architecture | ✅ Oui | Structure, design patterns, choix techniques |
| UI/UX | ✅ Oui | Interfaces, maquettes, design system |
| Documentation | ✅ Oui | README, guides, spécifications |
| Base de données | ✅ Oui | Schéma, migrations, structure |
| Nom commercial | ✅ Oui | "Realpro Suite" (à protéger en marque) |
| Logo | ✅ Oui | Identité visuelle |

### Ce que possèdent les clients

| Ce que reçoivent les clients | Propriété ? | Type de droit |
|------------------------------|-------------|---------------|
| Accès au logiciel SaaS | ❌ Non | Licence d'usage |
| Leurs données | ✅ Oui | Propriété des données |
| Le code source | ❌ Non | Jamais fourni |

---

## 2️⃣ Modifications Techniques Effectuées

### ✅ Checklist des fichiers mis à jour

| Fichier | Status | Contenu |
|---------|--------|---------|
| `COPYRIGHT` | ✅ Créé | Notice de copyright globale |
| `LICENSE` | ✅ Créé | Licence propriétaire complète (12 sections) |
| `package.json` | ✅ Mis à jour | `"license": "PROPRIETARY"`, author: Realpro SA |
| `README.md` | ✅ Mis à jour | Branding Realpro SA, avertissements |
| `index.html` | ⏳ À faire | Meta tags avec nom Realpro Suite |
| Fichiers clés | ⏳ À faire | Headers copyright dans code source |

### Structure des fichiers juridiques

```
project/
├── COPYRIGHT              # Notice globale de propriété
├── LICENSE                # Licence d'utilisation propriétaire
├── LEGAL_GUIDE.md         # Ce fichier (guide complet)
├── CONTRACTS_TEMPLATES.md # Templates contrats développeurs
├── CGU_TEMPLATE.md        # CGU pour les clients
├── package.json           # Métadonnées (author, license)
└── README.md              # Documentation avec avertissements
```

---

## 3️⃣ Développeurs Externes (Freelances, Agences)

### 🎯 Objectif

**Faire céder** tous les droits de propriété intellectuelle à Realpro SA dès la création.

### Clause de Cession de Droits

Insérer dans **tous** les contrats avec développeurs externes :

```
═══════════════════════════════════════════════════════════════════════════
ARTICLE X - PROPRIÉTÉ INTELLECTUELLE ET CESSION DE DROITS

1. PROPRIÉTÉ DES DÉVELOPPEMENTS

Le Prestataire reconnaît et accepte que l'ensemble des développements
réalisés dans le cadre du présent contrat, incluant notamment :

  a) Le code source et le code compilé
  b) Les schémas et structures de base de données
  c) Les spécifications techniques et fonctionnelles
  d) Les interfaces utilisateur (UI/UX)
  e) Les maquettes et prototypes
  f) Les scripts, outils et utilitaires
  g) La documentation technique et utilisateur
  h) Toute création réalisée pour les besoins du logiciel « Realpro Suite »

sont destinés à être la propriété exclusive de REALPRO SA.

2. CESSION À TITRE EXCLUSIF

Dans la mesure permise par le droit applicable, le Prestataire cède à titre
exclusif à REALPRO SA, au fur et à mesure de leur création et pour le monde
entier, pour toute la durée légale de protection des droits d'auteur,
l'ensemble des droits de propriété intellectuelle sur les livrables,
y compris sans limitation :

  a) Le droit de reproduction sur tout support
  b) Le droit de représentation
  c) Le droit d'adaptation, de modification, de traduction
  d) Le droit de distribution et de commercialisation
  e) Le droit d'intégration dans tout autre logiciel ou service
  f) Le droit de concéder des sous-licences
  g) Le droit d'utilisation sous toute forme

3. RÉMUNÉRATION DE LA CESSION

Cette cession est consentie moyennant la rémunération forfaitaire prévue
au présent contrat. Aucune rémunération complémentaire ou additionnelle ne
sera due au titre de cette cession, quels que soient les modes
d'exploitation du logiciel.

4. GARANTIES

Le Prestataire garantit à REALPRO SA que :

  a) Les livrables sont originaux et ne constituent pas une contrefaçon
  b) Le Prestataire dispose de tous les droits nécessaires pour consentir
     la présente cession
  c) Les livrables ne portent pas atteinte aux droits de tiers
  d) Aucun élément des livrables n'est soumis à des restrictions ou
     obligations incompatibles avec les droits cédés

Le Prestataire s'engage à garantir REALPRO SA contre toute action,
réclamation ou revendication de tiers relative à la propriété
intellectuelle des livrables.

5. OBLIGATION DE NON-UTILISATION

Le Prestataire s'interdit d'utiliser, copier, modifier, distribuer ou
exploiter de quelque manière que ce soit les livrables, le code source du
logiciel « Realpro Suite », ou toute partie de celui-ci, en dehors du
strict cadre du présent contrat.

Cette interdiction subsiste après la fin du contrat.

6. CONFIDENTIALITÉ DU CODE SOURCE

Le Prestataire s'engage à maintenir strictement confidentiel le code source
et l'architecture du logiciel « Realpro Suite », et à ne pas les divulguer
à des tiers sans l'autorisation écrite préalable de REALPRO SA.

7. PROPRIÉTÉ EXCLUSIVE DE REALPRO SA

Les Parties reconnaissent expressément que le logiciel « Realpro Suite » et
l'ensemble du code qui le compose sont et demeurent la propriété exclusive
de REALPRO SA.

Le Prestataire ne conserve aucun droit d'utilisation, de propriété ou
d'exploitation autre que ceux strictement nécessaires à l'exécution du
présent contrat.

═══════════════════════════════════════════════════════════════════════════
```

### ⚠️ Points importants

1. **Cession au fur et à mesure** : Les droits sont transférés dès la création, pas à la livraison finale
2. **Rémunération forfaitaire** : Pas de royalties additionnelles
3. **Garanties** : Le développeur garantit qu'il ne viole pas de droits tiers
4. **Confidentialité** : Le code reste confidentiel même après la fin du contrat
5. **Interdiction d'utilisation** : Le développeur ne peut pas réutiliser le code ailleurs

### Cas particuliers

#### a) Composants Open Source

Si le développeur utilise des librairies open source (React, Supabase, etc.) :

```
Les composants et bibliothèques open source intégrés dans les livrables
restent soumis à leurs licences respectives (MIT, Apache, BSD, etc.).

Le Prestataire s'engage à n'utiliser que des composants dont les licences
sont compatibles avec l'exploitation commerciale du logiciel.

Le Prestataire fournira la liste complète des dépendances open source
utilisées, avec leurs licences respectives.
```

#### b) Code Préexistant du Prestataire

Si le développeur veut utiliser du code qu'il a déjà écrit :

```
Si le Prestataire souhaite intégrer du code ou des composants préexistants
lui appartenant, il doit :

1. En informer REALPRO SA par écrit avant intégration
2. Obtenir l'accord écrit de REALPRO SA
3. Concéder à REALPRO SA une licence perpétuelle, irrévocable, mondiale,
   gratuite et non exclusive d'utilisation de ces éléments préexistants
   dans le cadre du logiciel « Realpro Suite »

À défaut d'accord préalable, tous les développements réalisés dans le cadre
du présent contrat sont présumés originaux et cédés intégralement à
REALPRO SA.
```

---

## 4️⃣ Clients (Utilisateurs Finaux)

### 🎯 Objectif

Les clients achètent un **droit d'usage** (licence SaaS), **PAS** la propriété du logiciel.

### Clause CGU "Propriété Intellectuelle"

À insérer dans les **Conditions Générales d'Utilisation** (CGU) :

```
═══════════════════════════════════════════════════════════════════════════
ARTICLE X - PROPRIÉTÉ INTELLECTUELLE

1. PROPRIÉTÉ DU LOGICIEL

Le logiciel « Realpro Suite » (ci-après le « Logiciel ») ainsi que
l'ensemble de ses composants, incluant notamment :

  - le code source et le code exécutable
  - les interfaces graphiques et visuelles
  - les textes, graphismes et contenus
  - les bases de données et structures de données
  - les logos, marques et noms commerciaux
  - la documentation technique et utilisateur
  - les algorithmes et processus

sont la propriété exclusive de REALPRO SA, sous réserve des éléments
éventuellement détenus par des tiers et utilisés sous licence.

REALPRO SA détient tous les droits de propriété intellectuelle afférents
au Logiciel, protégés par les lois suisses et internationales sur le droit
d'auteur, les marques et la propriété intellectuelle.

2. LICENCE D'UTILISATION

Aucun droit de propriété intellectuelle n'est transféré au Client dans le
cadre du présent contrat.

REALPRO SA concède uniquement au Client une licence d'utilisation :

  ✓ NON EXCLUSIVE : d'autres clients peuvent utiliser le Logiciel
  ✓ NON TRANSFÉRABLE : le Client ne peut céder cette licence
  ✓ LIMITÉE : aux fonctionnalités et modules souscrits
  ✓ RÉVOCABLE : en cas de non-respect du contrat
  ✓ POUR LA DURÉE DU CONTRAT : la licence expire à la fin de l'abonnement

Cette licence permet au Client d'accéder au Logiciel et de l'utiliser
conformément à sa destination, dans le cadre de son activité professionnelle,
pour le nombre d'utilisateurs et de projets prévus dans son abonnement.

3. RESTRICTIONS D'UTILISATION

Le Client s'interdit formellement, sauf autorisation écrite préalable
de REALPRO SA :

  ❌ De copier, reproduire ou dupliquer le Logiciel (hors usage normal)
  ❌ De modifier, adapter, traduire ou créer des œuvres dérivées
  ❌ De décompiler, désassembler ou procéder à l'ingénierie inverse
  ❌ De céder, louer, prêter, sous-licencier ou distribuer à des tiers
  ❌ De supprimer ou altérer les mentions de propriété et de copyright
  ❌ D'utiliser le Logiciel pour développer un produit concurrent
  ❌ D'accéder au Logiciel pour créer un produit ou service similaire
  ❌ De publier ou diffuser des benchmarks sans autorisation
  ❌ D'extraire ou réutiliser de manière substantielle le contenu du Logiciel

4. CODE SOURCE

Le code source du Logiciel demeure confidentiel et n'est en aucun cas
fourni au Client.

Aucune demande d'accès au code source ne sera acceptée, sauf convention
d'entiercement (escrow agreement) spécifique et distincte.

5. MARQUES ET SIGNES DISTINCTIFS

Les mentions « Realpro », « Realpro SA », « Realpro Suite » ainsi que les
logos et autres signes distinctifs associés sont des marques et
dénominations appartenant à REALPRO SA ou ses partenaires.

Toute utilisation, reproduction ou représentation de ces marques sans
autorisation préalable écrite de REALPRO SA est strictement interdite.

6. DONNÉES CLIENT

Les données saisies et stockées par le Client dans le Logiciel (ci-après
les « Données Client ») restent la propriété exclusive du Client.

REALPRO SA s'engage à :
  - Ne pas utiliser les Données Client à des fins commerciales
  - Ne pas communiquer les Données Client à des tiers non autorisés
  - Permettre au Client d'exporter ses Données Client à tout moment
  - Restituer ou supprimer les Données Client à la fin du contrat

Les Données Client ne peuvent en aucun cas être assimilées au Logiciel
lui-même, dont la propriété demeure à REALPRO SA.

7. CONTENU UTILISATEUR

Le Client reste propriétaire des contenus qu'il crée ou télécharge dans le
Logiciel (documents, images, commentaires, etc.).

En téléchargeant du contenu, le Client concède à REALPRO SA une licence
limitée, non exclusive, pour héberger, stocker, afficher et transmettre ce
contenu dans le seul but de fournir le service.

8. AMÉLIORATION DU LOGICIEL

Toute suggestion, idée, retour ou recommandation communiquée par le Client
concernant le Logiciel pourra être librement utilisée par REALPRO SA pour
améliorer le Logiciel, sans obligation de rémunération ou de reconnaissance
envers le Client.

9. SANCTIONS

Toute violation des présentes dispositions relatives à la propriété
intellectuelle pourra entraîner :

  - La suspension immédiate de l'accès au Logiciel
  - La résiliation du contrat sans préavis ni remboursement
  - Des poursuites judiciaires pour contrefaçon
  - La réparation de l'intégralité du préjudice subi par REALPRO SA

═══════════════════════════════════════════════════════════════════════════
```

---

## 5️⃣ En-têtes Copyright dans le Code Source

### Où placer les headers ?

✅ **Fichiers importants** (pas tous) :
- `src/main.tsx` (point d'entrée React)
- `src/App.tsx`
- Fichiers de libs critiques (ex: `src/lib/supabase.ts`)
- Services métier clés (ex: QR Invoice, Exports)

❌ **Pas nécessaire** :
- Composants UI basiques
- Fichiers de configuration
- Tests

### Template d'en-tête

```typescript
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Realpro Suite – Plateforme SaaS de Gestion de Projets Immobiliers
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * © 2024-2025 Realpro SA. Tous droits réservés.
 *
 * Ce fichier fait partie du logiciel propriétaire Realpro Suite.
 *
 * L'utilisation, la copie, la modification et la distribution de ce fichier
 * sont soumises à l'autorisation écrite préalable de Realpro SA.
 *
 * Pour toute question : contact@realpro.ch
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Votre code ici...
```

### Version courte (pour fichiers moins critiques)

```typescript
/**
 * Realpro Suite | © 2024-2025 Realpro SA. Tous droits réservés.
 */
```

---

## 6️⃣ Protection de la Marque "Realpro Suite"

### Étapes recommandées

1. **Vérifier la disponibilité** de la marque "Realpro Suite"
   - Recherche dans le registre suisse des marques (IPI)
   - Vérifier les domaines (.ch, .com)

2. **Déposer la marque** auprès de l'IPI (Institut Fédéral de la Propriété Intellectuelle)
   - Classes recommandées :
     - Classe 9 : Logiciels
     - Classe 42 : Services informatiques, SaaS

3. **Enregistrer les domaines**
   - realpro-suite.ch
   - realpro-suite.com
   - Variations (.io, .net si pertinents)

4. **Protéger le logo**
   - Déposer le logo comme marque figurative

---

## 7️⃣ Clauses Complémentaires Utiles

### a) Confidentialité (NDA)

À ajouter dans les contrats développeurs :

```
ARTICLE - CONFIDENTIALITÉ

Le Prestataire s'engage à maintenir strictement confidentielles toutes les
informations relatives au logiciel « Realpro Suite », incluant notamment :

  - Le code source et l'architecture du Logiciel
  - Les spécifications fonctionnelles et techniques
  - Les données de performance et de sécurité
  - La roadmap produit et les évolutions prévues
  - Les informations commerciales et tarifaires
  - Les données clients

Cette obligation de confidentialité demeure applicable pendant toute la
durée du contrat et pour une durée de 5 ans après son terme, quelle qu'en
soit la cause.
```

### b) Non-Concurrence

Pour les développeurs clés :

```
ARTICLE - NON-CONCURRENCE

Pendant la durée du présent contrat et pour une période de 12 mois suivant
son terme, le Prestataire s'interdit de :

  a) Développer, commercialiser ou participer au développement d'un logiciel
     concurrent de « Realpro Suite »
  b) Travailler pour un concurrent direct de REALPRO SA
  c) Utiliser les connaissances acquises sur le Logiciel pour créer ou
     améliorer un produit concurrent

Cette clause est limitée au secteur de la gestion de projets immobiliers en
Suisse.
```

### c) Non-Débauchage

```
ARTICLE - NON-DÉBAUCHAGE

Le Prestataire s'interdit, pendant la durée du contrat et pendant 24 mois
après son terme, de solliciter, recruter ou employer directement ou
indirectement tout employé ou collaborateur de REALPRO SA.
```

---

## 8️⃣ Mentions Légales dans l'Interface

### Footer de l'application

```html
<footer>
  <p>© 2024-2025 Realpro SA. Tous droits réservés.</p>
  <p>Realpro Suite est une marque de Realpro SA.</p>
  <a href="/legal/terms">Conditions Générales</a>
  <a href="/legal/privacy">Politique de Confidentialité</a>
</footer>
```

### Page "À propos"

```
À propos de Realpro Suite

Realpro Suite est une plateforme SaaS de gestion de projets immobiliers
développée et éditée par Realpro SA, société suisse spécialisée dans les
solutions logicielles pour le secteur immobilier.

Éditeur
Realpro SA
[Adresse]
[Code postal et ville]
Suisse
CHE-XXX.XXX.XXX (numéro IDE)

Contact : contact@realpro.ch
Web : https://www.realpro.ch

Propriété Intellectuelle
Realpro Suite, son code source, son design et sa documentation sont la
propriété exclusive de Realpro SA et protégés par les lois suisses et
internationales sur le droit d'auteur et la propriété intellectuelle.

Version : 1.0.0
Dernière mise à jour : Décembre 2024
```

---

## 9️⃣ Checklist Avant Production

### ✅ Fichiers juridiques

- [ ] `COPYRIGHT` créé et complet
- [ ] `LICENSE` créé avec toutes les clauses
- [ ] `package.json` mis à jour (`license: "PROPRIETARY"`, author)
- [ ] `README.md` mis à jour avec avertissements
- [ ] `LEGAL_GUIDE.md` (ce fichier) complété
- [ ] `CONTRACTS_TEMPLATES.md` créé
- [ ] `CGU_TEMPLATE.md` créé

### ✅ Code source

- [ ] Headers copyright ajoutés dans fichiers principaux
- [ ] Nom "Realpro Suite" affiché dans l'interface
- [ ] Footer avec copyright dans l'app
- [ ] Page "À propos" / "Legal" créée
- [ ] Mentions légales complètes
- [ ] Pas de mentions "open source" ou licences incompatibles

### ✅ Contrats

- [ ] Contrat-type développeur avec cession de droits
- [ ] CGU clients avec clause propriété intellectuelle
- [ ] NDA pour partenaires/prestataires
- [ ] Contrat de travail (si employés) avec clause IP

### ✅ Marque & Domaines

- [ ] Vérifier disponibilité marque "Realpro Suite"
- [ ] Déposer la marque auprès de l'IPI (Suisse)
- [ ] Enregistrer domaines (.ch, .com)
- [ ] Protéger le logo (marque figurative)

### ✅ Sécurité & Accès

- [ ] Dépôt Git en privé (GitHub/GitLab private)
- [ ] Accès limité aux développeurs autorisés
- [ ] Pas de code public sur GitHub, StackOverflow, etc.
- [ ] Pas de copie du code sur ordinateurs personnels
- [ ] Logs d'accès au code source activés

---

## 🔟 Contacts & Ressources

### Assistance Juridique

Pour toute question juridique, consulter :

- **Avocat en propriété intellectuelle** (Suisse)
- **Institut Fédéral de la Propriété Intellectuelle (IPI)**
  - Web : https://www.ige.ch
  - Tél : +41 31 377 77 77

### Enregistrement de Marque

- **IPI - Registre suisse des marques**
  - https://www.ige.ch/fr/proteger-vos-pi/marques
  - Coût : ~550 CHF (marque nationale suisse)

### Dépôt de Code Source (Escrow)

Pour clients importants nécessitant une garantie :

- **Steganos Software GmbH** (service d'escrow)
- **IPI - Service de dépôt**

---

## 📞 Contact Realpro SA

**Pour toute question relative à ce guide :**

Realpro SA
[Adresse à compléter]
[Code postal et ville]
Suisse

📧 Email : legal@realpro.ch
🌐 Web : https://www.realpro.ch

---

**Document à conserver et mettre à jour régulièrement.**

*Version : 1.0 | Dernière mise à jour : Décembre 2024*
*© 2024-2025 Realpro SA. Tous droits réservés.*
