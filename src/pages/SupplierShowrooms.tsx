import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, MapPin, Phone, Mail, Calendar, Edit, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';

interface Showroom {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  contact_email: string;
  contact_phone: string;
  categories: string[];
  is_active: boolean;
  notes: string;
}

export default function SupplierShowrooms() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, organization } = useCurrentUser();
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (organization?.id) {
      loadShowrooms();
    }
  }, [organization?.id]);

  const loadShowrooms = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('supplier_showrooms')
        .select('*')
        .eq('organization_id', organization?.id)
        .order('name');

      if (fetchError) throw fetchError;
      setShowrooms(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      KITCHEN: t('supplier.category.kitchen') || 'Cuisines',
      SANITARY: t('supplier.category.sanitary') || 'Sanitaires',
      FLOORING: t('supplier.category.flooring') || 'Sols',
    };
    return labels[category] || category;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={loadShowrooms} />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {t('supplier.showrooms.title') || 'Mes Showrooms'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {t('supplier.showrooms.subtitle') || 'Gérez vos showrooms et créneaux de rendez-vous'}
          </p>
        </div>
        <Button
          onClick={() => navigate('/supplier/showrooms/new')}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{t('supplier.showrooms.create') || 'Nouveau showroom'}</span>
        </Button>
      </div>

      {showrooms.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title={t('supplier.showrooms.empty.title') || 'Aucun showroom'}
          description={
            t('supplier.showrooms.empty.description') ||
            'Créez votre premier showroom pour permettre aux acheteurs de prendre rendez-vous.'
          }
          action={
            <Button onClick={() => navigate('/supplier/showrooms/new')}>
              <Plus className="w-4 h-4 mr-2" />
              {t('supplier.showrooms.create') || 'Nouveau showroom'}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showrooms.map((showroom) => (
            <Card key={showroom.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">
                      {showroom.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      {showroom.categories.map((cat) => (
                        <Badge key={cat} variant="blue">
                          {getCategoryLabel(cat)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge variant={showroom.is_active ? 'green' : 'gray'}>
                    {showroom.is_active
                      ? t('common.active') || 'Actif'
                      : t('common.inactive') || 'Inactif'}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {showroom.address && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {showroom.address}
                        {showroom.postal_code && showroom.city && (
                          <>
                            <br />
                            {showroom.postal_code} {showroom.city}
                          </>
                        )}
                      </span>
                    </div>
                  )}
                  {showroom.contact_phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{showroom.contact_phone}</span>
                    </div>
                  )}
                  {showroom.contact_email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{showroom.contact_email}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/supplier/showrooms/${showroom.id}/appointments`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {t('supplier.appointments.view') || 'Rendez-vous'}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/supplier/showrooms/${showroom.id}/slots`)}
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/supplier/showrooms/${showroom.id}/edit`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
