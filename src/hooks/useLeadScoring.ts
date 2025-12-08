import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export interface ScoringRule {
  id: string;
  project_id?: string;
  name: string;
  description?: string;
  category: 'demographic' | 'behavioral' | 'engagement' | 'firmographic';
  field_name: string;
  operator: string;
  value?: string;
  score_points: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeadScore {
  id: string;
  prospect_id: string;
  total_score: number;
  demographic_score: number;
  behavioral_score: number;
  engagement_score: number;
  firmographic_score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  last_calculated_at: string;
  created_at: string;
  updated_at: string;
}

export function useLeadScoring() {
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScoringRules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crm_lead_scoring_rules')
        .select('*')
        .eq('is_active', true)
        .order('category, score_points', { ascending: [true, false] });

      if (error) throw error;
      setScoringRules(data || []);
    } catch (error) {
      console.error('Error fetching scoring rules:', error);
      toast.error('Erreur lors du chargement des règles de scoring');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScoringRules();
  }, []);

  const createScoringRule = async (ruleData: Partial<ScoringRule>) => {
    try {
      const { data, error } = await supabase
        .from('crm_lead_scoring_rules')
        .insert([ruleData])
        .select()
        .single();

      if (error) throw error;

      setScoringRules((prev) => [...prev, data]);
      toast.success('Règle de scoring créée');
      return data;
    } catch (error) {
      console.error('Error creating scoring rule:', error);
      toast.error('Erreur lors de la création');
      throw error;
    }
  };

  const updateScoringRule = async (id: string, updates: Partial<ScoringRule>) => {
    try {
      const { data, error } = await supabase
        .from('crm_lead_scoring_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setScoringRules((prev) =>
        prev.map((rule) => (rule.id === id ? data : rule))
      );
      toast.success('Règle mise à jour');
      return data;
    } catch (error) {
      console.error('Error updating scoring rule:', error);
      toast.error('Erreur lors de la mise à jour');
      throw error;
    }
  };

  const deleteScoringRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crm_lead_scoring_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setScoringRules((prev) => prev.filter((rule) => rule.id !== id));
      toast.success('Règle supprimée');
    } catch (error) {
      console.error('Error deleting scoring rule:', error);
      toast.error('Erreur lors de la suppression');
      throw error;
    }
  };

  const getProspectScore = async (prospectId: string): Promise<LeadScore | null> => {
    try {
      const { data, error } = await supabase
        .from('crm_lead_scores')
        .select('*')
        .eq('prospect_id', prospectId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching prospect score:', error);
      return null;
    }
  };

  const calculateProspectScore = async (prospectId: string, prospectData: any) => {
    try {
      // Calculer le score basé sur les règles
      let demographicScore = 0;
      let behavioralScore = 0;
      let engagementScore = 0;
      let firmographicScore = 0;

      for (const rule of scoringRules) {
        if (!rule.is_active) continue;

        const fieldValue = prospectData[rule.field_name];
        let matches = false;

        switch (rule.operator) {
          case 'equals':
            matches = fieldValue === rule.value;
            break;
          case 'contains':
            matches = fieldValue && fieldValue.includes(rule.value);
            break;
          case 'greater_than':
            matches = parseFloat(fieldValue) > parseFloat(rule.value || '0');
            break;
          case 'less_than':
            matches = parseFloat(fieldValue) < parseFloat(rule.value || '0');
            break;
          case 'exists':
            matches = fieldValue != null && fieldValue !== '';
            break;
        }

        if (matches) {
          switch (rule.category) {
            case 'demographic':
              demographicScore += rule.score_points;
              break;
            case 'behavioral':
              behavioralScore += rule.score_points;
              break;
            case 'engagement':
              engagementScore += rule.score_points;
              break;
            case 'firmographic':
              firmographicScore += rule.score_points;
              break;
          }
        }
      }

      const totalScore = demographicScore + behavioralScore + engagementScore + firmographicScore;

      // Déterminer le grade
      let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
      if (totalScore >= 80) grade = 'A';
      else if (totalScore >= 60) grade = 'B';
      else if (totalScore >= 40) grade = 'C';
      else if (totalScore >= 20) grade = 'D';

      // Enregistrer le score
      const { data, error } = await supabase
        .from('crm_lead_scores')
        .upsert({
          prospect_id: prospectId,
          total_score: totalScore,
          demographic_score: demographicScore,
          behavioral_score: behavioralScore,
          engagement_score: engagementScore,
          firmographic_score: firmographicScore,
          grade,
          last_calculated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error calculating prospect score:', error);
      toast.error('Erreur lors du calcul du score');
      throw error;
    }
  };

  return {
    scoringRules,
    loading,
    createScoringRule,
    updateScoringRule,
    deleteScoringRule,
    getProspectScore,
    calculateProspectScore,
    refetch: fetchScoringRules,
  };
}
