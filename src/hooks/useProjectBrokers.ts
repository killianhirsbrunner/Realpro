import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ProjectBroker {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  commissionRate: number;
  status: 'active' | 'inactive';
  lotsCount: number;
  salesCount: number;
  assignedLots: string[];
  createdAt: string;
}

export interface BrokerStats {
  totalBrokers: number;
  totalSales: number;
  lotsAssigned: number;
  totalCommissions: number;
}

export function useProjectBrokers(projectId: string) {
  const [brokers, setBrokers] = useState<ProjectBroker[]>([]);
  const [stats, setStats] = useState<BrokerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchBrokers();
      fetchStats();
    }
  }, [projectId]);

  const fetchBrokers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch project participants with BROKER role
      const { data: participants, error: participantsError } = await supabase
        .from('project_participants')
        .select(`
          id,
          user_id,
          role,
          status,
          created_at,
          users (
            id,
            email,
            full_name
          )
        `)
        .eq('project_id', projectId)
        .eq('role', 'BROKER')
        .order('created_at', { ascending: false });

      if (participantsError) throw participantsError;

      // For each broker, get their lots and sales stats
      const brokersData = await Promise.all(
        (participants || []).map(async (participant: any) => {
          // Get assigned lots count
          const { count: lotsCount } = await supabase
            .from('lots')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', projectId)
            .eq('broker_id', participant.user_id);

          // Get sales count
          const { count: salesCount } = await supabase
            .from('sales_contracts')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', projectId)
            .eq('broker_id', participant.user_id);

          // Get assigned lot IDs
          const { data: assignedLots } = await supabase
            .from('lots')
            .select('id')
            .eq('project_id', projectId)
            .eq('broker_id', participant.user_id);

          return {
            id: participant.id,
            userId: participant.user_id,
            name: participant.users?.full_name || participant.users?.email || 'Courtier',
            email: participant.users?.email || '',
            phone: '',
            company: '',
            commissionRate: 3, // Default, should come from a broker_settings table
            status: participant.status === 'ACTIVE' ? 'active' : 'inactive',
            lotsCount: lotsCount || 0,
            salesCount: salesCount || 0,
            assignedLots: (assignedLots || []).map((l: any) => l.id),
            createdAt: participant.created_at,
          };
        })
      );

      setBrokers(brokersData);
    } catch (e: any) {
      console.error('Error fetching brokers:', e);
      setError(e.message || 'Erreur lors du chargement des courtiers');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get total brokers count
      const { count: totalBrokers } = await supabase
        .from('project_participants')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId)
        .eq('role', 'BROKER')
        .eq('status', 'ACTIVE');

      // Get total sales from brokers
      const { count: totalSales } = await supabase
        .from('sales_contracts')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId)
        .not('broker_id', 'is', null);

      // Get total lots assigned to brokers
      const { count: lotsAssigned } = await supabase
        .from('lots')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId)
        .not('broker_id', 'is', null);

      // Calculate total commissions (simplified - would need actual commission calculation)
      const { data: salesData } = await supabase
        .from('sales_contracts')
        .select('lot_id, lots(price_total)')
        .eq('project_id', projectId)
        .not('broker_id', 'is', null);

      const totalCommissions = (salesData || []).reduce((sum: number, sale: any) => {
        const price = sale.lots?.price_total || 0;
        return sum + (price * 0.03); // Assuming 3% average commission
      }, 0);

      setStats({
        totalBrokers: totalBrokers || 0,
        totalSales: totalSales || 0,
        lotsAssigned: lotsAssigned || 0,
        totalCommissions,
      });
    } catch (e: any) {
      console.error('Error fetching broker stats:', e);
    }
  };

  const inviteBroker = async (data: {
    projectId: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    commissionRate: number;
    id?: string;
  }) => {
    try {
      if (data.id) {
        // Update existing broker
        const broker = brokers.find(b => b.id === data.id);
        if (broker) {
          // Update user info
          const { error: updateError } = await supabase
            .from('users')
            .update({
              full_name: data.name,
              phone: data.phone,
            })
            .eq('id', broker.userId);

          if (updateError) throw updateError;
        }
      } else {
        // Check if user exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', data.email)
          .single();

        let userId = existingUser?.id;

        if (!userId) {
          // Create new user (would need proper auth flow in production)
          const { data: newUser, error: userError } = await supabase
            .from('users')
            .insert({
              email: data.email,
              full_name: data.name,
              phone: data.phone,
            })
            .select('id')
            .single();

          if (userError) throw userError;
          userId = newUser.id;
        }

        // Add as project participant
        const { error: participantError } = await supabase
          .from('project_participants')
          .insert({
            project_id: data.projectId,
            user_id: userId,
            role: 'BROKER',
            status: 'ACTIVE',
          });

        if (participantError) throw participantError;
      }

      await fetchBrokers();
      await fetchStats();
    } catch (e: any) {
      console.error('Error inviting broker:', e);
      throw new Error(e.message || 'Erreur lors de l\'invitation du courtier');
    }
  };

  const removeBroker = async (brokerId: string) => {
    try {
      const { error } = await supabase
        .from('project_participants')
        .update({ status: 'INACTIVE' })
        .eq('id', brokerId);

      if (error) throw error;

      await fetchBrokers();
      await fetchStats();
    } catch (e: any) {
      console.error('Error removing broker:', e);
      throw new Error(e.message || 'Erreur lors de la suppression du courtier');
    }
  };

  const updateBroker = async (brokerId: string, updates: Partial<ProjectBroker>) => {
    try {
      const broker = brokers.find(b => b.id === brokerId);
      if (!broker) throw new Error('Courtier non trouvé');

      // Update user info
      const { error: updateError } = await supabase
        .from('users')
        .update({
          full_name: updates.name,
          phone: updates.phone,
        })
        .eq('id', broker.userId);

      if (updateError) throw updateError;

      await fetchBrokers();
    } catch (e: any) {
      console.error('Error updating broker:', e);
      throw new Error(e.message || 'Erreur lors de la mise à jour du courtier');
    }
  };

  const assignLotsToBreker = async (brokerId: string, lotIds: string[]) => {
    try {
      const broker = brokers.find(b => b.id === brokerId);
      if (!broker) throw new Error('Courtier non trouvé');

      // Remove previous assignments for this broker in this project
      await supabase
        .from('lots')
        .update({ broker_id: null })
        .eq('project_id', projectId)
        .eq('broker_id', broker.userId);

      // Assign new lots
      if (lotIds.length > 0) {
        const { error } = await supabase
          .from('lots')
          .update({ broker_id: broker.userId })
          .in('id', lotIds);

        if (error) throw error;
      }

      await fetchBrokers();
      await fetchStats();
    } catch (e: any) {
      console.error('Error assigning lots:', e);
      throw new Error(e.message || 'Erreur lors de l\'assignation des lots');
    }
  };

  return {
    brokers,
    stats,
    loading,
    error,
    inviteBroker,
    removeBroker,
    updateBroker,
    assignLotsToBreker,
    refetch: fetchBrokers,
  };
}
