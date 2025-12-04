# 🚀 Guide Dashboard Projet 360°

## 📍 Comment Accéder

### URL Principale
```
/projects/:projectId/dashboard
```

### Navigation
1. Depuis la liste des projets → Cliquez sur un projet
2. Depuis le menu projet → Cliquez sur "Dashboard"
3. URL directe : `/projects/[ID-DU-PROJET]/dashboard`

---

## 🎯 Vue d'Ensemble

### Section 1 : En-tête Projet
- **Nom du projet** (gros titre)
- **Localisation** (ville, canton)
- **Statut** (badge coloré)
- **Type de projet** (PPE, Locatif, Mixte)

### Section 2 : KPIs Principaux (4 cartes)

#### 🏢 Ventes
- Lots vendus / Total
- Lots réservés
- Lots disponibles

#### 💰 Budget CFC
- Montant total budgété
- Montant engagé
- Utilisation en %

#### 📈 Avancement
- Progression globale (%)
- Prochaine étape
- Phase actuelle

#### 📄 Dossiers Notaire
- Dossiers signés / Total
- Dossiers prêts pour signature
- Documents en attente

---

## 🎨 Section Modules (6 cartes interactives)

### 🔵 1. LOTS
```
┌─────────────────────────────┐
│ 🏢 Lots                     │
│ 45 lots au total            │
├─────────────────────────────┤
│ ✅ Vendus: 18 (40%)        │
│ ⏰ Réservés: 8             │
│ 🏠 Disponibles: 19         │
│ 📊 Valeur vendue: 12.5M    │
│                             │
│ [Barre de progression 40%] │
└─────────────────────────────┘
```

**Actions disponibles** :
- Clic sur la carte → `/projects/:id/lots`
- Voir le détail de chaque lot
- Statut de commercialisation

### 🟣 2. CRM & VENTES
```
┌─────────────────────────────┐
│ 👥 CRM & Ventes             │
│ Pipeline commercial         │
├─────────────────────────────┤
│ 🆕 Prospects: 127          │
│    └─ 23 nouveaux          │
│    └─ 45 qualifiés         │
│                             │
│ 📋 Réservations: 23        │
│    └─ 8 en attente         │
│    └─ 15 confirmées        │
│                             │
│ ✅ Acheteurs: 18           │
│    └─ 5 docs en attente    │
│    └─ 13 signés            │
│                             │
│ Taux conversion: 14%        │
└─────────────────────────────┘
```

**Actions disponibles** :
- Clic sur la carte → `/projects/:id/crm/prospects`
- Voir le pipeline complet
- Gérer prospects et acheteurs

### 🟢 3. FINANCES
```
┌─────────────────────────────┐
│ 💰 Finances                 │
│ Budget & Trésorerie         │
├─────────────────────────────┤
│ 📊 Budget CFC              │
│ Budgété: 22.00M CHF        │
│ Engagé: 18.50M CHF         │
│ Dépensé: 12.30M CHF        │
│ [Progress bar 56%]          │
│                             │
│ 📄 Contrats: 45 (38 actifs)│
│ 💳 Factures: 123 (115 OK)  │
│                             │
│ ⚠️ 2 factures en retard    │
│                             │
│ Acomptes acheteurs:         │
│ 850K / 1,200K CHF          │
└─────────────────────────────┘
```

**Actions disponibles** :
- Clic sur la carte → `/projects/:id/finances`
- Voir le détail CFC
- Gérer contrats et factures

### 🟠 4. SOUMISSIONS
```
┌─────────────────────────────┐
│ 📋 Soumissions              │
│ 24 appels d'offres          │
├─────────────────────────────┤
│ 📝 Brouillons: 2           │
│ 📤 Publiées: 8             │
│ 🔒 Clôturées: 0            │
│ ✅ Adjudiquées: 14         │
│                             │
│ Moyenne: 4 offres/soumission│
│ Valeur adjudiquée: 8.5M CHF│
└─────────────────────────────┘
```

**Actions disponibles** :
- Clic sur la carte → `/projects/:id/submissions`
- Créer nouvelle soumission
- Comparer les offres

### 🔵 5. MODIFICATIONS TECHNIQUES
```
┌─────────────────────────────┐
│ 🎨 Modifications            │
│ Choix & Demandes clients    │
├─────────────────────────────┤
│ ⚙️ Catalogue matériaux     │
│ 12 catégories              │
│ 156 options                │
│ 8 acheteurs                │
│                             │
│ 📝 Demandes modification:  │
│ Total: 15                  │
│ 🟡 5 en attente            │
│ 🔵 3 en revue              │
│ 🟢 7 approuvées            │
│                             │
│ Coût estimé: 125K CHF      │
└─────────────────────────────┘
```

**Actions disponibles** :
- Clic sur la carte → `/projects/:id/materials`
- Gérer le catalogue
- Approuver demandes

### 🟣 6. PLANNING CHANTIER
```
┌─────────────────────────────┐
│ 📅 Planning chantier        │
│ Phases, jalons et avancement│
├─────────────────────────────┤
│ Avancement: 65%             │
│                             │
│ Phase actuelle:             │
│ Gros-œuvre en cours         │
│                             │
│ Prochaine étape:            │
│ Second-œuvre - 15/03/2025   │
└─────────────────────────────┘
```

**Actions disponibles** :
- Clic sur la carte → `/projects/:id/planning`
- Voir le Gantt
- Gérer les phases

---

## 📊 Section Graphiques (2 cartes)

### Graphique 1 : Progression Ventes
- Barre de progression visuelle
- Répartition vendus / réservés / libres
- Chiffres en temps réel

### Graphique 2 : Budget CFC
- Barre de progression budgétaire
- Répartition engagé / facturé / payé
- Alertes si dépassement

---

## 📁 Section Activité Récente (2 cartes)

### Documents Récents
- Liste des 5 derniers documents
- Date d'upload
- Lien direct vers le document

### Messages Récents
- Liste des 5 derniers messages
- Expéditeur et date
- Lien vers la conversation

---

## ⚡ Section Quick Actions

Boutons d'action rapide :
- ➕ Créer un nouveau lot
- 👤 Ajouter un acheteur
- 📄 Créer une soumission
- 💰 Enregistrer une facture

---

## 📤 Section Export

Panel d'export :
- Export PDF du projet complet
- Export Excel des données
- Rapports personnalisés

---

## 🎨 Code Couleur

### Statuts Lots
- 🟢 **Vert** : Vendu
- 🟡 **Jaune** : Réservé
- ⚪ **Gris** : Disponible
- 🔵 **Bleu** : Option

### Statuts Financiers
- 🟢 **Vert** : Payé
- 🟡 **Jaune** : En attente
- 🔴 **Rouge** : En retard
- ⚪ **Gris** : Brouillon

### Priorités
- 🔴 **Urgent** : Action requise
- 🟠 **Haute** : À traiter bientôt
- 🟡 **Moyenne** : Planifié
- 🟢 **Basse** : Surveillance

---

## 📱 Responsive Design

### Desktop (1280px+)
- 3 colonnes pour les cartes modules
- Tous les graphiques visibles
- Sidebar complète

### Tablet (768px - 1279px)
- 2 colonnes pour les cartes modules
- Graphiques empilés
- Sidebar réduite

### Mobile (< 768px)
- 1 colonne pour les cartes modules
- Navigation hamburger
- Actions en bas d'écran

---

## 🔄 Rafraîchissement

### Automatique
- Les données se rafraîchissent toutes les 60 secondes
- Indicateur visuel en cours de chargement

### Manuel
- Bouton "Rafraîchir" dans le header
- Pull-to-refresh sur mobile
- Raccourci clavier : `Ctrl+R` / `Cmd+R`

---

## 🔔 Notifications

Le dashboard affiche des notifications pour :
- ⚠️ **Factures en retard**
- 📅 **Échéances importantes**
- 📝 **Demandes clients en attente**
- ✅ **Nouveaux contrats signés**
- 🎯 **Objectifs atteints**

---

## 💡 Astuces

### Navigation Rapide
- `Ctrl+K` : Recherche globale
- Cliquez sur une carte pour voir le détail
- Utilisez les breadcrumbs pour revenir

### Filtres
- Filtrez par période (Mois, Trimestre, Année)
- Filtrez par statut
- Filtrez par équipe

### Export
- Tous les modules sont exportables
- Format Excel pour l'analyse
- Format PDF pour la présentation

---

## 🎯 Cas d'Usage

### Chef de Projet
1. Ouvre le dashboard le matin
2. Vérifie les alertes (factures, échéances)
3. Contrôle l'avancement des ventes
4. Suit le budget en temps réel

### Commercial
1. Consulte le pipeline CRM
2. Vérifie les réservations en attente
3. Suit les lots disponibles
4. Gère les prospects

### Directeur Financier
1. Analyse le budget CFC
2. Vérifie les factures et paiements
3. Contrôle les acomptes acheteurs
4. Export pour reporting

### Promoteur
1. Vue d'ensemble multi-projets
2. Comparaison de performance
3. Suivi des KPIs globaux
4. Décisions stratégiques

---

## 🚀 Prochaines Fonctionnalités

### En développement
- 📊 **Graphiques avancés** (Chart.js)
- 🔔 **Notifications push** en temps réel
- 📱 **App mobile native**
- 🤖 **Alertes IA prédictives**

### Planifiées
- 🗓️ **Calendrier intégré**
- 💬 **Chat en direct**
- 📹 **Visioconférence**
- 📊 **Rapports automatisés**

---

## ✅ Checklist de Validation

Avant de mettre en production :
- [ ] Tous les modules chargent correctement
- [ ] Les liens de navigation fonctionnent
- [ ] Les données s'affichent en temps réel
- [ ] Le design est responsive
- [ ] Les couleurs sont cohérentes
- [ ] Les permissions RLS sont respectées
- [ ] Le build fonctionne (434 KB)

---

**🎉 Le Dashboard Projet 360° est maintenant opérationnel !**

Accès direct : `/projects/:projectId/dashboard`
