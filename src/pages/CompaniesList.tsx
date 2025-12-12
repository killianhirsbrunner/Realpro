import { useState } from 'react';
import { Plus, Search, Building2 } from 'lucide-react';
import { useCompanies } from '../hooks/useCompanies';
import { useNavigate } from 'react-router-dom';

export default function CompaniesList() {
  const { companies, loading } = useCompanies();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === 'all' || company.type === filterType;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Entreprises</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {filteredCompanies.length} entreprise{filteredCompanies.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => navigate('/companies/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Nouvelle entreprise
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Rechercher une entreprise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800"
        >
          <option value="all">Tous les types</option>
          <option value="EG">Entreprise Générale</option>
          <option value="NOTARY">Notaire</option>
          <option value="BROKER">Courtier</option>
          <option value="ARCHITECT">Architecte</option>
          <option value="ENGINEER">Ingénieur</option>
          <option value="SUPPLIER">Fournisseur</option>
          <option value="OTHER">Autre</option>
        </select>
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-12 text-center">
          <Building2 className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
            Aucune entreprise trouvée
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Commencez par ajouter votre première entreprise
          </p>
          <button
            onClick={() => navigate('/companies/new')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Ajouter une entreprise
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <button
              key={company.id}
              onClick={() => navigate(`/companies/${company.id}`)}
              className="bg-white dark:bg-neutral-800 rounded-lg p-6 text-left hover:shadow-lg transition-shadow border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 dark:text-white">
                      {company.name}
                    </h3>
                    {company.legal_form && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {company.legal_form}
                      </p>
                    )}
                  </div>
                </div>
                {company.is_client && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                    Client
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {company.email && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {company.email}
                  </p>
                )}
                {company.phone && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {company.phone}
                  </p>
                )}
                {company.industry && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {company.industry}
                  </p>
                )}
              </div>

              {company.tags && company.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {company.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                {company.is_client && (
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">Client</span>
                )}
                {company.is_supplier && (
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">Fournisseur</span>
                )}
                {company.is_partner && (
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">Partenaire</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
