/**
 * ProjectLotDetailEnhanced - Page de détail lot complète
 *
 * 5 onglets:
 * - Vue d'ensemble (métriques, statut, workflow)
 * - Surfaces & caractéristiques (détails PPE suisse)
 * - Finances (prix, options, ventilation)
 * - Documents & timeline
 * - Milestones & progression
 */

import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  Ruler,
  DollarSign,
  FileText,
  CheckCircle,
  Edit,
  Plus,
  Trash2,
  Upload,
  MessageSquare,
  ChevronRight,
  Clock,
  User,
  Building,
  MapPin,
  Compass,
  Home,
  Calendar,
  AlertTriangle,
  Lock,
  Download,
  ExternalLink,
} from 'lucide-react';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProTabs } from '../components/realpro/RealProTabs';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  useLotManagement,
  LOT_STATUS_CONFIG,
  LOT_TYPE_CONFIG,
  LotStatus,
  LotDocument,
  LotActivity,
  LotNote,
  LotMilestone,
} from '../hooks/useLotManagement';

export default function ProjectLotDetailEnhanced() {
  const { projectId, lotId } = useParams<{ projectId: string; lotId: string }>();
  const navigate = useNavigate();

  const {
    lot,
    summary,
    loading,
    error,
    saving,
    refresh,
    updateLot,
    changeStatus,
    getAllowedTransitions,
    addNote,
    deleteNote,
    updateMilestone,
    initializeMilestones,
    uploadDocument,
    deleteDocument,
    getPriceBreakdown,
  } = useLotManagement(projectId, lotId);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [notePrivate, setNotePrivate] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !lot) {
    return (
      <div className="px-10 py-8">
        <div className="text-center py-20">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Lot non trouvé
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {error?.message || 'Le lot demandé n\'existe pas'}
          </p>
          <RealProButton onClick={() => navigate(`/projects/${projectId}/lots`)}>
            Retour aux lots
          </RealProButton>
        </div>
      </div>
    );
  }

  const statusConfig = LOT_STATUS_CONFIG[lot.status];
  const typeConfig = LOT_TYPE_CONFIG[lot.type];
  const allowedTransitions = getAllowedTransitions();
  const priceBreakdown = getPriceBreakdown();

  const handleStatusChange = async (newStatus: LotStatus) => {
    const { error } = await changeStatus(newStatus);
    if (!error) {
      setShowStatusModal(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    const { error } = await addNote(noteContent, notePrivate);
    if (!error) {
      setNoteContent('');
      setNotePrivate(false);
      setShowNoteModal(false);
    }
  };

  const handleMilestoneToggle = async (milestone: LotMilestone) => {
    const newStatus = milestone.status === 'completed' ? 'pending' : 'completed';
    await updateMilestone(milestone.id, newStatus);
  };

  // ============================================================================
  // Tab: Overview
  // ============================================================================
  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Prix total"
          value={`CHF ${lot.pricing.price_total.toLocaleString('fr-CH')}`}
          subValue={`${lot.pricing.price_per_m2.toLocaleString('fr-CH')} CHF/m²`}
          icon={<DollarSign className="w-5 h-5" />}
          color="text-blue-600"
        />
        <MetricCard
          label="Surface totale"
          value={`${lot.surfaces.surface_total} m²`}
          subValue={`${lot.surfaces.surface_habitable} m² habitables`}
          icon={<Ruler className="w-5 h-5" />}
          color="text-green-600"
        />
        <MetricCard
          label="Jours sur le marché"
          value={summary?.days_on_market.toString() || '0'}
          subValue={`${summary?.visits_count || 0} visites`}
          icon={<Calendar className="w-5 h-5" />}
          color="text-amber-600"
        />
        <MetricCard
          label="Progression"
          value={`${summary?.completion_percentage || 0}%`}
          subValue={summary?.next_milestone?.name || 'Toutes étapes complétées'}
          icon={<CheckCircle className="w-5 h-5" />}
          color="text-purple-600"
        />
      </div>

      {/* Status & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Statut actuel
          </h3>
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-4 py-2 rounded-full text-lg font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
          {allowedTransitions.length > 0 && (
            <>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Transitions possibles:
              </p>
              <div className="flex flex-wrap gap-2">
                {allowedTransitions.map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={saving}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors
                      ${LOT_STATUS_CONFIG[status].bgColor} ${LOT_STATUS_CONFIG[status].color}
                      hover:opacity-80 disabled:opacity-50`}
                  >
                    {LOT_STATUS_CONFIG[status].label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Lot Info Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Informations
          </h3>
          <div className="space-y-3">
            <InfoRow icon={<Home />} label="Type" value={typeConfig?.label || lot.type} />
            <InfoRow icon={<Building />} label="Bâtiment" value={lot.building_name || '-'} />
            <InfoRow icon={<MapPin />} label="Étage" value={lot.floor_level?.toString() || '-'} />
            <InfoRow icon={<Compass />} label="Orientation" value={lot.orientation || '-'} />
            <InfoRow icon={<Home />} label="Pièces" value={`${lot.rooms_count} pièces`} />
          </div>
        </div>

        {/* Buyer Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Acquéreur
          </h3>
          {lot.buyer ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {lot.buyer.first_name} {lot.buyer.last_name}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {lot.buyer.email}
                  </p>
                </div>
              </div>
              {lot.buyer.phone && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Tél: {lot.buyer.phone}
                </p>
              )}
              {lot.buyer.contract_status && (
                <p className="text-sm">
                  Contrat: <span className="font-medium">{lot.buyer.contract_status}</span>
                </p>
              )}
              <RealProButton
                variant="outline"
                size="sm"
                onClick={() => navigate(`/projects/${projectId}/buyers/${lot.buyer?.id}`)}
              >
                Voir le profil
                <ChevronRight className="w-4 h-4 ml-1" />
              </RealProButton>
            </div>
          ) : (
            <div className="text-center py-6">
              <User className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Aucun acquéreur associé
              </p>
              <RealProButton
                variant="outline"
                size="sm"
                onClick={() => navigate(`/projects/${projectId}/crm/pipeline`)}
              >
                Associer un acheteur
              </RealProButton>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Activité récente
          </h3>
          <span className="text-sm text-neutral-500">
            {lot.activities.length} événements
          </span>
        </div>
        <div className="space-y-3">
          {lot.activities.slice(0, 5).map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
          {lot.activities.length === 0 && (
            <p className="text-center text-neutral-500 py-4">
              Aucune activité enregistrée
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // Tab: Surfaces
  // ============================================================================
  const SurfacesTab = () => (
    <div className="space-y-8">
      {/* Main Surfaces */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Surfaces principales
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <SurfaceItem
            label="Surface totale"
            value={lot.surfaces.surface_total}
            isPrimary
          />
          <SurfaceItem
            label="Surface habitable"
            value={lot.surfaces.surface_habitable}
          />
          <SurfaceItem
            label="Balcon"
            value={lot.surfaces.surface_balcon}
          />
          <SurfaceItem
            label="Terrasse"
            value={lot.surfaces.surface_terrasse}
          />
        </div>
      </div>

      {/* Additional Surfaces */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Surfaces annexes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <SurfaceItem
            label="Jardin"
            value={lot.surfaces.surface_jardin}
          />
          <SurfaceItem
            label="Cave"
            value={lot.surfaces.surface_cave}
          />
          <SurfaceItem
            label="Parking"
            value={lot.surfaces.surface_parking}
          />
          <SurfaceItem
            label="Millièmes PPE"
            value={lot.surfaces.ppe_milliemes}
            unit="‰"
          />
        </div>
      </div>

      {/* Characteristics */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Caractéristiques
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Type</p>
            <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              {typeConfig?.icon} {typeConfig?.label || lot.type}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Nombre de pièces</p>
            <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              {lot.rooms_count} pièces
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Étage</p>
            <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              {lot.floor_name || (lot.floor_level !== undefined ? `Étage ${lot.floor_level}` : '-')}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Bâtiment</p>
            <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              {lot.building_name || '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Orientation</p>
            <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              {lot.orientation || '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Code lot</p>
            <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              {lot.code}
            </p>
          </div>
        </div>
        {lot.description && (
          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Description</p>
            <p className="text-neutral-900 dark:text-neutral-100">{lot.description}</p>
          </div>
        )}
      </div>

      {/* Annexes */}
      {(lot.annexes.parking_ids.length > 0 || lot.annexes.cave_ids.length > 0) && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Lots annexes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lot.annexes.parking_ids.length > 0 && (
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Parkings</p>
                <div className="flex flex-wrap gap-2">
                  {lot.annexes.parking_ids.map(id => (
                    <span
                      key={id}
                      className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm"
                    >
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {lot.annexes.cave_ids.length > 0 && (
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Caves</p>
                <div className="flex flex-wrap gap-2">
                  {lot.annexes.cave_ids.map(id => (
                    <span
                      key={id}
                      className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm"
                    >
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // ============================================================================
  // Tab: Finances
  // ============================================================================
  const FinancesTab = () => (
    <div className="space-y-8">
      {/* Price Summary */}
      <div className="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 rounded-2xl border border-brand-200 dark:border-brand-800 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Prix de vente
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Prix total</p>
            <p className="text-3xl font-bold text-brand-600">
              CHF {lot.pricing.price_total.toLocaleString('fr-CH')}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Prix au m²</p>
            <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              CHF {lot.pricing.price_per_m2.toLocaleString('fr-CH')}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">TVA</p>
            <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              {lot.pricing.tva_included ? 'Incluse (8.1%)' : 'Non incluse'}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Statut</p>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      {priceBreakdown && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Ventilation du prix
          </h3>
          <div className="space-y-4">
            <PriceRow label="Prix de base" value={priceBreakdown.base} />
            {priceBreakdown.parking > 0 && (
              <PriceRow label="Parking" value={priceBreakdown.parking} />
            )}
            {priceBreakdown.cave > 0 && (
              <PriceRow label="Cave" value={priceBreakdown.cave} />
            )}
            {priceBreakdown.options > 0 && (
              <PriceRow label="Options" value={priceBreakdown.options} />
            )}
            {priceBreakdown.modifications > 0 && (
              <PriceRow label="Modifications acquéreur" value={priceBreakdown.modifications} />
            )}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <PriceRow label="Sous-total" value={priceBreakdown.subtotal} isBold />
            </div>
            {!lot.pricing.tva_included && priceBreakdown.tva > 0 && (
              <PriceRow label="TVA 8.1%" value={priceBreakdown.tva} />
            )}
            <div className="pt-4 border-t-2 border-brand-500">
              <PriceRow label="TOTAL" value={priceBreakdown.total} isBold isTotal />
            </div>
          </div>
        </div>
      )}

      {/* Financial Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Statut financier
          </h3>
          {lot.buyer?.contract_id ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Contrat signé</span>
              </div>
              {lot.buyer.signed_at && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Signé le {new Date(lot.buyer.signed_at).toLocaleDateString('fr-CH')}
                </p>
              )}
              <RealProButton
                variant="outline"
                size="sm"
                onClick={() => navigate(`/projects/${projectId}/finances/invoices?lot=${lotId}`)}
              >
                Voir les factures
              </RealProButton>
            </div>
          ) : (
            <p className="text-neutral-600 dark:text-neutral-400">
              Aucun contrat signé
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Modifications & options
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Options sélectionnées</span>
              <span className="font-medium">
                CHF {(lot.pricing.price_options || 0).toLocaleString('fr-CH')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Modifications</span>
              <span className="font-medium">
                CHF {(lot.pricing.price_modifications || 0).toLocaleString('fr-CH')}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <RealProButton
              variant="outline"
              size="sm"
              onClick={() => navigate(`/projects/${projectId}/materials/lots/${lotId}`)}
            >
              Gérer les matériaux
            </RealProButton>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // Tab: Documents
  // ============================================================================
  const DocumentsTab = () => (
    <div className="space-y-8">
      {/* Documents List */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Documents ({lot.documents.length})
          </h3>
          <RealProButton size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Ajouter
          </RealProButton>
        </div>

        {lot.documents.length > 0 ? (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {lot.documents.map(doc => (
              <DocumentRow key={doc.id} document={doc} onDelete={deleteDocument} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-600 dark:text-neutral-400">
              Aucun document associé
            </p>
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Notes ({lot.notes.length})
          </h3>
          <RealProButton size="sm" onClick={() => setShowNoteModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </RealProButton>
        </div>

        {lot.notes.length > 0 ? (
          <div className="space-y-4">
            {lot.notes.map(note => (
              <NoteCard key={note.id} note={note} onDelete={deleteNote} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-600 dark:text-neutral-400">
              Aucune note
            </p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Historique complet
        </h3>
        {lot.activities.length > 0 ? (
          <div className="space-y-4">
            {lot.activities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} showDate />
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-500 py-8">
            Aucun historique disponible
          </p>
        )}
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Ajouter une note
            </h3>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Contenu de la note..."
              className="w-full h-32 px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl
                bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 resize-none"
            />
            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notePrivate}
                onChange={(e) => setNotePrivate(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300"
              />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Note privée (visible uniquement par vous)
              </span>
            </label>
            <div className="flex justify-end gap-3 mt-6">
              <RealProButton variant="outline" onClick={() => setShowNoteModal(false)}>
                Annuler
              </RealProButton>
              <RealProButton onClick={handleAddNote} disabled={!noteContent.trim() || saving}>
                Ajouter
              </RealProButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ============================================================================
  // Tab: Milestones
  // ============================================================================
  const MilestonesTab = () => (
    <div className="space-y-8">
      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Progression globale
          </h3>
          <span className="text-2xl font-bold text-purple-600">
            {summary?.completion_percentage || 0}%
          </span>
        </div>
        <div className="w-full h-3 bg-purple-200 dark:bg-purple-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${summary?.completion_percentage || 0}%` }}
          />
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3">
          {lot.milestones.filter(m => m.status === 'completed').length} sur {lot.milestones.length} étapes complétées
        </p>
      </div>

      {/* Milestones List */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Étapes clés
          </h3>
          {lot.milestones.length === 0 && (
            <RealProButton size="sm" onClick={initializeMilestones} disabled={saving}>
              Initialiser les étapes
            </RealProButton>
          )}
        </div>

        {lot.milestones.length > 0 ? (
          <div className="space-y-4">
            {lot.milestones.map((milestone, index) => (
              <MilestoneItem
                key={milestone.id}
                milestone={milestone}
                index={index}
                onToggle={() => handleMilestoneToggle(milestone)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Aucune étape définie
            </p>
            <RealProButton onClick={initializeMilestones} disabled={saving}>
              Créer les étapes par défaut
            </RealProButton>
          </div>
        )}
      </div>
    </div>
  );

  // ============================================================================
  // Tabs Configuration
  // ============================================================================
  const tabs = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: <Eye className="w-4 h-4" />,
      content: <OverviewTab />,
    },
    {
      id: 'surfaces',
      label: 'Surfaces',
      icon: <Ruler className="w-4 h-4" />,
      content: <SurfacesTab />,
    },
    {
      id: 'finances',
      label: 'Finances',
      icon: <DollarSign className="w-4 h-4" />,
      content: <FinancesTab />,
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText className="w-4 h-4" />,
      badge: lot.documents.length > 0 ? lot.documents.length.toString() : undefined,
      content: <DocumentsTab />,
    },
    {
      id: 'milestones',
      label: 'Étapes',
      icon: <CheckCircle className="w-4 h-4" />,
      badge: `${summary?.completion_percentage || 0}%`,
      content: <MilestonesTab />,
    },
  ];

  return (
    <div className="px-10 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          to={`/projects/${projectId}/lots`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux lots
        </Link>

        <RealProTopbar
          title={`Lot ${lot.code}`}
          subtitle={`${typeConfig?.label || lot.type} • ${lot.rooms_count} pièces • ${lot.surfaces.surface_total} m²`}
          actions={
            <div className="flex gap-3">
              <RealProButton variant="outline" onClick={refresh}>
                Actualiser
              </RealProButton>
              <RealProButton>
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </RealProButton>
            </div>
          }
        />
      </div>

      {/* Tabs */}
      <RealProTabs tabs={tabs} defaultTab="overview" />
    </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function MetricCard({
  label,
  value,
  subValue,
  icon,
  color,
}: {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={color}>{icon}</span>
        <span className="text-sm text-neutral-600 dark:text-neutral-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
      {subValue && (
        <p className="text-sm text-neutral-500 mt-1">{subValue}</p>
      )}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
        <span className="w-4 h-4">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      <span className="font-medium text-neutral-900 dark:text-neutral-100">{value}</span>
    </div>
  );
}

function SurfaceItem({
  label,
  value,
  unit = 'm²',
  isPrimary,
}: {
  label: string;
  value?: number;
  unit?: string;
  isPrimary?: boolean;
}) {
  return (
    <div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{label}</p>
      <p className={`font-medium ${isPrimary ? 'text-2xl text-brand-600' : 'text-lg text-neutral-900 dark:text-neutral-100'}`}>
        {value !== undefined && value !== null ? `${value} ${unit}` : '-'}
      </p>
    </div>
  );
}

function PriceRow({
  label,
  value,
  isBold,
  isTotal,
}: {
  label: string;
  value: number;
  isBold?: boolean;
  isTotal?: boolean;
}) {
  return (
    <div className={`flex justify-between ${isBold ? 'font-semibold' : ''} ${isTotal ? 'text-lg text-brand-600' : ''}`}>
      <span className="text-neutral-600 dark:text-neutral-400">{label}</span>
      <span className={isTotal ? 'text-brand-600' : 'text-neutral-900 dark:text-neutral-100'}>
        CHF {value.toLocaleString('fr-CH')}
      </span>
    </div>
  );
}

function DocumentRow({
  document,
  onDelete,
}: {
  document: LotDocument;
  onDelete: (id: string, path: string) => Promise<{ error: Error | null }>;
}) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      plan: 'Plan',
      contract: 'Contrat',
      specification: 'Devis',
      certificate: 'Certificat',
      photo: 'Photo',
      other: 'Autre',
    };
    return labels[type] || type;
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-neutral-400" />
        <div>
          <p className="font-medium text-neutral-900 dark:text-neutral-100">{document.name}</p>
          <p className="text-sm text-neutral-500">
            {getTypeLabel(document.type)} • {new Date(document.uploaded_at).toLocaleDateString('fr-CH')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
          <Download className="w-4 h-4" />
        </button>
        <button className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
          <ExternalLink className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(document.id, document.storage_path)}
          className="p-2 text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function NoteCard({
  note,
  onDelete,
}: {
  note: LotNote;
  onDelete: (id: string) => Promise<{ error: Error | null }>;
}) {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {note.author_name}
          </span>
          {note.is_private && (
            <Lock className="w-3 h-3 text-amber-500" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">
            {new Date(note.created_at).toLocaleDateString('fr-CH')}
          </span>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <p className="text-neutral-700 dark:text-neutral-300 text-sm">{note.content}</p>
    </div>
  );
}

function ActivityItem({
  activity,
  showDate,
}: {
  activity: LotActivity;
  showDate?: boolean;
}) {
  const getActivityIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      status_change: <ChevronRight className="w-4 h-4" />,
      price_update: <DollarSign className="w-4 h-4" />,
      document_added: <FileText className="w-4 h-4" />,
      note_added: <MessageSquare className="w-4 h-4" />,
      visit_scheduled: <Calendar className="w-4 h-4" />,
      contract_signed: <CheckCircle className="w-4 h-4" />,
      milestone: <CheckCircle className="w-4 h-4" />,
    };
    return icons[type] || <Clock className="w-4 h-4" />;
  };

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-neutral-900 dark:text-neutral-100">{activity.description}</p>
        {showDate && (
          <p className="text-xs text-neutral-500 mt-1">
            {new Date(activity.created_at).toLocaleString('fr-CH')}
          </p>
        )}
      </div>
    </div>
  );
}

function MilestoneItem({
  milestone,
  index,
  onToggle,
}: {
  milestone: LotMilestone;
  index: number;
  onToggle: () => void;
}) {
  const isCompleted = milestone.status === 'completed';

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-colors cursor-pointer
        ${isCompleted
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
        }`}
      onClick={onToggle}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
          ${isCompleted
            ? 'bg-green-500 text-white'
            : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
          }`}
      >
        {isCompleted ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <span className="text-sm font-medium">{index + 1}</span>
        )}
      </div>
      <div className="flex-1">
        <p className={`font-medium ${isCompleted ? 'text-green-700 dark:text-green-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
          {milestone.name}
        </p>
        {milestone.completed_at && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Complété le {new Date(milestone.completed_at).toLocaleDateString('fr-CH')}
          </p>
        )}
        {milestone.due_date && !isCompleted && (
          <p className="text-xs text-neutral-500 mt-1">
            Échéance: {new Date(milestone.due_date).toLocaleDateString('fr-CH')}
          </p>
        )}
      </div>
    </div>
  );
}
