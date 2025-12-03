/*
  # Seed Roles & Permissions
  
  ## Description
  Cette migration initialise les rôles système et les permissions de base
  pour tous les modules de l'application.
  
  ## Rôles créés
  1. **saas_admin** - Administrateur plateforme SaaS
  2. **org_admin** - Administrateur d'organisation
  3. **promoter** - Promoteur / Développeur
  4. **general_contractor** - Entreprise Générale (EG)
  5. **architect** - Architecte
  6. **engineer** - Bureau technique / Ingénieur
  7. **notary** - Notaire
  8. **broker** - Courtier
  9. **buyer** - Acheteur (PPE/QPT)
  10. **supplier** - Entreprise soumissionnaire
  
  ## Permissions créées
  Pour chaque module : projects, lots, crm, notary, brokers, submissions,
  finance, documents, choices, construction, communication, settings,
  reporting, billing, organizations
  
  Actions : read, create, update, delete, export, manage
  
  ## Attribution des permissions
  Matrice complète des permissions par rôle selon les besoins métier
*/

-- Insert Roles avec labels i18n
INSERT INTO roles (name, label, description, is_system) VALUES
  (
    'saas_admin',
    '{"fr": "Administrateur SaaS", "de": "SaaS-Administrator", "en": "SaaS Administrator", "it": "Amministratore SaaS"}'::jsonb,
    '{"fr": "Accès complet à la plateforme", "de": "Vollzugriff auf die Plattform", "en": "Full platform access", "it": "Accesso completo alla piattaforma"}'::jsonb,
    true
  ),
  (
    'org_admin',
    '{"fr": "Administrateur organisation", "de": "Organisations-Administrator", "en": "Organization Admin", "it": "Amministratore organizzazione"}'::jsonb,
    '{"fr": "Gestion complète de l''organisation", "de": "Vollständige Verwaltung der Organisation", "en": "Full organization management", "it": "Gestione completa dell''organizzazione"}'::jsonb,
    true
  ),
  (
    'promoter',
    '{"fr": "Promoteur", "de": "Bauträger", "en": "Developer", "it": "Promotore"}'::jsonb,
    '{"fr": "Promoteur immobilier", "de": "Immobilienentwickler", "en": "Real estate developer", "it": "Sviluppatore immobiliare"}'::jsonb,
    true
  ),
  (
    'general_contractor',
    '{"fr": "Entreprise Générale", "de": "Generalunternehmer", "en": "General Contractor", "it": "Impresa Generale"}'::jsonb,
    '{"fr": "Entreprise générale de construction", "de": "Generalunternehmen für Bau", "en": "General construction contractor", "it": "Impresa generale di costruzione"}'::jsonb,
    true
  ),
  (
    'architect',
    '{"fr": "Architecte", "de": "Architekt", "en": "Architect", "it": "Architetto"}'::jsonb,
    '{"fr": "Bureau d''architecture", "de": "Architekturbüro", "en": "Architecture firm", "it": "Studio di architettura"}'::jsonb,
    true
  ),
  (
    'engineer',
    '{"fr": "Ingénieur", "de": "Ingenieur", "en": "Engineer", "it": "Ingegnere"}'::jsonb,
    '{"fr": "Bureau technique / Ingénieur", "de": "Technisches Büro / Ingenieur", "en": "Engineering office", "it": "Ufficio tecnico / Ingegnere"}'::jsonb,
    true
  ),
  (
    'notary',
    '{"fr": "Notaire", "de": "Notar", "en": "Notary", "it": "Notaio"}'::jsonb,
    '{"fr": "Étude notariale", "de": "Notariat", "en": "Notary office", "it": "Studio notarile"}'::jsonb,
    true
  ),
  (
    'broker',
    '{"fr": "Courtier", "de": "Makler", "en": "Broker", "it": "Mediatore"}'::jsonb,
    '{"fr": "Courtier immobilier", "de": "Immobilienmakler", "en": "Real estate broker", "it": "Mediatore immobiliare"}'::jsonb,
    true
  ),
  (
    'buyer',
    '{"fr": "Acheteur", "de": "Käufer", "en": "Buyer", "it": "Acquirente"}'::jsonb,
    '{"fr": "Acquéreur PPE/QPT", "de": "Käufer WEG/QPT", "en": "Buyer PPE/QPT", "it": "Acquirente PPE/QPT"}'::jsonb,
    true
  ),
  (
    'supplier',
    '{"fr": "Soumissionnaire", "de": "Bieter", "en": "Bidder", "it": "Offerente"}'::jsonb,
    '{"fr": "Entreprise soumissionnaire", "de": "Bietendes Unternehmen", "en": "Bidding company", "it": "Impresa offerente"}'::jsonb,
    true
  );

-- Insert Permissions (resource.action)
INSERT INTO permissions (resource, action, name, description) VALUES
  -- Organizations
  ('organizations', 'read', 'organizations.read', '{"fr": "Voir les organisations", "en": "View organizations"}'::jsonb),
  ('organizations', 'create', 'organizations.create', '{"fr": "Créer des organisations", "en": "Create organizations"}'::jsonb),
  ('organizations', 'update', 'organizations.update', '{"fr": "Modifier les organisations", "en": "Update organizations"}'::jsonb),
  ('organizations', 'delete', 'organizations.delete', '{"fr": "Supprimer les organisations", "en": "Delete organizations"}'::jsonb),
  
  -- Projects
  ('projects', 'read', 'projects.read', '{"fr": "Voir les projets", "en": "View projects"}'::jsonb),
  ('projects', 'create', 'projects.create', '{"fr": "Créer des projets", "en": "Create projects"}'::jsonb),
  ('projects', 'update', 'projects.update', '{"fr": "Modifier les projets", "en": "Update projects"}'::jsonb),
  ('projects', 'delete', 'projects.delete', '{"fr": "Supprimer les projets", "en": "Delete projects"}'::jsonb),
  ('projects', 'export', 'projects.export', '{"fr": "Exporter les projets", "en": "Export projects"}'::jsonb),
  
  -- Lots
  ('lots', 'read', 'lots.read', '{"fr": "Voir les lots", "en": "View lots"}'::jsonb),
  ('lots', 'create', 'lots.create', '{"fr": "Créer des lots", "en": "Create lots"}'::jsonb),
  ('lots', 'update', 'lots.update', '{"fr": "Modifier les lots", "en": "Update lots"}'::jsonb),
  ('lots', 'delete', 'lots.delete', '{"fr": "Supprimer les lots", "en": "Delete lots"}'::jsonb),
  ('lots', 'manage_pricing', 'lots.manage_pricing', '{"fr": "Gérer les prix", "en": "Manage pricing"}'::jsonb),
  
  -- CRM
  ('crm', 'read', 'crm.read', '{"fr": "Voir le CRM", "en": "View CRM"}'::jsonb),
  ('crm', 'create', 'crm.create', '{"fr": "Créer des prospects", "en": "Create prospects"}'::jsonb),
  ('crm', 'update', 'crm.update', '{"fr": "Modifier le CRM", "en": "Update CRM"}'::jsonb),
  ('crm', 'delete', 'crm.delete', '{"fr": "Supprimer du CRM", "en": "Delete CRM"}'::jsonb),
  ('crm', 'export', 'crm.export', '{"fr": "Exporter le CRM", "en": "Export CRM"}'::jsonb),
  
  -- Notary
  ('notary', 'read', 'notary.read', '{"fr": "Voir les dossiers notaire", "en": "View notary files"}'::jsonb),
  ('notary', 'create', 'notary.create', '{"fr": "Créer des dossiers notaire", "en": "Create notary files"}'::jsonb),
  ('notary', 'update', 'notary.update', '{"fr": "Modifier les dossiers notaire", "en": "Update notary files"}'::jsonb),
  ('notary', 'manage', 'notary.manage', '{"fr": "Gérer les actes", "en": "Manage acts"}'::jsonb),
  
  -- Brokers
  ('brokers', 'read', 'brokers.read', '{"fr": "Voir les courtiers", "en": "View brokers"}'::jsonb),
  ('brokers', 'manage', 'brokers.manage', '{"fr": "Gérer les courtiers", "en": "Manage brokers"}'::jsonb),
  
  -- Submissions
  ('submissions', 'read', 'submissions.read', '{"fr": "Voir les soumissions", "en": "View submissions"}'::jsonb),
  ('submissions', 'create', 'submissions.create', '{"fr": "Créer des soumissions", "en": "Create submissions"}'::jsonb),
  ('submissions', 'update', 'submissions.update', '{"fr": "Modifier les soumissions", "en": "Update submissions"}'::jsonb),
  ('submissions', 'adjudicate', 'submissions.adjudicate', '{"fr": "Adjuger", "en": "Adjudicate"}'::jsonb),
  ('submissions', 'bid', 'submissions.bid', '{"fr": "Soumettre une offre", "en": "Submit bid"}'::jsonb),
  
  -- Finance
  ('finance', 'read', 'finance.read', '{"fr": "Voir les finances", "en": "View finance"}'::jsonb),
  ('finance', 'create', 'finance.create', '{"fr": "Créer des finances", "en": "Create finance"}'::jsonb),
  ('finance', 'update', 'finance.update', '{"fr": "Modifier les finances", "en": "Update finance"}'::jsonb),
  ('finance', 'manage_budget', 'finance.manage_budget', '{"fr": "Gérer le budget", "en": "Manage budget"}'::jsonb),
  ('finance', 'approve_payment', 'finance.approve_payment', '{"fr": "Approuver les paiements", "en": "Approve payments"}'::jsonb),
  
  -- Documents
  ('documents', 'read', 'documents.read', '{"fr": "Voir les documents", "en": "View documents"}'::jsonb),
  ('documents', 'create', 'documents.create', '{"fr": "Créer des documents", "en": "Create documents"}'::jsonb),
  ('documents', 'update', 'documents.update', '{"fr": "Modifier les documents", "en": "Update documents"}'::jsonb),
  ('documents', 'delete', 'documents.delete', '{"fr": "Supprimer les documents", "en": "Delete documents"}'::jsonb),
  
  -- Choices
  ('choices', 'read', 'choices.read', '{"fr": "Voir les choix", "en": "View choices"}'::jsonb),
  ('choices', 'create', 'choices.create', '{"fr": "Créer des choix", "en": "Create choices"}'::jsonb),
  ('choices', 'update', 'choices.update', '{"fr": "Modifier les choix", "en": "Update choices"}'::jsonb),
  ('choices', 'approve', 'choices.approve', '{"fr": "Approuver les choix", "en": "Approve choices"}'::jsonb),
  
  -- Construction
  ('construction', 'read', 'construction.read', '{"fr": "Voir le chantier", "en": "View construction"}'::jsonb),
  ('construction', 'update', 'construction.update', '{"fr": "Modifier le chantier", "en": "Update construction"}'::jsonb),
  ('construction', 'manage', 'construction.manage', '{"fr": "Gérer le chantier", "en": "Manage construction"}'::jsonb),
  
  -- Communication
  ('communication', 'read', 'communication.read', '{"fr": "Voir les messages", "en": "View messages"}'::jsonb),
  ('communication', 'create', 'communication.create', '{"fr": "Créer des messages", "en": "Create messages"}'::jsonb),
  
  -- Settings
  ('settings', 'read', 'settings.read', '{"fr": "Voir les paramètres", "en": "View settings"}'::jsonb),
  ('settings', 'update', 'settings.update', '{"fr": "Modifier les paramètres", "en": "Update settings"}'::jsonb),
  
  -- Reporting
  ('reporting', 'read', 'reporting.read', '{"fr": "Voir les rapports", "en": "View reports"}'::jsonb),
  ('reporting', 'export', 'reporting.export', '{"fr": "Exporter les rapports", "en": "Export reports"}'::jsonb),
  
  -- Billing
  ('billing', 'read', 'billing.read', '{"fr": "Voir la facturation", "en": "View billing"}'::jsonb),
  ('billing', 'manage', 'billing.manage', '{"fr": "Gérer la facturation", "en": "Manage billing"}'::jsonb);

-- Attribution des permissions aux rôles
-- saas_admin : TOUT
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'saas_admin';

-- org_admin : Tout sauf billing.manage (qui reste au saas_admin)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'org_admin'
AND p.name != 'billing.manage';

-- promoter : Accès complet projets, CRM, finance, documents, reporting
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'promoter'
AND (
  p.resource IN ('projects', 'lots', 'crm', 'finance', 'documents', 'reporting', 'communication', 'settings', 'brokers')
  OR p.name IN ('submissions.read', 'submissions.adjudicate', 'construction.read', 'choices.read', 'choices.approve', 'notary.read', 'billing.read')
);

-- general_contractor : Gestion construction, soumissions, documents
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'general_contractor'
AND (
  p.resource IN ('construction', 'documents', 'communication')
  OR p.name IN ('projects.read', 'lots.read', 'submissions.read', 'submissions.create', 'submissions.update', 'finance.read')
);

-- architect : Projets, plans, documents, choix matériaux
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'architect'
AND (
  p.resource IN ('documents', 'choices', 'communication')
  OR p.name IN ('projects.read', 'projects.update', 'lots.read', 'lots.update', 'construction.read')
);

-- engineer : Similaire architecte avec focus technique
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'engineer'
AND (
  p.resource IN ('documents', 'communication')
  OR p.name IN ('projects.read', 'lots.read', 'construction.read', 'construction.update', 'submissions.read')
);

-- notary : Dossiers notaire, actes, documents liés
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'notary'
AND (
  p.resource IN ('notary', 'communication')
  OR p.name IN ('crm.read', 'documents.read', 'documents.create', 'lots.read')
);

-- broker : CRM, réservations, commissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'broker'
AND (
  p.resource IN ('crm', 'brokers', 'communication')
  OR p.name IN ('projects.read', 'lots.read', 'documents.read')
);

-- buyer : Lecture limitée de son lot, ses choix, ses documents
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'buyer'
AND p.name IN (
  'lots.read',
  'choices.read',
  'choices.create',
  'documents.read',
  'construction.read',
  'communication.read',
  'communication.create',
  'finance.read'
);

-- supplier : Soumissions uniquement
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'supplier'
AND (
  p.name IN ('submissions.read', 'submissions.bid', 'communication.read', 'communication.create', 'documents.read')
);