import React from 'react';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../hooks/useProjects';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { TrendingUp, DollarSign, Package } from 'lucide-react';

export function InvestorPortfolio() {
  const { t } = useTranslation();
  const { user } = useCurrentUser();
  const organizationId = user?.organizations?.[0]?.organization_id || '';
  const { projects, loading } = useProjects(organizationId);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
          {t('investor.portfolio')}
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {t('investor.portfolioDescription')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-neutral-900 dark:text-neutral-50">
                  {project.name}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {project.city}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="flex items-center space-x-1 text-neutral-500 dark:text-neutral-400">
                    <Package className="h-3 w-3" />
                    <span>{t('common.lots')}</span>
                  </div>
                  <p className="mt-1 font-medium text-neutral-900 dark:text-neutral-50">
                    {project.total_lots || 0}
                  </p>
                </div>
                <div>
                  <div className="flex items-center space-x-1 text-neutral-500 dark:text-neutral-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>{t('common.status')}</span>
                  </div>
                  <p className="mt-1 font-medium text-neutral-900 dark:text-neutral-50">
                    {project.status}
                  </p>
                </div>
                <div>
                  <div className="flex items-center space-x-1 text-neutral-500 dark:text-neutral-400">
                    <DollarSign className="h-3 w-3" />
                    <span>{t('common.budget')}</span>
                  </div>
                  <p className="mt-1 font-medium text-neutral-900 dark:text-neutral-50">--</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
