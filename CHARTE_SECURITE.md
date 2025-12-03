# CHARTE DE SÉCURITÉ
## Realpro Suite – Realpro SA

**Politique de Sécurité de l'Information**

**Version :** 1.0
**Date :** 3 décembre 2025

---

## 1. INTRODUCTION

### 1.1 Objet

La présente Charte de Sécurité définit les **engagements de Realpro SA** et les **bonnes pratiques** recommandées aux clients et utilisateurs pour assurer la sécurité de la plateforme Realpro Suite.

### 1.2 Périmètre

Cette charte s'applique à :

- L'**infrastructure** technique de Realpro Suite
- L'**application web** et ses fonctionnalités
- Les **données** hébergées sur la plateforme
- Les **accès** des utilisateurs et administrateurs
- Les **sous-traitants** et prestataires de Realpro SA

### 1.3 Objectifs

Les objectifs de sécurité de Realpro SA sont :

1. **Confidentialité** : garantir que seules les personnes autorisées accèdent aux données
2. **Intégrité** : prévenir toute modification non autorisée des données
3. **Disponibilité** : assurer un accès continu au service (objectif : 99,5%)
4. **Traçabilité** : maintenir des logs d'audit pour investigation
5. **Conformité** : respecter la LPD, le RGPD et les normes de sécurité

---

## 2. GOUVERNANCE DE LA SÉCURITÉ

### 2.1 Responsable sécurité

Realpro SA a désigné un **Responsable de la Sécurité des Systèmes d'Information** (RSSI) chargé de :

- Définir la **politique de sécurité**
- Superviser la **mise en œuvre** des mesures techniques et organisationnelles
- Coordonner les **audits de sécurité**
- Gérer les **incidents de sécurité**
- Assurer la **conformité** réglementaire

**Contact sécurité :** [security@realpro.ch](mailto:security@realpro.ch)

### 2.2 Comité de sécurité

Un comité de sécurité se réunit **trimestriellement** pour :

- Évaluer les **risques** de sécurité
- Valider les **investissements** en sécurité
- Suivre les **indicateurs** de sécurité (KPIs)
- Réviser la **politique** de sécurité

### 2.3 Formation du personnel

Tous les employés de Realpro SA reçoivent une **formation annuelle** sur :

- Les **risques** de sécurité (phishing, ingénierie sociale, etc.)
- Les **bonnes pratiques** (mots de passe, chiffrement, etc.)
- Les **obligations légales** (LPD, RGPD, confidentialité)
- La **gestion des incidents**

---

## 3. SÉCURITÉ DE L'INFRASTRUCTURE

### 3.1 Hébergement

**Hébergeur :** Supabase / AWS (Amazon Web Services)

**Localisation :**
- **Primaire** : UE (Frankfurt, Allemagne) ou Suisse (selon configuration)
- **Secondaire** : réplication géographique sur 2 zones distinctes (formules Enterprise et Custom)

**Certifications de l'hébergeur :**
- ISO 27001 (sécurité de l'information)
- SOC 2 Type II (sécurité, disponibilité, confidentialité)
- PCI-DSS (sécurité des paiements)
- Conformité RGPD

### 3.2 Architecture réseau

**Protection périmétrique :**
- **Pare-feu** (firewall) applicatif et réseau
- **WAF** (Web Application Firewall) pour filtrer les attaques web
- **DDoS protection** (protection contre les attaques par déni de service)
- **IDS/IPS** (systèmes de détection et prévention d'intrusions)

**Segmentation :**
- Séparation réseau entre **production**, **staging** et **développement**
- Isolation des **bases de données** dans des sous-réseaux privés
- **VPN sécurisé** pour l'accès administratif

### 3.3 Serveurs et systèmes d'exploitation

**Mise à jour :**
- **Patches de sécurité** appliqués dans les **48 heures** suivant leur publication
- **Mises à jour critiques** appliquées en urgence
- Tests de non-régression avant application en production

**Durcissement (hardening) :**
- Désactivation des **services inutiles**
- Fermeture des **ports non nécessaires**
- Configuration **minimale** des droits d'accès

### 3.4 Sauvegardes

**Fréquence :**
- **Quotidienne** (tous les jours à 02h00 CET/CEST)
- **Hebdomadaire** (tous les dimanches)
- **Mensuelle** (premier dimanche du mois)

**Rétention :**
- Sauvegardes quotidiennes : **30 jours**
- Sauvegardes hebdomadaires : **12 semaines**
- Sauvegardes mensuelles : **12 mois**

**Sécurité des sauvegardes :**
- **Chiffrement AES-256** des sauvegardes
- Stockage sur infrastructure **géographiquement distincte**
- **Tests de restauration** mensuels

**RPO/RTO :**
- **RPO** (Recovery Point Objective) : < 24 heures (Professional), < 5 minutes (Enterprise avec réplication)
- **RTO** (Recovery Time Objective) : < 4 heures (Professional), < 1 heure (Enterprise)

---

## 4. SÉCURITÉ APPLICATIVE

### 4.1 Développement sécurisé

Realpro SA applique les principes du **Secure Development Lifecycle (SDL)** :

**Phase de conception :**
- **Threat modeling** (modélisation des menaces)
- **Analyse de risques**
- **Privacy by Design** (protection des données dès la conception)

**Phase de développement :**
- **Coding standards** (conventions de codage sécurisé)
- **Revue de code** (code review) systématique
- Utilisation de **librairies sécurisées** et à jour
- Respect des **OWASP Top 10** (principales vulnérabilités web)

**Phase de test :**
- **Tests unitaires** de sécurité
- **Tests d'intégration**
- **Tests de pénétration** (pentests) annuels
- **Scans de vulnérabilités** automatisés (hebdomadaires)

### 4.2 Protection contre les vulnérabilités

**OWASP Top 10 (2021) :**

| Vulnérabilité | Mesures de protection |
|---------------|------------------------|
| **A01 - Injection SQL** | ORM (Object-Relational Mapping), requêtes paramétrées, validation des entrées |
| **A02 - Failles d'authentification** | Authentification forte (MFA optionnelle), hachage bcrypt, verrouillage après échecs |
| **A03 - Exposition de données** | Chiffrement TLS/SSL, chiffrement at rest, contrôle d'accès strict |
| **A04 - XXE** | Désactivation du parsing XML externe |
| **A05 - Broken Access Control** | RBAC (contrôle d'accès basé sur les rôles), vérification systématique des permissions |
| **A06 - Mauvaise configuration** | Hardening des serveurs, suppression des services inutiles, audits réguliers |
| **A07 - XSS** | Échappement des sorties, Content Security Policy (CSP), validation des entrées |
| **A08 - Désérialisation** | Validation stricte, signature des objets sérialisés |
| **A09 - Composants vulnérables** | Veille CVE, mise à jour automatique des dépendances (Dependabot), scans SCA |
| **A10 - Logs insuffisants** | Logs d'audit centralisés, monitoring des événements de sécurité, alertes automatiques |

### 4.3 Chiffrement

**Chiffrement en transit (TLS/SSL) :**
- **TLS 1.2** minimum (préférence TLS 1.3)
- Protocole **HTTPS** obligatoire sur toutes les pages
- **HSTS** (HTTP Strict Transport Security) activé
- Certificats SSL **valides et à jour**

**Chiffrement at rest :**
- **Base de données** : chiffrement AES-256 des données sensibles (documents d'identité, IBAN, etc.)
- **Fichiers uploadés** : chiffrement AES-256
- **Sauvegardes** : chiffrement AES-256

**Gestion des clés de chiffrement :**
- Stockage sécurisé dans un **HSM** (Hardware Security Module) ou **KMS** (Key Management Service)
- Rotation des clés **annuelle**
- Séparation des **clés de prod** et de **staging**

---

## 5. CONTRÔLE D'ACCÈS

### 5.1 Authentification

**Méthodes d'authentification :**
- **Email + mot de passe** (obligatoire)
- **MFA** (Multi-Factor Authentication) optionnelle via TOTP ou SMS (recommandée pour administrateurs)
- **SSO** (Single Sign-On) via SAML 2.0 ou OAuth 2.0 (formules Enterprise et Custom)

**Politique de mots de passe :**
- Longueur **minimale** : 12 caractères
- Complexité **recommandée** : majuscules, minuscules, chiffres, caractères spéciaux
- **Hachage** : bcrypt avec salt unique
- **Historique** : interdiction de réutiliser les 5 derniers mots de passe
- **Expiration** : aucune (selon recommandations NIST 2023)

**Verrouillage de compte :**
- Après **5 tentatives échouées** consécutives
- Durée de verrouillage : **15 minutes** (ou déverrouillage manuel par admin)

### 5.2 Gestion des sessions

- **Timeout** : 30 minutes d'inactivité (configurable selon organisation)
- **Token** : JWT (JSON Web Token) avec signature RSA-256
- **Révocation** : possibilité de révoquer les sessions actives
- **Cookie** : attributs `Secure`, `HttpOnly`, `SameSite=Strict`

### 5.3 Contrôle d'accès basé sur les rôles (RBAC)

**Rôles prédéfinis :**

| Rôle | Permissions |
|------|-------------|
| **Super Admin** | Toutes les permissions (gestion organisation, utilisateurs, projets) |
| **Admin Projet** | Gestion complète d'un projet spécifique |
| **Promoteur** | Création/modification de projets, ventes, budgets |
| **EG (Entreprise Générale)** | Soumissions, contrats, planning chantier |
| **Notaire** | Accès aux actes notariaux, signatures |
| **Courtier** | Lots, réservations, contrats de vente |
| **Acheteur** | Lecture seule de son lot, choix matériaux, SAV |
| **Fournisseur** | Rendez-vous showrooms, matériaux |
| **Comptable** | Factures, paiements, exports comptables |
| **Utilisateur** | Accès limité selon projet |

**Principe du moindre privilège :**
- Chaque utilisateur dispose uniquement des **permissions nécessaires** à ses fonctions
- Les droits d'administration sont **strictement limités**
- Revue **annuelle** des permissions

### 5.4 Accès administratif

**Accès aux serveurs :**
- **VPN sécurisé** obligatoire
- **Authentification à 2 facteurs** (2FA) obligatoire
- **SSH avec clés** (pas de mots de passe)
- **Logs** de toutes les connexions administratives

**Accès à la base de données :**
- **Pas d'accès direct** en production (sauf urgence)
- **Jump server** (bastion host) pour accès limité
- **Logs** de toutes les requêtes sensibles

---

## 6. SURVEILLANCE ET DÉTECTION

### 6.1 Monitoring de sécurité

**Surveillance 24/7 :**
- **IDS/IPS** (détection et prévention d'intrusions)
- **SIEM** (Security Information and Event Management) pour centralisation des logs
- **Alertes automatiques** en cas d'événement suspect

**Indicateurs surveillés :**
- Tentatives de connexion **échouées**
- Modification des **permissions** ou des **rôles**
- Accès aux **données sensibles**
- Upload de **fichiers suspects**
- Trafic **anormal** (pics de requêtes, scans de ports)
- Modification de **configurations critiques**

### 6.2 Logs d'audit

**Conservation :**
- **Logs applicatifs** : 12 mois
- **Logs de sécurité** : 24 mois
- **Logs d'accès admin** : 36 mois

**Contenu des logs :**
- **Date et heure** (horodatage précis)
- **Utilisateur** (ID + nom)
- **Action effectuée** (lecture, écriture, suppression)
- **Ressource** concernée (projet, lot, document)
- **Adresse IP** et user agent
- **Résultat** (succès ou échec)

**Protection des logs :**
- Logs **immuables** (write-once)
- Stockage **centralisé** et **chiffré**
- Accès **restreint** au RSSI et équipe sécurité

### 6.3 Tests de sécurité

**Tests automatisés (hebdomadaires) :**
- **Scans de vulnérabilités** (Nessus, OpenVAS)
- **SCA** (Software Composition Analysis) pour détecter les librairies vulnérables
- **SAST** (Static Application Security Testing) pour analyser le code

**Tests manuels (annuels) :**
- **Pentest externe** (boîte noire) par cabinet spécialisé
- **Pentest interne** (si applicable)
- **Tests d'ingénierie sociale** (phishing simulé sur employés)

**Remédiation :**
- Vulnérabilités **critiques** : correction sous **48 heures**
- Vulnérabilités **hautes** : correction sous **7 jours**
- Vulnérabilités **moyennes** : correction sous **30 jours**

---

## 7. GESTION DES INCIDENTS

### 7.1 Processus de gestion

**Phase 1 : Détection**
- Alertes automatiques (monitoring, IDS, WAF)
- Signalement par un utilisateur ou client
- Découverte lors d'un audit

**Phase 2 : Qualification**
- Gravité : **Critique**, **Haute**, **Moyenne**, **Basse**
- Impact : nombre d'utilisateurs, données concernées
- Périmètre : local ou généralisé

**Phase 3 : Confinement**
- Isolation des systèmes compromis
- Blocage des comptes suspects
- Modification des mots de passe si nécessaire

**Phase 4 : Éradication**
- Suppression de la cause (malware, backdoor, etc.)
- Correction de la vulnérabilité exploitée
- Vérification de l'absence de compromission résiduelle

**Phase 5 : Rétablissement**
- Restauration des systèmes
- Vérification de l'intégrité des données
- Reprise progressive du service

**Phase 6 : Post-mortem**
- Analyse des causes profondes (root cause analysis)
- Documentation de l'incident
- Mise en place de mesures correctives
- Notification aux clients si nécessaire

### 7.2 Classification des incidents

| Gravité | Exemples | Délai de réponse | Notification client |
|---------|----------|------------------|---------------------|
| **Critique** | Fuite de données massive, service totalement inaccessible, ransomware | 15 minutes | Immédiate (< 1h) |
| **Haute** | Vulnérabilité critique exploitée, compromission de comptes admin, dégradation sévère | 1 heure | Sous 4 heures |
| **Moyenne** | Tentative d'intrusion bloquée, bug de sécurité mineur, dégradation partielle | 4 heures | Si impact client |
| **Basse** | Vulnérabilité théorique, faux positif, anomalie mineure | 24 heures | Non |

### 7.3 Notification de violation de données (Data Breach)

En cas de **violation de données** susceptible d'engendrer un risque pour les droits et libertés des personnes concernées :

**Notification à l'autorité (PFPDT en Suisse, CNIL en France) :**
- Délai : **72 heures** après prise de connaissance
- Contenu : nature de la violation, données concernées, mesures prises, contact du DPO

**Notification aux clients (responsables du traitement) :**
- Délai : **72 heures** après prise de connaissance
- Fourniture de toutes les informations nécessaires pour que le client remplisse ses propres obligations

**Notification aux personnes concernées (par le client) :**
- Si risque **élevé** pour les droits et libertés
- Communication **claire et compréhensible** des risques et mesures de protection

---

## 8. CONTINUITÉ ET REPRISE D'ACTIVITÉ

### 8.1 Plan de Continuité d'Activité (PCA)

Realpro SA dispose d'un **PCA** testé **annuellement** couvrant :

- **Pannes matérielles** (serveurs, disques)
- **Pannes réseau** (coupure Internet, FAI)
- **Incidents de sécurité** (cyberattaques, ransomware)
- **Catastrophes naturelles** (incendie datacenter, inondation)

### 8.2 Plan de Reprise d'Activité (PRA)

**Objectifs de reprise :**
- **RTO** (Recovery Time Objective) : < 4 heures (Professional), < 1 heure (Enterprise)
- **RPO** (Recovery Point Objective) : < 24 heures (Professional), < 5 minutes (Enterprise avec réplication temps réel)

**Procédures :**
1. Activation du **serveur de secours** (failover automatique pour Enterprise)
2. Restauration des **données** depuis sauvegarde la plus récente
3. Tests de **fonctionnement**
4. Notification aux **clients**
5. Investigation et **correction** de la cause

---

## 9. CONFORMITÉ RÉGLEMENTAIRE

### 9.1 LPD (Loi fédérale suisse sur la protection des données)

Realpro SA respecte la **LPD révisée** (en vigueur depuis septembre 2023) :

- **Registre des activités de traitement** tenu à jour
- **Analyse d'impact** (DPIA) pour traitements à risque élevé
- **Notification** des violations de données au PFPDT
- Respect des **droits des personnes** (accès, rectification, effacement, portabilité)

### 9.2 RGPD (Règlement Général sur la Protection des Données)

Pour les clients ayant des utilisateurs dans l'UE, Realpro SA respecte le **RGPD** :

- **Base légale** du traitement : exécution du contrat
- **Durée de conservation** : uniquement le nécessaire
- **Transferts hors UE** : clauses contractuelles types (SCC)
- **DPO** (Data Protection Officer) : [dpo@realpro.ch](mailto:dpo@realpro.ch) (à désigner)

### 9.3 Normes et certifications

**Certifications visées :**
- **ISO 27001** (Management de la sécurité de l'information) - en cours
- **SOC 2 Type II** (sécurité, disponibilité, confidentialité) - en cours

**Audits :**
- Audits de sécurité **annuels** (externes)
- Pentests **annuels** (externes)
- Revue de conformité LPD/RGPD **semestrielle** (interne)

---

## 10. RECOMMANDATIONS AUX CLIENTS

### 10.1 Bonnes pratiques de sécurité

**Mots de passe :**
- Utiliser des mots de passe **longs et complexes** (minimum 12 caractères)
- Ne **jamais réutiliser** le même mot de passe sur plusieurs services
- Utiliser un **gestionnaire de mots de passe** (1Password, Bitwarden, etc.)
- Activer la **double authentification** (MFA) si disponible

**Sécurité des accès :**
- Ne **jamais partager** vos identifiants de connexion
- Se **déconnecter** après utilisation (surtout sur ordinateurs partagés)
- Utiliser des **connexions sécurisées** (HTTPS, VPN si WiFi public)

**Vigilance :**
- Se méfier des **emails suspects** (phishing)
- Vérifier l'**URL** avant de saisir vos identifiants (doit commencer par `https://realpro.ch`)
- Ne **pas cliquer** sur des liens suspects dans les emails

**Signalement :**
- Signaler immédiatement toute **activité suspecte** à [security@realpro.ch](mailto:security@realpro.ch)
- Signaler toute **compromission de compte** (connexions inhabituelles, modifications non autorisées)

### 10.2 Responsabilités du client

Le client est responsable de :

- La **confidentialité** des identifiants de ses utilisateurs
- La **formation** de ses utilisateurs aux bonnes pratiques de sécurité
- La **gestion des permissions** (principe du moindre privilège)
- L'**export régulier** de ses données (backup personnel)
- La **conformité** de l'usage du Logiciel avec les lois applicables

---

## 11. GESTION DES SOUS-TRAITANTS

### 11.1 Sélection des sous-traitants

Realpro SA sélectionne ses sous-traitants selon les critères suivants :

- **Certifications** de sécurité (ISO 27001, SOC 2, etc.)
- **Conformité** LPD et RGPD
- **Réputation** et solidité financière
- **Transparence** sur leurs pratiques de sécurité

### 11.2 Obligations contractuelles

Tous les sous-traitants signent des **clauses de sécurité** incluant :

- Obligation de **confidentialité**
- Respect des **normes de sécurité**
- **Notification** des incidents de sécurité
- **Audits** possibles par Realpro SA
- **Assurances** cyber-risques

### 11.3 Surveillance

Realpro SA **surveille** ses sous-traitants via :

- **Audits** annuels de conformité
- **Revue** des certifications
- **Indicateurs** de performance et sécurité (SLAs)

---

## 12. SENSIBILISATION ET FORMATION

### 12.1 Formation du personnel Realpro SA

**Formation initiale** (nouveaux employés) :
- Politique de sécurité de l'entreprise
- Risques de sécurité (phishing, ingénierie sociale, malware)
- Gestion des mots de passe et accès
- Procédures de signalement d'incidents

**Formation continue** (annuelle) :
- Mise à jour sur les nouvelles menaces
- Simulation de phishing
- Rappel des bonnes pratiques
- Évolutions réglementaires (LPD, RGPD)

### 12.2 Sensibilisation des clients

Realpro SA met à disposition des clients :

- **Base de connaissances** sur la sécurité
- **Guides** de bonnes pratiques
- **Webinaires** périodiques sur la sécurité
- **Newsletter** sur les menaces émergentes

---

## 13. REVUE ET AMÉLIORATION CONTINUE

### 13.1 Révision de la charte

La présente Charte de Sécurité est **révisée au minimum annuellement** pour :

- Intégrer les **nouvelles menaces**
- S'adapter aux **évolutions technologiques**
- Respecter les **nouvelles réglementations**
- Améliorer les **processus** de sécurité

### 13.2 Indicateurs de sécurité (KPIs)

Realpro SA suit les indicateurs suivants :

- **Disponibilité** du service (uptime)
- **Nombre d'incidents** de sécurité
- **Temps de résolution** des vulnérabilités
- **Taux de réussite** des tests de restauration
- **Conformité** aux patchs de sécurité

### 13.3 Amélioration continue

Realpro SA s'engage dans une **démarche d'amélioration continue** via :

- **Retours d'expérience** après chaque incident
- **Veille** technologique et sécurité
- **Participation** à des conférences et formations
- **Collaboration** avec la communauté sécurité

---

## 14. CONTACT SÉCURITÉ

Pour toute question ou signalement relatif à la sécurité :

**Email sécurité :** [security@realpro.ch](mailto:security@realpro.ch)
**Responsable sécurité :** [Nom du RSSI] (à compléter)
**Téléphone urgence** (incidents critiques) : [à compléter]

---

## 15. ACCEPTATION

**Les clients et utilisateurs de Realpro Suite reconnaissent avoir pris connaissance de la présente Charte de Sécurité et s'engagent à en respecter les recommandations.**

---

**Document établi le :** 3 décembre 2025
**Version :** 1.0
**Prochaine révision prévue :** Décembre 2026

**Realpro SA – Yverdon-les-Bains (VD), Suisse**
