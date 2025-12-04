import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface PlanningItem {
  id: string;
  phase: string;
  status: string;
  progress?: number;
}

interface GlobalPlanningProps {
  planning: PlanningItem[];
}

export function GlobalPlanning({ planning }: GlobalPlanningProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en cours':
      case 'in_progress':
        return 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200';
      case 'terminé':
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'en retard':
      case 'delayed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200';
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Planning global</h2>

      {planning.length === 0 ? (
        <p className="text-sm text-neutral-500">Aucune phase planifiée</p>
      ) : (
        <ul className="space-y-3">
          {planning.map((item) => (
            <li key={item.id} className="flex justify-between items-center p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors">
              <span className="text-sm font-medium">{item.phase}</span>
              <Badge className={getStatusColor(item.status)}>
                {item.status}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
