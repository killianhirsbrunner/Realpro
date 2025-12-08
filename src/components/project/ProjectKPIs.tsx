import { Home, TrendingUp, Users, Package, Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { StatCard } from '../ui/StatCard';
import { Card, CardContent } from '../ui/Card';
import { formatCHF, formatPercent } from '../../lib/utils/format';

interface ProjectKPIsProps {
  sales?: {
    total_lots: number;
    sold_lots: number;
    reserved_lots: number;
    available_lots: number;
    sales_percentage: number;
    total_revenue: number;
  };
  notary?: {
    ready_files: number;
    signed_files: number;
    incomplete_files: number;
  };
  finance?: {
    cfc_budget: number;
    cfc_engagement: number;
    cfc_invoiced: number;
    cfc_paid: number;
  };
  construction?: {
    overall_progress: number;
  };
}

export function ProjectKPIs({ sales, notary, finance, construction }: ProjectKPIsProps) {
  return (
    <div className="space-y-6">
      {sales && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ventes & commercialisation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Lots totaux"
              value={sales.total_lots}
              icon={Home}
              variant="default"
            />
            <StatCard
              label="Vendus"
              value={sales.sold_lots}
              icon={TrendingUp}
              variant="success"
            />
            <StatCard
              label="Réservés"
              value={sales.reserved_lots}
              icon={Calendar}
              variant="warning"
            />
            <StatCard
              label="Disponibles"
              value={sales.available_lots}
              icon={Package}
              variant="default"
            />
          </div>

          <Card className="mt-4">
            <CardContent>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Taux de commercialisation</span>
                <span className="text-gray-900 font-semibold text-lg">
                  {formatPercent(sales.sales_percentage)}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-700 relative"
                  style={{ width: `${sales.sales_percentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Chiffre d'affaires réalisé
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCHF(sales.total_revenue)}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {notary && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dossiers notaire</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card hover>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Dossiers prêts</p>
                    <p className="text-3xl font-bold text-gray-900">{notary.ready_files}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl">
                    <CheckCircle className="h-7 w-7 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Dossiers signés</p>
                    <p className="text-3xl font-bold text-gray-900">{notary.signed_files}</p>
                  </div>
                  <div className="p-3 bg-brand-50 rounded-xl">
                    <FileText className="h-7 w-7 text-brand-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Dossiers incomplets</p>
                    <p className="text-3xl font-bold text-gray-900">{notary.incomplete_files}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-xl">
                    <AlertCircle className="h-7 w-7 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {finance && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget CFC</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent>
                <p className="text-xs text-gray-500 mb-1">Budget initial</p>
                <p className="text-lg font-semibold text-gray-900">{formatCHF(finance.cfc_budget)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-xs text-gray-500 mb-1">Engagé</p>
                <p className="text-lg font-semibold text-brand-600">{formatCHF(finance.cfc_engagement)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatPercent((finance.cfc_engagement / finance.cfc_budget) * 100)} du budget
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-xs text-gray-500 mb-1">Facturé</p>
                <p className="text-lg font-semibold text-brand-600">{formatCHF(finance.cfc_invoiced)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatPercent((finance.cfc_invoiced / finance.cfc_budget) * 100)} du budget
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-xs text-gray-500 mb-1">Payé</p>
                <p className="text-lg font-semibold text-green-600">{formatCHF(finance.cfc_paid)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatPercent((finance.cfc_paid / finance.cfc_budget) * 100)} du budget
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {construction && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Avancement chantier</h2>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Progression globale</span>
                <span className="text-gray-900 font-semibold text-lg">
                  {formatPercent(construction.overall_progress)}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-500 to-brand-600 h-4 rounded-full transition-all duration-700 relative"
                  style={{ width: `${construction.overall_progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
