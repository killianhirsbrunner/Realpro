# SLA — SERVICE LEVEL AGREEMENT
## Accord de Niveau de Service

**Realpro Suite – Realpro SA**

**Annexe au Contrat SaaS B2B**

---

## 1. OBJET

Le présent Service Level Agreement (SLA) définit les **engagements de Realpro SA** en matière de :

- **Disponibilité** du service Realpro Suite
- **Performance** de la plateforme
- **Support technique** et délais de réponse
- **Maintenance** planifiée et d'urgence
- **Compensation** en cas de non-respect des engagements

Ce SLA s'applique aux clients ayant souscrit une formule **Professional**, **Enterprise** ou **Custom**.

Les clients de la formule **Basic** bénéficient d'un niveau de service standard sans garantie SLA formelle.

---

## 2. DÉFINITIONS

**« Disponibilité »** : capacité du Client à accéder au service Realpro Suite et à en utiliser les fonctionnalités principales.

**« Temps de fonctionnement »** (Uptime) : période pendant laquelle le service est disponible et fonctionnel.

**« Temps d'indisponibilité »** (Downtime) : période pendant laquelle le service n'est pas accessible ou non fonctionnel.

**« Maintenance planifiée »** : opération de maintenance programmée et notifiée au moins 48 heures à l'avance.

**« Incident »** : événement non planifié entraînant une dégradation ou une interruption du service.

**« Incident critique »** : incident empêchant l'accès complet au service ou affectant gravement son fonctionnement.

**« Incident majeur »** : incident affectant une fonctionnalité importante du service.

**« Incident mineur »** : dysfonctionnement affectant une fonctionnalité secondaire sans impact sur l'utilisation générale.

**« Temps de réponse »** : délai entre l'ouverture d'un ticket de support et la première réponse de Realpro SA.

**« Temps de résolution »** : délai entre l'ouverture d'un ticket et la résolution complète du problème.

**« Mois »** : période calendaire de 30 jours consécutifs.

**« Année »** : période de 12 mois consécutifs.

---

## 3. DISPONIBILITÉ DU SERVICE

### 3.1 Engagement de disponibilité

Realpro SA s'engage à fournir les taux de disponibilité suivants :

| Formule | Disponibilité cible (mensuelle) | Disponibilité cible (annuelle) |
|---------|----------------------------------|--------------------------------|
| **Basic** | Meilleur effort (pas de garantie SLA) | Meilleur effort |
| **Professional** | 99,5% | 99,5% |
| **Enterprise** | 99,7% | 99,7% |
| **Custom** | 99,9% (selon contrat) | 99,9% |

### 3.2 Calcul de la disponibilité

La disponibilité est calculée comme suit :

**Disponibilité (%) = [(Temps total - Temps d'indisponibilité non planifiée) / Temps total] × 100**

**Exemple pour un mois de 30 jours (43 200 minutes) :**

- Professional (99,5%) : indisponibilité maximale de **216 minutes/mois** (3h36)
- Enterprise (99,7%) : indisponibilité maximale de **130 minutes/mois** (2h10)
- Custom (99,9%) : indisponibilité maximale de **43 minutes/mois**

### 3.3 Exclusions du calcul de disponibilité

Ne sont **pas comptabilisées** comme indisponibilité :

1. **Maintenance planifiée** notifiée au moins 48 heures à l'avance
2. **Cas de force majeure** (catastrophe naturelle, guerre, cyberattaque massive, etc.)
3. **Défaillance de l'hébergeur** ou des infrastructures tierces (hors contrôle de Realpro SA)
4. **Problèmes de connexion Internet** du Client ou de son fournisseur d'accès
5. **Indisponibilités causées par le Client** (mauvaise configuration, surcharge volontaire, attaque DDoS depuis les comptes du Client)
6. **Incompatibilité navigateur** (navigateurs obsolètes ou non supportés)
7. **Utilisation non conforme** aux CGU

### 3.4 Mesure de la disponibilité

La disponibilité est mesurée par :

- **Monitoring automatique** 24h/24, 7j/7 depuis plusieurs points géographiques
- **Synthèse ping** toutes les 60 secondes
- **Tests fonctionnels** toutes les 5 minutes (connexion, accès aux données, navigation)

Un tableau de bord public de statut est accessible à : **[status.realpro.ch]** (à configurer)

---

## 4. MAINTENANCE

### 4.1 Maintenance planifiée

**Fenêtre de maintenance :**

- **Préférence** : dimanche 22h00 - lundi 02h00 (heure suisse CET/CEST)
- **Durée maximale** : 4 heures
- **Fréquence** : mensuelle maximum (sauf urgence)

**Notification :**

- Envoi d'un email **au moins 48 heures ouvrées avant** la maintenance
- Publication sur le tableau de bord de statut
- Notification dans l'application 24 heures avant

**Contenu de la notification :**

- Date et heure de début
- Durée estimée
- Fonctionnalités impactées
- Raison de la maintenance (mise à jour, migration, optimisation)

### 4.2 Maintenance d'urgence

En cas de **faille de sécurité critique** ou de **bug majeur** menaçant la stabilité ou la sécurité du service, Realpro SA peut effectuer une maintenance d'urgence **sans préavis**.

Le Client en sera informé :
- **Dès que possible** par email
- Via le tableau de bord de statut
- Via notification dans l'application (si accessible)

Ces maintenances d'urgence ne sont **pas comptabilisées** dans le calcul de disponibilité si elles durent moins de **2 heures**.

### 4.3 Maintenance des infrastructures tierces

Realpro SA s'efforce de planifier les maintenances des infrastructures tierces (hébergeur, base de données, etc.) en dehors des heures ouvrées et en informera le Client dans les mêmes conditions.

---

## 5. PERFORMANCE

### 5.1 Temps de réponse

Realpro SA s'engage sur les temps de réponse suivants pour les requêtes utilisateur :

| Type de page | Temps de réponse cible (P95) |
|--------------|------------------------------|
| Page d'accueil / Dashboard | < 2 secondes |
| Liste de projets / lots | < 3 secondes |
| Détail d'un projet | < 3 secondes |
| Formulaires de saisie | < 2 secondes |
| Recherches simples | < 2 secondes |
| Recherches complexes | < 5 secondes |
| Génération de documents (PDF) | < 10 secondes |
| Exports ZIP complets | < 60 secondes (selon volume) |

**P95** signifie que 95% des requêtes doivent respecter ce temps de réponse.

### 5.2 Facteurs affectant la performance

Les temps de réponse peuvent être affectés par :

- **Volume de données** du Client (projets, documents, photos)
- **Connexion Internet** du Client
- **Charge du serveur** (pics d'utilisation)
- **Opérations lourdes** (génération de rapports complexes, exports massifs)

### 5.3 Optimisations continues

Realpro SA s'engage à :

- **Monitorer** en continu les performances
- **Optimiser** régulièrement le code et la base de données
- **Mettre à l'échelle** l'infrastructure selon les besoins
- **Notifier** le Client en cas de dégradation prolongée (> 24 heures)

---

## 6. SUPPORT TECHNIQUE

### 6.1 Niveaux de support par formule

| Formule | Canaux | Délai de réponse | Disponibilité | Temps de résolution cible |
|---------|--------|------------------|---------------|---------------------------|
| **Basic** | Email / Ticket | 48h ouvrées | Lun-Ven 9h-17h | 5 jours ouvrés |
| **Professional** | Email / Ticket / Chat | 24h ouvrées | Lun-Ven 8h-18h | 3 jours ouvrés |
| **Enterprise** | Email / Ticket / Chat / Téléphone | 4h ouvrées (critique: 1h) | Lun-Ven 8h-18h + Astreinte | 1 jour ouvré (critique: 4h) |
| **Custom** | Dédié + SLA personnalisé | Selon contrat | Selon contrat | Selon contrat |

### 6.2 Classification des tickets

**Priorité CRITIQUE (P1)**
- Service totalement inaccessible
- Perte de données
- Faille de sécurité critique
- Bug bloquant empêchant toute utilisation

**Priorité HAUTE (P2)**
- Fonctionnalité majeure inaccessible
- Bug affectant un processus métier important
- Dégradation significative de performance

**Priorité MOYENNE (P3)**
- Fonctionnalité secondaire inaccessible
- Bug gênant mais contournable
- Question technique complexe

**Priorité BASSE (P4)**
- Question générale
- Demande d'information
- Suggestion d'amélioration
- Bug cosmétique

### 6.3 Délais de réponse selon priorité

| Priorité | Professional | Enterprise | Custom |
|----------|--------------|------------|--------|
| **P1 - Critique** | 4h ouvrées | 1h (7j/7 si astreinte) | Selon contrat |
| **P2 - Haute** | 12h ouvrées | 4h ouvrées | Selon contrat |
| **P3 - Moyenne** | 24h ouvrées | 8h ouvrées | Selon contrat |
| **P4 - Basse** | 48h ouvrées | 24h ouvrées | Selon contrat |

### 6.4 Délais de résolution cibles

| Priorité | Professional | Enterprise | Custom |
|----------|--------------|------------|--------|
| **P1 - Critique** | 2 jours ouvrés | 4 heures | Selon contrat |
| **P2 - Haute** | 3 jours ouvrés | 1 jour ouvré | Selon contrat |
| **P3 - Moyenne** | 5 jours ouvrés | 3 jours ouvrés | Selon contrat |
| **P4 - Basse** | 10 jours ouvrés | 5 jours ouvrés | Selon contrat |

**Note :** Il s'agit de délais **cibles**, pas de garanties absolues. La résolution peut prendre plus de temps selon la complexité du problème.

### 6.5 Canaux de support

**Email / Ticketing**
- Adresse : [support@realpro.ch](mailto:support@realpro.ch)
- Système de ticketing intégré dans l'application
- Suivi de l'état du ticket en temps réel

**Chat en ligne** (Professional, Enterprise, Custom)
- Accessible depuis l'application
- Disponible pendant les heures ouvrées
- Réponse dans les 15 minutes (Professional), 5 minutes (Enterprise)

**Téléphone** (Enterprise, Custom)
- Numéro : [à compléter]
- Disponible pendant les heures ouvrées
- Astreinte 24/7 pour formule Enterprise (incidents critiques uniquement)

**Portail de documentation**
- Base de connaissances (FAQ, guides, tutoriels)
- Vidéos de formation
- Accessible 24h/24

### 6.6 Langues supportées

- Français
- Allemand
- Italien
- Anglais

### 6.7 Support hors périmètre

Les éléments suivants ne sont **pas inclus** dans le support standard :

- Formation personnalisée sur site (facturable séparément)
- Développements sur-mesure
- Intégrations avec systèmes tiers non documentées
- Assistance pour usage non conforme aux CGU
- Reprise de données depuis d'autres systèmes
- Conseil en gestion de projet immobilier

Ces prestations peuvent être proposées sur **devis séparé**.

---

## 7. SAUVEGARDES ET RESTAURATION

### 7.1 Politique de sauvegarde

Realpro SA effectue les sauvegardes suivantes :

**Sauvegardes quotidiennes** (Daily Backups)
- Fréquence : **tous les jours à 02h00 CET/CEST**
- Rétention : **30 jours**
- Contenu : base de données complète + fichiers uploadés

**Sauvegardes hebdomadaires** (Weekly Backups)
- Fréquence : **tous les dimanches à 02h00**
- Rétention : **12 semaines** (3 mois)

**Sauvegardes mensuelles** (Monthly Backups)
- Fréquence : **premier dimanche du mois à 02h00**
- Rétention : **12 mois** (1 an)

**Réplication en temps réel** (Enterprise et Custom uniquement)
- Base de données répliquée sur 2 zones géographiques distinctes
- RPO (Recovery Point Objective) : < 5 minutes
- RTO (Recovery Time Objective) : < 1 heure

### 7.2 Stockage des sauvegardes

- Les sauvegardes sont **chiffrées**
- Stockées sur des infrastructures **géographiquement distinctes**
- Testées régulièrement (restauration test mensuelle)

### 7.3 Restauration de données

**Délais de restauration :**

| Formule | Délai de restauration |
|---------|----------------------|
| **Professional** | 48h ouvrées |
| **Enterprise** | 4h ouvrées |
| **Custom** | Selon contrat (généralement < 2h) |

**Procédure :**

1. Le Client ouvre un ticket de support **priorité HAUTE** ou **CRITIQUE**
2. Realpro SA analyse la demande et valide la faisabilité
3. Restauration effectuée sur un environnement de test (pour validation par le Client)
4. Après validation, mise en production

**Frais :**

- Restauration complète : **gratuite** (1 fois par an maximum)
- Restauration partielle (projet, lot, document) : **gratuite** (3 fois par an)
- Au-delà : facturation au **tarif horaire** convenu

### 7.4 Limitations

- Les sauvegardes ne remplacent pas l'export régulier des données par le Client
- Realpro SA ne garantit pas la possibilité de restaurer des données **supprimées volontairement** par le Client au-delà de la rétention standard
- Les données modifiées ou supprimées moins de 24 heures avant la demande de restauration peuvent ne pas être récupérables

---

## 8. SÉCURITÉ

### 8.1 Mesures de sécurité

Realpro SA met en œuvre les mesures suivantes :

**Infrastructure**
- Pare-feu (WAF - Web Application Firewall)
- Protection anti-DDoS
- IDS/IPS (Intrusion Detection/Prevention System)
- VPN sécurisé pour accès administratif

**Application**
- Chiffrement TLS/SSL (HTTPS obligatoire)
- Authentification forte (MFA optionnelle)
- Gestion des sessions sécurisée
- Protection CSRF, XSS, injection SQL
- Rate limiting contre les abus

**Données**
- Chiffrement at rest (données sensibles)
- Sauvegardes chiffrées
- Contrôles d'accès basés sur les rôles (RBAC)
- Logs d'audit (traçabilité)

**Processus**
- Tests de sécurité réguliers (scans de vulnérabilités)
- Audits de sécurité (annuels)
- Veille sur les CVE (Common Vulnerabilities and Exposures)
- Patch management (correctifs de sécurité appliqués sous 48h)

### 8.2 Certifications et conformité

Realpro SA vise les certifications suivantes :

- **ISO 27001** (gestion de la sécurité de l'information) - en cours
- **SOC 2 Type II** (sécurité, disponibilité, confidentialité) - en cours
- Conformité **LPD** (Loi fédérale suisse sur la protection des données)
- Conformité **RGPD** (Règlement Général sur la Protection des Données)

### 8.3 Notification de faille de sécurité

En cas de faille de sécurité (data breach), Realpro SA s'engage à :

- **Notifier le Client** dans les **72 heures** après découverte
- Fournir un **rapport détaillé** (nature, impact, données concernées, mesures correctives)
- Assister le Client dans ses obligations de notification aux autorités (PFPDT, CNIL, etc.)

---

## 9. GESTION DES INCIDENTS

### 9.1 Processus de signalement

Le Client peut signaler un incident via :

1. **Email** : [support@realpro.ch](mailto:support@realpro.ch)
2. **Ticketing** : système intégré dans l'application
3. **Téléphone** : [à compléter] (Enterprise et Custom uniquement)
4. **Tableau de bord de statut** : vérification de l'état du service à [status.realpro.ch]

### 9.2 Traitement des incidents

**Phase 1 : Détection**
- Monitoring automatique 24/7
- Alertes envoyées à l'équipe technique
- Vérification et qualification de l'incident

**Phase 2 : Réponse**
- Ouverture d'un ticket d'incident interne
- Notification au Client (incidents critiques uniquement)
- Mise à jour du tableau de bord de statut

**Phase 3 : Résolution**
- Investigation et diagnostic
- Mise en œuvre de correctifs
- Tests et validation
- Mise en production

**Phase 4 : Communication**
- Notification de résolution au Client
- Mise à jour du statut
- Post-mortem pour incidents critiques (envoyé sous 7 jours)

### 9.3 Communication

Pour les **incidents critiques** (service totalement inaccessible) :

- **Notification initiale** : dans les 30 minutes suivant la détection
- **Mises à jour régulières** : toutes les 2 heures jusqu'à résolution
- **Notification de résolution** : dès que le service est rétabli
- **Post-mortem** : rapport détaillé envoyé sous 7 jours

Pour les **incidents non critiques** :

- Notification via tableau de bord de statut
- Email de résumé en fin d'incident

---

## 10. COMPENSATION EN CAS DE NON-RESPECT DU SLA

### 10.1 Principe

Si Realpro SA ne respecte pas les engagements de disponibilité définis à l'Article 3, le Client peut bénéficier de **crédits de service** (service credits).

### 10.2 Calcul des crédits

| Disponibilité atteinte (mensuelle) | Crédit accordé |
|-------------------------------------|----------------|
| < 99,5% mais ≥ 99,0% (Professional) | 10% du montant mensuel |
| < 99,0% mais ≥ 98,0% | 25% du montant mensuel |
| < 98,0% | 50% du montant mensuel |
| < 99,7% mais ≥ 99,5% (Enterprise) | 10% du montant mensuel |
| < 99,5% mais ≥ 99,0% (Enterprise) | 25% du montant mensuel |
| < 99,0% (Enterprise) | 50% du montant mensuel |

**Crédit maximum :** 50% du montant mensuel de l'abonnement

### 10.3 Conditions d'application

Les crédits sont accordés uniquement si :

1. Le Client a **signalé l'indisponibilité** dans un délai de **7 jours** suivant l'incident
2. Le Client a **fourni les éléments de preuve** (captures d'écran, logs, etc.)
3. Realpro SA a **confirmé** que l'indisponibilité n'entre pas dans les exclusions (Article 3.3)
4. Le Client est **à jour de ses paiements**

### 10.4 Demande de crédit

Le Client doit envoyer une **demande écrite** à [billing@realpro.ch](mailto:billing@realpro.ch) dans un délai de **30 jours** suivant le mois concerné.

La demande doit contenir :
- Période d'indisponibilité constatée
- Fonctionnalités impactées
- Éléments de preuve (captures d'écran, logs)

### 10.5 Application des crédits

Les crédits accordés sont appliqués :

- Sur la **facture du mois suivant** (sous forme de réduction)
- Ou sur le **prochain renouvellement** (abonnement annuel)

Les crédits ne peuvent être :
- Remboursés en espèces
- Transférés à un autre client
- Cumulés au-delà de 6 mois

### 10.6 Recours unique

Les crédits de service constituent le **seul et unique recours** du Client en cas de non-respect du SLA.

Le Client renonce expressément à toute autre forme de compensation (dommages-intérêts, etc.) sauf en cas de faute lourde ou intentionnelle de Realpro SA.

---

## 11. AMÉLIORATION CONTINUE

### 11.1 Revue trimestrielle

Pour les clients **Enterprise** et **Custom**, Realpro SA propose une **revue trimestrielle** incluant :

- Statistiques de disponibilité et performance
- Résumé des incidents et résolutions
- Recommandations d'optimisation
- Feuille de route des évolutions à venir

### 11.2 Feedback

Le Client peut à tout moment soumettre :

- **Suggestions d'amélioration** du service
- **Demandes de fonctionnalités** (feature requests)
- **Rapports de bugs** non critiques

Ces éléments sont traités dans le cadre de la **maintenance évolutive** continue.

---

## 12. ÉVOLUTION DU SLA

### 12.1 Révision

Realpro SA se réserve le droit de réviser le présent SLA pour :

- Améliorer les engagements
- S'adapter aux évolutions technologiques
- Répondre aux exigences réglementaires

### 12.2 Notification

Toute modification substantielle sera notifiée au Client **au moins 30 jours avant** son entrée en vigueur.

Si les modifications **diminuent les engagements**, le Client peut résilier son contrat sans frais dans un délai de 30 jours.

---

## 13. ENTRÉE EN VIGUEUR

Le présent SLA entre en vigueur à la date de signature du Contrat SaaS et reste applicable pendant toute la durée du contrat.

---

## 14. CONTACT

Pour toute question relative au présent SLA :

**Email :** [sla@realpro.ch](mailto:sla@realpro.ch)
**Support technique :** [support@realpro.ch](mailto:support@realpro.ch)
**Tableau de bord de statut :** [status.realpro.ch] (à configurer)

---

## SIGNATURE

**Le Client reconnaît avoir pris connaissance du présent SLA et l'accepte en signant le Contrat SaaS principal.**

---

**Document établi le :** 3 décembre 2025
**Version :** 1.0
**Annexe au Contrat SaaS Realpro Suite**

**Realpro SA – Yverdon-les-Bains (VD), Suisse**
