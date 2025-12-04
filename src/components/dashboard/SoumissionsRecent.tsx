import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface Soumission {
  id: string;
  label: string;
  deadline: string;
  status: string;
}

interface SoumissionsRecentProps {
  soumissions: Soumission[];
}

export function SoumissionsRecent({ soumissions }: SoumissionsRecentProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Soumissions en cours</h2>

      {soumissions.length === 0 ? (
        <p className="text-sm text-neutral-500">Aucune soumission en cours</p>
      ) : (
        <div className="space-y-3">
          {soumissions.map((s) => (
            <div key={s.id} className="flex justify-between items-center text-sm p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors">
              <span className="font-medium">{s.label}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {s.status}
                </Badge>
                <span className="text-neutral-500 text-xs">{s.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
