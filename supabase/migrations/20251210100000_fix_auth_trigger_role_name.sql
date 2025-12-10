/*
  # Correction du trigger d'authentification

  ## Problème
  Le trigger `handle_new_user()` cherchait un rôle nommé 'ADMIN' qui n'existe pas.
  Le rôle correct est 'org_admin'.

  ## Solution
  - Mise à jour de la fonction pour utiliser le bon nom de rôle 'org_admin'
  - Ajout de gestion d'erreur améliorée
*/

-- Recréer la fonction avec le bon nom de rôle
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
  v_role_id uuid;
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

  -- Récupérer le rôle org_admin (correction du nom de rôle)
  SELECT id INTO v_role_id FROM public.roles WHERE name = 'org_admin' LIMIT 1;

  -- Assigner le rôle admin par défaut si trouvé
  IF v_role_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, organization_id, role_id)
    VALUES (NEW.id, v_org_id, v_role_id);
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log l'erreur mais ne pas bloquer la création de l'utilisateur auth
    RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- S'assurer que le trigger existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
