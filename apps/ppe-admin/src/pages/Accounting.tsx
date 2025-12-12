import { Card, CardHeader, CardContent, Button, Badge } from '@realpro/ui';
import { Receipt, TrendingUp, TrendingDown, FileText, Download } from 'lucide-react';

export function AccountingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Comptabilité
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            Suivi comptable de vos copropriétés
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Exporter
          </Button>
          <Button leftIcon={<FileText className="w-4 h-4" />}>
            Nouveau décompte
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total encaissé</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  CHF 156'230
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total dépensé</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  CHF 142'850
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Impayés</p>
                <p className="text-2xl font-bold text-error-600">
                  CHF 4'520
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Décomptes de charges
          </h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { year: 2024, status: 'draft', total: 48250, sent: false },
              { year: 2023, status: 'closed', total: 45890, sent: true },
              { year: 2022, status: 'closed', total: 43120, sent: true },
            ].map((decompte) => (
              <div
                key={decompte.year}
                className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      {decompte.year}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      Décompte {decompte.year}
                    </p>
                    <p className="text-sm text-neutral-500">
                      CHF {decompte.total.toLocaleString('fr-CH')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={decompte.status === 'draft' ? 'warning' : 'success'}
                    size="sm"
                  >
                    {decompte.status === 'draft' ? 'Brouillon' : 'Clôturé'}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    Voir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
