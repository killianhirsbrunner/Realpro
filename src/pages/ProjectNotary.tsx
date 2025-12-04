import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Plus, Users, AlertCircle } from 'lucide-react';
import { RealProTopbar } from '@/components/realpro/RealProTopbar';
import { RealProCard } from '@/components/realpro/RealProCard';
import { RealProButton } from '@/components/realpro/RealProButton';
import NotaryBuyerCard from '@/components/notary/NotaryBuyerCard';
import { useNotaryDossiers } from '@/hooks/useNotaryDossiers';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ProjectNotary() {
  const { projectId } = useParams();
  const { dossiers, loading, error } = useNotaryDossiers(projectId!);

  const stats = {
    total: dossiers.length,
    incomplete: dossiers.filter(d => d.status === 'incomplete').length,
    waiting: dossiers.filter(d => d.status === 'waiting_notary').length,
    signed: dossiers.filter(d => d.status === 'signed').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
          <AlertCircle className="w-5 h-5 inline mr-2" />
          Erreur lors du chargement des dossiers notaire
        </div>
      </div>
    );
  }

  return (
    <div className="px-10 py-8 space-y-8">
      <RealProTopbar
        title="Dossiers Notaire"
        subtitle="Suivi juridique et gestion des actes"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <RealProCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total dossiers</p>
              <p className="text-2xl font-semibold text-neutral-900">{stats.total}</p>
            </div>
          </div>
        </RealProCard>

        <RealProCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Incomplets</p>
              <p className="text-2xl font-semibold text-neutral-900">{stats.incomplete}</p>
            </div>
          </div>
        </RealProCard>

        <RealProCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Chez notaire</p>
              <p className="text-2xl font-semibold text-neutral-900">{stats.waiting}</p>
            </div>
          </div>
        </RealProCard>

        <RealProCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Signés</p>
              <p className="text-2xl font-semibold text-neutral-900">{stats.signed}</p>
            </div>
          </div>
        </RealProCard>
      </div>

      {/* Dossiers list */}
      {dossiers.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aucun dossier notaire"
          description="Les dossiers notaires seront créés automatiquement lors de la vente des lots."
        />
      ) : (
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">
            Tous les dossiers ({dossiers.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dossiers.map((dossier) => (
              <NotaryBuyerCard
                key={dossier.id}
                dossier={dossier}
                projectId={projectId!}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
