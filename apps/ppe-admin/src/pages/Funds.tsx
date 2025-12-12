import { Card, CardHeader, CardContent, Button, Badge, Progress } from '@realpro/ui';
import { Wallet, Plus, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const mockFunds = [
  {
    id: '1',
    name: 'Fonds de rénovation principal',
    balance: 125000,
    target: 200000,
    annual: 15000,
    property: 'Résidence Les Alpes',
  },
  {
    id: '2',
    name: 'Fonds de rénovation toiture',
    balance: 45000,
    target: 80000,
    annual: 8000,
    property: 'Immeuble Lac-Léman',
  },
  {
    id: '3',
    name: 'Fonds travaux ascenseur',
    balance: 32000,
    target: 50000,
    annual: 6000,
    property: 'Copropriété du Parc',
  },
];

const mockMovements = [
  { id: '1', date: '15.12.2024', type: 'in', amount: 1250, description: 'Cotisation mensuelle', property: 'Résidence Les Alpes' },
  { id: '2', date: '12.12.2024', type: 'out', amount: 3500, description: 'Réparation chaudière', property: 'Immeuble Lac-Léman' },
  { id: '3', date: '10.12.2024', type: 'in', amount: 800, description: 'Cotisation mensuelle', property: 'Copropriété du Parc' },
  { id: '4', date: '05.12.2024', type: 'in', amount: 1250, description: 'Cotisation mensuelle', property: 'Résidence Les Alpes' },
];

export function FundsPage() {
  const totalBalance = mockFunds.reduce((sum, f) => sum + f.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Fonds de rénovation
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            Solde total: CHF {totalBalance.toLocaleString('fr-CH')}
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Nouveau fonds
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockFunds.map((fund) => {
          const percent = Math.round((fund.balance / fund.target) * 100);
          return (
            <Card key={fund.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                    <Wallet className="w-6 h-6 text-emerald-600" />
                  </div>
                  <Badge variant={percent >= 75 ? 'success' : percent >= 50 ? 'warning' : 'error'} size="sm">
                    {percent}%
                  </Badge>
                </div>
                <h3 className="mt-4 font-semibold text-neutral-900 dark:text-white">
                  {fund.name}
                </h3>
                <p className="text-sm text-neutral-500">{fund.property}</p>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-neutral-500">Objectif</span>
                    <span className="font-medium text-neutral-900 dark:text-white">
                      CHF {fund.target.toLocaleString('fr-CH')}
                    </span>
                  </div>
                  <Progress value={percent} variant={percent >= 75 ? 'success' : percent >= 50 ? 'warning' : 'error'} />
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between">
                  <div>
                    <p className="text-xs text-neutral-500">Solde actuel</p>
                    <p className="text-lg font-bold text-emerald-600">
                      CHF {fund.balance.toLocaleString('fr-CH')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-500">Cotisation/an</p>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      CHF {fund.annual.toLocaleString('fr-CH')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Mouvements récents
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockMovements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    movement.type === 'in' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {movement.type === 'in' ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {movement.description}
                    </p>
                    <p className="text-sm text-neutral-500">{movement.property}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    movement.type === 'in' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {movement.type === 'in' ? '+' : '-'}CHF {movement.amount.toLocaleString('fr-CH')}
                  </p>
                  <p className="text-xs text-neutral-500">{movement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
