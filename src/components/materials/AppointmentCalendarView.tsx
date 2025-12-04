import { format, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock } from 'lucide-react';

interface TimeSlot {
  datetime: string;
  available: boolean;
}

interface AppointmentCalendarViewProps {
  availability: TimeSlot[];
  selectedSlot?: string;
  onSelectSlot: (datetime: string) => void;
}

export function AppointmentCalendarView({
  availability,
  selectedSlot,
  onSelectSlot
}: AppointmentCalendarViewProps) {
  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    const startDate = new Date();

    for (let day = 0; day < 14; day++) {
      const date = addDays(startDate, day);

      const morningSlots = [
        { hour: 9, minute: 0 },
        { hour: 10, minute: 0 },
        { hour: 11, minute: 0 }
      ];

      const afternoonSlots = [
        { hour: 14, minute: 0 },
        { hour: 15, minute: 0 },
        { hour: 16, minute: 0 },
        { hour: 17, minute: 0 }
      ];

      [...morningSlots, ...afternoonSlots].forEach(({ hour, minute }) => {
        const slotDate = new Date(date);
        slotDate.setHours(hour, minute, 0, 0);

        if (slotDate > new Date()) {
          slots.push({
            datetime: slotDate.toISOString(),
            available: Math.random() > 0.3
          });
        }
      });
    }

    return slots;
  };

  const slots = availability && availability.length > 0 ? availability : generateTimeSlots();

  const groupedSlots = slots.reduce((acc, slot) => {
    const date = format(new Date(slot.datetime), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedSlots).map(([date, daySlots]) => (
        <div key={date}>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            {format(new Date(date), 'EEEE d MMMM', { locale: fr })}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {daySlots
              .filter(slot => slot.available)
              .map((slot) => {
                const isSelected = selectedSlot === slot.datetime;
                return (
                  <button
                    key={slot.datetime}
                    onClick={() => onSelectSlot(slot.datetime)}
                    disabled={!slot.available}
                    className={`p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-brand-600 dark:bg-brand-500 text-white border-brand-600 dark:border-brand-500'
                        : slot.available
                        ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-brand-600 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20'
                        : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">
                        {format(new Date(slot.datetime), 'HH:mm')}
                      </span>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      ))}

      {Object.keys(groupedSlots).length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-500">
            Aucun créneau disponible pour le moment
          </p>
        </div>
      )}
    </div>
  );
}
