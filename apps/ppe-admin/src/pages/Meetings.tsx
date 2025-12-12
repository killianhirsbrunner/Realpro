import { Card, CardContent, Button, Badge } from '@realpro/ui';
import { Calendar, Plus, Users, FileText, Clock, MapPin } from 'lucide-react';

const mockMeetings = [
  {
    id: '1',
    title: 'Assemblée générale ordinaire 2025',
    property: 'Résidence Les Alpes',
    type: 'ordinary',
    status: 'planned',
    date: '15.03.2025',
    time: '18:30',
    location: 'Salle communale de Lausanne',
    attendees: 0,
    total: 22,
  },
  {
    id: '2',
    title: 'AG extraordinaire - Travaux toiture',
    property: 'Immeuble Lac-Léman',
    type: 'extraordinary',
    status: 'convoked',
    date: '20.01.2025',
    time: '19:00',
    location: 'Restaurant du Lac, Morges',
    attendees: 8,
    total: 14,
  },
  {
    id: '3',
    title: 'Assemblée générale ordinaire 2024',
    property: 'Résidence Les Alpes',
    type: 'ordinary',
    status: 'completed',
    date: '15.06.2024',
    time: '18:30',
    location: 'Salle communale de Lausanne',
    attendees: 18,
    total: 22,
  },
];

const statusConfig = {
  planned: { label: 'Planifiée', variant: 'info' as const },
  convoked: { label: 'Convoquée', variant: 'warning' as const },
  in_progress: { label: 'En cours', variant: 'brand' as const },
  completed: { label: 'Terminée', variant: 'success' as const },
  cancelled: { label: 'Annulée', variant: 'error' as const },
};

const typeConfig = {
  ordinary: { label: 'Ordinaire', variant: 'default' as const },
  extraordinary: { label: 'Extraordinaire', variant: 'warning' as const },
};

export function MeetingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Assemblées générales
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            Planification et suivi des AG
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Nouvelle AG
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">2</p>
                <p className="text-sm text-neutral-500">À venir</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">1</p>
                <p className="text-sm text-neutral-500">Convoquée</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">12</p>
                <p className="text-sm text-neutral-500">Terminées (total)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {mockMeetings.map((meeting) => (
          <Card key={meeting.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-xs text-emerald-600 font-medium">
                      {meeting.date.split('.')[1] === '01' ? 'JAN' :
                       meeting.date.split('.')[1] === '03' ? 'MAR' :
                       meeting.date.split('.')[1] === '06' ? 'JUN' : ''}
                    </span>
                    <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                      {meeting.date.split('.')[0]}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-neutral-900 dark:text-white">
                        {meeting.title}
                      </h3>
                      <Badge variant={typeConfig[meeting.type as keyof typeof typeConfig].variant} size="sm">
                        {typeConfig[meeting.type as keyof typeof typeConfig].label}
                      </Badge>
                      <Badge variant={statusConfig[meeting.status as keyof typeof statusConfig].variant} size="sm">
                        {statusConfig[meeting.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">{meeting.property}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-neutral-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {meeting.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {meeting.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {meeting.status !== 'planned' && (
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-neutral-400" />
                        <span className="text-lg font-bold text-neutral-900 dark:text-white">
                          {meeting.attendees}/{meeting.total}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">participants</p>
                    </div>
                  )}
                  <Button variant="outline" size="sm">
                    {meeting.status === 'completed' ? 'Voir PV' : 'Gérer'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
