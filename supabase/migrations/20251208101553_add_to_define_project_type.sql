/*
  # Add TO_DEFINE to project_type enum

  1. Changes
    - Add 'TO_DEFINE' value to project_type enum
    - This allows projects to be created without a defined type initially
    
  2. Notes
    - Users can configure the project type later from the project settings
*/

DO $$ BEGIN
  ALTER TYPE project_type ADD VALUE IF NOT EXISTS 'TO_DEFINE';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
