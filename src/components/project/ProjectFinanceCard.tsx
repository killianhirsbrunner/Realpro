import { DollarSign, TrendingUp, TrendingDown, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCHF, formatPercent } from '../../lib/utils/format';

interface ProjectFinanceCardProps {
  projectId: string;
  finance: {
    cfc_budget: number;
    cfc_engagement: number;
    cfc_invoiced: number;
    cfc_paid: number;
    sales_revenue: number;
    pending_payments: number;
    budget_variance?: number;
  };
}

export function ProjectFinanceCard({ projectId, finance }: ProjectFinanceCardProps) {
  const budgetUsagePercent = finance.cfc_budget > 0
    ? (finance.cfc_paid / finance.cfc_budget) * 100
    : 0;

  const isOverBudget = budgetUsagePercent > 100;
  const isNearBudget = budgetUsagePercent > 90 && budgetUsagePercent <= 100;

  const metrics = [
    {
      label: 'Budget CFC',
      value: formatCHF(finance.cfc_budget),
      color: 'text-neutral-900',
      bg: 'bg-neutral-50',
    },
    {
      label: 'Engagé',
      value: formatCHF(finance.cfc_engagement),
      color: 'text-brand-600',
      bg: 'bg-brand-50',
      percent: finance.cfc_budget > 0 ? (finance.cfc_engagement / finance.cfc_budget) * 100 : 0,
    },
    {
      label: 'Facturé',
      value: formatCHF(finance.cfc_invoiced),
      color: 'text-brand-600',
      bg: 'bg-brand-50',
      percent: finance.cfc_budget > 0 ? (finance.cfc_invoiced / finance.cfc_budget) * 100 : 0,
    },
    {
      label: 'Payé',
      value: formatCHF(finance.cfc_paid),
      color: 'text-green-600',
      bg: 'bg-green-50',
      percent: budgetUsagePercent,
    },
  ];

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-neutral-600" />
            <Card.Title>Budget & Finances</Card.Title>
          </div>
          {(isOverBudget || isNearBudget) && (
            <Badge variant={isOverBudget ? 'danger' : 'warning'} className="gap-1">
              <AlertCircle className="h-3 w-3" />
              {isOverBudget ? 'Dépassement' : 'Attention'}
            </Badge>
          )}
        </div>
      </Card.Header>

      <Card.Content className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label} className={`p-4 rounded-xl ${metric.bg}`}>
              <p className="text-xs text-neutral-600 mb-1">{metric.label}</p>
              <p className={`text-lg font-bold ${metric.color}`}>
                {metric.value}
              </p>
              {metric.percent !== undefined && (
                <p className="text-xs text-neutral-500 mt-1">
                  {formatPercent(metric.percent)}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Utilisation du budget</span>
            <span className={`text-lg font-bold ${
              isOverBudget ? 'text-red-600' : isNearBudget ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {formatPercent(budgetUsagePercent)}
            </span>
          </div>

          <div className="relative w-full bg-neutral-100 h-3 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 transition-all duration-700 ${
                isOverBudget
                  ? 'bg-gradient-to-r from-red-500 to-red-600'
                  : isNearBudget
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                  : 'bg-gradient-to-r from-green-500 to-green-600'
              }`}
              style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          {isOverBudget && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-red-700">
                <p className="font-medium">Budget dépassé</p>
                <p>Le budget a été dépassé de {formatCHF(finance.cfc_paid - finance.cfc_budget)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-neutral-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Chiffre d'affaires ventes</span>
            <span className="text-base font-semibold text-neutral-900">
              {formatCHF(finance.sales_revenue)}
            </span>
          </div>

          {finance.pending_payments > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Paiements en attente</span>
              <span className="text-base font-semibold text-brand-600">
                {formatCHF(finance.pending_payments)}
              </span>
            </div>
          )}

          {finance.budget_variance !== undefined && finance.budget_variance !== 0 && (
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm text-neutral-600 flex items-center gap-2">
                {finance.budget_variance > 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
                Écart budgétaire
              </span>
              <span className={`text-base font-semibold ${
                finance.budget_variance > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {finance.budget_variance > 0 ? '+' : ''}{formatCHF(finance.budget_variance)}
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-neutral-100 flex gap-2">
          <Link to={`/projects/${projectId}/cfc`} className="flex-1">
            <Button variant="outline" className="w-full">
              Détail CFC
            </Button>
          </Link>
          <Link to={`/projects/${projectId}/finances`} className="flex-1">
            <Button className="w-full gap-2">
              Finances
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card.Content>
    </Card>
  );
}
