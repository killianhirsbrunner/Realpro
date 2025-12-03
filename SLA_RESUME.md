# SLA — SERVICE LEVEL AGREEMENT (VERSION RÉSUMÉ)
## Engagements de service — Realpro Suite

**Version simplifiée pour lecture rapide**
**Pour la version complète et légale, voir : `SLA_SERVICE_LEVEL_AGREEMENT.md`**

---

## 1. OBJET

Ce SLA définit les **engagements de Realpro SA** en termes de :

- **Disponibilité** du service (uptime)
- **Performance** de la plateforme
- **Support** technique et délais de réponse
- **Maintenance** planifiée et d'urgence

Il s'applique aux **Clients professionnels B2B** ayant souscrit une formule **Professional**, **Enterprise** ou **Custom**.

---

## 2. DISPONIBILITÉ (UPTIME)

### 2.1 Engagements selon formule

| Formule | Disponibilité cible (annuelle) | Indisponibilité max/mois |
|---------|--------------------------------|--------------------------|
| **Basic** | Meilleur effort (pas de SLA) | Non garanti |
| **Professional** | 99,5% | 3h36 (216 minutes) |
| **Enterprise** | 99,7% | 2h10 (130 minutes) |
| **Custom** | 99,9% | 43 minutes |

### 2.2 Exclusions du calcul

Ne sont **pas comptées** comme indisponibilité :

- **Maintenance planifiée** (notifiée 48h à l'avance)
- **Force majeure** (catastrophes naturelles, cyberattaques massives, etc.)
- **Pannes de l'hébergeur** ou infrastructures tierces (hors contrôle Realpro SA)
- **Problèmes de connexion Internet** du Client
- **Indisponibilités causées par le Client** (mauvaise configuration, surcharge volontaire)
- **Navigateurs obsolètes** ou non supportés
- **Utilisation non conforme** aux CGU

### 2.3 Mesure de la disponibilité

- Monitoring automatique **24h/24, 7j/7**
- Tests fonctionnels toutes les **5 minutes**
- Tableau de bord public : **[status.realpro.ch]** (à configurer)

---

## 3. PERFORMANCE

### 3.1 Temps de réponse cibles

| Type de page | Temps de réponse (P95) |
|--------------|------------------------|
| Dashboard / Accueil | < 2 secondes |
| Listes (projets, lots) | < 3 secondes |
| Formulaires de saisie | < 2 secondes |
| Recherches simples | < 2 secondes |
| Génération PDF | < 10 secondes |
| Exports ZIP complets | < 60 secondes |

**P95** = 95% des requêtes respectent ce temps

### 3.2 API & Intégrations
- Temps de réponse API cible : **< 300 ms**
- Latence uploads lourds : **< 3 secondes**
- Synchronisation asynchrone via worker

---

## 4. MAINTENANCE

### 4.1 Maintenance planifiée
- **Fenêtre préférentielle** : Dimanche 22h00 → Lundi 02h00 (heure suisse)
- **Durée maximale** : 4 heures
- **Notification** : au moins **48 heures** à l'avance par email

### 4.2 Maintenance corrective
- **Bugs critiques** → résolution sous **24-72h** selon SLA
- **Bugs majeurs** → résolution sous **3-5 jours**
- **Bugs mineurs** → résolution sous **7-30 jours**

### 4.3 Maintenance évolutive (incluse)
- Nouveaux modules et fonctionnalités
- Optimisations de performance
- Améliorations UX/UI
- Mises à jour de sécurité

### 4.4 Maintenance de sécurité
- **Patchs de sécurité** : appliqués sous **48 heures**
- **Vulnérabilités critiques** : correction sous **24 heures**
- **Mises à jour urgentes** : sans préavis (zero-day exploits)
- Surveillance **24/7** des infrastructures

---

## 5. SUPPORT TECHNIQUE

### 5.1 Niveaux de support selon formule

| Formule | Canaux | Délai réponse | Disponibilité |
|---------|--------|---------------|---------------|
| **Basic** | Email / Ticket | 48h ouvrées | Lun-Ven 9h-17h |
| **Professional** | Email / Ticket / Chat | 24h ouvrées | Lun-Ven 8h-18h |
| **Enterprise** | Email / Ticket / Chat / Téléphone | 4h ouvrées (critique : 1h) | Lun-Ven 8h-18h + Astreinte |
| **Custom** | Dédié + SLA personnalisé | Selon contrat | Selon contrat |

### 5.2 Classification des tickets

**P1 — Critique**
- Service totalement inaccessible
- Perte de données
- Bug bloquant l'utilisation complète

**P2 — Haute**
- Fonctionnalité majeure inaccessible
- Dégradation significative de performance

**P3 — Moyenne**
- Fonctionnalité secondaire inaccessible
- Bug gênant mais contournable

**P4 — Basse**
- Question générale
- Bug cosmétique

### 5.3 Délais de résolution cibles

| Priorité | Professional | Enterprise |
|----------|--------------|------------|
| **P1 - Critique** | 2 jours ouvrés | 4 heures |
| **P2 - Haute** | 3 jours ouvrés | 1 jour ouvré |
| **P3 - Moyenne** | 5 jours ouvrés | 3 jours ouvrés |
| **P4 - Basse** | 10 jours ouvrés | 5 jours ouvrés |

### 5.4 Langues supportées
- Français
- Allemand
- Italien
- Anglais

---

## 6. SAUVEGARDES ET RESTAURATION

### 6.1 Politique de sauvegarde

**Sauvegardes quotidiennes**
- Fréquence : tous les jours à **02h00 CET/CEST**
- Rétention : **30 jours**

**Sauvegardes hebdomadaires**
- Fréquence : tous les dimanches
- Rétention : **12 semaines**

**Sauvegardes mensuelles**
- Fréquence : premier dimanche du mois
- Rétention : **12 mois**

**Toutes les sauvegardes sont chiffrées AES-256.**

### 6.2 Restauration de données

| Formule | Délai de restauration | Gratuit |
|---------|----------------------|---------|
| **Professional** | 48h ouvrées | 1 fois/an (complète) |
| **Enterprise** | 4h ouvrées | 3 fois/an (partielle) |
| **Custom** | < 2h (selon contrat) | Selon contrat |

Au-delà : facturation au tarif horaire

### 6.3 Tests de restauration
- Tests réguliers de restauration (mensuels)
- Validation de l'intégrité des sauvegardes

---

## 7. SÉCURITÉ

### 7.1 Mesures de sécurité

**Infrastructure**
- Pare-feu (WAF - Web Application Firewall)
- Protection anti-DDoS
- IDS/IPS (détection et prévention d'intrusions)

**Application**
- Chiffrement TLS/SSL (HTTPS obligatoire)
- Authentification forte (MFA disponible)
- Protection OWASP Top 10 (injection SQL, XSS, etc.)

**Données**
- Chiffrement at rest (AES-256)
- Contrôles d'accès RBAC (basés sur les rôles)
- Logs d'audit (traçabilité 12-36 mois)

### 7.2 Tests de sécurité
- **Scans de vulnérabilités** : hebdomadaires (automatisés)
- **Pentests externes** : annuels (par cabinet spécialisé)
- **Audits de sécurité** : annuels

### 7.3 Notification de faille
En cas de **data breach**, Realpro SA s'engage à :
- Notifier le Client sous **72 heures**
- Fournir un rapport détaillé
- Assister dans la notification aux autorités (PFPDT, CNIL)

---

## 8. COMPENSATION EN CAS DE NON-RESPECT

**Pour clients Enterprise et Custom uniquement :**

| Disponibilité atteinte | Compensation (crédit) |
|------------------------|-----------------------|
| < 99,5% mais ≥ 99,0% | 5% du montant mensuel |
| < 99,0% mais ≥ 97,0% | 10% du montant mensuel |
| < 97,0% | 20% du montant mensuel |

**Compensation maximale : 20% du montant mensuel**

**Conditions :**
- Signalement sous **7 jours** après l'incident
- Fourniture d'éléments de preuve (captures, logs)
- Client à jour de ses paiements

---

## 9. CONTINUITÉ ET REPRISE D'ACTIVITÉ

### 9.1 Objectifs de reprise

| Indicateur | Professional | Enterprise |
|------------|--------------|------------|
| **RPO** (Recovery Point Objective) | < 24 heures | < 5 minutes (réplication temps réel) |
| **RTO** (Recovery Time Objective) | < 4 heures | < 1 heure |

**RPO** = Perte de données maximale acceptable
**RTO** = Temps de rétablissement du service maximal

### 9.2 Plan de Continuité d'Activité (PCA)
- PCA testé **annuellement**
- Couvre : pannes matérielles, incidents réseau, cyberattaques, catastrophes

---

## 10. JURIDICTION

### 10.1 Droit applicable
**Droit suisse**

### 10.2 Juridiction compétente
**Tribunaux ordinaires du district du Jura-Nord vaudois**
**Yverdon-les-Bains, Canton de Vaud, Suisse**

---

## 11. CONTACT

**Support technique :** [support@realpro.ch](mailto:support@realpro.ch)
**SLA et incidents :** [sla@realpro.ch](mailto:sla@realpro.ch)
**Téléphone (Enterprise/Custom) :** [à compléter]
**Statut du service :** [status.realpro.ch]

---

## 12. DOCUMENTS ASSOCIÉS

- **SLA complet** : `SLA_SERVICE_LEVEL_AGREEMENT.md` (14 sections détaillées)
- **Contrat SaaS B2B** : `CONTRAT_SAAS_B2B.md`
- **Charte de Sécurité** : `CHARTE_SECURITE.md`
- **DPA** : `DPA_DATA_PROCESSING_AGREEMENT.md`

---

**Document établi le :** 3 décembre 2025
**Version :** 1.0 (Résumé)
**Annexe au Contrat SaaS Realpro Suite**

**Realpro SA – Yverdon-les-Bains (VD), Suisse**
