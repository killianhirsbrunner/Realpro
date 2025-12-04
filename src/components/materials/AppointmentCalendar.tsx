import { useState } from 'react';
import { Card } from '../ui/Card';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { SupplierTimeSlot } from '../../hooks/useSupplierAppointments';
import { AppointmentModal } from './AppointmentModal';

interface AppointmentCalendarProps {
  slots: SupplierTimeSlot[];
  showroomId: string;
  showroomName: string;
  projectId: string;
  lotId: string;
  buyerId: string;
}

export function AppointmentCalendar({
  slots,
  showroomId,
  showroomName,
  projectId,
  lotId,
  buyerId,
}: AppointmentCalendarProps) {
  const [selectedSlot, setSelectedSlot] = useState<SupplierTimeSlot | null>(null);

  const groupedSlots = slots.reduce((groups, slot) => {
    const date = new Date(slot.start_at).toLocaleDateString('fr-CH');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(slot);
    return groups;
  }, {} as Record<string, SupplierTimeSlot[]>);

  const isSlotAvailable = (slot: SupplierTimeSlot) => {
    const bookedCount = slot.booked_count || 0;
    return slot.is_active && bookedCount < slot.capacity;
  };

  return (
    <>
      <div className="space-y-6">
        {Object.entries(groupedSlots).length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">Aucun créneau disponible pour le moment.</p>
            <p className="text-sm text-neutral-500 mt-2">
              Les créneaux seront bientôt ajoutés par le fournisseur.
            </p>
          </Card>
        ) : (
          Object.entries(groupedSlots).map(([date, daySlots]) => (
            <div key={date}>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-neutral-500" />
                {new Date(daySlots[0].start_at).toLocaleDateString('fr-CH', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {daySlots.map((slot) => {
                  const available = isSlotAvailable(slot);
                  const bookedCount = slot.booked_count || 0;

                  return (
                    <Card
                      key={slot.id}
                      className={`p-4 transition ${
                        available
                          ? 'cursor-pointer hover:shadow-lg hover:border-blue-300'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => available && setSelectedSlot(slot)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">
                            {new Date(slot.start_at).toLocaleTimeString('fr-CH', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {available ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Disponible
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            Complet
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-neutral-600 space-y-1">
                        <div>
                          Durée: {Math.round(
                            (new Date(slot.end_at).getTime() - new Date(slot.start_at).getTime()) / 60000
                          )} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {bookedCount}/{slot.capacity} places
                        </div>
                      </div>

                      {slot.notes && (
                        <div className="mt-2 text-xs text-neutral-500 line-clamp-2">
                          {slot.notes}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedSlot && (
        <AppointmentModal
          slot={selectedSlot}
          showroomId={showroomId}
          showroomName={showroomName}
          projectId={projectId}
          lotId={lotId}
          buyerId={buyerId}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </>
  );
}
