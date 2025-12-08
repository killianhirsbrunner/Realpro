import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import {
  MODULES,
  getModulesByCategory,
  type Module,
} from '../lib/modules/config';
import { Search, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export function ModulesHub() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const coreModules = getModulesByCategory('core');
  const businessModules = getModulesByCategory('business');
  const supportModules = getModulesByCategory('support');
  const adminModules = getModulesByCategory('admin');

  const filterModules = (modules: Module[]) => {
    if (!searchQuery) return modules;
    return modules.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const ModuleCard = ({ module }: { module: Module }) => {
    const Icon = module.icon;

    return (
      <Card
        className="p-6 hover:shadow-lg-premium transition-all duration-200 cursor-pointer group"
        onClick={() => navigate(module.routes[0]?.path || '/')}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={clsx('p-3 rounded-xl', module.bgColor)}>
            <Icon className={clsx('h-6 w-6', module.color)} />
          </div>
          <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
        </div>

        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          {module.name}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          {module.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {module.routes.slice(0, 3).map((route) => {
            const RouteIcon = route.icon;
            return (
              <div
                key={route.path}
                className="flex items-center gap-1 text-xs text-neutral-500"
              >
                {RouteIcon && <RouteIcon className="w-3 h-3" />}
                <span>{route.label}</span>
                {route.badge && (
                  <Badge size="sm" variant="success">
                    {route.badge}
                  </Badge>
                )}
              </div>
            );
          })}
          {module.routes.length > 3 && (
            <span className="text-xs text-neutral-400">
              +{module.routes.length - 3} plus
            </span>
          )}
        </div>
      </Card>
    );
  };

  const CategorySection = ({
    title,
    modules,
    description,
  }: {
    title: string;
    modules: Module[];
    description: string;
  }) => {
    const filteredModules = filterModules(modules);
    if (filteredModules.length === 0) return null;

    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {title}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <PageShell
      title="Modules RealPro"
      subtitle="Accédez à tous les modules de la plateforme"
    >
      <div className="space-y-12">
        {/* Barre de recherche */}
        <div className="max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              placeholder="Rechercher un module..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12"
            />
          </div>
        </div>

        {/* Vue d'ensemble */}
        <Card className="p-6 bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 border-none">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {coreModules.length}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Modules Core
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {businessModules.length}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Modules Business
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {supportModules.length}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Modules Support
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {adminModules.length}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Administration
              </div>
            </div>
          </div>
        </Card>

        {/* Modules par catégorie */}
        <CategorySection
          title="Modules Core"
          description="Fonctionnalités essentielles de la plateforme"
          modules={coreModules}
        />

        <CategorySection
          title="Modules Business"
          description="Outils de gestion métier"
          modules={businessModules}
        />

        <CategorySection
          title="Modules Support"
          description="Outils de support et communication"
          modules={supportModules}
        />

        <CategorySection
          title="Administration"
          description="Configuration et administration système"
          modules={adminModules}
        />
      </div>
    </PageShell>
  );
}
