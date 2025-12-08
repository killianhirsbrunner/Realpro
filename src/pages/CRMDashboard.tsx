import { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useCampaigns } from '../hooks/useCampaigns';
import { useCRMActivities } from '../hooks/useCRMActivities';
import { useLeadScoring } from '../hooks/useLeadScoring';
import { useCRMSegments } from '../hooks/useCRMSegments';
import { useI18n } from '../lib/i18n';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  Mail,
  Phone,
  Calendar,
  Target,
  Award,
  BarChart3,
  Send,
  UserPlus,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Filter,
  Download,
  Plus,
} from 'lucide-react';
import clsx from 'clsx';

export function CRMDashboard() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const { campaigns, loading: campaignsLoading } = useCampaigns();
  const { activities, loading: activitiesLoading } = useCRMActivities();
  const { scoringRules } = useLeadScoring();
  const { segments } = useCRMSegments();

  // Calcul des KPIs
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
  const pendingActivities = activities.filter((a) => a.status === 'pending').length;
  const todayActivities = activities.filter((a) => {
    const today = new Date();
    const activityDate = new Date(a.due_date || a.created_at);
    return activityDate.toDateString() === today.toDateString();
  }).length;

  // Calcul du taux d'ouverture moyen
  const totalSent = campaigns.reduce((acc, c) => acc + c.sent_count, 0);
  const totalOpened = campaigns.reduce((acc, c) => acc + c.opened_count, 0);
  const avgOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;

  const kpis = [
    {
      title: 'Campagnes Actives',
      value: activeCampaigns,
      icon: Target,
      trend: '+12%',
      trendUp: true,
      color: 'text-brand-600',
      bgColor: 'bg-brand-50 dark:bg-brand-900/20',
      link: '/crm/campaigns',
    },
    {
      title: 'Activités Aujourd\'hui',
      value: todayActivities,
      icon: Calendar,
      trend: `${pendingActivities} en attente`,
      trendUp: false,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      link: '/crm/activities',
    },
    {
      title: 'Taux d\'Ouverture',
      value: `${avgOpenRate.toFixed(1)}%`,
      icon: Mail,
      trend: '+3.2%',
      trendUp: true,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      link: '/crm/email-marketing',
    },
    {
      title: 'Segments Actifs',
      value: segments.length,
      icon: Filter,
      trend: `${segments.length} segments`,
      trendUp: true,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      link: '/crm/segments',
    },
  ];

  const recentActivities = activities.slice(0, 5);
  const upcomingCampaigns = campaigns
    .filter((c) => c.status === 'scheduled' || c.status === 'active')
    .slice(0, 3);

  return (
    <PageShell
      title="Centre CRM"
      subtitle="Gérez vos contacts, prospects et campagnes marketing"
      loading={campaignsLoading || activitiesLoading}
      actions={
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;

            return (
              <Card
                key={kpi.title}
                className="p-6 hover:shadow-lg-premium transition-all duration-200 cursor-pointer"
                onClick={() => navigate(kpi.link)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={clsx('p-3 rounded-xl', kpi.bgColor)}>
                    <Icon className={clsx('h-6 w-6', kpi.color)} />
                  </div>
                  {kpi.trendUp !== undefined && (
                    <div
                      className={clsx(
                        'text-sm font-medium',
                        kpi.trendUp ? 'text-green-600' : 'text-neutral-500'
                      )}
                    >
                      {kpi.trend}
                    </div>
                  )}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  {kpi.title}
                </p>
                <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {kpi.value}
                </h3>
              </Card>
            );
          })}
        </div>

        {/* Actions Rapides */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Actions Rapides
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="flex-col h-auto py-4"
              onClick={() => navigate('/crm/campaigns/new')}
            >
              <Plus className="w-5 h-5 mb-2" />
              <span className="text-sm">Nouvelle Campagne</span>
            </Button>
            <Button
              variant="outline"
              className="flex-col h-auto py-4"
              onClick={() => navigate('/crm/activities/new')}
            >
              <Calendar className="w-5 h-5 mb-2" />
              <span className="text-sm">Créer Activité</span>
            </Button>
            <Button
              variant="outline"
              className="flex-col h-auto py-4"
              onClick={() => navigate('/crm/email-marketing/new')}
            >
              <Mail className="w-5 h-5 mb-2" />
              <span className="text-sm">Envoyer Email</span>
            </Button>
            <Button
              variant="outline"
              className="flex-col h-auto py-4"
              onClick={() => navigate('/crm/segments/new')}
            >
              <Filter className="w-5 h-5 mb-2" />
              <span className="text-sm">Nouveau Segment</span>
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campagnes en cours */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Campagnes en Cours
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/crm/campaigns')}
              >
                Voir tout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {upcomingCampaigns.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Aucune campagne active
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate('/crm/campaigns/new')}
                >
                  Créer une campagne
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/crm/campaigns/${campaign.id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                          {campaign.name}
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          {campaign.description}
                        </p>
                      </div>
                      <Badge
                        variant={
                          campaign.status === 'active'
                            ? 'success'
                            : campaign.status === 'scheduled'
                            ? 'info'
                            : 'default'
                        }
                        size="sm"
                      >
                        {campaign.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 mt-3">
                      <div className="flex items-center gap-1">
                        <Send className="w-4 h-4" />
                        <span>{campaign.sent_count} envois</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>
                          {campaign.sent_count > 0
                            ? ((campaign.opened_count / campaign.sent_count) * 100).toFixed(1)
                            : 0}
                          % ouverture
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Activités récentes */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Activités Récentes
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/crm/activities')}
              >
                Voir tout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Aucune activité récente
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  const Icon =
                    activity.type === 'call'
                      ? Phone
                      : activity.type === 'email'
                      ? Mail
                      : activity.type === 'meeting'
                      ? Calendar
                      : Activity;

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                    >
                      <div
                        className={clsx(
                          'p-2 rounded-lg',
                          activity.status === 'completed'
                            ? 'bg-green-50 dark:bg-green-900/20'
                            : activity.status === 'in_progress'
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : 'bg-neutral-100 dark:bg-neutral-800'
                        )}
                      >
                        {activity.status === 'completed' ? (
                          <CheckCircle2
                            className={clsx(
                              'w-4 h-4',
                              'text-green-600 dark:text-green-400'
                            )}
                          />
                        ) : (
                          <Icon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {activity.subject}
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(activity.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Lead Scoring Overview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Lead Scoring
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/crm/lead-scoring')}
            >
              Configurer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['A', 'B', 'C', 'D'].map((grade) => (
              <div
                key={grade}
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 text-center"
              >
                <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  {grade}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Grade {grade}
                </div>
                <div className="text-lg font-semibold text-brand-600 mt-2">
                  {Math.floor(Math.random() * 50)}
                </div>
                <div className="text-xs text-neutral-500">prospects</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
