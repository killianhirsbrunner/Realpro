/*
  # Fix Infinite Recursion in RLS Policies

  1. Problème
    - La policy "Users see their project participations" cause une récursion infinie
    - Elle référence project_participants dans sa propre condition USING
    
  2. Solution
    - Supprimer les policies problématiques
    - Créer des policies simples et directes sans récursion
    - Utiliser uniquement auth.uid() et organization_id
    
  3. Sécurité
    - Maintenir l'isolation des données
    - Accès basé sur organization_id pour les owners
    - Accès basé sur user_id pour les participants
*/

-- Supprimer toutes les policies problématiques de project_participants
DROP POLICY IF EXISTS "Users see their project participations" ON project_participants;
DROP POLICY IF EXISTS "Users see only their projects" ON project_participants;

-- Supprimer les policies problématiques de projects
DROP POLICY IF EXISTS "Access to projects based on role" ON projects;
DROP POLICY IF EXISTS "Access based on participation" ON projects;

-- Nouvelle policy simple pour project_participants
-- Les utilisateurs voient les participations de leurs projets
CREATE POLICY "View project participants"
  ON project_participants FOR SELECT
  TO authenticated
  USING (
    -- Les membres de l'organisation voient tous les participants
    project_id IN (
      SELECT id FROM projects 
      WHERE organization_id IN (
        SELECT organization_id FROM users WHERE id = auth.uid()
      )
    )
    OR
    -- Les participants voient leur propre participation
    user_id = auth.uid()
  );

-- Policy pour INSERT sur project_participants
CREATE POLICY "Insert project participants"
  ON project_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects 
      WHERE organization_id IN (
        SELECT organization_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Policy pour UPDATE sur project_participants
CREATE POLICY "Update project participants"
  ON project_participants FOR UPDATE
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE organization_id IN (
        SELECT organization_id FROM users WHERE id = auth.uid()
      )
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects 
      WHERE organization_id IN (
        SELECT organization_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Policy pour DELETE sur project_participants
CREATE POLICY "Delete project participants"
  ON project_participants FOR DELETE
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE organization_id IN (
        SELECT organization_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Nouvelle policy simple pour projects
-- Les utilisateurs voient les projets de leur organisation
CREATE POLICY "View organization projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Policy pour INSERT sur projects
CREATE POLICY "Insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Policy pour UPDATE sur projects
CREATE POLICY "Update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Policy pour DELETE sur projects
CREATE POLICY "Delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Commentaire
COMMENT ON POLICY "View organization projects" ON projects IS 
  'Utilisateurs voient les projets de leur organisation - pas de récursion';
COMMENT ON POLICY "View project participants" ON project_participants IS 
  'Utilisateurs voient les participants des projets de leur org - pas de récursion';
