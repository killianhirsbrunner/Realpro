import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, User, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Textarea } from '../components/ui/Textarea';

interface Appointment {
  id: string;
  status: string;
  notes_buyer: string;
  notes_supplier: string;
  created_at: string;
  time_slot: {
    start_at: string;
    end_at: string;
    category: string;
  };
  buyer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  lot: {
    lot_number: string;
  };
  project: {
    name: string;
  };
}

interface Showroom {
  id: string;
  name: string;
}

export default function SupplierAppointments() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [showroom, setShowroom] = useState<Showroom | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [supplierNotes, setSupplierNotes] = useState('');

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
        .select('id, name')
        .eq('id', id)
        .single();

      if (showroomError) throw showroomError;
      setShowroom(showroomData);

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/appointments/showrooms/${id}`;
      const token = (await supabase.auth.getSession()).data.session?.access_token;

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (err: any) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (appointmentId: string, status: 'CONFIRMED' | 'DECLINED') => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/appointments/appointments/${appointmentId}/respond`;
      const token = (await supabase.auth.getSession()).data.session?.access_token;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          notesSupplier: supplierNotes || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to respond to appointment');

      setRespondingTo(null);
      setSupplierNotes('');
      loadData();
    } catch (err: any) {
      console.error('Error responding to appointment:', err);
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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'yellow' | 'green' | 'red' | 'gray'> = {
      REQUESTED: 'yellow',
      CONFIRMED: 'green',
      DECLINED: 'red',
      CANCELLED: 'gray',
    };

    const labels: Record<string, string> = {
      REQUESTED: t('appointment.status.requested') || 'En attente',
      CONFIRMED: t('appointment.status.confirmed') || 'Confirmé',
      DECLINED: t('appointment.status.declined') || 'Refusé',
      CANCELLED: t('appointment.status.cancelled') || 'Annulé',
    };

    return (
      <Badge variant={variants[status] || 'gray'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('fr-CH', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
  };

  if (loading) return <LoadingSpinner />;
  if (!showroom) return null;

  const pendingAppointments = appointments.filter((a) => a.status === 'REQUESTED');
  const confirmedAppointments = appointments.filter((a) => a.status === 'CONFIRMED');
  const otherAppointments = appointments.filter(
    (a) => a.status !== 'REQUESTED' && a.status !== 'CONFIRMED'
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/supplier/showrooms')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('supplier.appointments.title') || 'Rendez-vous'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{showroom.name}</p>
        </div>
      </div>

      {pendingAppointments.length > 0 && (
        <Card>
          <div className="p-6 space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {t('supplier.appointments.pending') || 'Demandes en attente'} (
              {pendingAppointments.length})
            </h3>
            <div className="space-y-4">
              {pendingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Badge variant="blue">
                          {getCategoryLabel(appointment.time_slot.category)}
                        </Badge>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateTime(appointment.time_slot.start_at)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                        <User className="w-4 h-4" />
                        <span>
                          {appointment.buyer.first_name} {appointment.buyer.last_name}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span>{appointment.buyer.email}</span>
                        {appointment.buyer.phone && (
                          <>
                            <span className="text-gray-500">•</span>
                            <span>{appointment.buyer.phone}</span>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {appointment.project.name} - Lot {appointment.lot.lot_number}
                      </div>
                      {appointment.notes_buyer && (
                        <div className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded">
                          <strong>{t('supplier.appointments.buyerNotes') || 'Notes acheteur'}:</strong>
                          <br />
                          {appointment.notes_buyer}
                        </div>
                      )}
                    </div>
                  </div>

                  {respondingTo === appointment.id ? (
                    <div className="space-y-3 mt-4 pt-4 border-t border-yellow-200 dark:border-yellow-800">
                      <Textarea
                        value={supplierNotes}
                        onChange={(e) => setSupplierNotes(e.target.value)}
                        placeholder={
                          t('supplier.appointments.supplierNotes') ||
                          'Notes supplémentaires (optionnel)'
                        }
                        rows={2}
                      />
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setRespondingTo(null);
                            setSupplierNotes('');
                          }}
                        >
                          {t('common.cancel') || 'Annuler'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleRespond(appointment.id, 'CONFIRMED')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {t('supplier.appointments.confirm') || 'Confirmer'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleRespond(appointment.id, 'DECLINED')}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          {t('supplier.appointments.decline') || 'Refuser'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-yellow-200 dark:border-yellow-800">
                      <Button size="sm" onClick={() => setRespondingTo(appointment.id)}>
                        {t('supplier.appointments.respond') || 'Répondre'}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {confirmedAppointments.length > 0 && (
        <Card>
          <div className="p-6 space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {t('supplier.appointments.confirmed') || 'Rendez-vous confirmés'} (
              {confirmedAppointments.length})
            </h3>
            <div className="space-y-3">
              {confirmedAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Badge variant="blue">
                          {getCategoryLabel(appointment.time_slot.category)}
                        </Badge>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateTime(appointment.time_slot.start_at)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                        <User className="w-4 h-4" />
                        <span>
                          {appointment.buyer.first_name} {appointment.buyer.last_name}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span>{appointment.buyer.email}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {appointment.project.name} - Lot {appointment.lot.lot_number}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {otherAppointments.length > 0 && (
        <Card>
          <div className="p-6 space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {t('supplier.appointments.history') || 'Historique'}
            </h3>
            <div className="space-y-3">
              {otherAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg opacity-60"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <Badge variant="blue">
                          {getCategoryLabel(appointment.time_slot.category)}
                        </Badge>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDateTime(appointment.time_slot.start_at)} •{' '}
                        {appointment.buyer.first_name} {appointment.buyer.last_name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {appointments.length === 0 && (
        <Card>
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            {t('supplier.appointments.empty') || 'Aucun rendez-vous'}
          </div>
        </Card>
      )}
    </div>
  );
}
