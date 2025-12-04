import { useState } from 'react';
import { X, Edit2, Mail, Phone, MapPin, Building2, Calendar, User } from 'lucide-react';
import { BuyerTimeline } from './BuyerTimeline';
import { BuyerDocumentsList } from './BuyerDocumentsList';
import { BuyerEditPanel } from './BuyerEditPanel';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface Buyer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  status: string;
  lot_number?: string;
  lot_type?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  created_at?: string;
}

interface BuyerPreviewPanelProps {
  buyer: Buyer;
  projectId: string;
  onClose: () => void;
}

export function BuyerPreviewPanel({ buyer, projectId, onClose }: BuyerPreviewPanelProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <BuyerEditPanel
        buyer={buyer}
        projectId={projectId}
        onClose={onClose}
        onSave={() => setIsEditing(false)}
      />
    );
  }

  const statusLabels: Record<string, string> = {
    PROSPECT: 'Prospect',
    RESERVED: 'Réservé',
    IN_PROGRESS: 'En cours',
    SIGNED: 'Signé'
  };

  const statusColors: Record<string, string> = {
    PROSPECT: 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300',
    RESERVED: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-300',
    IN_PROGRESS: 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300',
    SIGNED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white dark:bg-neutral-900 shadow-2xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Détails acheteur
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <User className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                    {buyer.first_name} {buyer.last_name}
                  </h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${statusColors[buyer.status] || statusColors.PROSPECT}`}>
                    {statusLabels[buyer.status] || buyer.status}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Modifier les informations
            </Button>
          </div>

          <Card className="p-4">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Informations de contact
            </h4>
            <div className="space-y-3">
              {buyer.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {buyer.email}
                  </span>
                </div>
              )}
              {buyer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {buyer.phone}
                  </span>
                </div>
              )}
              {(buyer.address || buyer.city) && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-neutral-400 mt-0.5" />
                  <div className="text-sm text-neutral-700 dark:text-neutral-300">
                    {buyer.address && <div>{buyer.address}</div>}
                    {(buyer.postal_code || buyer.city) && (
                      <div>
                        {buyer.postal_code} {buyer.city}
                      </div>
                    )}
                    {buyer.country && <div>{buyer.country}</div>}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {buyer.lot_number && (
            <Card className="p-4">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                Lot attribué
              </h4>
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-neutral-400" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Lot {buyer.lot_number}
                  {buyer.lot_type && ` • ${buyer.lot_type}`}
                </span>
              </div>
            </Card>
          )}

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
              Timeline
            </h4>
            <Card className="p-4">
              <BuyerTimeline buyerId={buyer.id} />
            </Card>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
              Documents
            </h4>
            <BuyerDocumentsList buyerId={buyer.id} />
          </div>
        </div>
      </div>
    </>
  );
}
