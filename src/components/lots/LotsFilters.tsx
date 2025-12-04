import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { RealProSearchBar } from '../realpro/RealProSearchBar';

interface LotsFiltersProps {
  onFilterChange: (filters: any) => void;
  buildings?: Array<{ id: string; name: string }>;
  statusCounts?: {
    available: number;
    reserved: number;
    option: number;
    sold: number;
    delivered: number;
    blocked: number;
    total: number;
  };
}

export default function LotsFilters({ onFilterChange, buildings = [], statusCounts }: LotsFiltersProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [buildingId, setBuildingId] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minSurface, setMinSurface] = useState('');
  const [maxSurface, setMaxSurface] = useState('');

  const handleFilterChange = (updates: any) => {
    const newFilters = {
      search,
      status,
      type,
      buildingId,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minSurface: minSurface ? Number(minSurface) : undefined,
      maxSurface: maxSurface ? Number(maxSurface) : undefined,
      ...updates,
    };
    onFilterChange(newFilters);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    handleFilterChange({ search: value });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    handleFilterChange({ status: value });
  };

  const handleTypeChange = (value: string) => {
    setType(value);
    handleFilterChange({ type: value });
  };

  const handleBuildingChange = (value: string) => {
    setBuildingId(value);
    handleFilterChange({ buildingId: value });
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('all');
    setType('all');
    setBuildingId('all');
    setMinPrice('');
    setMaxPrice('');
    setMinSurface('');
    setMaxSurface('');
    onFilterChange({});
  };

  const hasActiveFilters = status !== 'all' || type !== 'all' || buildingId !== 'all' || minPrice || maxPrice || minSurface || maxSurface;

  return (
    <div className="space-y-4">
      {/* Main Filters Bar */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-[280px]">
          <RealProSearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Rechercher un lot, type, bâtiment..."
          />
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-background text-foreground hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">Tous les statuts {statusCounts && `(${statusCounts.total})`}</option>
          <option value="AVAILABLE">Libre {statusCounts && `(${statusCounts.available})`}</option>
          <option value="RESERVED">Réservé {statusCounts && `(${statusCounts.reserved})`}</option>
          <option value="OPTION">Option {statusCounts && `(${statusCounts.option})`}</option>
          <option value="SOLD">Vendu {statusCounts && `(${statusCounts.sold})`}</option>
          <option value="DELIVERED">Livré {statusCounts && `(${statusCounts.delivered})`}</option>
          <option value="BLOCKED">Bloqué {statusCounts && `(${statusCounts.blocked})`}</option>
        </select>

        {/* Type Filter */}
        <select
          value={type}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-background text-foreground hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">Tous les types</option>
          <option value="APARTMENT">Appartement</option>
          <option value="DUPLEX">Duplex</option>
          <option value="PENTHOUSE">Attique</option>
          <option value="COMMERCIAL">Commerce</option>
          <option value="PARKING">Parking</option>
          <option value="STORAGE">Cave</option>
        </select>

        {/* Building Filter */}
        {buildings.length > 0 && (
          <select
            value={buildingId}
            onChange={(e) => handleBuildingChange(e.target.value)}
            className="px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-background text-foreground hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Tous les bâtiments</option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>
        )}

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 ${
            showAdvanced
              ? 'bg-primary text-background border-primary'
              : 'border-neutral-200 dark:border-neutral-700 bg-background text-foreground hover:border-neutral-300 dark:hover:border-neutral-600'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtres avancés
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-background text-foreground hover:border-red-200 hover:text-red-600 dark:hover:border-red-800 dark:hover:text-red-400 transition-all flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 space-y-4">
          <h3 className="font-semibold text-sm text-neutral-700 dark:text-neutral-300 mb-4">Filtres avancés</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Prix minimum (CHF)
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  handleFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined });
                }}
                placeholder="Ex: 500000"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Prix maximum (CHF)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  handleFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined });
                }}
                placeholder="Ex: 1500000"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Surface Range */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Surface min (m²)
              </label>
              <input
                type="number"
                value={minSurface}
                onChange={(e) => {
                  setMinSurface(e.target.value);
                  handleFilterChange({ minSurface: e.target.value ? Number(e.target.value) : undefined });
                }}
                placeholder="Ex: 50"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Surface max (m²)
              </label>
              <input
                type="number"
                value={maxSurface}
                onChange={(e) => {
                  setMaxSurface(e.target.value);
                  handleFilterChange({ maxSurface: e.target.value ? Number(e.target.value) : undefined });
                }}
                placeholder="Ex: 150"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
