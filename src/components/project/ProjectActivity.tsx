interface ActivityItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'sale' | 'document' | 'task' | 'message' | 'submission' | 'payment';
  user?: string;
}

interface ProjectActivityProps {
  activity: ActivityItem[];
}

const activityIcons = {
  sale: '💰',
  document: '📄',
  task: '✅',
  message: '💬',
  submission: '📋',
  payment: '💳',
};

export default function ProjectActivity({ activity }: ProjectActivityProps) {
  return (
    <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-sm space-y-4">
      <h3 className="font-semibold text-lg text-neutral-900">Activité récente</h3>

      {activity.length === 0 && (
        <p className="text-neutral-500 text-sm py-4">Aucune activité récente.</p>
      )}

      <div className="space-y-3">
        {activity.map((item) => (
          <div key={item.id} className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{activityIcons[item.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900">{item.title}</p>
                <p className="text-sm text-neutral-600 mt-1">{item.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xs text-neutral-500">{item.date}</p>
                  {item.user && (
                    <>
                      <span className="text-neutral-300">•</span>
                      <p className="text-xs text-neutral-500">{item.user}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
