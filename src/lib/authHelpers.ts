/**
 * RealPro | © 2024-2025 Realpro SA. Tous droits réservés.
 * Authentication helpers for user setup
 */

import { supabase } from './supabase';

interface UserSetupData {
  firstName?: string;
  lastName?: string;
  company?: string;
}

/**
 * Ensures a user has all required database records after authentication.
 * Creates missing user, organization, and user_organization records.
 */
export async function ensureUserSetup(authUserId: string, userData?: UserSetupData): Promise<{
  success: boolean;
  error?: string;
  userId?: string;
  organizationId?: string;
}> {
  try {
    // 1. Check if user record exists
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('id', authUserId)
      .maybeSingle();

    if (userCheckError && userCheckError.code !== 'PGRST116') {
      console.error('Error checking user:', userCheckError);
    }

    // 2. Create user record if it doesn't exist
    if (!existingUser) {
      const { data: authUser } = await supabase.auth.getUser();
      const email = authUser.user?.email || '';
      const firstName = userData?.firstName || authUser.user?.user_metadata?.first_name || '';
      const lastName = userData?.lastName || authUser.user?.user_metadata?.last_name || '';

      const { error: createUserError } = await supabase
        .from('users')
        .insert({
          id: authUserId,
          email: email,
          first_name: firstName,
          last_name: lastName,
          language: 'FR',
          is_active: true
        });

      if (createUserError) {
        console.error('Error creating user record:', createUserError);
        // Don't fail - RLS might prevent this but trigger might handle it
      }
    }

    // 3. Check if user has any organization
    const { data: userOrgs, error: orgCheckError } = await supabase
      .from('user_organizations')
      .select('organization_id')
      .eq('user_id', authUserId);

    if (orgCheckError && orgCheckError.code !== 'PGRST116') {
      console.error('Error checking user organizations:', orgCheckError);
    }

    let organizationId = userOrgs?.[0]?.organization_id;

    // 4. If no organization, create a default one
    if (!organizationId) {
      const companyName = userData?.company || 'Mon Organisation';
      const slug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

      // Try to create organization
      const { data: newOrg, error: createOrgError } = await supabase
        .from('organizations')
        .insert({
          name: companyName,
          slug: `${slug}-${Date.now()}`,
          default_language: 'FR',
          settings: {},
          is_active: true
        })
        .select('id')
        .single();

      if (createOrgError) {
        console.error('Error creating organization:', createOrgError);
        // Try to find any existing organization for this user via trigger
        const { data: retryOrgs } = await supabase
          .from('user_organizations')
          .select('organization_id')
          .eq('user_id', authUserId)
          .limit(1);

        if (retryOrgs?.[0]?.organization_id) {
          organizationId = retryOrgs[0].organization_id;
        }
      } else if (newOrg) {
        organizationId = newOrg.id;

        // 5. Create user_organization link
        const { error: linkError } = await supabase
          .from('user_organizations')
          .insert({
            user_id: authUserId,
            organization_id: organizationId,
            role: 'org_admin',
            is_default: true
          });

        if (linkError) {
          console.error('Error linking user to organization:', linkError);
        }
      }
    }

    return {
      success: true,
      userId: authUserId,
      organizationId
    };
  } catch (error) {
    console.error('Error in ensureUserSetup:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de configuration utilisateur'
    };
  }
}

/**
 * Handles post-authentication setup
 */
export async function handlePostAuthSetup(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return false;
    }

    const result = await ensureUserSetup(user.id, {
      firstName: user.user_metadata?.first_name,
      lastName: user.user_metadata?.last_name,
      company: user.user_metadata?.company
    });

    return result.success;
  } catch (error) {
    console.error('Error in post-auth setup:', error);
    return false;
  }
}
