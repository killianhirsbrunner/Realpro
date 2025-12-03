import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ChecklistItem {
  key: string;
  label: string;
  status: 'OK' | 'MISSING' | 'WARNING';
  details?: string[];
}

interface NotaryChecklistProps {
  buyerId: string;
}

export function NotaryChecklist({ buyerId }: NotaryChecklistProps) {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadChecklist = async () => {
    setLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notary-checklist/buyer/${buyerId}`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, { headers });

      if (!response.ok) throw new Error('Failed to load checklist');

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to load checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (buyerId) {
      loadChecklist();
    }
  }, [buyerId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OK':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'WARNING':
        return <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case 'MISSING':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('common.loading')}</p>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
              {t('notary.checklistTitle')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {data.buyer.fullName} · {data.buyer.projectName}
            </p>
          </div>
          <Badge
            className={
              data.ready
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300'
            }
          >
            {data.ready ? t('notary.ready') : t('notary.incomplete')}
          </Badge>
        </div>

        <div className="space-y-3">
          {data.items.map((item: ChecklistItem) => (
            <div
              key={item.key}
              className="flex items-start space-x-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
            >
              <div className="mt-0.5">{getStatusIcon(item.status)}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {item.label}
                </p>
                {item.details && item.details.length > 0 && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {t('notary.missing')}: {item.details.join(', ')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
