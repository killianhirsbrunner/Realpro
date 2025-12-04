import { useState, useEffect } from 'react';
import { useOrganizationContext } from '../contexts/OrganizationContext';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useOrganizationUsers, useOrganizationStats } from '../hooks/useOrganizationData';
import {
  Building2,
  Save,
  Users,
  FolderKanban,
  TrendingUp,
  Settings,
  Upload,
  Globe
} from 'lucide-react';

export function OrganizationSettings() {
  const { currentOrganization, refreshOrganizations } = useOrganizationContext();
  const { users } = useOrganizationUsers();
  const { stats } = useOrganizationStats();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    default_language: 'FR',
    logo_url: '',
  });

  useEffect(() => {
    if (currentOrganization) {
      setFormData({
        name: currentOrganization.name || '',
        slug: currentOrganization.slug || '',
        default_language: currentOrganization.default_language || 'FR',
        logo_url: currentOrganization.logo_url || '',
      });
    }
  }, [currentOrganization]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!currentOrganization) return;

    try {
      setSaving(true);
      setMessage('');

      const { error } = await supabase
        .from('organizations')
        .update({
          name: formData.name,
          slug: formData.slug,
          default_language: formData.default_language,
          logo_url: formData.logo_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentOrganization.id);

      if (error) throw error;

      setMessage('Organisation mise à jour avec succès');
      await refreshOrganizations();

      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  if (!currentOrganization) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-neutral-600 dark:text-neutral-400">
          Aucune organisation sélectionnée
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Paramètres de l'organisation
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Gérez les informations et paramètres de votre organisation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {stats?.totalProjects || 0}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Projets</p>
                </div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                {stats?.activeProjects || 0} actifs
              </p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {users?.length || 0}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Utilisateurs</p>
                </div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                Membres de l'équipe
              </p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {stats?.soldLots || 0}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Lots vendus</p>
                </div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                Sur {stats?.totalLots || 0} lots
              </p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Settings className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Informations générales
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Logo de l'organisation
                </label>
                <div className="flex items-center gap-4">
                  {formData.logo_url ? (
                    <img
                      src={formData.logo_url}
                      alt="Logo"
                      className="w-16 h-16 rounded-lg object-cover border border-neutral-200 dark:border-neutral-800"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
                      <Building2 className="w-8 h-8 text-neutral-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      placeholder="URL du logo"
                      value={formData.logo_url}
                      onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    />
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                      Format recommandé: PNG ou SVG, taille minimale 200x200px
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Nom de l'organisation *
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Promotions Suisse SA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Slug (URL) *
                  </label>
                  <Input
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    placeholder="promotions-suisse"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                    Utilisé pour l'URL: realpro.ch/{formData.slug}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Langue par défaut
                </label>
                <select
                  value={formData.default_language}
                  onChange={(e) => setFormData({ ...formData, default_language: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="FR">Français</option>
                  <option value="DE">Allemand</option>
                  <option value="EN">Anglais</option>
                  <option value="IT">Italien</option>
                </select>
              </div>

              {message && (
                <div className={`p-4 rounded-lg ${
                  message.includes('succès')
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              </div>
            </form>
          </div>
        </Card>

        <Card className="mt-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Informations système
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-600 dark:text-neutral-400 mb-1">ID de l'organisation</p>
                <p className="font-mono text-xs bg-neutral-100 dark:bg-neutral-800 p-2 rounded">
                  {currentOrganization.id}
                </p>
              </div>
              <div>
                <p className="text-neutral-600 dark:text-neutral-400 mb-1">Date de création</p>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  {new Date(currentOrganization.created_at).toLocaleDateString('fr-CH', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
