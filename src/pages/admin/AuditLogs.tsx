import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { RealProCard } from '../../components/realpro/RealProCard';
import { RealProTopbar } from '../../components/realpro/RealProTopbar';
import { RealProSearchBar } from '../../components/realpro/RealProSearchBar';
import { Timeline } from '../../components/ui/Timeline';
import { Skeleton, SkeletonTable } from '../../components/ui/Skeleton';
import { designTokens } from '../../lib/design-system/tokens';
import { supabase } from '../../lib/supabase';
import {
  Filter,
  Download,
  Calendar,
  User,
  FileText,
  Settings,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '../../components/ui/Toast';

interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  resource_type: string;
  resource_id: string;
  changes: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export function AuditLogs() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });

  useEffect(() => {
    fetchAuditLogs();
  }, [filterType, filterSeverity, dateRange]);

  async function fetchAuditLogs() {
    try {
      setLoading(true);
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filterType !== 'all') {
        query = query.eq('resource_type', filterType);
      }

      if (filterSeverity !== 'all') {
        query = query.eq('severity', filterSeverity);
      }

      if (dateRange.start) {
        query = query.gte('created_at', dateRange.start);
      }

      if (dateRange.end) {
        query = query.lte('created_at', dateRange.end);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      console.error('Error fetching audit logs:', error);
      toast.error('Erreur', 'Impossible de charger les journaux d\'audit');
    } finally {
      setLoading(false);
    }
  }

  function exportLogs() {
    const csv = [
      ['Date', 'Utilisateur', 'Action', 'Type', 'Resource ID', 'Sévérité'].join(','),
      ...filteredLogs.map(log =>
        [
          format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss'),
          log.user_email,
          log.action,
          log.resource_type,
          log.resource_id,
          log.severity,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    toast.success('Export réussi', 'Les logs ont été exportés en CSV');
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const timelineItems = filteredLogs.map(log => ({
    id: log.id,
    title: `${log.user_email} - ${log.action}`,
    description: `${log.resource_type} ${log.resource_id ? `(${log.resource_id})` : ''}`,
    timestamp: log.created_at,
    icon: getActionIcon(log.action),
    status: getSeverityStatus(log.severity),
    metadata: {
      IP: log.ip_address,
      Sévérité: log.severity,
    },
  }));

  return (
    <div className="min-h-screen" style={{ backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.background }}>
      <RealProTopbar
        title="Journaux d'Audit"
        subtitle="Historique complet des actions système"
        icon={<Shield />}
        actions={
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: isDark ? designTokens.colors.dark.brand : designTokens.colors.light.brand,
              color: '#ffffff',
            }}
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </button>
        }
      />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Filters */}
        <RealProCard>
          <div className="space-y-4">
            <RealProSearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Rechercher par utilisateur, action ou ressource..."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Resource Type Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                  Type de ressource
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{
                    backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
                    borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
                    color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground,
                  }}
                >
                  <option value="all">Tous les types</option>
                  <option value="user">Utilisateurs</option>
                  <option value="project">Projets</option>
                  <option value="lot">Lots</option>
                  <option value="buyer">Acheteurs</option>
                  <option value="contract">Contrats</option>
                  <option value="document">Documents</option>
                  <option value="invoice">Factures</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                  Sévérité
                </label>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{
                    backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
                    borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
                    color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground,
                  }}
                >
                  <option value="all">Toutes</option>
                  <option value="info">Info</option>
                  <option value="warning">Avertissement</option>
                  <option value="error">Erreur</option>
                  <option value="critical">Critique</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                  Date de début
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{
                    backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
                    borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
                    color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground,
                  }}
                />
              </div>
            </div>
          </div>
        </RealProCard>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <RealProCard className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
              {filteredLogs.length}
            </div>
            <div className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Total événements
            </div>
          </RealProCard>

          <RealProCard className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: designTokens.colors.light.info }}>
              {filteredLogs.filter(l => l.severity === 'info').length}
            </div>
            <div className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Info
            </div>
          </RealProCard>

          <RealProCard className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: designTokens.colors.light.warning }}>
              {filteredLogs.filter(l => l.severity === 'warning').length}
            </div>
            <div className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Avertissements
            </div>
          </RealProCard>

          <RealProCard className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: designTokens.colors.light.danger }}>
              {filteredLogs.filter(l => l.severity === 'error' || l.severity === 'critical').length}
            </div>
            <div className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Erreurs
            </div>
          </RealProCard>
        </div>

        {/* Timeline */}
        <RealProCard>
          <h3 className="text-lg font-semibold mb-6" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
            Historique des événements
          </h3>

          {loading ? (
            <SkeletonTable rows={10} cols={4} />
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              <Shield className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Aucun journal d'audit trouvé</p>
            </div>
          ) : (
            <Timeline items={timelineItems} />
          )}
        </RealProCard>
      </div>
    </div>
  );
}

function getActionIcon(action: string) {
  const lower = action.toLowerCase();
  if (lower.includes('create')) return <CheckCircle className="w-5 h-5 text-white" />;
  if (lower.includes('update')) return <Settings className="w-5 h-5 text-white" />;
  if (lower.includes('delete')) return <XCircle className="w-5 h-5 text-white" />;
  if (lower.includes('login')) return <User className="w-5 h-5 text-white" />;
  return <FileText className="w-5 h-5 text-white" />;
}

function getSeverityStatus(severity: string): 'success' | 'warning' | 'danger' | 'info' {
  switch (severity) {
    case 'info':
      return 'info';
    case 'warning':
      return 'warning';
    case 'error':
    case 'critical':
      return 'danger';
    default:
      return 'success';
  }
}
