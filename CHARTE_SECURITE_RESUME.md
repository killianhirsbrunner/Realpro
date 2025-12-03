# CHARTE DE SÉCURITÉ (VERSION RÉSUMÉ)
## Realpro Suite — Engagements Realpro SA + Bonnes Pratiques Client

**Version simplifiée pour lecture rapide**
**Pour la version complète, voir : `CHARTE_SECURITE.md`**

---

## 1. ENGAGEMENTS DE REALPRO SA

### 1.1 Sécurité technique

**Infrastructure**
- ✅ **Chiffrement TLS/SSL** (HTTPS obligatoire sur toutes les pages)
- ✅ **Chiffrement at rest** AES-256 (données sensibles)
- ✅ **Pare-feu applicatif** (WAF - Web Application Firewall)
- ✅ **Protection DDoS** (anti-déni de service)
- ✅ **IDS/IPS** (détection et prévention d'intrusions)

**Sauvegardes**
- ✅ **Backups quotidiens** automatiques (02h00 CET/CEST)
- ✅ **Rétention 30 jours** (quotidiennes) + 12 semaines (hebdomadaires) + 12 mois (mensuelles)
- ✅ **Chiffrement AES-256** des sauvegardes
- ✅ **Tests de restauration** mensuels
- ✅ **Stockage géographiquement distinct**

**Contrôles d'accès**
- ✅ **RBAC** (Role-Based Access Control) : accès basés sur les rôles et permissions
- ✅ **Isolation logique** par organisation (chaque client est isolé)
- ✅ **Authentification forte** (MFA disponible pour tous les utilisateurs)
- ✅ **Logs d'audit** (traçabilité de toutes les actions sensibles)

### 1.2 Sécurité organisationnelle

**Accès internes Realpro SA**
- ✅ Accès **restreints** aux seuls employés autorisés
- ✅ **Audit interne** et journalisation de tous les accès admin
- ✅ **MFA obligatoire** pour tous les administrateurs Realpro SA
- ✅ **VPN sécurisé** pour accès aux serveurs de production
- ✅ **Formation annuelle** du personnel sur la sécurité

**Surveillance**
- ✅ **Monitoring 24/7** de l'infrastructure
- ✅ **Alertes automatiques** en cas d'événement suspect
- ✅ **Scans de sécurité** hebdomadaires (automatisés)
- ✅ **Pentests annuels** (tests de pénétration par cabinet externe)
- ✅ **Veille CVE** (Common Vulnerabilities and Exposures)

### 1.3 Conformité et certifications

**Conformité légale**
- ✅ **LPD** (Loi fédérale suisse sur la protection des données)
- ✅ **RGPD** (Règlement Général sur la Protection des Données - UE)
- ✅ **PCI-DSS** (via Datatrans pour les paiements)

**Certifications visées**
- 🔄 **ISO 27001** (Management de la sécurité de l'information) — en cours
- 🔄 **SOC 2 Type II** (Security, Availability, Confidentiality) — en cours

### 1.4 Hébergement sécurisé

**Hébergeur :** Supabase / AWS (Amazon Web Services)

**Localisation :**
- 🇨🇭 **Suisse** ou
- 🇪🇺 **Union Européenne** (Frankfurt, Allemagne)

**Certifications hébergeur :**
- ISO 27001
- SOC 2 Type II
- PCI-DSS niveau 1
- Conforme RGPD

---

## 2. BONNES PRATIQUES POUR LES CLIENTS

### 2.1 Authentification et mots de passe

**Ce que VOUS devez faire :**

✅ **Activer l'authentification à deux facteurs (MFA)** dès que disponible
- Utiliser une app TOTP (Google Authenticator, Authy, etc.) ou SMS
- Obligatoire pour les administrateurs de votre organisation

✅ **Utiliser des mots de passe forts**
- Minimum **12 caractères**
- Mélange de majuscules, minuscules, chiffres et caractères spéciaux
- Unique pour chaque service (ne pas réutiliser)

✅ **Utiliser un gestionnaire de mots de passe**
- 1Password, Bitwarden, LastPass, etc.
- Ne jamais stocker les mots de passe en clair (post-it, fichiers non chiffrés)

❌ **Ne JAMAIS partager vos identifiants**
- Chaque utilisateur doit avoir son propre compte
- Ne pas créer de "comptes partagés"

### 2.2 Gestion des accès utilisateurs

✅ **Limiter l'accès au strict nécessaire** (principe du moindre privilège)
- Chaque utilisateur ne doit voir que les projets qui le concernent
- Utiliser les rôles prédéfinis (Promoteur, EG, Notaire, Acheteur, etc.)

✅ **Désactiver immédiatement les comptes des employés sortants**
- Licenciement, démission, fin de mission
- Révoquer les accès dans les 24 heures

✅ **Réviser régulièrement les permissions** (au moins 2 fois par an)
- Supprimer les comptes inactifs (> 6 mois)
- Vérifier que les permissions sont à jour

✅ **Former vos utilisateurs** aux bonnes pratiques de sécurité
- Sensibilisation au phishing
- Politique de mots de passe
- Signalement d'incidents

### 2.3 Protection des données sensibles

✅ **Importer uniquement les données nécessaires**
- Ne pas uploader de documents inutiles ou non liés au projet
- Supprimer les documents obsolètes

✅ **Vérifier la conformité juridique** des documents
- Contrats, factures, plans doivent être valides et à jour
- Respecter la LPD pour les données personnelles (acheteurs, employés)

✅ **Protéger les documents sensibles** avec des permissions adaptées
- Passeports et pièces d'identité : accès limité (notaire, admin)
- Données financières : accès limité (comptable, promoteur)

❌ **Ne pas téléverser de fichiers suspects**
- Fichiers provenant de sources non fiables
- Fichiers exécutables (.exe, .bat, .sh)
- Archives protégées par mot de passe inconnu

### 2.4 Vigilance face aux menaces

✅ **Se méfier du phishing** (emails frauduleux)
- Vérifier l'expéditeur (domaine @realpro.ch uniquement)
- Ne pas cliquer sur des liens suspects
- Ne jamais communiquer votre mot de passe par email

✅ **Vérifier l'URL** avant de saisir vos identifiants
- Doit commencer par **https://realpro.ch** (ou votre domaine custom)
- Vérifier le cadenas de sécurité dans le navigateur

✅ **Signaler immédiatement toute activité suspecte**
- Connexions inhabituelles (lieu, heure)
- Modifications non autorisées de documents ou projets
- Emails suspects prétendant venir de Realpro SA

**Contact sécurité :** [security@realpro.ch](mailto:security@realpro.ch)

### 2.5 Sécurité des postes de travail

✅ **Maintenir votre système à jour**
- Installer les mises à jour de sécurité (Windows Update, macOS Update)
- Utiliser un antivirus/antimalware à jour

✅ **Se déconnecter** après utilisation
- Surtout sur ordinateurs partagés
- Fermer le navigateur complètement

✅ **Utiliser des connexions sécurisées**
- Éviter les WiFi publics non sécurisés pour accéder au logiciel
- Utiliser un **VPN** si connexion depuis l'extérieur de l'entreprise

✅ **Verrouiller votre poste** quand vous vous absentez
- Windows : Touche Windows + L
- macOS : Control + Command + Q

---

## 3. GESTION DES DOCUMENTS ET SAV

### 3.1 Documents projets

✅ **Vérifier la conformité juridique**
- Contrats de vente valides et signés
- Factures QR conformes (Swiss QR-bill)
- Plans officiels et à jour

✅ **Classifier correctement** les documents
- Utiliser les catégories prédéfinies
- Nommer les fichiers de manière explicite (pas "document1.pdf")

### 3.2 Photos de chantier

✅ **Respecter les droits à l'image**
- Floutage des visages si nécessaire
- Autorisation des personnes identifiables

✅ **Géolocalisation** (métadonnées EXIF)
- Attention aux photos contenant des données de localisation sensibles

---

## 4. PROTOCOLES EN CAS D'INCIDENT

### 4.1 Engagements Realpro SA

En cas d'**incident de sécurité** (data breach, cyberattaque, etc.), Realpro SA s'engage à :

1. **Notifier le Client** dans les **72 heures** après prise de connaissance
2. **Documenter l'incident** (nature, impact, données concernées)
3. **Fournir un rapport technique** détaillé
4. **Assister le Client** dans la notification aux autorités (PFPDT, CNIL) si nécessaire
5. **Aider au rétablissement** (restauration de données, changement mots de passe, etc.)

### 4.2 Procédure pour le Client

Si vous **détectez ou suspectez** un incident de sécurité :

**1. Signaler immédiatement**
- Email : [security@realpro.ch](mailto:security@realpro.ch)
- Téléphone (Enterprise/Custom) : [à compléter]

**2. Fournir les informations suivantes**
- Date et heure de l'incident
- Utilisateur(s) concerné(s)
- Nature du problème (connexion non autorisée, document supprimé, etc.)
- Captures d'écran ou logs si disponibles

**3. Ne pas modifier les preuves**
- Ne pas supprimer de logs
- Ne pas modifier les données affectées (sauf si risque immédiat)

**4. Changer les mots de passe** si compromission suspectée
- Utilisateur concerné
- Administrateurs

**5. Documenter** l'incident pour votre propre audit interne

---

## 5. SAUVEGARDES ET EXPORT

### 5.1 Responsabilité du Client

**Realpro SA effectue des sauvegardes quotidiennes**, MAIS :

⚠️ **Vous devez également effectuer vos propres exports réguliers** de documents critiques :

- Contrats signés
- Actes notariaux
- Documents juridiques importants
- Factures émises

**Fréquence recommandée :** mensuelle minimum

### 5.2 Export de données

Vous pouvez à tout moment demander un **export complet** de vos données :

- Via l'interface (si disponible)
- Via le support : [support@realpro.ch](mailto:support@realpro.ch)

**Format :** Archive ZIP avec :
- Tous les documents uploadés
- Données structurées (projets, lots, acheteurs, etc.) en JSON/CSV/SQL
- Factures générées

**Délai de livraison :** 7 jours ouvrés maximum

---

## 6. CONFORMITÉ LPD / RGPD

### 6.1 Responsabilités du Client (Responsable du traitement)

Vous êtes **responsable** de :

✅ **Informer** les personnes concernées (acheteurs, employés) du traitement de leurs données
✅ **Obtenir les consentements** nécessaires (si applicable)
✅ **Respecter les droits** des personnes (accès, rectification, effacement)
✅ **Limiter** la collecte de données au strict nécessaire
✅ **Paramétrer correctement** les accès et permissions

### 6.2 Assistance Realpro SA (Sous-traitant)

Realpro SA vous assiste pour :

✅ Répondre aux demandes d'accès/rectification/effacement (outils dans l'interface)
✅ Fournir les logs nécessaires en cas d'audit
✅ Export de données sur demande
✅ Notification de violation de données (data breach) sous 72h

---

## 7. CONTACT SÉCURITÉ

**Incidents de sécurité :** [security@realpro.ch](mailto:security@realpro.ch)
**Support technique :** [support@realpro.ch](mailto:support@realpro.ch)
**Questions DPO :** [dpo@realpro.ch](mailto:dpo@realpro.ch) (si applicable)

**Téléphone urgence (Enterprise/Custom) :** [à compléter]

---

## 8. RÉVISIONS

Cette Charte de Sécurité est **révisée au minimum annuellement**.

**Dernière révision :** 3 décembre 2025
**Prochaine révision prévue :** Décembre 2026

---

## 9. DOCUMENTS ASSOCIÉS

- **Charte de Sécurité complète** : `CHARTE_SECURITE.md` (15 sections détaillées)
- **SLA** : `SLA_SERVICE_LEVEL_AGREEMENT.md`
- **DPA** : `DPA_DATA_PROCESSING_AGREEMENT.md`
- **Politique de confidentialité** : `/legal/privacy`

---

## RÉSUMÉ DES BONNES PRATIQUES

| ✅ À FAIRE | ❌ À NE PAS FAIRE |
|-----------|-------------------|
| Activer la MFA (double authentification) | Partager vos identifiants |
| Utiliser des mots de passe forts (12+ caractères) | Réutiliser le même mot de passe |
| Désactiver les comptes sortants immédiatement | Laisser des comptes inactifs |
| Limiter les accès au strict nécessaire | Donner des droits admin à tous |
| Se déconnecter après utilisation | Rester connecté sur ordinateurs partagés |
| Vérifier l'URL avant de saisir vos identifiants | Cliquer sur des liens suspects |
| Signaler immédiatement les activités suspectes | Ignorer les alertes de sécurité |
| Exporter régulièrement vos documents critiques | Compter uniquement sur les backups Realpro |

---

**La sécurité est une responsabilité partagée entre Realpro SA et ses clients.**

**Ensemble, protégeons vos données.**

---

**Document établi le :** 3 décembre 2025
**Version :** 1.0 (Résumé)

**Realpro SA – Yverdon-les-Bains (VD), Suisse**
