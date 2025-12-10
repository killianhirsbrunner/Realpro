import { useState } from 'react';
import { CheckCircle, X, Calendar, Phone, Mail, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { supabase } from '@/lib/supabase';

interface ProspectQuickActionsProps {
  prospect: any;
  projectId: string;
  onStatusChange?: () => void;
}

export function ProspectQuickActions({ prospect, projectId, onStatusChange }: ProspectQuickActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleConvertToReservation = async () => {
    if (!confirm('Voulez-vous convertir ce prospect en réservation ?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('prospects')
        .update({
          status: 'CONVERTED',
          updated_at: new Date().toISOString()
        })
        .eq('id', prospect.id);

      if (error) throw error;
      onStatusChange?.();
    } catch (err) {
      console.error('Error converting prospect:', err);
      alert('Erreur lors de la conversion');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsLost = async () => {
    const reason = prompt('Raison de la perte (optionnel):');

    setLoading(true);
    try {
      const { error } = await supabase
        .from('prospects')
        .update({
          status: 'LOST',
          lost_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', prospect.id);

      if (error) throw error;
      onStatusChange?.();
    } catch (err) {
      console.error('Error marking prospect as lost:', err);
      alert('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleCallback = () => {
    console.log('Schedule callback for prospect:', prospect.id);
  };

  const handleSendEmail = () => {
    if (prospect.email) {
      window.location.href = `mailto:${prospect.email}`;
    }
  };

  const handleCall = () => {
    if (prospect.phone) {
      window.location.href = `tel:${prospect.phone}`;
    }
  };

  const isConverted = prospect.status === 'CONVERTED';
  const isLost = prospect.status === 'LOST';
  const isActive = !isConverted && !isLost;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {isActive && (
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleConvertToReservation}
            disabled={loading}
            className="bg-brand-600 hover:bg-brand-700 text-white"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Convertir en réservation
          </Button>

          {prospect.phone && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCall}
              disabled={loading}
              className="text-green-600 hover:text-green-700 border-green-300 hover:border-green-400"
            >
              <Phone className="h-4 w-4 mr-2" />
              Appeler
            </Button>
          )}

          {prospect.email && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendEmail}
              disabled={loading}
              className="text-brand-600 hover:text-brand-700 border-brand-300 hover:border-brand-400"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleScheduleCallback}
            disabled={loading}
            className="text-brand-600 hover:text-brand-700 border-brand-300 hover:border-brand-400"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Planifier rappel
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAsLost}
            disabled={loading}
            className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
          >
            <X className="h-4 w-4 mr-2" />
            Marquer comme perdu
          </Button>
        </>
      )}

      {isConverted && (
        <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800 text-sm font-medium">
          <CheckCircle className="h-4 w-4 inline mr-2" />
          Prospect converti
        </div>
      )}

      {isLost && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 text-sm font-medium">
          <X className="h-4 w-4 inline mr-2" />
          Prospect perdu
        </div>
      )}
    </div>
  );
}
