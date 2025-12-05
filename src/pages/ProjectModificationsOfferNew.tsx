import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Save, Upload } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';

export function ProjectModificationsOfferNew() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    lot_number: '',
    supplier_name: '',
    supplier_email: '',
    price: '',
    description: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;

    try {
      setLoading(true);

      const { error } = await supabase.from('supplier_offers').insert({
        project_id: projectId,
        lot_number: formData.lot_number,
        supplier_name: formData.supplier_name,
        supplier_email: formData.supplier_email || null,
        price: formData.price ? parseFloat(formData.price) : null,
        description: formData.description || null,
        notes: formData.notes || null,
        status: 'draft',
        version: 1,
      });

      if (error) throw error;

      navigate(`/projects/${projectId}/modifications/offers`);
    } catch (error) {
      console.error('Error creating offer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/modifications/offers`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux offres
        </Link>

        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          Nouvelle offre fournisseur
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Créez une nouvelle offre pour modification technique
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                  Lot concerné <span className="text-red-600">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.lot_number}
                  onChange={(e) => setFormData({ ...formData, lot_number: e.target.value })}
                  placeholder="Ex: A.02 ou B.15"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                  Prix total (CHF)
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Ex: 15000"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                  Nom du fournisseur <span className="text-red-600">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.supplier_name}
                  onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                  placeholder="Ex: Cuisine Concept SA"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                  Email du fournisseur
                </label>
                <Input
                  type="email"
                  value={formData.supplier_email}
                  onChange={(e) => setFormData({ ...formData, supplier_email: e.target.value })}
                  placeholder="contact@fournisseur.ch"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                Description de l'offre
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez les travaux, matériaux, finitions..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                Notes internes
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notes pour usage interne uniquement..."
                rows={3}
              />
            </div>

            <div className="p-4 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <Upload className="h-5 w-5" />
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">Documents (PDF, images)</p>
                  <p>Les documents pourront être ajoutés après création de l'offre</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/projects/${projectId}/modifications/offers`)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Création...' : 'Créer l\'offre'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
