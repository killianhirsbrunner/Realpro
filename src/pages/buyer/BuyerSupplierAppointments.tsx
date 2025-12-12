import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, Building2, Phone, Mail, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useSupplierAppointments, SupplierCategory, SupplierTimeSlot, SupplierAppointment } from '@/hooks/useSupplierAppointments';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const CATEGORIES = [
  { value: 'KITCHEN' as SupplierCategory, label: 'Cuisines', icon: '🍳' },
  { value: 'BATHROOM' as SupplierCategory, label: 'Sanitaires', icon: '🚿' },
  { value: 'FLOORING' as SupplierCategory, label: 'Sols', icon: '🏠' },
  { value: 'OTHER' as SupplierCategory, label: 'Autres', icon: '📦' },
];

interface BuyerSupplierAppointmentsProps {
  projectId: string;
  lotId: string;
  buyerId: string;
}

export default function BuyerSupplierAppointments({
  projectId,
  lotId,
  buyerId,
}: BuyerSupplierAppointmentsProps) {
  const { t } = useTranslation();
  const {
    loading,
    listAvailableSlots,
    requestAppointment,
    listBuyerAppointments,
    cancelAppointment,
  } = useSupplierAppointments();

  const [selectedCategory, setSelectedCategory] = useState<SupplierCategory>('KITCHEN');
  const [availableSlots, setAvailableSlots] = useState<SupplierTimeSlot[]>([]);
  const [myAppointments, setMyAppointments] = useState<SupplierAppointment[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const loadSlots = async () => {
    setLoadingSlots(true);
    const slots = await listAvailableSlots(projectId, selectedCategory);
    setAvailableSlots(slots);
    setLoadingSlots(false);
  };

  const loadAppointments = async () => {
    setLoadingAppointments(true);
    const appointments = await listBuyerAppointments(buyerId);
    setMyAppointments(appointments);
    setLoadingAppointments(false);
  };

  useEffect(() => {
    loadSlots();
  }, [projectId, selectedCategory]);

  useEffect(() => {
    loadAppointments();
  }, [buyerId]);

  const handleRequestAppointment = async (slot: SupplierTimeSlot) => {
    const note = prompt('Souhaitez-vous laisser un message au fournisseur ?');

    const result = await requestAppointment({
      projectId,
      lotId,
      buyerId,
      showroomId: slot.showroom_id,
      timeSlotId: slot.id,
      category: selectedCategory,
      buyerNote: note || undefined,
    });

    if (result) {
      alert('Votre demande de rendez-vous a été envoyée avec succès !');
      await Promise.all([loadSlots(), loadAppointments()]);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      return;
    }

    const success = await cancelAppointment(appointmentId);
    if (success) {
      alert('Rendez-vous annulé');
      await Promise.all([loadSlots(), loadAppointments()]);
    }
  };

  const formatDateTime = (iso: string) => {
    return new Date(iso).toLocaleString('fr-CH', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('fr-CH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-brand-600" />
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Rendez-vous fournisseurs
          </h1>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Planifiez vos rendez-vous chez les fournisseurs pour choisir vos matériaux et finitions.
        </p>
      </header>

      <div className="flex gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={[
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              selectedCategory === cat.value
                ? 'bg-brand-600 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700',
            ].join(' ')}
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              Créneaux disponibles
            </h2>
            {loadingSlots && <LoadingSpinner size="sm" />}
          </div>

          {availableSlots.length === 0 && !loadingSlots && (
            <Card className="p-6 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-neutral-400" />
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Aucun créneau disponible pour cette catégorie.
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                Contactez votre promoteur pour plus d'informations.
              </p>
            </Card>
          )}

          <div className="space-y-3">
            {availableSlots.map((slot) => (
              <Card key={slot.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-2">
                      <Building2 className="mt-0.5 h-4 w-4 text-neutral-400" />
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-50">
                          {slot.showroom?.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {slot.showroom?.company?.name}
                        </p>
                      </div>
                    </div>

                    {slot.showroom?.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-neutral-400" />
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          {slot.showroom.address}, {slot.showroom.city}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-neutral-400" />
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        {formatDateTime(slot.start_at)} - {formatTime(slot.end_at)}
                      </p>
                    </div>

                    <Badge variant="secondary" size="sm">
                      {slot.max_appointments - (slot.appointments?.length || 0)} place(s) disponible(s)
                    </Badge>
                  </div>

                  <Button
                    onClick={() => handleRequestAppointment(slot)}
                    disabled={loading}
                    size="sm"
                  >
                    Réserver
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              Mes rendez-vous
            </h2>
            {loadingAppointments && <LoadingSpinner size="sm" />}
          </div>

          {myAppointments.length === 0 && !loadingAppointments && (
            <Card className="p-6 text-center">
              <Calendar className="mx-auto h-12 w-12 text-neutral-400" />
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Vous n'avez pas encore de rendez-vous planifié.
              </p>
            </Card>
          )}

          <div className="space-y-3">
            {myAppointments.map((appointment) => (
              <Card key={appointment.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-neutral-900 dark:text-neutral-50">
                          {appointment.showroom?.name}
                        </p>
                        <AppointmentStatusBadge status={appointment.status} />
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {appointment.showroom?.company?.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-3.5 w-3.5 text-neutral-400" />
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {formatDateTime(appointment.time_slot?.start_at)} -{' '}
                        {formatTime(appointment.time_slot?.end_at)}
                      </span>
                    </div>

                    {appointment.showroom?.address && (
                      <div className="flex items-start gap-2 text-xs">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 text-neutral-400" />
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {appointment.showroom.address}, {appointment.showroom.city}
                        </span>
                      </div>
                    )}

                    <Badge size="sm">
                      {CATEGORIES.find((c) => c.value === appointment.category)?.label}
                    </Badge>
                  </div>

                  {appointment.buyer_note && (
                    <div className="rounded-lg bg-neutral-50 p-2 text-xs dark:bg-neutral-800">
                      <p className="font-medium text-neutral-700 dark:text-neutral-300">
                        Votre message :
                      </p>
                      <p className="mt-0.5 text-neutral-600 dark:text-neutral-400">
                        {appointment.buyer_note}
                      </p>
                    </div>
                  )}

                  {appointment.supplier_note && (
                    <div className="rounded-lg bg-brand-50 p-2 text-xs dark:bg-brand-900/20">
                      <p className="font-medium text-brand-700 dark:text-brand-300">
                        Message du fournisseur :
                      </p>
                      <p className="mt-0.5 text-brand-600 dark:text-brand-400">
                        {appointment.supplier_note}
                      </p>
                    </div>
                  )}

                  {appointment.status === 'PENDING' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCancelAppointment(appointment.id)}
                      disabled={loading}
                    >
                      Annuler
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function AppointmentStatusBadge({ status }: { status: string }) {
  const statusConfig = {
    PENDING: {
      label: 'En attente',
      variant: 'warning' as const,
      icon: AlertCircle,
    },
    ACCEPTED: {
      label: 'Confirmé',
      variant: 'success' as const,
      icon: CheckCircle2,
    },
    DECLINED: {
      label: 'Refusé',
      variant: 'error' as const,
      icon: XCircle,
    },
    CANCELLED: {
      label: 'Annulé',
      variant: 'secondary' as const,
      icon: XCircle,
    },
    COMPLETED: {
      label: 'Réalisé',
      variant: 'secondary' as const,
      icon: CheckCircle2,
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} size="sm" className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
