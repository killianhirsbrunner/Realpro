import { useState } from 'react';
import { X, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { SupplierTimeSlot, useSupplierAppointments } from '../../hooks/useSupplierAppointments';

interface AppointmentModalProps {
  slot: SupplierTimeSlot;
  showroomId: string;
  showroomName: string;
  projectId: string;
  lotId: string;
  buyerId: string;
  onClose: () => void;
}

export function AppointmentModal({
  slot,
  showroomId,
  showroomName,
  projectId,
  lotId,
  buyerId,
  onClose,
}: AppointmentModalProps) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { requestAppointment } = useSupplierAppointments();

  const handleBook = async () => {
    try {
      setLoading(true);

      await requestAppointment({
        projectId,
        lotId,
        buyerId,
        showroomId,
        timeSlotId: slot.id,
        category: slot.category,
        buyerNote: notes || undefined,
      });

      alert('Votre demande de rendez-vous a été envoyée avec succès !');
      onClose();
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold">Confirmer le rendez-vous</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">{showroomName}</p>
                {slot.showroom?.address && (
                  <p className="text-sm text-neutral-600">{slot.showroom.address}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-medium">
                {new Date(slot.start_at).toLocaleDateString('fr-CH', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-medium">
                {new Date(slot.start_at).toLocaleTimeString('fr-CH', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {' - '}
                {new Date(slot.end_at).toLocaleTimeString('fr-CH', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Notes ou demandes spéciales (optionnel)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Indiquez vos préférences ou questions..."
              rows={4}
            />
          </div>

          <div className="text-sm text-neutral-600 bg-neutral-50 p-4 rounded-lg">
            <p className="font-medium mb-1">Important :</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Vous recevrez une confirmation par email</li>
              <li>Le fournisseur confirmera votre rendez-vous sous 24h</li>
              <li>Vous pouvez annuler jusqu'à 48h avant</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-neutral-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleBook}
            className="flex-1"
            disabled={loading}
          >
            {loading ? 'Envoi...' : 'Confirmer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
