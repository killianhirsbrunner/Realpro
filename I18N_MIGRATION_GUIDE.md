# 🔄 Guide Migration Composants vers i18n

## Vue d'ensemble

Guide pratique pour migrer les composants existants vers le nouveau système i18n.

---

## 🎯 Checklist Migration Composant

Pour chaque composant:

- [ ] Importer `useI18n` hook
- [ ] Remplacer tous textes en dur par `t('key')`
- [ ] Vérifier clés existent dans les 4 langues
- [ ] Tester changement langue
- [ ] Vérifier paramètres dynamiques

---

## 📝 Exemples Avant/Après

### Exemple 1: Textes Simples

**❌ Avant**:
```tsx
export function ProjectHeader({ project }) {
  return (
    <div>
      <h1>Projets</h1>
      <button>Ajouter</button>
      <p>Chargement...</p>
    </div>
  );
}
```

**✅ Après**:
```tsx
import { useI18n } from '../lib/i18n';

export function ProjectHeader({ project }) {
  const { t } = useI18n();

  return (
    <div>
      <h1>{t('nav.projects')}</h1>
      <button>{t('actions.add')}</button>
      <p>{t('common.loading')}</p>
    </div>
  );
}
```

---

### Exemple 2: Statuts Dynamiques

**❌ Avant**:
```tsx
function LotCard({ lot }) {
  const statusLabel = {
    AVAILABLE: 'Disponible',
    RESERVED: 'Réservé',
    SOLD: 'Vendu',
  }[lot.status];

  return <Badge>{statusLabel}</Badge>;
}
```

**✅ Après**:
```tsx
import { useI18n } from '../lib/i18n';

function LotCard({ lot }) {
  const { t } = useI18n();

  return <Badge>{t(`lot.status.${lot.status}`)}</Badge>;
}
```

---

### Exemple 3: Interpolation Paramètres

**❌ Avant**:
```tsx
function NotificationItem({ notification }) {
  return (
    <div>
      <h4>{notification.title}</h4>
      <p>{notification.body}</p>
    </div>
  );
}
```

**✅ Après**:
```tsx
import { useI18n } from '../lib/i18n';

function NotificationItem({ notification }) {
  const { t } = useI18n();

  const title = notification.i18n_key
    ? t(`${notification.i18n_key}.title`, notification.i18n_params)
    : notification.title;

  const body = notification.i18n_key
    ? t(`${notification.i18n_key}.body`, notification.i18n_params)
    : notification.body;

  return (
    <div>
      <h4>{title}</h4>
      <p>{body}</p>
    </div>
  );
}
```

---

### Exemple 4: Formulaires

**❌ Avant**:
```tsx
function LotForm() {
  return (
    <form>
      <label>Numéro de lot</label>
      <input placeholder="Ex: A101" />

      <label>Surface (m²)</label>
      <input type="number" placeholder="Surface" />

      <button type="submit">Enregistrer</button>
      <button type="button">Annuler</button>
    </form>
  );
}
```

**✅ Après**:
```tsx
import { useI18n } from '../lib/i18n';

function LotForm() {
  const { t } = useI18n();

  return (
    <form>
      <label>{t('lot.number')}</label>
      <input placeholder={t('lot.number')} />

      <label>{t('lot.surface')}</label>
      <input type="number" placeholder={t('lot.surface')} />

      <button type="submit">{t('actions.save')}</button>
      <button type="button">{t('actions.cancel')}</button>
    </form>
  );
}
```

---

### Exemple 5: Messages d'Erreur

**❌ Avant**:
```tsx
function ErrorDisplay({ error }) {
  const messages = {
    'NOT_FOUND': 'Élément introuvable',
    'UNAUTHORIZED': 'Accès non autorisé',
    'VALIDATION_ERROR': 'Erreur de validation',
  };

  return <p>{messages[error.code] || 'Erreur inconnue'}</p>;
}
```

**✅ Après**:
```tsx
import { useI18n } from '../lib/i18n';

function ErrorDisplay({ error }) {
  const { t } = useI18n();

  return (
    <p>
      {t(`errors.${error.code}`) || t('errors.genericError')}
    </p>
  );
}
```

---

### Exemple 6: Topbar avec LanguageSwitcher

**❌ Avant**:
```tsx
import { Globe, User } from 'lucide-react';

export function Topbar() {
  return (
    <header>
      <button>
        <Globe />
        <span>FR</span>
      </button>
      <button>
        <User />
        <span>Mon compte</span>
      </button>
    </header>
  );
}
```

**✅ Après**:
```tsx
import { User } from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useI18n } from '../lib/i18n';

export function Topbar() {
  const { t } = useI18n();

  return (
    <header>
      <LanguageSwitcher />
      <button>
        <User />
        <span>{t('nav.settings')}</span>
      </button>
    </header>
  );
}
```

---

## 🔧 Migration Scheduler

**❌ Avant**:
```typescript
await supabase.from('notifications').insert({
  user_id: userId,
  type: 'CHOICE_MATERIAL',
  title: `Choix matériaux en retard – Lot ${lotNumber}`,
  body: `Les choix matériaux pour le lot ${lotNumber} (projet ${projectName}) sont en retard.`,
  project_id: projectId,
  link_url: linkUrl,
});
```

**✅ Après**:
```typescript
await supabase.from('notifications').insert({
  user_id: userId,
  type: 'CHOICE_MATERIAL',
  i18n_key: 'notifications.materialChoice.late',
  i18n_params: {
    lotNumber,
    projectName,
  },
  title: '', // Requis par schéma
  body: '',
  project_id: projectId,
  link_url: linkUrl,
});
```

---

## 📋 Clés i18n Disponibles

### Navigation
```typescript
t('nav.dashboard')      // Tableau de bord / Dashboard / ...
t('nav.projects')       // Projets / Projekte / ...
t('nav.lots')          // Lots / Lose / ...
t('nav.finance')       // Finance / Finanzen / ...
t('nav.construction')  // Chantier / Baustelle / ...
t('nav.settings')      // Paramètres / Einstellungen / ...
```

### Actions
```typescript
t('actions.save')      // Enregistrer / Speichern / ...
t('actions.cancel')    // Annuler / Abbrechen / ...
t('actions.edit')      // Modifier / Bearbeiten / ...
t('actions.delete')    // Supprimer / Löschen / ...
t('actions.add')       // Ajouter / Hinzufügen / ...
t('actions.search')    // Rechercher / Suchen / ...
```

### Commun
```typescript
t('common.yes')        // Oui / Ja / ...
t('common.no')         // Non / Nein / ...
t('common.loading')    // Chargement... / Laden... / ...
t('common.error')      // Erreur / Fehler / ...
t('common.success')    // Succès / Erfolg / ...
```

### Statuts Lot
```typescript
t('lot.status.AVAILABLE')   // Disponible / Verfügbar / ...
t('lot.status.RESERVED')    // Réservé / Reserviert / ...
t('lot.status.SOLD')        // Vendu / Verkauft / ...
```

### Statuts Projet
```typescript
t('project.status.PLANNING')      // Planification / Planung / ...
t('project.status.SALES')         // En vente / Verkauf / ...
t('project.status.CONSTRUCTION')  // En chantier / Bau / ...
t('project.status.DELIVERED')     // Livré / Geliefert / ...
```

### Erreurs
```typescript
t('errors.genericError')      // Une erreur est survenue / ...
t('errors.notFound')         // Élément introuvable / ...
t('errors.unauthorized')     // Accès non autorisé / ...
t('errors.validationError')  // Erreur de validation / ...
```

---

## ⚡ Quick Migration Script

Pour accélérer la migration, utilisez ces regex de remplacement:

### 1. Remplacer textes simples

**Rechercher**: `>Projets<`
**Remplacer**: `>{t('nav.projects')}<`

**Rechercher**: `>Enregistrer<`
**Remplacer**: `>{t('actions.save')}<`

### 2. Remplacer placeholders

**Rechercher**: `placeholder="Rechercher"`
**Remplacer**: `placeholder={t('actions.search')}`

### 3. Ajouter import

Au début de chaque fichier migré:
```typescript
import { useI18n } from '../lib/i18n';
```

Dans le composant:
```typescript
const { t } = useI18n();
```

---

## 🧪 Test Checklist

Après migration d'un composant:

### Tests Visuels
- [ ] Affichage correct en français (fr-CH)
- [ ] Affichage correct en allemand (de-CH)
- [ ] Affichage correct en italien (it-CH)
- [ ] Affichage correct en anglais (en-GB)

### Tests Fonctionnels
- [ ] Changement langue via LanguageSwitcher fonctionne
- [ ] Paramètres dynamiques s'affichent correctement
- [ ] Statuts dynamiques traduisent bien
- [ ] Aucune clé manquante (pas de `lot.status.AVAILABLE` affiché brut)

### Tests Console
```tsx
// Dans le composant
const { t, language } = useI18n();
console.log('Current language:', language);
console.log('Translation test:', t('nav.projects'));
```

---

## 📊 Composants Prioritaires à Migrer

### Priorité 1 (High Impact)
1. **Topbar** - Navigation principale + LanguageSwitcher
2. **Sidebar** - Menu navigation
3. **NotificationBell** - Affichage notifications i18n
4. **Dashboard** - KPIs et widgets
5. **BrokerLots** - Programme de vente

### Priorité 2 (Medium Impact)
6. **TasksManager** - Gestion tâches
7. **ProjectPlanning** - Planning Gantt
8. **BuyerMaterialChoices** - Choix matériaux
9. **ReportingOverview** - Rapports
10. **TemplatesManager** - Templates

### Priorité 3 (Low Impact)
11. Forms secondaires
12. Dialogs et modals
13. Error boundaries
14. Loading states

---

## 🎯 Pattern de Migration

**Template standard**:

```tsx
// 1. Import hook
import { useI18n } from '../lib/i18n';

export function MyComponent() {
  // 2. Utiliser hook
  const { t, language } = useI18n();

  // 3. Remplacer textes
  return (
    <div>
      <h1>{t('section.title')}</h1>
      <p>{t('section.description')}</p>
      <button>{t('actions.save')}</button>
    </div>
  );
}
```

---

## 💡 Tips & Astuces

### 1. Éviter Duplication

**❌ Mauvais**:
```json
{
  "save": "Enregistrer",
  "saveButton": "Enregistrer",
  "saveAction": "Enregistrer"
}
```

**✅ Bon**:
```json
{
  "actions": {
    "save": "Enregistrer"
  }
}
```

Utiliser partout: `t('actions.save')`

### 2. Grouper par Feature

**✅ Organisation**:
```json
{
  "lot": {
    "label": "Lot",
    "number": "Numéro de lot",
    "status": { ... }
  },
  "project": {
    "label": "Projet",
    "name": "Nom du projet",
    "status": { ... }
  }
}
```

### 3. Paramètres Nommés

**❌ Mauvais**:
```json
{
  "message": "Le lot {{0}} pour {{1}} est {{2}}"
}
```

**✅ Bon**:
```json
{
  "message": "Le lot {{lotNumber}} pour {{buyer}} est {{status}}"
}
```

### 4. Fallback Intelligent

```tsx
// Si clé manquante, utiliser valeur par défaut
const title = t('notifications.unknown', { defaultValue: 'Notification' });
```

---

## 📚 Resources

- **Config i18n**: `src/lib/i18n/config.ts`
- **Hook**: `src/lib/i18n/index.ts`
- **Helpers**: `src/lib/i18n/helpers.ts`
- **Traductions**: `src/lib/i18n/locales/*.json`
- **Composant**: `src/components/LanguageSwitcher.tsx`
- **Edge Function**: `supabase/functions/i18n/index.ts`
- **Guide complet**: `I18N_COMPLETE_GUIDE.md`

---

## ✅ Checklist Projet Complet

### Backend
- [x] Migration SQL appliquée
- [x] Fonction `resolve_user_locale` créée
- [x] Edge Function i18n déployée
- [ ] Scheduler migré vers i18n_key/i18n_params
- [ ] Templates e-mail créés par langue

### Frontend
- [x] react-i18next installé
- [x] Config i18n créée
- [x] 4 fichiers traductions complets
- [x] Hook useI18n créé
- [x] LanguageSwitcher créé
- [ ] Topbar migré
- [ ] Sidebar migré
- [ ] NotificationBell migré
- [ ] Dashboard migré
- [ ] Autres pages migrées

### Tests
- [ ] Changement langue fonctionne
- [ ] Traductions affichent correctement (4 langues)
- [ ] Notifications i18n fonctionnent
- [ ] Datatrans multilingue testé
- [ ] Build production OK

---

## 🚀 Go Live

Une fois tous les composants migrés:

1. **Tester exhaustivement** les 4 langues
2. **Mettre à jour** seed data avec locales
3. **Communiquer** changement aux utilisateurs
4. **Monitorer** logs erreurs traduction manquante
5. **Itérer** sur feedback utilisateurs

---

**Migration i18n complète = Plateforme ready pour l'expansion internationale! 🌍🚀**
