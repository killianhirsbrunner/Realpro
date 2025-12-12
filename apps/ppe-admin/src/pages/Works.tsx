import { Card, CardHeader, CardContent, Button, Badge, Progress } from '@realpro/ui';
import { Wrench, Plus, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';

const mockWorks = [
  {
    id: '1',
    title: 'Rénovation toiture',
    property: 'Résidence Les Alpes',
    status: 'in_progress',
    progress: 65,
    startDate: '01.09.2024',
    endDate: '15.01.2025',
    budget: 85000,
    spent: 52000,
    contractor: 'Toitures Suisse SA',
  },
  {
    id: '2',
    title: 'Remplacement chaudière',
    property: 'Immeuble Lac-Léman',
    status: 'planned',
    progress: 0,
    startDate: '01.02.2025',
    endDate: '28.02.2025',
    budget: 35000,
    spent: 0,
    contractor: 'Chauffage Pro Sàrl',
  },
  {
    id: '3',
    title: 'Réfection cage d\'escalier',
    property: 'Copropriété du Parc',
    status: 'completed',
    progress: 100,
    startDate: '01.06.2024',
    endDate: '30.06.2024',
    budget: 15000,
    spent: 14200,
    contractor: 'Peinture Express',
  },
];

const statusConfig = {
  planned: { label: 'Planifié', variant: 'info' as const, icon: Calendar },
  in_progress: { label: 'En cours', variant: 'warning' as const, icon: Wrench },
  completed: { label: 'Terminé', variant: 'success' as const, icon: CheckCircle2 },
  delayed: { label: 'Retardé', variant: 'error' as const, icon: AlertTriangle },
};

export function WorksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Travaux
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            Suivi des projets de travaux et rénovations
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Nouveau projet
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
                <p className="text-sm text-neutral-500">Planifiés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Wrench className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">1</p>
                <p className="text-sm text-neutral-500">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">5</p>
                <p className="text-sm text-neutral-500">Terminés cette année</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {mockWorks.map((work) => {
          const StatusIcon = statusConfig[work.status as keyof typeof statusConfig].icon;
          const budgetPercent = Math.round((work.spent / work.budget) * 100);

          return (
            <Card key={work.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      work.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-900/20' :
                      work.status === 'in_progress' ? 'bg-orange-50 dark:bg-orange-900/20' :
                      'bg-blue-50 dark:bg-blue-900/20'
                    }`}>
                      <StatusIcon className={`w-6 h-6 ${
                        work.status === 'completed' ? 'text-emerald-600' :
                        work.status === 'in_progress' ? 'text-orange-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-neutral-900 dark:text-white">
                          {work.title}
                        </h3>
                        <Badge
                          variant={statusConfig[work.status as keyof typeof statusConfig].variant}
                          size="sm"
                        >
                          {statusConfig[work.status as keyof typeof statusConfig].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-500 mt-1">{work.property}</p>
                      <p className="text-sm text-neutral-400 mt-1">
                        {work.contractor} · {work.startDate} → {work.endDate}
                      </p>
                    </div>
                  </div>

                  <div className="lg:w-64 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Avancement</span>
                      <span className="font-medium">{work.progress}%</span>
                    </div>
                    <Progress value={work.progress} size="sm" variant={work.progress === 100 ? 'success' : 'primary'} />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Budget</span>
                      <span className={`font-medium ${budgetPercent > 100 ? 'text-error-600' : ''}`}>
                        CHF {work.spent.toLocaleString('fr-CH')} / {work.budget.toLocaleString('fr-CH')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
