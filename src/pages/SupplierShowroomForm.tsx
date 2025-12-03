import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const CATEGORIES = [
  { value: 'KITCHEN', label: 'Cuisines' },
  { value: 'SANITARY', label: 'Sanitaires' },
  { value: 'FLOORING', label: 'Sols' },
];

export default function SupplierShowroomForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { organization } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postal_code: '',
    contact_email: '',
    contact_phone: '',
    categories: [] as string[],
    is_active: true,
    notes: '',
  });

  useEffect(() => {
    if (id) {
      loadShowroom();
    }
  }, [id]);

  const loadShowroom = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('supplier_showrooms')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData(data);
      }
    } catch (err: any) {
      console.error('Error loading showroom:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization?.id) return;

    try {
      setSaving(true);

      if (id) {
        const { error } = await supabase
          .from('supplier_showrooms')
          .update(formData)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('supplier_showrooms')
          .insert({
            ...formData,
            organization_id: organization.id,
          });

        if (error) throw error;
      }

      navigate('/supplier/showrooms');
    } catch (err: any) {
      console.error('Error saving showroom:', err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/supplier/showrooms')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {id
            ? t('supplier.showrooms.edit') || 'Modifier le showroom'
            : t('supplier.showrooms.create') || 'Nouveau showroom'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('supplier.showroom.name') || 'Nom du showroom'} *
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Cuisines Premium Genève"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('supplier.showroom.categories') || 'Catégories'} *
              </label>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((cat) => (
                  <label
                    key={cat.value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(cat.value)}
                      onChange={() => toggleCategory(cat.value)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {cat.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('common.address') || 'Adresse'}
              </label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Rue et numéro"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('common.postalCode') || 'Code postal'}
                </label>
                <Input
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  placeholder="1200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('common.city') || 'Ville'}
                </label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Genève"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('common.email') || 'Email'}
                </label>
                <Input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="contact@showroom.ch"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('common.phone') || 'Téléphone'}
                </label>
                <Input
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="+41 22 123 45 67"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('common.notes') || 'Notes'}
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Informations complémentaires..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700 dark:text-gray-300">
                {t('supplier.showroom.active') || 'Showroom actif (visible par les acheteurs)'}
              </label>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/supplier/showrooms')}
            >
              {t('common.cancel') || 'Annuler'}
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving
                ? t('common.saving') || 'Enregistrement...'
                : t('common.save') || 'Enregistrer'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
