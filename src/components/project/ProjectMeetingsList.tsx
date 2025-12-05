import { Calendar, FileText, MapPin, Users } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  attendees: number;
  type: 'chantier' | 'coordination' | 'pilotage' | 'bureau' | 'autre';
  hasMinutes: boolean;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface ProjectMeetingsListProps {
  meetings: Meeting[];
  onMeetingClick?: (meetingId: string) => void;
  onViewMinutes?: (meetingId: string) => void;
}

const typeColors = {
  chantier: { bg: 'bg-brand-100', text: 'text-brand-700', label: 'Chantier' },
  coordination: { bg: 'bg-brand-100', text: 'text-brand-700', label: 'Coordination' },
  pilotage: { bg: 'bg-brand-100', text: 'text-brand-700', label: 'Pilotage' },
  bureau: { bg: 'bg-green-100', text: 'text-green-700', label: 'Bureau' },
  autre: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Autre' },
};

export default function ProjectMeetingsList({
  meetings,
  onMeetingClick,
  onViewMinutes,
}: ProjectMeetingsListProps) {
  const upcomingMeetings = meetings.filter(m => m.status === 'scheduled');
  const pastMeetings = meetings.filter(m => m.status === 'completed');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Réunions à venir ({upcomingMeetings.length})
        </h3>
        <div className="space-y-3">
          {upcomingMeetings.map((meeting) => {
            const typeStyle = typeColors[meeting.type];
            return (
              <div
                key={meeting.id}
                onClick={() => onMeetingClick?.(meeting.id)}
                className="p-5 bg-white border-l-4 border-brand-500 rounded-r-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-900">{meeting.title}</p>
                      <span className={`px-2 py-1 ${typeStyle.bg} ${typeStyle.text} rounded text-xs font-medium`}>
                        {typeStyle.label}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{meeting.date} à {meeting.time}</span>
                      </div>

                      {meeting.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{meeting.location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{meeting.attendees} participants</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {upcomingMeetings.length === 0 && (
            <p className="text-gray-500 text-sm py-4">Aucune réunion planifiée</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Réunions passées ({pastMeetings.length})
        </h3>
        <div className="space-y-3">
          {pastMeetings.slice(0, 10).map((meeting) => {
            const typeStyle = typeColors[meeting.type];
            return (
              <div
                key={meeting.id}
                className="p-5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-white transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-gray-900">{meeting.title}</p>
                      <span className={`px-2 py-1 ${typeStyle.bg} ${typeStyle.text} rounded text-xs font-medium`}>
                        {typeStyle.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{meeting.date}</span>
                    </div>
                  </div>

                  {meeting.hasMinutes && onViewMinutes && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewMinutes(meeting.id);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>PV</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {pastMeetings.length === 0 && (
            <p className="text-gray-500 text-sm py-4">Aucune réunion passée</p>
          )}
        </div>
      </div>
    </div>
  );
}
