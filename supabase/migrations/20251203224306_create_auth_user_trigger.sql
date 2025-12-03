/*
  # Trigger pour création automatique du profil utilisateur

  1. Fonction
    - Crée automatiquement un utilisateur dans `public.users` quand un compte auth est créé
    - Extrait le prénom/nom de l'email si non fournis
    - Crée une organisation par défaut pour chaque nouvel utilisateur

  2. Trigger
    - Se déclenche après l'insertion dans `auth.users`
    - Appelle la fonction pour créer le profil

  3. Sécurité
    - Aucune RLS requise (trigger système)
*/

-- Fonction pour créer le profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id uuid;
  v_first_name text;
  v_last_name text;
  v_email_parts text[];
BEGIN
  -- Extraire prénom/nom de l'email si pas de metadata
  v_email_parts := string_to_array(split_part(NEW.email, '@', 1), '.');
  v_first_name := COALESCE(
    NEW.raw_user_meta_data->>'first_name',
    initcap(v_email_parts[1]),
    'User'
  );
  v_last_name := COALESCE(
    NEW.raw_user_meta_data->>'last_name',
    CASE WHEN array_length(v_email_parts, 1) > 1 THEN initcap(v_email_parts[2]) ELSE '' END,
    ''
  );

  -- Créer une organisation par défaut pour le nouvel utilisateur
  INSERT INTO public.organizations (name, slug)
  VALUES (
    v_first_name || '''s Organization',
    lower(regexp_replace(v_first_name || '-' || gen_random_uuid()::text, '[^a-z0-9-]', '', 'g'))
  )
  RETURNING id INTO v_org_id;

  -- Créer le profil utilisateur
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (NEW.id, NEW.email, v_first_name, v_last_name);

  -- Lier l'utilisateur à son organisation
  INSERT INTO public.user_organizations (user_id, organization_id, is_default)
  VALUES (NEW.id, v_org_id, true);

  -- Assigner le rôle admin par défaut
  INSERT INTO public.user_roles (user_id, organization_id, role_id)
  SELECT NEW.id, v_org_id, id
  FROM public.roles
  WHERE name = 'ADMIN'
  LIMIT 1;

  RETURN NEW;
END;
$$;

-- Trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
