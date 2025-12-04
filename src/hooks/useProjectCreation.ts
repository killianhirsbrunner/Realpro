import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ProjectCreationData {
  name: string;
  address: string;
  city: string;
  canton: string;
  type: string;
  defaultLanguage?: string;
  vatRate?: string;
  description?: string;
  buildingsCount?: string;
  entrancesCount?: string;
  floorsCount?: string;
  lots?: any[];
  actors?: any[];
  totalBudget?: string;
  contingencyRate?: string;
  paymentMode?: string;
  startDate?: string;
  endDate?: string;
  submissionDeadlineGO?: string;
  submissionDeadlineSO?: string;
}

export function useProjectCreation() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const createProject = async (data: ProjectCreationData) => {
    setIsCreating(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      const { data: userOrg } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!userOrg) {
        throw new Error('Organisation non trouvée');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/project-wizard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
        },
        body: JSON.stringify({
          organizationId: userOrg.organization_id,
          userId: user.id,
          projectData: data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du projet');
      }

      const result = await response.json();

      if (result.projectId) {
        navigate(`/projects/${result.projectId}`);
      } else {
        throw new Error('ID du projet non retourné');
      }
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError(err.message || 'Erreur lors de la création du projet');
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createProject,
    isCreating,
    error,
  };
}
