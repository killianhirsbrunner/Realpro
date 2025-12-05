import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  appointmentsEnabled: boolean;
}

export function SuppliersSettings() {
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Tous' },
    { value: 'kitchen', label: 'Cuisines' },
    { value: 'bathroom', label: 'Sanitaires' },
    { value: 'flooring', label: 'Sols & Revêtements' },
    { value: 'electrical', label: 'Électricité' },
    { value: 'painting', label: 'Peinture' },
    { value: 'other', label: 'Autres' }
  ];

  const suppliers: Supplier[] = [
    {
      id: '1',
      name: 'Swiss Kitchens SA',
      category: 'kitchen',
      email: 'contact@swisskitchens.ch',
      phone: '+41 21 123 45 67',
      address: 'Lausanne, VD',
      status: 'active',
      appointmentsEnabled: true
    },
    {
      id: '2',
      name: 'Sanitech Solutions',
      category: 'bathroom',
      email: 'info@sanitech.ch',
      phone: '+41 22 234 56 78',
      address: 'Genève, GE',
      status: 'active',
      appointmentsEnabled: true
    },
    {
      id: '3',
      name: 'Parquet Premium',
      category: 'flooring',
      email: 'contact@parquetpremium.ch',
      phone: '+41 44 345 67 89',
      address: 'Zürich, ZH',
      status: 'active',
      appointmentsEnabled: false
    },
    {
      id: '4',
      name: 'Électro-Tech Romandie',
      category: 'electrical',
      email: 'info@electrotech.ch',
      phone: '+41 26 456 78 90',
      address: 'Fribourg, FR',
      status: 'inactive',
      appointmentsEnabled: false
    }
  ];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
            <Package className="w-7 h-7 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
              Fournisseurs
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Gérez vos partenaires et prestataires
            </p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un fournisseur
        </Button>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher un fournisseur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-brand-300 dark:hover:border-brand-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      {supplier.name}
                    </h3>
                    <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium rounded-lg">
                      {getCategoryLabel(supplier.category)}
                    </span>
                    {supplier.status === 'active' ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-lg">
                        Actif
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-medium rounded-lg">
                        Inactif
                      </span>
                    )}
                    {supplier.appointmentsEnabled && (
                      <span className="px-2 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-medium rounded-lg flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Rendez-vous
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <Mail className="w-4 h-4" />
                      {supplier.email}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <Phone className="w-4 h-4" />
                      {supplier.phone}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-4 h-4" />
                      {supplier.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="w-4 h-4" />
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSuppliers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              Aucun fournisseur trouvé
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {searchQuery || selectedCategory !== 'all'
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par ajouter votre premier fournisseur'}
            </p>
            {!searchQuery && selectedCategory === 'all' && (
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Ajouter un fournisseur
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 text-center">
          <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-2">
            {suppliers.length}
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Fournisseurs totaux
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {suppliers.filter(s => s.status === 'active').length}
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Actifs
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 text-center">
          <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-2">
            {suppliers.filter(s => s.appointmentsEnabled).length}
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Avec rendez-vous
          </p>
        </div>
      </div>

      <div className="bg-brand-50 dark:bg-blue-950/20 rounded-xl border border-brand-200 dark:border-brand-900/30 p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/40 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
          <div>
            <h4 className="font-medium text-brand-900 dark:text-brand-100 mb-1">
              Système de rendez-vous intégré
            </h4>
            <p className="text-sm text-brand-700 dark:text-brand-300">
              Les fournisseurs avec rendez-vous activés peuvent proposer des créneaux horaires
              directement aux acheteurs pour les choix de matériaux.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
