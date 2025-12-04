import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';
import { useContracts } from '../hooks/useContracts';
import { ContractCard } from '../components/finance/ContractCard';

export default function ProjectFinancesContracts() {
  const { projectId } = useParams<{ projectId: string }>();
  const { contracts, loading, error, refresh } = useContracts(projectId!);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContracts = contracts.filter(contract =>
    contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-600 mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">Chargement des contrats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 lg:px-10 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-700 dark:text-red-300 font-medium">
            Erreur lors du chargement des contrats
          </p>
          <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-10 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={`/projects/${projectId}/finances`}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Contrats Entreprises
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Gérer les contrats EG, sous-traitants et prestataires
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
            <Plus className="w-4 h-4" />
            Nouveau contrat
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, numéro ou entreprise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {filteredContracts.length} contrat{filteredContracts.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {filteredContracts.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {searchTerm ? 'Aucun contrat trouvé' : 'Aucun contrat'}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {searchTerm
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par créer votre premier contrat entreprise'
              }
            </p>
            {!searchTerm && (
              <button className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium">
                Créer le premier contrat
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onClick={() => {
                // Navigation vers détail du contrat
              }}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            {contracts.length}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Contrats total
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {contracts.filter(c => c.status === 'SIGNED' || c.status === 'ACTIVE').length}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Contrats actifs
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            CHF {contracts.reduce((sum, c) => sum + c.amount, 0).toLocaleString('fr-CH', { minimumFractionDigits: 0 })}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Valeur totale
          </div>
        </div>
      </div>
    </div>
  );
}
