import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { RealProCard } from '../../components/realpro/RealProCard';
import { RealProTopbar } from '../../components/realpro/RealProTopbar';
import { RealProButton } from '../../components/realpro/RealProButton';
import { RealProModal } from '../../components/realpro/RealProModal';
import { Skeleton } from '../../components/ui/Skeleton';
import { designTokens } from '../../lib/design-system/tokens';
import { supabase } from '../../lib/supabase';
import {
  Flag,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { toast } from '../../components/ui/Toast';

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  enabled: boolean;
  rollout_percentage: number;
  organizations_whitelist: string[];
  organizations_blacklist: string[];
  created_at: string;
  updated_at: string;
}

interface FeatureUsage {
  feature_key: string;
  usage_count: number;
  unique_users: number;
  last_used_at: string;
}

export function FeatureFlags() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [usage, setUsage] = useState<Record<string, FeatureUsage>>({});
  const [loading, setLoading] = useState(true);
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchFeatureFlags();
    fetchFeatureUsage();
  }, []);

  async function fetchFeatureFlags() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('name');

      if (error) throw error;
      setFlags(data || []);
    } catch (error: any) {
      console.error('Error fetching feature flags:', error);
      toast.error('Erreur', 'Impossible de charger les feature flags');
    } finally {
      setLoading(false);
    }
  }

  async function fetchFeatureUsage() {
    try {
      const { data, error } = await supabase
        .from('feature_usage_tracking')
        .select('feature_key, count(*) as usage_count')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const usageMap: Record<string, FeatureUsage> = {};
      (data || []).forEach((item: any) => {
        usageMap[item.feature_key] = {
          feature_key: item.feature_key,
          usage_count: item.usage_count || 0,
          unique_users: 0,
          last_used_at: new Date().toISOString(),
        };
      });

      setUsage(usageMap);
    } catch (error: any) {
      console.error('Error fetching feature usage:', error);
    }
  }

  async function toggleFlag(flag: FeatureFlag) {
    try {
      const { error } = await supabase
        .from('feature_flags')
        .update({ enabled: !flag.enabled })
        .eq('id', flag.id);

      if (error) throw error;

      toast.success(
        'Feature flag mis à jour',
        `${flag.name} est maintenant ${!flag.enabled ? 'activé' : 'désactivé'}`
      );

      fetchFeatureFlags();
    } catch (error: any) {
      console.error('Error toggling flag:', error);
      toast.error('Erreur', 'Impossible de mettre à jour le feature flag');
    }
  }

  async function deleteFlag(flag: FeatureFlag) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${flag.name}" ?`)) return;

    try {
      const { error } = await supabase
        .from('feature_flags')
        .delete()
        .eq('id', flag.id);

      if (error) throw error;

      toast.success('Feature flag supprimé', `${flag.name} a été supprimé`);
      fetchFeatureFlags();
    } catch (error: any) {
      console.error('Error deleting flag:', error);
      toast.error('Erreur', 'Impossible de supprimer le feature flag');
    }
  }

  function openCreateModal() {
    setSelectedFlag(null);
    setIsEdit(false);
    setShowModal(true);
  }

  function openEditModal(flag: FeatureFlag) {
    setSelectedFlag(flag);
    setIsEdit(true);
    setShowModal(true);
  }

  const enabledCount = flags.filter(f => f.enabled).length;
  const totalUsage = Object.values(usage).reduce((sum, u) => sum + u.usage_count, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.background }}>
      <RealProTopbar
        title="Feature Flags"
        subtitle="Gestion des fonctionnalités par organisation"
        icon={<Flag />}
        actions={
          <RealProButton variant="primary" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Flag
          </RealProButton>
        }
      />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <RealProCard className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
              {flags.length}
            </div>
            <div className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Total features
            </div>
          </RealProCard>

          <RealProCard className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: designTokens.colors.light.success }}>
              {enabledCount}
            </div>
            <div className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Activées
            </div>
          </RealProCard>

          <RealProCard className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: designTokens.colors.light.danger }}>
              {flags.length - enabledCount}
            </div>
            <div className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Désactivées
            </div>
          </RealProCard>

          <RealProCard className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: designTokens.colors.light.info }}>
              {totalUsage}
            </div>
            <div className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Utilisations (30j)
            </div>
          </RealProCard>
        </div>

        {/* Feature Flags List */}
        <RealProCard>
          <h3 className="text-lg font-semibold mb-6" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
            Liste des feature flags
          </h3>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height="5rem" />
              ))}
            </div>
          ) : flags.length === 0 ? (
            <div className="text-center py-12" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              <Flag className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Aucun feature flag configuré</p>
              <RealProButton variant="primary" onClick={openCreateModal} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Créer le premier flag
              </RealProButton>
            </div>
          ) : (
            <div className="space-y-4">
              {flags.map(flag => (
                <div
                  key={flag.id}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
                    borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-base" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                          {flag.name}
                        </h4>
                        <span
                          className="px-2 py-1 text-xs rounded font-medium"
                          style={{
                            backgroundColor: flag.enabled ? designTokens.colors.light.success : designTokens.colors.light.danger,
                            color: '#ffffff',
                          }}
                        >
                          {flag.enabled ? 'Activé' : 'Désactivé'}
                        </span>
                        {flag.rollout_percentage < 100 && (
                          <span
                            className="px-2 py-1 text-xs rounded"
                            style={{
                              backgroundColor: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.secondary,
                              color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground,
                            }}
                          >
                            {flag.rollout_percentage}% rollout
                          </span>
                        )}
                      </div>

                      <p className="text-sm mb-2" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                        {flag.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                        <span className="font-mono">{flag.key}</span>
                        {usage[flag.key] && (
                          <>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {usage[flag.key].usage_count} utilisations
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFlag(flag)}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                          backgroundColor: isDark ? designTokens.colors.dark.secondary : designTokens.colors.light.secondary,
                        }}
                        title={flag.enabled ? 'Désactiver' : 'Activer'}
                      >
                        {flag.enabled ? (
                          <ToggleRight className="w-5 h-5" style={{ color: designTokens.colors.light.success }} />
                        ) : (
                          <ToggleLeft className="w-5 h-5" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }} />
                        )}
                      </button>

                      <button
                        onClick={() => openEditModal(flag)}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                          backgroundColor: isDark ? designTokens.colors.dark.secondary : designTokens.colors.light.secondary,
                        }}
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }} />
                      </button>

                      <button
                        onClick={() => deleteFlag(flag)}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                          backgroundColor: isDark ? designTokens.colors.dark.secondary : designTokens.colors.light.secondary,
                        }}
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" style={{ color: designTokens.colors.light.danger }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </RealProCard>
      </div>

      {/* Modal Create/Edit */}
      {showModal && (
        <RealProModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={isEdit ? 'Modifier le feature flag' : 'Nouveau feature flag'}
        >
          <div className="space-y-4">
            <p className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Fonctionnalité à venir : formulaire de création/édition de feature flags
            </p>
          </div>
        </RealProModal>
      )}
    </div>
  );
}
