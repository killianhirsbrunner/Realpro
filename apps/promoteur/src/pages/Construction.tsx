import { useState } from 'react';
import { Button, SearchInput, Badge, Select, Progress } from '@realpro/ui';
import { PageShell, ContentCard } from '@realpro/ui/layouts';
import { StatCard } from '@realpro/ui';
import { Plus, Download, Building2, Calendar, CheckCircle2, Clock, AlertTriangle, HardHat, Hammer, Users } from 'lucide-react';

const mockProjects = [
  { id: '1', name: 'Résidence du Lac', phase: 'gros_oeuvre', progress: 65, startDate: '2024-03-01', endDate: '2025-09-30', contractor: 'Implenia SA', budget: 12500000, spent: 7800000, delays: 0 },
  { id: '2', name: 'Les Jardins de Genève', phase: 'finitions', progress: 85, startDate: '2023-09-01', endDate: '2025-03-31', contractor: 'Losinger Marazzi', budget: 8200000, spent: 7100000, delays: 15 },
  { id: '3', name: 'Villa Park', phase: 'fondations', progress: 25, startDate: '2024-11-01', endDate: '2026-06-30', contractor: 'Implenia SA', budget: 18000000, spent: 4200000, delays: 0 },
];

const mockMilestones = [
  { id: '1', project: 'Résidence du Lac', name: 'Toiture terminée', date: '2025-01-15', status: 'upcoming' },
  { id: '2', project: 'Les Jardins', name: 'Livraison Lot A', date: '2025-02-28', status: 'upcoming' },
  { id: '3', project: 'Résidence du Lac', name: 'Façade Est', date: '2025-01-05', status: 'completed' },
  { id: '4', project: 'Villa Park', name: 'Dalle RDC', date: '2025-01-20', status: 'in_progress' },
];

const phaseConfig: Record<string, { label: string; variant: 'info' | 'warning' | 'success' | 'neutral' }> = {
  terrassement: { label: 'Terrassement', variant: 'neutral' },
  fondations: { label: 'Fondations', variant: 'info' },
  gros_oeuvre: { label: 'Gros œuvre', variant: 'warning' },
  finitions: { label: 'Finitions', variant: 'success' },
  livraison: { label: 'Livraison', variant: 'success' },
};

const statusConfig: Record<string, { label: string; variant: 'info' | 'warning' | 'success'; icon: typeof Clock }> = {
  upcoming: { label: 'À venir', variant: 'info', icon: Clock },
  in_progress: { label: 'En cours', variant: 'warning', icon: Hammer },
  completed: { label: 'Terminé', variant: 'success', icon: CheckCircle2 },
};

export function ConstructionPage() {
  const [search, setSearch] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('all');

  const filteredProjects = mockProjects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesPhase = phaseFilter === 'all' || p.phase === phaseFilter;
    return matchesSearch && matchesPhase;
  });

  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = mockProjects.reduce((sum, p) => sum + p.spent, 0);
  const avgProgress = Math.round(mockProjects.reduce((sum, p) => sum + p.progress, 0) / mockProjects.length);

  return (
    <PageShell
      title="Chantiers"
      subtitle="Suivi de construction"
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>Rapport</Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>Nouveau jalon</Button>
        </div>
      }
      filters={
        <div className="flex items-center gap-4">
          <SearchInput placeholder="Rechercher..." onSearch={setSearch} className="w-64" />
          <Select value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)} className="w-40">
            <option value="all">Toutes phases</option>
            <option value="fondations">Fondations</option>
            <option value="gros_oeuvre">Gros œuvre</option>
            <option value="finitions">Finitions</option>
          </Select>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Chantiers actifs" value={mockProjects.length.toString()} icon={<Building2 className="h-5 w-5" />} iconBgClass="bg-brand-100" iconColorClass="text-brand-600" />
        <StatCard label="Avancement moyen" value={`${avgProgress}%`} icon={<HardHat className="h-5 w-5" />} iconBgClass="bg-warning-100" iconColorClass="text-warning-600" />
        <StatCard label="Budget total" value={`CHF ${(totalBudget / 1000000).toFixed(1)}M`} icon={<Hammer className="h-5 w-5" />} iconBgClass="bg-info-100" iconColorClass="text-info-600" />
        <StatCard label="Dépensé" value={`CHF ${(totalSpent / 1000000).toFixed(1)}M`} description={`${Math.round((totalSpent / totalBudget) * 100)}% du budget`} icon={<Users className="h-5 w-5" />} iconBgClass="bg-success-100" iconColorClass="text-success-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Projets en cours</h2>
          {filteredProjects.map((project) => {
            const phase = phaseConfig[project.phase];
            return (
              <ContentCard key={project.id} className="hover:border-brand-300 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <Badge variant={phase.variant} size="sm">{phase.label}</Badge>
                      {project.delays > 0 && <Badge variant="error" size="sm"><AlertTriangle className="h-3 w-3 mr-1" />+{project.delays}j</Badge>}
                    </div>
                    <p className="text-sm text-neutral-500">{project.contractor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-brand-600">{project.progress}%</p>
                    <p className="text-xs text-neutral-500">avancement</p>
                  </div>
                </div>
                <Progress value={project.progress} size="lg" className="mb-4" />
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><span className="text-neutral-500">Début:</span> <span className="font-medium">{new Date(project.startDate).toLocaleDateString('fr-CH')}</span></div>
                  <div><span className="text-neutral-500">Fin prévue:</span> <span className="font-medium">{new Date(project.endDate).toLocaleDateString('fr-CH')}</span></div>
                  <div><span className="text-neutral-500">Budget:</span> <span className="font-medium">CHF {(project.spent / 1000000).toFixed(1)}M / {(project.budget / 1000000).toFixed(1)}M</span></div>
                </div>
              </ContentCard>
            );
          })}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Jalons à venir</h2>
          {mockMilestones.map((milestone) => {
            const status = statusConfig[milestone.status];
            const Icon = status.icon;
            return (
              <ContentCard key={milestone.id} className="hover:border-brand-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${milestone.status === 'completed' ? 'bg-success-100' : milestone.status === 'in_progress' ? 'bg-warning-100' : 'bg-neutral-100'}`}>
                    <Icon className={`h-5 w-5 ${milestone.status === 'completed' ? 'text-success-600' : milestone.status === 'in_progress' ? 'text-warning-600' : 'text-neutral-500'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{milestone.name}</p>
                    <p className="text-sm text-neutral-500">{milestone.project}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-neutral-400" />
                      <span className="text-xs text-neutral-500">{new Date(milestone.date).toLocaleDateString('fr-CH')}</span>
                      <Badge variant={status.variant} size="sm">{status.label}</Badge>
                    </div>
                  </div>
                </div>
              </ContentCard>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
