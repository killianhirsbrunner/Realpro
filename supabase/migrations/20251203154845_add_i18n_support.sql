/*
  # Internationalisation (i18n) Support

  1. Ajout Champs Langue
    - `organizations.default_lang` - Langue par défaut organisation
    - `users.locale` - Préférence langue utilisateur
    - `projects.language` - Langue par défaut projet
    - `notifications.i18n_key` - Clé de traduction notification
    - `notifications.i18n_params` - Paramètres dynamiques traduction

  2. Valeurs Supportées
    - fr-CH (français suisse, par défaut)
    - de-CH (allemand suisse)
    - it-CH (italien suisse)
    - en-GB (anglais)

  3. Règle de Résolution
    - 1. User.locale (si défini)
    - 2. Project.language (si contexte projet)
    - 3. Organisation.default_lang
    - 4. Fallback: fr-CH

  4. Changements
    - Ajoute colonnes langue
    - Migre notifications vers système i18n
    - Crée fonction résolution langue
*/

-- 1. Ajouter colonne langue aux organisations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organizations' AND column_name = 'default_lang'
  ) THEN
    ALTER TABLE organizations
    ADD COLUMN default_lang VARCHAR(10) NOT NULL DEFAULT 'fr-CH';

    COMMENT ON COLUMN organizations.default_lang IS 'Langue par défaut de l''organisation (fr-CH, de-CH, it-CH, en-GB)';
  END IF;
END $$;

-- 2. Ajouter colonne locale aux utilisateurs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'locale'
  ) THEN
    ALTER TABLE users
    ADD COLUMN locale VARCHAR(10);

    COMMENT ON COLUMN users.locale IS 'Préférence de langue utilisateur (null = langue organisation)';
  END IF;
END $$;

-- 3. Ajouter colonne language aux projets
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'language'
  ) THEN
    ALTER TABLE projects
    ADD COLUMN language VARCHAR(10);

    COMMENT ON COLUMN projects.language IS 'Langue par défaut du projet (null = langue organisation)';
  END IF;
END $$;

-- 4. Migrer notifications vers système i18n
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'i18n_key'
  ) THEN
    ALTER TABLE notifications
    ADD COLUMN i18n_key VARCHAR(255);

    COMMENT ON COLUMN notifications.i18n_key IS 'Clé de traduction (ex: notifications.materialChoice.late)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'i18n_params'
  ) THEN
    ALTER TABLE notifications
    ADD COLUMN i18n_params JSONB;

    COMMENT ON COLUMN notifications.i18n_params IS 'Paramètres dynamiques pour traduction (ex: {"lotNumber": "A101"})';
  END IF;
END $$;

-- 5. Créer contrainte check pour langues valides
ALTER TABLE organizations
DROP CONSTRAINT IF EXISTS organizations_default_lang_check;

ALTER TABLE organizations
ADD CONSTRAINT organizations_default_lang_check
CHECK (default_lang IN ('fr-CH', 'de-CH', 'it-CH', 'en-GB'));

ALTER TABLE users
DROP CONSTRAINT IF EXISTS users_locale_check;

ALTER TABLE users
ADD CONSTRAINT users_locale_check
CHECK (locale IS NULL OR locale IN ('fr-CH', 'de-CH', 'it-CH', 'en-GB'));

ALTER TABLE projects
DROP CONSTRAINT IF EXISTS projects_language_check;

ALTER TABLE projects
ADD CONSTRAINT projects_language_check
CHECK (language IS NULL OR language IN ('fr-CH', 'de-CH', 'it-CH', 'en-GB'));

-- 6. Créer fonction de résolution de langue
CREATE OR REPLACE FUNCTION resolve_user_locale(
  p_user_id UUID,
  p_project_id UUID DEFAULT NULL
)
RETURNS VARCHAR(10)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_locale VARCHAR(10);
  v_project_lang VARCHAR(10);
  v_org_lang VARCHAR(10);
BEGIN
  SELECT locale INTO v_locale
  FROM users
  WHERE id = p_user_id;

  IF v_locale IS NOT NULL THEN
    RETURN v_locale;
  END IF;

  IF p_project_id IS NOT NULL THEN
    SELECT language INTO v_project_lang
    FROM projects
    WHERE id = p_project_id;

    IF v_project_lang IS NOT NULL THEN
      RETURN v_project_lang;
    END IF;
  END IF;

  SELECT o.default_lang INTO v_org_lang
  FROM users u
  JOIN user_organizations uo ON u.id = uo.user_id
  JOIN organizations o ON uo.organization_id = o.id
  WHERE u.id = p_user_id
  LIMIT 1;

  IF v_org_lang IS NOT NULL THEN
    RETURN v_org_lang;
  END IF;

  RETURN 'fr-CH';
END;
$$;

COMMENT ON FUNCTION resolve_user_locale IS 'Résout la locale d''un utilisateur selon hiérarchie: User.locale > Project.language > Organisation.default_lang > fr-CH';

-- 7. Créer index pour performance
CREATE INDEX IF NOT EXISTS idx_users_locale ON users(locale) WHERE locale IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_projects_language ON projects(language) WHERE language IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_i18n_key ON notifications(i18n_key) WHERE i18n_key IS NOT NULL;

-- 8. Grant permissions sur fonction
GRANT EXECUTE ON FUNCTION resolve_user_locale TO authenticated;
GRANT EXECUTE ON FUNCTION resolve_user_locale TO service_role;
