import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';

interface Appointment {
  id: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'DECLINED' | 'CANCELLED';
  notes_buyer?: string;
  notes_supplier?: string;
  created_at: string;
  showroom: {
    name: string;
    city?: string;
    contact_email?: string;
    contact_phone?: string;
  };
  time_slot: {
    start_at: string;
    end_at: string;
    category: string;
  };
  lot: {
    lot_number: string;
  };
  project: {
    name: string;
  };
}

export function BuyerAppointments() {
  const { t } = useI18n();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/appointments/buyer/me`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to load appointments');

      const data = await response.json();
      setAppointments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    if (!confirm(t('common.confirm'))) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/appointments/${appointmentId}/cancel`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to cancel appointment');

      loadAppointments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'KITCHEN':
        return t('materials.categories.kitchen') || 'Cuisine';
      case 'SANITARY':
        return t('materials.categories.sanitary') || 'Sanitaires';
      case 'FLOORING':
        return t('materials.categories.flooring') || 'Revêtements';
      default:
        return category;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REQUESTED':
        return <Badge variant="warning">{t('appointments.status.requested') || 'En attente'}</Badge>;
      case 'CONFIRMED':
        return <Badge variant="success">{t('appointments.status.confirmed') || 'Confirmé'}</Badge>;
      case 'DECLINED':
        return <Badge variant="error">{t('appointments.status.declined') || 'Refusé'}</Badge>;
      case 'CANCELLED':
        return <Badge variant="gray">{t('appointments.status.cancelled') || 'Annulé'}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'DECLINED':
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">{t('errors.genericError')}: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          {t('appointments.myAppointments') || 'Mes rendez-vous fournisseurs'}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Suivez vos rendez-vous pour les cuisines, sanitaires et revêtements de sols
        </p>
      </div>

      {appointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={t('appointments.noAppointments') || 'Aucun rendez-vous'}
          description="Vous n'avez pas encore de rendez-vous fournisseur"
        />
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="mt-1">{getStatusIcon(appointment.status)}</div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {appointment.showroom.name}
                        </h3>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {getCategoryLabel(appointment.time_slot.category)}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(appointment.time_slot.start_at).toLocaleDateString('fr-CH', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(appointment.time_slot.start_at).toLocaleTimeString('fr-CH', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {' - '}
                          {new Date(appointment.time_slot.end_at).toLocaleTimeString('fr-CH', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {appointment.showroom.city && (
                        <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
                          <MapPin className="w-4 h-4" />
                          <span>{appointment.showroom.city}</span>
                        </div>
                      )}

                      <div className="text-neutral-600 dark:text-neutral-400">
                        <span className="font-medium">Lot:</span> {appointment.lot.lot_number} - {appointment.project.name}
                      </div>
                    </div>

                    {appointment.showroom.contact_phone && (
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        <span className="font-medium">Contact:</span> {appointment.showroom.contact_phone}
                        {appointment.showroom.contact_email && ` • ${appointment.showroom.contact_email}`}
                      </div>
                    )}

                    {appointment.notes_buyer && (
                      <div className="bg-brand-50 dark:bg-brand-900/20 rounded-lg p-3">
                        <p className="text-xs font-medium text-brand-900 dark:text-brand-300 mb-1">
                          Votre message:
                        </p>
                        <p className="text-sm text-brand-800 dark:text-brand-200">
                          {appointment.notes_buyer}
                        </p>
                      </div>
                    )}

                    {appointment.notes_supplier && (
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                        <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300 mb-1">
                          Réponse du fournisseur:
                        </p>
                        <p className="text-sm text-emerald-800 dark:text-emerald-200">
                          {appointment.notes_supplier}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {appointment.status === 'REQUESTED' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancel(appointment.id)}
                  >
                    {t('actions.cancel')}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
