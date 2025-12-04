import { useState } from 'react';
import { CheckCircle, Clock, Lock, Unlock, Edit, Trash2, FileText, DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';
import { supabase } from '@/lib/supabase';

interface LotQuickActionsProps {
  lot: any;
  projectId: string;
  onStatusChange?: () => void;
}

export default function LotQuickActions({ lot, projectId, onStatusChange }: LotQuickActionsProps) {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('lots')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', lot.id);

      if (error) throw error;
      onStatusChange?.();
    } catch (err) {
      console.error('Error updating lot status:', err);
    } finally {
      setLoading(false);
    }
  };

  const canMarkAsAvailable = lot.status === 'BLOCKED' || lot.status === 'RESERVED';
  const canMarkAsReserved = lot.status === 'AVAILABLE';
  const canMarkAsSold = lot.status === 'RESERVED' || lot.status === 'AVAILABLE';
  const canBlock = lot.status === 'AVAILABLE';

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {canMarkAsAvailable && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateStatus('AVAILABLE')}
          disabled={loading}
          className="text-green-600 hover:text-green-700 border-green-300 hover:border-green-400"
        >
          <Unlock className="h-4 w-4 mr-2" />
          Libérer
        </Button>
      )}

      {canMarkAsReserved && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateStatus('RESERVED')}
          disabled={loading}
          className="text-amber-600 hover:text-amber-700 border-amber-300 hover:border-amber-400"
        >
          <Clock className="h-4 w-4 mr-2" />
          Réserver
        </Button>
      )}

      {canMarkAsSold && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateStatus('SOLD')}
          disabled={loading}
          className="text-blue-600 hover:text-blue-700 border-blue-300 hover:border-blue-400"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Vendre
        </Button>
      )}

      {canBlock && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateStatus('BLOCKED')}
          disabled={loading}
          className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
        >
          <Lock className="h-4 w-4 mr-2" />
          Bloquer
        </Button>
      )}
    </div>
  );
}
