import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus, Calendar, Clock, Users, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

interface TimeSlot {
  id: string;
  category: string;
  start_at: string;
  end_at: string;
  capacity: number;
  is_active: boolean;
}

interface Showroom {
  id: string;
  name: string;
  categories: string[];
}

export default function SupplierTimeSlots() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [showroom, setShowroom] = useState<Showroom | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    category: '',
    start_at: '',
    end_at: '',
    capacity: 1,
  });

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      const { data: showroomData, error: showroomError } = await supabase
        .from('supplier_showrooms')
        .select('id, name, categories')
        .eq('id', id)
        .single();

      if (showroomError) throw showroomError;
      setShowroom(showroomData);

      if (showroomData.categories.length > 0) {
        setFormData((prev) => ({ ...prev, category: showroomData.categories[0] }));
      }

      const { data: slotsData, error: slotsError } = await supabase
        .from('supplier_time_slots')
        .select('*')
        .eq('showroom_id', id)
        .order('start_at', { ascending: true });

      if (slotsError) throw slotsError;
      setSlots(slotsData || []);
    } catch (err: any) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const { error } = await supabase.from('supplier_time_slots').insert({
        showroom_id: id,
        category: formData.category,
        start_at: formData.start_at,
        end_at: formData.end_at,
        capacity: formData.capacity,
        is_active: true,
      });

      if (error) throw error;

      setFormData({
        category: showroom?.categories[0] || '',
        start_at: '',
        end_at: '',
        capacity: 1,
      });
      setShowForm(false);
      loadData();
    } catch (err: any) {
      console.error('Error creating slot:', err);
      alert(err.message);
    }
  };

  const handleDelete = async (slotId: string) => {
    if (!confirm(t('supplier.slots.confirmDelete') || 'Supprimer ce créneau ?')) return;

    try {
      const { error } = await supabase.from('supplier_time_slots').delete().eq('id', slotId);

      if (error) throw error;
      loadData();
    } catch (err: any) {
      console.error('Error deleting slot:', err);
      alert(err.message);
    }
  };

  const toggleActive = async (slotId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('supplier_time_slots')
        .update({ is_active: !isActive })
        .eq('id', slotId);

      if (error) throw error;
      loadData();
    } catch (err: any) {
      console.error('Error updating slot:', err);
      alert(err.message);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      KITCHEN: 'Cuisines',
      SANITARY: 'Sanitaires',
      FLOORING: 'Sols',
    };
    return labels[category] || category;
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('fr-CH', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  if (loading) return <LoadingSpinner />;
  if (!showroom) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/supplier/showrooms')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('supplier.slots.title') || 'Créneaux horaires'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{showroom.name}</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('supplier.slots.create') || 'Nouveau créneau'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {t('supplier.slots.new') || 'Créer un créneau'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('supplier.category') || 'Catégorie'}
                </label>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {showroom.categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {getCategoryLabel(cat)}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('supplier.slots.startAt') || 'Début'}
                </label>
                <Input
                  type="datetime-local"
                  value={formData.start_at}
                  onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('supplier.slots.endAt') || 'Fin'}
                </label>
                <Input
                  type="datetime-local"
                  value={formData.end_at}
                  onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('supplier.slots.capacity') || 'Capacité'}
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                {t('common.cancel') || 'Annuler'}
              </Button>
              <Button type="submit">{t('common.create') || 'Créer'}</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="p-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
            {t('supplier.slots.list') || 'Créneaux disponibles'}
          </h3>

          {slots.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {t('supplier.slots.empty') || 'Aucun créneau créé'}
            </div>
          ) : (
            <div className="space-y-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Badge variant="blue">{getCategoryLabel(slot.category)}</Badge>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateTime(slot.start_at)}</span>
                      <span>→</span>
                      <Clock className="w-4 h-4" />
                      <span>{formatDateTime(slot.end_at)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>
                        {t('supplier.slots.capacity') || 'Capacité'}: {slot.capacity}
                      </span>
                    </div>
                    <Badge variant={slot.is_active ? 'green' : 'gray'}>
                      {slot.is_active ? t('common.active') || 'Actif' : t('common.inactive') || 'Inactif'}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(slot.id, slot.is_active)}
                    >
                      {slot.is_active ? t('common.deactivate') || 'Désactiver' : t('common.activate') || 'Activer'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(slot.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
