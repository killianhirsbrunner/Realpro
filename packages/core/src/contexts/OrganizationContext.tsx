/**
 * RealPro | Organization Context
 * Global provider for organization and project state
 */

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

// Simplified types for context (avoid circular deps with entities)
interface Organization {
  id: string;
  name: string;
  slug: string;
  default_language: string;
  logo_url: string | null;
  settings: Record<string, unknown>;
  is_active: boolean;
}

interface Project {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  city: string | null;
  status: string;
  image_url: string | null;
}

interface OrganizationContextType {
  currentOrganization: Organization | null;
  currentProject: Project | null;
  organizations: Organization[];
  projects: Project[];
  setCurrentOrganization: (org: Organization) => void;
  setCurrentProject: (project: Project | null) => void;
  loading: boolean;
  refreshOrganizations: () => Promise<void>;
  refreshProjects: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

const ORG_STORAGE_KEY = 'realpro_current_organization_id';
const PROJECT_STORAGE_KEY = 'realpro_current_project_id';

interface OrganizationProviderProps {
  children: ReactNode;
  supabase: SupabaseClient;
}

export function OrganizationProvider({ children, supabase }: OrganizationProviderProps) {
  const [currentOrganization, setCurrentOrganizationState] = useState<Organization | null>(null);
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: userOrgs, error } = await supabase
        .from('user_organizations')
        .select(`
          organization_id,
          is_default,
          organizations (
            id,
            name,
            slug,
            default_language,
            logo_url,
            settings,
            is_active
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const orgs = userOrgs
        ?.map(uo => uo.organizations as unknown as Organization)
        .filter(Boolean) || [];

      setOrganizations(orgs);

      const savedOrgId = localStorage.getItem(ORG_STORAGE_KEY);
      const defaultOrg = userOrgs?.find(uo => uo.is_default)?.organizations as unknown as Organization;
      const orgToSet = orgs.find(o => o.id === savedOrgId) || defaultOrg || orgs[0];

      if (orgToSet) {
        setCurrentOrganizationState(orgToSet);
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const loadOrganizationProjects = useCallback(async (organizationId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, organization_id, name, code, city, status, image_url')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);

      const savedProjectId = localStorage.getItem(PROJECT_STORAGE_KEY);
      const projectToSet = data?.find(p => p.id === savedProjectId) || data?.[0];

      setCurrentProjectState(projectToSet || null);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    }
  }, [supabase]);

  useEffect(() => {
    loadUserOrganizations();
  }, [loadUserOrganizations]);

  useEffect(() => {
    if (currentOrganization) {
      loadOrganizationProjects(currentOrganization.id);
      localStorage.setItem(ORG_STORAGE_KEY, currentOrganization.id);
    }
  }, [currentOrganization, loadOrganizationProjects]);

  useEffect(() => {
    if (currentProject) {
      localStorage.setItem(PROJECT_STORAGE_KEY, currentProject.id);
    } else {
      localStorage.removeItem(PROJECT_STORAGE_KEY);
    }
  }, [currentProject]);

  const setCurrentOrganization = useCallback((org: Organization) => {
    setCurrentOrganizationState(org);
    setCurrentProjectState(null);
  }, []);

  const setCurrentProject = useCallback((project: Project | null) => {
    setCurrentProjectState(project);
  }, []);

  const refreshOrganizations = useCallback(async () => {
    await loadUserOrganizations();
  }, [loadUserOrganizations]);

  const refreshProjects = useCallback(async () => {
    if (currentOrganization) {
      await loadOrganizationProjects(currentOrganization.id);
    }
  }, [currentOrganization, loadOrganizationProjects]);

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        currentProject,
        organizations,
        projects,
        setCurrentOrganization,
        setCurrentProject,
        loading,
        refreshOrganizations,
        refreshProjects,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}

// Alias for backwards compatibility
export { useOrganization as useOrganizationContext };
