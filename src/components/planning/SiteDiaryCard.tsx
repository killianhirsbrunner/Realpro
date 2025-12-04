import { SiteDiaryEntry } from '../../hooks/useSiteDiaryEntries';
import { Card } from '../ui/Card';
import { Calendar, Cloud, Users, AlertTriangle } from 'lucide-react';

interface SiteDiaryCardProps {
  entry: SiteDiaryEntry;
  onClick?: () => void;
}

export function SiteDiaryCard({ entry, onClick }: SiteDiaryCardProps) {
  const workforceCount = Array.isArray(entry.workforce) ? entry.workforce.length : 0;
  const issuesCount = Array.isArray(entry.issues) ? entry.issues.length : 0;

  return (
    <Card
      className={`p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-neutral-500" />
            Rapport du {new Date(entry.entry_date).toLocaleDateString('fr-CH', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </h3>
          {entry.weather && (
            <p className="text-sm text-neutral-600 flex items-center gap-2 mt-1">
              <Cloud className="w-4 h-4" />
              Météo : {entry.weather}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {workforceCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
              <Users className="w-4 h-4" />
              {workforceCount}
            </div>
          )}
          {issuesCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded text-sm">
              <AlertTriangle className="w-4 h-4" />
              {issuesCount}
            </div>
          )}
        </div>
      </div>

      {entry.notes && (
        <div className="mt-4">
          <p className="text-sm text-neutral-700 line-clamp-3">
            {entry.notes}
          </p>
        </div>
      )}

      {Array.isArray(entry.workforce) && entry.workforce.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <p className="text-xs text-neutral-600 font-medium mb-2">Personnel sur site :</p>
          <div className="flex flex-wrap gap-2">
            {entry.workforce.slice(0, 3).map((worker: any, index) => (
              <span key={index} className="text-xs bg-neutral-100 px-2 py-1 rounded">
                {worker.company || worker.name || `Travailleur ${index + 1}`}
              </span>
            ))}
            {entry.workforce.length > 3 && (
              <span className="text-xs text-neutral-500">
                +{entry.workforce.length - 3} autres
              </span>
            )}
          </div>
        </div>
      )}

      {Array.isArray(entry.issues) && entry.issues.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <p className="text-xs text-neutral-600 font-medium mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-orange-600" />
            Problèmes signalés :
          </p>
          <ul className="text-sm text-neutral-700 space-y-1">
            {entry.issues.slice(0, 2).map((issue: any, index) => (
              <li key={index} className="line-clamp-1">
                • {issue.description || issue.title || `Problème ${index + 1}`}
              </li>
            ))}
            {entry.issues.length > 2 && (
              <li className="text-xs text-neutral-500">
                +{entry.issues.length - 2} autre{entry.issues.length > 3 ? 's' : ''}
              </li>
            )}
          </ul>
        </div>
      )}
    </Card>
  );
}
