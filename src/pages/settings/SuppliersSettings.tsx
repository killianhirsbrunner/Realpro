import { useState } from 'react';
import { useSuppliersSettings } from '../../hooks/useSettings';
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
  Calendar,
  X,
  Save,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export function SuppliersSettings() {
  const { suppliers, loading, saving, error, createSupplier, updateSupplier, deleteSupplier, refetch } = useSuppliersSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'other',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    notes: '',
    status: 'active' as const
  });

  const categories = [
    { value: 'all', label: 'Tous' },
    { value: 'kitchen', label: 'Cuisines' },
    { value: 'bathroom', label: 'Sanitaires' },
    { value: 'flooring', label: 'Sols & Revetements' },
    { value: 'electrical', label: 'Electricite' },
    { value: 'painting', label: 'Peinture' },
    { value: 'other', label: 'Autres' }
  ];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (supplier.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === 'all' || supplier.category?.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'other',
      email: '',
      phone: '',
      address: '',
      city: '',
      postal_code: '',
      notes: '',
      status: 'active'
    });
    setEditingSupplier(null);
    setShowForm(false);
  };

  const handleEdit = (supplier: typeof suppliers[0]) => {
    setFormData({
      name: supplier.name,
      category: supplier.category || 'other',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      city: supplier.city || '',
      postal_code: supplier.postal_code || '',
      notes: supplier.notes || '',
      status: supplier.status
    });
    setEditingSupplier(supplier.id);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Le nom est requis');
      return;
    }

    if (editingSupplier) {
      const success = await updateSupplier(editingSupplier, formData);
      if (success) {
        toast.success('Fournisseur mis a jour');
        resetForm();
      }
    } else {
      const result = await createSupplier(formData);
      if (result) {
        toast.success('Fournisseur cree');
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Etes-vous sur de vouloir supprimer ce fournisseur ?')) {
      const success = await deleteSupplier(id);
      if (success) {
        toast.success('Fournisseur supprime');
      }
    }
  };

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
              Gerez vos partenaires et prestataires
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={refetch} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un fournisseur
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              {editingSupplier ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
            </h2>
            <button onClick={resetForm} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Nom *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="Nom du fournisseur"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Categorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                {categories.filter(c => c.value !== 'all').map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="email@exemple.ch"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Telephone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="+41 XX XXX XX XX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Adresse</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="Rue et numero"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Ville</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="Ville"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Code postal</label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="NPA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
              placeholder="Notes supplementaires..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={resetForm}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={saving} className="gap-2">
              {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
              {editingSupplier ? 'Mettre a jour' : 'Creer'}
            </Button>
          </div>
        </div>
      )}

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
                    {supplier.appointments_enabled && (
                      <span className="px-2 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-medium rounded-lg flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Rendez-vous
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    {supplier.email && (
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <Mail className="w-4 h-4" />
                        {supplier.email}
                      </div>
                    )}
                    {supplier.phone && (
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <Phone className="w-4 h-4" />
                        {supplier.phone}
                      </div>
                    )}
                    {(supplier.city || supplier.address) && (
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <MapPin className="w-4 h-4" />
                        {[supplier.city, supplier.postal_code].filter(Boolean).join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEdit(supplier)}>
                    <Edit className="w-4 h-4" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => handleDelete(supplier.id)}
                  >
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
              <Button className="gap-2" onClick={() => setShowForm(true)}>
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
            {suppliers.filter(s => s.appointments_enabled).length}
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
