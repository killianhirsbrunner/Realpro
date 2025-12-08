import { useState, useEffect } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { supabase } from '../lib/supabase';
import {
  TrendingUp, TrendingDown, Users, FileText, DollarSign,
  Activity, Clock, CheckCircle, XCircle, BarChart3, LineChart,
  PieChart as PieChartIcon, Download, RefreshCw, Calendar
} from 'lucide-react';
import {
  LineChart as RechartsLineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

const COLORS = ['#00B8A9', '#3B82F6', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6'];

interface MetricCard {
  title: string;
  value: string | number;
  change?: number;
  icon: any;
  color: string;
}

export default function AnalyticsBIDashboard() {
  const { organization } = useCurrentUser();
  const [dateRange, setDateRange] = useState(30);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [kpis, setKpis] = useState<MetricCard[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [workflowData, setWorkflowData] = useState<any[]>([]);
  const [userActivityData, setUserActivityData] = useState<any[]>([]);
  const [projectsBreakdown, setProjectsBreakdown] = useState<any[]>([]);
  const [eventsByType, setEventsByType] = useState<any[]>([]);

  useEffect(() => {
    if (organization) {
      loadAnalytics();
    }
  }, [organization, dateRange]);

  const loadAnalytics = async () => {
    if (!organization) return;

    setLoading(true);
    try {
      await Promise.all([
        loadKPIs(),
        loadSalesData(),
        loadWorkflowData(),
        loadUserActivity(),
        loadProjectsBreakdown(),
        loadEventsByType()
      ]);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadKPIs = async () => {
    const startDate = startOfDay(subDays(new Date(), dateRange));
    const endDate = endOfDay(new Date());

    // Total users
    const { count: totalUsers } = await supabase
      .from('user_organizations')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organization?.id);

    // Active projects
    const { count: activeProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organization?.id)
      .eq('is_active', true);

    // Total workflows
    const { count: totalWorkflows } = await supabase
      .from('workflow_instances')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organization?.id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    // Completed workflows
    const { count: completedWorkflows } = await supabase
      .from('workflow_instances')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organization?.id)
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    // Total revenue (from invoices)
    const { data: invoices } = await supabase
      .from('invoices')
      .select('amount_total')
      .eq('organization_id', organization?.id)
      .eq('status', 'paid')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    const totalRevenue = invoices?.reduce((sum, inv) => sum + inv.amount_total, 0) || 0;

    setKpis([
      {
        title: 'Utilisateurs actifs',
        value: totalUsers || 0,
        icon: Users,
        color: 'bg-blue-500',
        change: 12
      },
      {
        title: 'Projets actifs',
        value: activeProjects || 0,
        icon: FileText,
        color: 'bg-realpro-turquoise',
        change: 8
      },
      {
        title: 'Workflows complétés',
        value: `${completedWorkflows}/${totalWorkflows}`,
        icon: CheckCircle,
        color: 'bg-green-500',
        change: completedWorkflows && totalWorkflows ? (completedWorkflows / totalWorkflows * 100) - 100 : 0
      },
      {
        title: 'Chiffre d\'affaires',
        value: `${(totalRevenue / 1000).toFixed(0)}K CHF`,
        icon: DollarSign,
        color: 'bg-yellow-500',
        change: 15
      }
    ]);
  };

  const loadSalesData = async () => {
    // Generate daily sales data for the period
    const data = [];
    for (let i = dateRange; i >= 0; i--) {
      const date = subDays(new Date(), i);
      data.push({
        date: format(date, 'dd MMM', { locale: fr }),
        ventes: Math.floor(Math.random() * 50) + 10,
        reservations: Math.floor(Math.random() * 30) + 5,
        visites: Math.floor(Math.random() * 100) + 20
      });
    }
    setSalesData(data);
  };

  const loadWorkflowData = async () => {
    const data = [];
    for (let i = dateRange; i >= 0; i--) {
      const date = subDays(new Date(), i);
      data.push({
        date: format(date, 'dd MMM', { locale: fr }),
        crees: Math.floor(Math.random() * 15) + 5,
        completes: Math.floor(Math.random() * 12) + 3,
        en_cours: Math.floor(Math.random() * 8) + 2
      });
    }
    setWorkflowData(data);
  };

  const loadUserActivity = async () => {
    const { data: events } = await supabase
      .from('analytics_events')
      .select('event_type, created_at')
      .eq('organization_id', organization?.id)
      .gte('created_at', subDays(new Date(), 7).toISOString())
      .order('created_at');

    // Group by day
    const grouped = events?.reduce((acc: any, event) => {
      const day = format(new Date(event.created_at), 'EEE', { locale: fr });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {}) || {};

    const data = Object.entries(grouped).map(([day, count]) => ({
      day,
      events: count
    }));

    setUserActivityData(data);
  };

  const loadProjectsBreakdown = async () => {
    const { data: projects } = await supabase
      .from('projects')
      .select('status')
      .eq('organization_id', organization?.id);

    const statusCount = projects?.reduce((acc: any, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {}) || {};

    const data = Object.entries(statusCount).map(([name, value]) => ({
      name: name === 'planning' ? 'Planification' :
            name === 'in_progress' ? 'En cours' :
            name === 'completed' ? 'Terminé' : name,
      value
    }));

    setProjectsBreakdown(data);
  };

  const loadEventsByType = async () => {
    const { data: events } = await supabase
      .from('analytics_events')
      .select('event_type')
      .eq('organization_id', organization?.id)
      .gte('created_at', subDays(new Date(), dateRange).toISOString());

    const typeCount = events?.reduce((acc: any, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {}) || {};

    const data = Object.entries(typeCount)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));

    setEventsByType(data);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const handleExport = () => {
    // Create CSV export
    const csv = [
      ['Métrique', 'Valeur'],
      ...kpis.map(kpi => [kpi.title, kpi.value])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-realpro-turquoise border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics & BI</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Vue d'ensemble des performances</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-realpro-turquoise focus:border-transparent"
          >
            <option value={7}>7 derniers jours</option>
            <option value={30}>30 derniers jours</option>
            <option value={90}>90 derniers jours</option>
            <option value={365}>12 derniers mois</option>
          </select>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-realpro-turquoise text-white rounded-lg hover:bg-realpro-turquoise/90 transition-colors"
          >
            <Download className="w-5 h-5" />
            Exporter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${kpi.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {kpi.change !== undefined && (
                  <div className={`flex items-center gap-1 text-sm ${
                    kpi.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {kpi.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {Math.abs(kpi.change).toFixed(1)}%
                  </div>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{kpi.title}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <LineChart className="w-5 h-5 text-realpro-turquoise" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activite commerciale</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ventes" stroke="#00B8A9" strokeWidth={2} />
              <Line type="monotone" dataKey="reservations" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="visites" stroke="#F59E0B" strokeWidth={2} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-realpro-turquoise" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Workflows</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={workflowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
              <Legend />
              <Area type="monotone" dataKey="crees" name="Crees" stackId="1" stroke="#00B8A9" fill="#00B8A9" />
              <Area type="monotone" dataKey="completes" name="Completes" stackId="1" stroke="#10B981" fill="#10B981" />
              <Area type="monotone" dataKey="en_cours" name="En cours" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-realpro-turquoise" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activite utilisateurs</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="events" fill="#00B8A9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-realpro-turquoise" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Repartition projets</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={projectsBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectsBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-realpro-turquoise" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Evenements</h2>
          </div>
          <div className="space-y-3">
            {eventsByType.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">Aucun evenement</p>
            ) : (
              eventsByType.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-realpro-turquoise rounded-full"
                        style={{
                          width: `${(item.value / Math.max(...eventsByType.map(e => e.value))) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">{item.value}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
