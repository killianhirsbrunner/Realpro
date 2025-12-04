import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card } from '../ui/Card';

interface LotFinanceCardProps {
  lot: any;
  projectId: string;
}

export function LotFinanceCard({ lot, projectId }: LotFinanceCardProps) {
  const [financeData, setFinanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lot.id) return;

    async function fetchFinanceData() {
      try {
        const { data: buyer } = await supabase
          .from('buyers')
          .select('id')
          .eq('lot_id', lot.id)
          .maybeSingle();

        if (!buyer) {
          setFinanceData(null);
          setLoading(false);
          return;
        }

        const { data: installments } = await supabase
          .from('buyer_installments')
          .select('*')
          .eq('buyer_id', buyer.id)
          .order('due_date');

        const totalAmount = installments?.reduce((sum, i) => sum + (i.amount || 0), 0) || 0;
        const paidAmount = installments?.filter(i => i.status === 'PAID')
          .reduce((sum, i) => sum + (i.amount || 0), 0) || 0;
        const pendingAmount = totalAmount - paidAmount;
        const overdueCount = installments?.filter(i =>
          i.status === 'OVERDUE' ||
          (i.status === 'PENDING' && new Date(i.due_date) < new Date())
        ).length || 0;

        setFinanceData({
          totalAmount,
          paidAmount,
          pendingAmount,
          installmentsCount: installments?.length || 0,
          overdueCount,
          nextDueDate: installments?.find(i => i.status === 'PENDING')?.due_date
        });
      } catch (err) {
        console.error('Error fetching finance data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFinanceData();
  }, [lot.id]);

  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!financeData) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Finances
            </h3>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Aucune donnée financière disponible. Le lot n'est pas encore vendu.
          </p>
        </div>
      </Card>
    );
  }

  const paidPercentage = financeData.totalAmount > 0
    ? (financeData.paidAmount / financeData.totalAmount) * 100
    : 0;

  return (
    <Card>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Finances Acheteur
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                {financeData.installmentsCount} acompte{financeData.installmentsCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Link
            to={`/projects/${projectId}/finance/buyers/${lot.buyer?.id}`}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Voir détail →
          </Link>
        </div>

        <div className="space-y-4">
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Montant total
              </span>
              <span className="text-lg font-bold text-neutral-900 dark:text-white">
                CHF {financeData.totalAmount.toLocaleString('fr-CH')}
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${paidPercentage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-neutral-600 dark:text-neutral-400">
              <span>Payé: CHF {financeData.paidAmount.toLocaleString('fr-CH')}</span>
              <span>{paidPercentage.toFixed(0)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-900 dark:text-green-100">
                  Payé
                </span>
              </div>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                CHF {financeData.paidAmount.toLocaleString('fr-CH')}
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-medium text-amber-900 dark:text-amber-100">
                  Restant
                </span>
              </div>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                CHF {financeData.pendingAmount.toLocaleString('fr-CH')}
              </p>
            </div>
          </div>

          {financeData.overdueCount > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-900 dark:text-red-100">
                {financeData.overdueCount} acompte{financeData.overdueCount > 1 ? 's' : ''} en retard
              </span>
            </div>
          )}

          {financeData.nextDueDate && (
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <Calendar className="w-4 h-4" />
              <span>
                Prochain: {new Date(financeData.nextDueDate).toLocaleDateString('fr-CH')}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
