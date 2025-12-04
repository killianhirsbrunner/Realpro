import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFinancialScenarios, FinancialAssumptions, FinancialResults } from '../hooks/useFinancialScenarios';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Calculator, TrendingUp, DollarSign, PieChart } from 'lucide-react';

interface FinancialSimulatorProps {
  projectId?: string;
}

export function FinancialSimulator({ projectId }: FinancialSimulatorProps) {
  const { t } = useTranslation();
  const { user } = useCurrentUser();
  const organizationId = user?.organizations?.[0]?.organization_id || '';

  const { scenarios, loading, createScenario } = useFinancialScenarios(organizationId, projectId);

  const [priceMultiplier, setPriceMultiplier] = useState(1.0);
  const [costMultiplier, setCostMultiplier] = useState(1.0);
  const [vacancyRate, setVacancyRate] = useState(0.0);
  const [interestRate, setInterestRate] = useState(0.0);
  const [simulation, setSimulation] = useState<FinancialResults | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);

  const runSimulation = async () => {
    setCalculating(true);
    try {
      const assumptions: FinancialAssumptions = {
        priceMultiplier: Number(priceMultiplier),
        costMultiplier: Number(costMultiplier),
        vacancyRate: Number(vacancyRate),
        interestRate: Number(interestRate),
      };

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/financial/calculate`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          organizationId,
          projectId: projectId || null,
          assumptions,
        }),
      });

      if (!response.ok) throw new Error('Failed to calculate');

      const results = await response.json();
      setSimulation(results);
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setCalculating(false);
    }
  };

  const saveScenario = async () => {
    if (!simulation) return;

    setSaving(true);
    try {
      const assumptions: FinancialAssumptions = {
        priceMultiplier: Number(priceMultiplier),
        costMultiplier: Number(costMultiplier),
        vacancyRate: Number(vacancyRate),
        interestRate: Number(interestRate),
      };

      await createScenario(
        `${t('financial.scenario')} ${(scenarios.length || 0) + 1}`,
        assumptions,
        undefined,
        projectId
      );
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          {t('financial.simulator')}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t('financial.simulatorDescription')}
        </p>
      </div>

      {/* Simulation Form */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Assumptions */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400">
              <Calculator className="h-5 w-5" />
              <h2 className="text-lg font-medium">{t('financial.assumptions')}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('financial.priceMultiplier')}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={priceMultiplier}
                  onChange={(e) => setPriceMultiplier(parseFloat(e.target.value))}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('financial.priceMultiplierHelp')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('financial.costMultiplier')}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={costMultiplier}
                  onChange={(e) => setCostMultiplier(parseFloat(e.target.value))}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('financial.costMultiplierHelp')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('financial.vacancyRate')}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={vacancyRate}
                  onChange={(e) => setVacancyRate(parseFloat(e.target.value))}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('financial.vacancyRateHelp')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('financial.interestRate')}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('financial.interestRateHelp')}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={runSimulation}
                  disabled={calculating}
                  className="flex-1"
                >
                  {calculating ? t('financial.calculating') : t('financial.calculate')}
                </Button>
                {simulation && (
                  <Button
                    onClick={saveScenario}
                    disabled={saving}
                    variant="secondary"
                    className="flex-1"
                  >
                    {saving ? t('common.saving') : t('financial.saveScenario')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Results */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <TrendingUp className="h-5 w-5" />
              <h2 className="text-lg font-medium">{t('financial.results')}</h2>
            </div>

            {!simulation ? (
              <EmptyState
                icon={PieChart}
                title={t('financial.noResults')}
                description={t('financial.runSimulation')}
              />
            ) : (
              <div className="space-y-3">
                <KpiCard
                  label={t('financial.adjustedRevenue')}
                  value={simulation.adjustedRevenue}
                  suffix=" CHF"
                  trend="positive"
                />
                <KpiCard
                  label={t('financial.adjustedCost')}
                  value={simulation.adjustedCost}
                  suffix=" CHF"
                  trend="neutral"
                />
                <KpiCard
                  label={t('financial.margin')}
                  value={simulation.margin}
                  suffix=" CHF"
                  trend={simulation.margin > 0 ? 'positive' : 'negative'}
                />
                <KpiCard
                  label={t('financial.marginPercent')}
                  value={simulation.marginPercent.toFixed(1)}
                  suffix="%"
                  trend={simulation.marginPercent > 15 ? 'positive' : simulation.marginPercent > 5 ? 'neutral' : 'negative'}
                />

                <div className="mt-4 rounded-lg bg-brand-50 p-3 dark:bg-brand-900/20">
                  <h3 className="text-sm font-medium text-brand-900 dark:text-brand-100">
                    {t('financial.cashflow')}
                  </h3>
                  <div className="mt-2 space-y-2">
                    {simulation.cashflowByYear.map((cf) => (
                      <div key={cf.year} className="flex items-center justify-between text-xs">
                        <span className="text-brand-700 dark:text-brand-300">{cf.year}</span>
                        <div className="flex gap-4">
                          <span className="text-green-600 dark:text-green-400">
                            +{cf.cashIn.toLocaleString('fr-CH')} CHF
                          </span>
                          <span className="text-red-600 dark:text-red-400">
                            -{cf.cashOut.toLocaleString('fr-CH')} CHF
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Saved Scenarios */}
      <Card>
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">
            {t('financial.savedScenarios')}
          </h2>

          {scenarios.length === 0 ? (
            <EmptyState
              icon={DollarSign}
              title={t('financial.noSavedScenarios')}
              description={t('financial.saveYourFirstScenario')}
            />
          ) : (
            <div className="space-y-2">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-50">
                      {scenario.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(scenario.created_at).toLocaleDateString('fr-CH')}
                    </p>
                  </div>
                  {scenario.results && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        {scenario.results.margin.toLocaleString('fr-CH')} CHF
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {scenario.results.marginPercent.toFixed(1)}% marge
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function KpiCard({
  label,
  value,
  suffix = '',
  trend = 'neutral',
}: {
  label: string;
  value: number;
  suffix?: string;
  trend?: 'positive' | 'negative' | 'neutral';
}) {
  const trendColors = {
    positive: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    negative: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    neutral: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
  };

  const textColors = {
    positive: 'text-green-900 dark:text-green-100',
    negative: 'text-red-900 dark:text-red-100',
    neutral: 'text-gray-900 dark:text-gray-50',
  };

  return (
    <div className={`rounded-lg border p-3 ${trendColors[trend]}`}>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`text-lg font-semibold ${textColors[trend]}`}>
        {value.toLocaleString('fr-CH', { maximumFractionDigits: 0 })} {suffix}
      </p>
    </div>
  );
}
