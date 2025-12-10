import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  Users,
  FileText,
  Home,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Phone,
  Mail,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  UserPlus,
  FileSignature,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ClientDocumentsManager } from '../components/stakeholder';
import { useClientDocuments } from '../hooks/useClientDocuments';
import { useProspects } from '../hooks/useProspects';
import { useLots } from '../hooks/useLots';

interface BrokerStats {
  totalProspects: number;
  activeProspects: number;
  reservations: number;
  conversions: number;
  conversionRate: number;
  totalCommission: number;
  pendingDocuments: number;
  lotsAvailable: number;
}

export default function BrokerProjectDashboard() {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'prospects' | 'lots' | 'documents'>('overview');
  const [stats, setStats] = useState<BrokerStats | null>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);

      // Fetch project
      const { data: projectData } = await supabase
        .from('projects')
        .select('*, organization:organizations(*)')
        .eq('id', projectId)
        .single();

      setProject(projectData);

      // Fetch stats (would be RPC in production)
      // Simulated stats for now
      setStats({
        totalProspects: 24,
        activeProspects: 18,
        reservations: 6,
        conversions: 4,
        conversionRate: 16.7,
        totalCommission: 45000,
        pendingDocuments: 8,
        lotsAvailable: 12,
      });
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {project.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Espace Courtier • {project.organization?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to={`/broker/project/${projectId}/prospect/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Nouveau prospect
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
              { id: 'prospects', label: 'Prospects', icon: Users },
              { id: 'lots', label: 'Lots', icon: Home },
              { id: 'documents', label: 'Documents', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-1 py-4 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && stats && (
          <OverviewTab stats={stats} projectId={projectId!} />
        )}
        {activeTab === 'prospects' && (
          <ProspectsTab projectId={projectId!} />
        )}
        {activeTab === 'lots' && (
          <LotsTab projectId={projectId!} />
        )}
        {activeTab === 'documents' && (
          <ClientDocumentsManager projectId={projectId!} canValidate={false} />
        )}
      </main>
    </div>
  );
}

// Overview Tab
function OverviewTab({ stats, projectId }: { stats: BrokerStats; projectId: string }) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Prospects actifs"
          value={stats.activeProspects}
          total={stats.totalProspects}
          icon={Users}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Réservations"
          value={stats.reservations}
          icon={FileSignature}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Taux de conversion"
          value={`${stats.conversionRate}%`}
          icon={Percent}
          color="purple"
          trend={{ value: 2.3, isPositive: true }}
        />
        <StatCard
          title="Commission totale"
          value={`CHF ${stats.totalCommission.toLocaleString()}`}
          icon={DollarSign}
          color="yellow"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Activité récente
          </h3>
          <div className="space-y-4">
            {[
              { action: 'Nouveau prospect ajouté', name: 'Jean Dupont', time: 'Il y a 2h' },
              { action: 'Réservation confirmée', name: 'Marie Martin', time: 'Il y a 4h' },
              { action: 'Document téléchargé', name: 'Contrat EG signé', time: 'Il y a 6h' },
              { action: 'Visite planifiée', name: 'Pierre Durand', time: 'Hier' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.name}
                  </p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tâches en attente
          </h3>
          <div className="space-y-3">
            <TaskItem
              title="Documents manquants"
              count={stats.pendingDocuments}
              icon={FileText}
              color="yellow"
              link={`/broker/project/${projectId}?tab=documents`}
            />
            <TaskItem
              title="Suivis à effectuer"
              count={5}
              icon={Phone}
              color="blue"
              link={`/broker/project/${projectId}?tab=prospects`}
            />
            <TaskItem
              title="Visites à planifier"
              count={3}
              icon={Calendar}
              color="purple"
              link={`/broker/project/${projectId}/visits`}
            />
          </div>
        </div>
      </div>

      {/* Lots Available */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Lots disponibles ({stats.lotsAvailable})
          </h3>
          <Link
            to={`/broker/project/${projectId}?tab=lots`}
            className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            Voir tous
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        {/* Lots preview would go here */}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  total,
  icon: Icon,
  color,
  trend,
}: {
  title: string;
  value: string | number;
  total?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  trend?: { value: number; isPositive: boolean };
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={`flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {trend.value}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
          {total && <span className="text-lg font-normal text-gray-400">/{total}</span>}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      </div>
    </div>
  );
}

// Task Item Component
function TaskItem({
  title,
  count,
  icon: Icon,
  color,
  link,
}: {
  title: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'yellow' | 'blue' | 'purple';
  link: string;
}) {
  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <Link
      to={link}
      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{title}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-bold text-gray-900 dark:text-white">{count}</span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </Link>
  );
}

// Prospects Tab (placeholder)
function ProspectsTab({ projectId }: { projectId: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          Gestion des prospects
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          La liste des prospects sera affichée ici.
        </p>
      </div>
    </div>
  );
}

// Lots Tab (placeholder)
function LotsTab({ projectId }: { projectId: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="text-center py-12">
        <Home className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          Liste des lots
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Les lots disponibles seront affichés ici.
        </p>
      </div>
    </div>
  );
}
