/*
  # Fix Security and Performance Issues - Part 4: Function Security

  ## Changes
  1. Fix function search_path to prevent SQL injection
  2. Set secure search_path for all functions
*/

-- Fix search_path for functions (only those that exist)
DO $$
DECLARE
  func_name text;
  func_signature text;
BEGIN
  -- Update search_path for all functions that exist
  FOR func_name, func_signature IN 
    SELECT 
      p.proname,
      pg_get_function_identity_arguments(p.oid)
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
    AND p.proname IN (
      'update_choices_updated_at',
      'prevent_locked_choice_changes',
      'update_supplier_appointments_updated_at',
      'get_time_slot_remaining_capacity',
      'update_project_exports_updated_at',
      'get_project_export_stats',
      'cleanup_old_project_exports',
      'update_project_status_on_phase_change',
      'auto_add_thread_creator_as_participant',
      'resolve_user_locale',
      'update_onboarding_updated_at',
      'initialize_buyer_checklist',
      'cleanup_old_offline_actions',
      'update_updated_at_column',
      'update_submissions_updated_at',
      'update_sales_contracts_updated_at',
      'update_notary_files_updated_at',
      'auto_create_notary_file_for_sales_contract',
      'update_invite_status_on_offer_submit',
      'update_construction_updated_at',
      'create_audit_log',
      'is_feature_enabled',
      'track_feature_usage',
      'update_timestamp',
      'update_signature_requests_updated_at',
      'update_subscription_plans_updated_at',
      'update_organization_subscriptions_updated_at',
      'update_supplier_showrooms_updated_at',
      'check_slot_availability',
      'update_sav_tickets_updated_at',
      'log_sav_status_change',
      'get_sav_statistics',
      'check_warranty_expired',
      'get_thread_stats'
    )
  LOOP
    BEGIN
      EXECUTE format('ALTER FUNCTION public.%I(%s) SET search_path = public, pg_temp', func_name, func_signature);
      RAISE NOTICE 'Updated search_path for function: %.%(%)', 'public', func_name, func_signature;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not update function %.%: %', 'public', func_name, SQLERRM;
    END;
  END LOOP;
END $$;
