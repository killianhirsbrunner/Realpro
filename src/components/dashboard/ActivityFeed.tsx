import { Card } from '../ui/Card';

interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Activité récente</h2>

      {activities.length === 0 ? (
        <p className="text-sm text-neutral-500">Aucune activité récente</p>
      ) : (
        <ul className="space-y-3">
          {activities.map((a) => (
            <li key={a.id} className="text-sm p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors">
              <span className="font-semibold">{a.user}</span>
              <span className="text-neutral-700 dark:text-neutral-300"> — {a.action}</span>
              <span className="text-neutral-500 text-xs ml-2">({a.time})</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
