import { useState } from 'react';
import { X, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AppointmentCalendarView } from './AppointmentCalendarView';
import { RealProButton } from '../realpro/RealProButton';
import { RealProTextarea } from '../realpro/RealProTextarea';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  availability?: any;
}

interface AppointmentBookingPanelProps {
  supplier: Supplier;
  lotId: string;
  onClose: () => void;
  onBook: (supplierId: string, datetime: string, notes?: string) => Promise<void>;
}

export function AppointmentBookingPanel({
  supplier,
  lotId,
  onClose,
  onBook
}: AppointmentBookingPanelProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>();
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);

  async function handleBook() {
    if (!selectedSlot) return;

    setBooking(true);
    try {
      await onBook(supplier.id, selectedSlot, notes);
      onClose();
    } catch (error) {
      console.error('Error booking appointment:', error);
    } finally {
      setBooking(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-neutral-900 shadow-panel border-l border-neutral-200 dark:border-neutral-800 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                Rendez-vous
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                {supplier.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6 space-y-3">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Informations du fournisseur
            </h3>

            {supplier.email && (
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <Mail className="w-4 h-4" />
                <span>{supplier.email}</span>
              </div>
            )}

            {supplier.phone && (
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <Phone className="w-4 h-4" />
                <span>{supplier.phone}</span>
              </div>
            )}

            {supplier.address && (
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <MapPin className="w-4 h-4" />
                <span>{supplier.address}</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Choisissez un créneau disponible
            </h3>
            <AppointmentCalendarView
              availability={supplier.availability || []}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
            />
          </div>

          {selectedSlot && (
            <div className="bg-brand-50 dark:bg-brand-950/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-brand-600 dark:text-brand-500" />
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {format(new Date(selectedSlot), 'EEEE d MMMM yyyy', { locale: fr })}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    à {format(new Date(selectedSlot), 'HH:mm')}
                  </p>
                </div>
              </div>

              <RealProTextarea
                label="Notes (optionnel)"
                placeholder="Ajoutez des notes pour ce rendez-vous..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <div className="flex gap-4 pt-6 sticky bottom-0 bg-white dark:bg-neutral-900 pb-6">
            <RealProButton
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </RealProButton>
            <RealProButton
              variant="primary"
              onClick={handleBook}
              disabled={!selectedSlot || booking}
              className="flex-1"
            >
              {booking ? 'Réservation...' : 'Confirmer le rendez-vous'}
            </RealProButton>
          </div>
        </div>
      </div>
    </div>
  );
}
