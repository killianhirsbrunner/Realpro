import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useOrganization } from './useOrganization';

interface Quota {
  maxProjects: number;
  maxUsers: number;
  maxStorageMB: number;
  maxLotsPerProject: number;
}

interface Usage {
  projects: number;
  users: number;
  storageMB: number;
}

interface QuotaStatus {
  quota: Quota;
  usage: Usage;
  canCreateProject: boolean;
  canInviteUser: boolean;
  canUploadFile: (fileSizeMB: number) => boolean;
  percentages: {
    projects: number;
    users: number;
    storage: number;
  };
}

export function useQuotas() {
  const { organization, subscription } = useOrganization();
  const [quotaStatus, setQuotaStatus] = useState<QuotaStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organization && subscription) {
      fetchQuotaStatus();
    }
  }, [organization, subscription]);

  const fetchQuotaStatus = async () => {
    try {
      const plan = subscription?.plan;

      const quota: Quota = {
        maxProjects: plan?.max_projects || 1,
        maxUsers: plan?.max_users || 3,
        maxStorageMB: plan?.max_storage_mb || 1000,
        maxLotsPerProject: plan?.max_lots_per_project || 50
      };

      const { data: projectsData } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organization!.id);

      const { data: usersData } = await supabase
        .from('user_organizations')
        .select('user_id', { count: 'exact', head: true })
        .eq('organization_id', organization!.id);

      const { data: storageData } = await supabase
        .from('documents')
        .select('file_size')
        .eq('organization_id', organization!.id);

      const totalStorageMB = storageData
        ? storageData.reduce((sum, doc) => sum + (doc.file_size || 0), 0) / (1024 * 1024)
        : 0;

      const usage: Usage = {
        projects: projectsData?.length || 0,
        users: usersData?.length || 0,
        storageMB: Math.round(totalStorageMB)
      };

      const canCreateProject = usage.projects < quota.maxProjects;
      const canInviteUser = usage.users < quota.maxUsers;
      const canUploadFile = (fileSizeMB: number) => {
        return (usage.storageMB + fileSizeMB) <= quota.maxStorageMB;
      };

      const percentages = {
        projects: quota.maxProjects > 0 ? (usage.projects / quota.maxProjects) * 100 : 0,
        users: quota.maxUsers > 0 ? (usage.users / quota.maxUsers) * 100 : 0,
        storage: quota.maxStorageMB > 0 ? (usage.storageMB / quota.maxStorageMB) * 100 : 0
      };

      setQuotaStatus({
        quota,
        usage,
        canCreateProject,
        canInviteUser,
        canUploadFile,
        percentages
      });
    } catch (error) {
      console.error('Error fetching quota status:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkProjectQuota = async (): Promise<{ allowed: boolean; message?: string }> => {
    if (!quotaStatus) {
      return { allowed: false, message: 'Chargement des quotas...' };
    }

    if (!quotaStatus.canCreateProject) {
      return {
        allowed: false,
        message: `Limite de ${quotaStatus.quota.maxProjects} projet(s) atteinte. Passez à un plan supérieur pour créer plus de projets.`
      };
    }

    return { allowed: true };
  };

  const checkUserQuota = async (): Promise<{ allowed: boolean; message?: string }> => {
    if (!quotaStatus) {
      return { allowed: false, message: 'Chargement des quotas...' };
    }

    if (!quotaStatus.canInviteUser) {
      return {
        allowed: false,
        message: `Limite de ${quotaStatus.quota.maxUsers} utilisateur(s) atteinte. Passez à un plan supérieur pour inviter plus d'utilisateurs.`
      };
    }

    return { allowed: true };
  };

  const checkStorageQuota = async (fileSizeMB: number): Promise<{ allowed: boolean; message?: string }> => {
    if (!quotaStatus) {
      return { allowed: false, message: 'Chargement des quotas...' };
    }

    if (!quotaStatus.canUploadFile(fileSizeMB)) {
      return {
        allowed: false,
        message: `Espace de stockage insuffisant. Limite: ${quotaStatus.quota.maxStorageMB} MB. Utilisé: ${quotaStatus.usage.storageMB} MB.`
      };
    }

    return { allowed: true };
  };

  return {
    quotaStatus,
    loading,
    checkProjectQuota,
    checkUserQuota,
    checkStorageQuota,
    refresh: fetchQuotaStatus
  };
}
