import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';

export function NewSubmission() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    description: '',
    cfc_code: '',
    budget_estimate: '',
    deadline: '',
    deadline_questions: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;

    try {
      setLoading(true);

      const { error } = await supabase.from('submissions').insert({
        project_id: projectId,
        label: formData.label,
        description: formData.description || null,
        cfc_code: formData.cfc_code || null,
        budget_estimate: formData.budget_estimate ? parseFloat(formData.budget_estimate) : null,
        deadline: formData.deadline,
        deadline_questions: formData.deadline_questions || null,
        status: 'draft',
      });

      if (error) throw error;

      navigate(`/projects/${projectId}/submissions`);
    } catch (error) {
      console.error('Error creating submission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/submissions`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux soumissions
        </Link>

        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          Nouvelle soumission
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Créez un nouveau dossier d'appel d'offres
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                Titre <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Ex: Maçonnerie - Gros œuvre"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description détaillée des travaux..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                  Code CFC
                </label>
                <Input
                  type="text"
                  value={formData.cfc_code}
                  onChange={(e) => setFormData({ ...formData, cfc_code: e.target.value })}
                  placeholder="Ex: CFC 221"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                  Budget estimé (CHF)
                </label>
                <Input
                  type="number"
                  value={formData.budget_estimate}
                  onChange={(e) => setFormData({ ...formData, budget_estimate: e.target.value })}
                  placeholder="Ex: 250000"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                  Délai dépôt des offres <span className="text-red-600">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                  Délai questions / clarifications
                </label>
                <Input
                  type="date"
                  value={formData.deadline_questions}
                  onChange={(e) => setFormData({ ...formData, deadline_questions: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/projects/${projectId}/submissions`)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Création...' : 'Créer la soumission'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
