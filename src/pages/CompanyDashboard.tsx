import { Link } from 'react-router-dom';
import {
  Building2,
  CreditCard,
  Users,
  Settings,
  FileText,
  TrendingUp,
  Package,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Badge } from '../components/ui/Badge';
import { useOrganizationDashboard } from '../hooks/useOrganizationData';

export default function CompanyDashboard() {
  const { data, loading, error } = useOrganizationDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error?.message || 'Impossible de charger les données'}</p>
          </div>
        </Card>
      </div>
    );
  }

  const { organization, stats, subscription, invoices } = data;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        <header className="space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-600">
            <Building2 className="w-4 h-4" />
            <span>Gestion Entreprise</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                {organization.name}
              </h1>
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                {organization.city && (
                  <>
                    <span>{organization.city}</span>
                    <span>·</span>
                  </>
                )}
                <Badge variant="default">
                  {subscription?.plan_name || organization.plan || 'Starter'}
                </Badge>
              </div>
            </div>
            <Link
              to="/settings/organization"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Paramètres</span>
            </Link>
          </div>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Package className="w-5 h-5" />}
            label="Projets"
            value={`${stats.projectsUsed} / ${stats.projectsLimit}`}
            description={`${stats.projectsLimit - stats.projectsUsed} projet(s) disponible(s)`}
            variant="default"
            progress={(stats.projectsUsed / stats.projectsLimit) * 100}
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Utilisateurs"
            value={`${stats.usersCount} / ${stats.usersLimit}`}
            description={`${stats.usersLimit - stats.usersCount} place(s) disponible(s)`}
            variant="success"
            progress={(stats.usersCount / stats.usersLimit) * 100}
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Stockage"
            value={`${stats.storageUsed} / ${stats.storageLimit} GB`}
            description="Espace de stockage"
            variant="warning"
            progress={(stats.storageUsed / stats.storageLimit) * 100}
          />
          <StatCard
            icon={<CreditCard className="w-5 h-5" />}
            label="Abonnement"
            value={subscription?.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
            description={subscription?.billing_period === 'YEARLY' ? 'Facturation annuelle' : 'Facturation mensuelle'}
            variant={subscription?.status === 'ACTIVE' ? 'success' : 'danger'}
          />
        </section>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ModuleCard
            title="Abonnement"
            description="Gérer votre forfait et options"
            icon={<Package className="w-5 h-5" />}
            link="/company/subscription"
            badge={
              subscription?.plan_name
                ? { label: subscription.plan_name, variant: 'default' }
                : undefined
            }
          />
          <ModuleCard
            title="Facturation"
            description="Historique des factures et paiements"
            icon={<CreditCard className="w-5 h-5" />}
            link="/company/billing"
            badge={
              invoices.length > 0
                ? { label: `${invoices.length} facture(s)`, variant: 'default' }
                : undefined
            }
          />
          <ModuleCard
            title="Utilisateurs"
            description="Gérer les membres de l'équipe"
            icon={<Users className="w-5 h-5" />}
            link="/admin/users"
            badge={{ label: `${stats.usersCount} membre(s)`, variant: 'default' }}
          />
          <ModuleCard
            title="Invitations"
            description="Inviter des collaborateurs et partenaires"
            icon={<Users className="w-5 h-5" />}
            link="/admin/users/invite"
          />
          <ModuleCard
            title="Paramètres"
            description="Configuration de l'entreprise"
            icon={<Settings className="w-5 h-5" />}
            link="/settings/organization"
          />
          <ModuleCard
            title="Organisations"
            description="Gérer les organisations"
            icon={<Building2 className="w-5 h-5" />}
            link="/admin/organizations"
          />
        </section>

        {subscription && (
          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
              Abonnement actuel
            </h2>
            <Card>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        {subscription.plan_name}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        CHF {subscription.price?.toLocaleString('fr-CH')} /{' '}
                        {subscription.billing_period === 'YEARLY' ? 'an' : 'mois'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {subscription.status}
                        </span>
                      </div>
                    </div>
                    {subscription.next_billing_date && (
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">
                          Prochaine facturation
                        </p>
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {new Date(subscription.next_billing_date).toLocaleDateString('fr-CH')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Link
                  to="/company/subscription"
                  className="px-4 py-2 rounded-lg bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors flex items-center gap-2"
                >
                  <span className="text-sm font-medium">Gérer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>
          </section>
        )}

        {invoices.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                Factures récentes
              </h2>
              <Link
                to="/company/billing"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
              >
                Voir tout
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {invoices.slice(0, 5).map((invoice) => (
                <Link
                  key={invoice.id}
                  to={`/company/invoices/${invoice.id}`}
                  className="block p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          Facture {invoice.invoice_number}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500">
                          {new Date(invoice.date).toLocaleDateString('fr-CH')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        CHF {invoice.amount.toLocaleString('fr-CH')}
                      </span>
                      <Badge variant={invoice.status === 'PAID' ? 'success' : 'warning'}>
                        {invoice.status === 'PAID' ? 'Payée' : 'En attente'}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-neutral-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
  variant = 'default',
  progress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  progress?: number;
}) {
  const bgColors = {
    default: 'bg-neutral-50 dark:bg-neutral-900',
    success: 'bg-green-50 dark:bg-green-950/30',
    warning: 'bg-amber-50 dark:bg-amber-950/30',
    danger: 'bg-red-50 dark:bg-red-950/30',
  };

  const iconColors = {
    default: 'text-neutral-600 dark:text-neutral-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-amber-600 dark:text-amber-400',
    danger: 'text-red-600 dark:text-red-400',
  };

  const progressColors = {
    default: 'bg-neutral-600',
    success: 'bg-green-600',
    warning: 'bg-amber-600',
    danger: 'bg-red-600',
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${bgColors[variant]}`}>
            <div className={iconColors[variant]}>{icon}</div>
          </div>
          <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium">
            {label}
          </p>
        </div>
        <div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums mb-1">
            {value}
          </p>
          {description && (
            <p className="text-xs text-neutral-500 dark:text-neutral-500">{description}</p>
          )}
        </div>
        {progress !== undefined && (
          <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColors[variant]} rounded-full transition-all`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
    </Card>
  );
}

function ModuleCard({
  title,
  description,
  icon,
  link,
  badge,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  badge?: { label: string; variant: 'default' | 'success' | 'warning' | 'danger' };
}) {
  return (
    <Link
      to={link}
      className="group block rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-xl transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {title}
            </h3>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-3">{description}</p>
      {badge && (
        <Badge variant={badge.variant} className="mt-2">
          {badge.label}
        </Badge>
      )}
    </Link>
  );
}
