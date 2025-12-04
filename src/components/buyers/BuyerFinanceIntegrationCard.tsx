import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle, ArrowRight, Calendar, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface BuyerFinanceIntegrationCardProps {
  buyer: any;
  projectId: string;
}

export function BuyerFinanceIntegrationCard({ buyer, projectId }: BuyerFinanceIntegrationCardProps) {
  const [financeData, setFinanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!buyer.id) {
      setLoading(false);
      return;
    }

    async function fetchFinanceData() {
      try {
        const { data: installments } = await supabase
          .from('buyer_installments')
          .select('*')
          .eq('buyer_id', buyer.id)
          .order('due_date');

        const { data: contracts } = await supabase
          .from('contracts')
          .select('id, contract_number, type, amount, status')
          .eq('buyer_id', buyer.id);

        const totalAmount = installments?.reduce((sum, i) => sum + (i.amount || 0), 0) || 0;
        const paidAmount = installments?.filter(i => i.status === 'PAID')
          .reduce((sum, i) => sum + (i.amount || 0), 0) || 0;
        const pendingAmount = totalAmount - paidAmount;
        const overdueCount = installments?.filter(i =>
          i.status === 'OVERDUE' ||
          (i.status === 'PENDING' && new Date(i.due_date) < new Date())
        ).length || 0;

        const nextInstallment = installments?.find(i => i.status === 'PENDING');

        setFinanceData({
          totalAmount,
          paidAmount,
          pendingAmount,
          installmentsCount: installments?.length || 0,
          overdueCount,
          nextDueDate: nextInstallment?.due_date,
          nextAmount: nextInstallment?.amount,
          contracts: contracts || [],
        });
      } catch (err) {
        console.error('Error fetching finance data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFinanceData();
  }, [buyer.id]);

  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!financeData || financeData.installmentsCount === 0) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Finances & Paiements
            </h3>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Aucun plan de paiement configuré
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
                Finances & Paiements
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                {financeData.installmentsCount} acompte{financeData.installmentsCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Link
            to={`/projects/${projectId}/finance/buyers/${buyer.id}`}
            className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
          >
            Voir détail <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Montant total
              </span>
              <span className="text-xl font-bold text-neutral-900 dark:text-white">
                CHF {financeData.totalAmount.toLocaleString('fr-CH')}
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all"
                style={{ width: `${paidPercentage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-neutral-600 dark:text-neutral-400">
              <span>Progression des paiements</span>
              <span className="font-semibold">{paidPercentage.toFixed(0)}%</span>
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
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  {financeData.overdueCount} acompte{financeData.overdueCount > 1 ? 's' : ''} en retard
                </p>
                <p className="text-xs text-red-700 dark:text-red-300">
                  Action requise
                </p>
              </div>
              <Link to={`/projects/${projectId}/finance/buyers/${buyer.id}`}>
                <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                  Voir
                </button>
              </Link>
            </div>
          )}

          {financeData.nextDueDate && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-900 dark:text-blue-100">
                  Prochain acompte
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Échéance: {new Date(financeData.nextDueDate).toLocaleDateString('fr-CH')}
                </span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">
                  CHF {financeData.nextAmount?.toLocaleString('fr-CH')}
                </span>
              </div>
            </div>
          )}

          {financeData.contracts.length > 0 && (
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    Contrats
                  </span>
                </div>
                <Badge variant="default">{financeData.contracts.length}</Badge>
              </div>
              <div className="space-y-1">
                {financeData.contracts.slice(0, 3).map((contract: any) => (
                  <Link
                    key={contract.id}
                    to={`/projects/${projectId}/finance/contracts/${contract.id}`}
                    className="block text-xs text-neutral-600 dark:text-neutral-400 hover:text-primary"
                  >
                    • {contract.contract_number} - {contract.type}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
