import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProBadge } from '../components/realpro/RealProBadge';
import { SupplierCard } from '../components/materials/SupplierCard';
import { AppointmentBookingPanel } from '../components/materials/AppointmentBookingPanel';
import { useLotDetails } from '../hooks/useLotDetails';
import { useSuppliers } from '../hooks/useSuppliers';
import { useAppointments } from '../hooks/useSuppliers';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export default function ProjectMaterialsAppointments() {
  const { projectId, lotId } = useParams<{ projectId: string; lotId: string }>();
  const navigate = useNavigate();

  const { lot, loading: lotLoading } = useLotDetails(lotId!);
  const { suppliers, loading: suppliersLoading } = useSuppliers(projectId);
  const { appointments, createAppointment, cancelAppointment, loading: appointmentsLoading } = useAppointments(lotId);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  const loading = lotLoading || suppliersLoading || appointmentsLoading;

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleBookAppointment = async (supplierId: string, datetime: string, notes?: string) => {
    await createAppointment(lotId!, supplierId, datetime, notes);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-brand-600 dark:text-brand-500" />;
    }
  };

  const getStatusVariant = (status: string): 'success' | 'error' | 'warning' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <div className="px-10 py-8 space-y-10">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(`/dashboard/projects/${projectId}/materials/lots/${lotId}`)}
          className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <RealProTopbar
            title={`Rendez-vous fournisseurs — Lot ${lot?.number}`}
            subtitle="Planifiez des rendez-vous avec les fournisseurs pour vos choix de matériaux"
          />
        </div>
      </div>

      {appointments && appointments.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Mes rendez-vous
          </h2>

          <div className="space-y-4">
            {appointments.map((appointment) => (
              <RealProCard key={appointment.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {getStatusIcon(appointment.status)}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                        {appointment.supplier?.name || 'Fournisseur'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(new Date(appointment.scheduled_date), 'EEEE d MMMM yyyy', { locale: fr })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {format(new Date(appointment.scheduled_date), 'HH:mm')}
                          </span>
                        </div>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RealProBadge variant={getStatusVariant(appointment.status)}>
                      {appointment.status === 'scheduled' && 'Planifié'}
                      {appointment.status === 'completed' && 'Terminé'}
                      {appointment.status === 'cancelled' && 'Annulé'}
                    </RealProBadge>
                    {appointment.status === 'scheduled' && (
                      <button
                        onClick={() => cancelAppointment(appointment.id)}
                        className="text-sm text-red-600 dark:text-red-500 hover:underline"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              </RealProCard>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Fournisseurs disponibles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onBookAppointment={setSelectedSupplier}
            />
          ))}
        </div>

        {suppliers.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Aucun fournisseur disponible
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Les fournisseurs seront ajoutés prochainement
            </p>
          </div>
        )}
      </section>

      {selectedSupplier && (
        <AppointmentBookingPanel
          supplier={selectedSupplier}
          lotId={lotId!}
          onClose={() => setSelectedSupplier(null)}
          onBook={handleBookAppointment}
        />
      )}
    </div>
  );
}
