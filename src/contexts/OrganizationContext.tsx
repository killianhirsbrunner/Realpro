import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface Organization {
  id: string;
  name: string;
  slug: string;
  default_language: string;
  logo_url: string | null;
  settings: Record<string, any>;
  is_active: boolean;
}

interface Project {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  city: string;
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

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserOrganizations();
  }, []);

  useEffect(() => {
    if (currentOrganization) {
      loadOrganizationProjects(currentOrganization.id);
      localStorage.setItem('current_organization_id', currentOrganization.id);
    }
  }, [currentOrganization]);

  useEffect(() => {
    if (currentProject) {
      localStorage.setItem('current_project_id', currentProject.id);
    }
  }, [currentProject]);

  async function loadUserOrganizations() {
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

      const savedOrgId = localStorage.getItem('current_organization_id');
      const defaultOrg = userOrgs?.find(uo => uo.is_default)?.organizations as unknown as Organization;
      const orgToSet = orgs.find(o => o.id === savedOrgId) || defaultOrg || orgs[0];

      if (orgToSet) {
        setCurrentOrganization(orgToSet);
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadOrganizationProjects(organizationId: string) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, organization_id, name, code, city, status, image_url')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);

      const savedProjectId = localStorage.getItem('current_project_id');
      const projectToSet = data?.find(p => p.id === savedProjectId) || data?.[0];

      if (projectToSet) {
        setCurrentProject(projectToSet);
      } else {
        setCurrentProject(null);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    }
  }

  async function refreshOrganizations() {
    await loadUserOrganizations();
  }

  async function refreshProjects() {
    if (currentOrganization) {
      await loadOrganizationProjects(currentOrganization.id);
    }
  }

  const handleSetCurrentOrganization = (org: Organization) => {
    setCurrentOrganization(org);
    setCurrentProject(null);
  };

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        currentProject,
        organizations,
        projects,
        setCurrentOrganization: handleSetCurrentOrganization,
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

export function useOrganizationContext() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganizationContext must be used within an OrganizationProvider');
  }
  return context;
}
