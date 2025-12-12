import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Plus, Calendar, Cloud, Sun, CloudRain, Snowflake, Wind,
  Users, AlertTriangle, CheckCircle, FileText, Clock, Edit2, Trash2,
  X, Save, Camera, ChevronDown, ChevronUp
} from 'lucide-react';
import { useSiteDiaryEntries } from '../hooks/useSiteDiaryEntries';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { toast } from 'sonner';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';

const WEATHER_OPTIONS = [
  { value: 'sunny', label: 'Ensoleille', icon: Sun, color: 'text-yellow-500' },
  { value: 'cloudy', label: 'Nuageux', icon: Cloud, color: 'text-neutral-500' },
  { value: 'rainy', label: 'Pluvieux', icon: CloudRain, color: 'text-blue-500' },
  { value: 'snowy', label: 'Neigeux', icon: Snowflake, color: 'text-cyan-500' },
  { value: 'windy', label: 'Venteux', icon: Wind, color: 'text-teal-500' },
];

export default function ProjectPlanningReports() {
  const { projectId } = useParams<{ projectId: string }>();
  const { entries, loading, error, createEntry, updateEntry, deleteEntry } = useSiteDiaryEntries(projectId!);
  const [showNewForm, setShowNewForm] = useState(false);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({
    entry_date: format(new Date(), 'yyyy-MM-dd'),
    weather: 'sunny',
    notes: '',
    workforce: [] as { company: string; workers: number; hours: number }[],
    issues: [] as { description: string; severity: string; resolved: boolean }[]
  });
  const [saving, setSaving] = useState(false);

  const handleCreateEntry = async () => {
    if (!newEntry.entry_date) {
      toast.error('Veuillez selectionner une date');
      return;
    }

    try {
      setSaving(true);
      await createEntry({
        entry_date: newEntry.entry_date,
        weather: newEntry.weather,
        notes: newEntry.notes || null,
        workforce: newEntry.workforce.length > 0 ? newEntry.workforce : null,
        issues: newEntry.issues.length > 0 ? newEntry.issues : null,
      });
      toast.success('Rapport cree avec succes');
      setShowNewForm(false);
      setNewEntry({
        entry_date: format(new Date(), 'yyyy-MM-dd'),
        weather: 'sunny',
        notes: '',
        workforce: [],
        issues: []
      });
    } catch (err: any) {
      toast.error('Erreur lors de la creation');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Supprimer ce rapport ?')) return;

    try {
      await deleteEntry(entryId);
      toast.success('Rapport supprime');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const addWorkforceRow = () => {
    setNewEntry({
      ...newEntry,
      workforce: [...newEntry.workforce, { company: '', workers: 0, hours: 8 }]
    });
  };

  const addIssueRow = () => {
    setNewEntry({
      ...newEntry,
      issues: [...newEntry.issues, { description: '', severity: 'medium', resolved: false }]
    });
  };

  const formatEntryDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Aujourd'hui";
    if (isYesterday(date)) return 'Hier';
    return format(date, 'EEEE d MMMM yyyy', { locale: fr });
  };

  const getWeatherIcon = (weather: string | null) => {
    const found = WEATHER_OPTIONS.find(w => w.value === weather);
    if (!found) return { Icon: Cloud, color: 'text-neutral-400' };
    return { Icon: found.icon, color: found.color };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 dark:text-red-400">Erreur : {error.message}</p>
      </div>
    );
  }

  const totalWorkers = entries.reduce((sum, e) => {
    const workforce = e.workforce as any[] | null;
    return sum + (workforce?.reduce((s, w) => s + (w.workers || 0), 0) || 0);
  }, 0);

  const openIssues = entries.reduce((sum, e) => {
    const issues = e.issues as any[] | null;
    return sum + (issues?.filter(i => !i.resolved).length || 0);
  }, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={`/projects/${projectId}/planning`}
            className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour au planning
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-realpro-turquoise/10 rounded-xl">
              <FileText className="w-8 h-8 text-realpro-turquoise" />
            </div>
            Journal de chantier
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Suivi quotidien du chantier - {entries.length} rapport{entries.length > 1 ? 's' : ''}
          </p>
        </div>

        <Button onClick={() => setShowNewForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau rapport
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Total rapports</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">{entries.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Ouvriers total</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">{totalWorkers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Problemes ouverts</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">{openIssues}</p>
            </div>
          </div>
        </Card>
      </div>

      {showNewForm && (
        <Card className="p-6 border-2 border-realpro-turquoise">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Nouveau rapport journalier</h2>
            <button onClick={() => setShowNewForm(false)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Date du rapport
              </label>
              <input
                type="date"
                value={newEntry.entry_date}
                onChange={(e) => setNewEntry({ ...newEntry, entry_date: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Meteo
              </label>
              <div className="flex gap-2">
                {WEATHER_OPTIONS.map(option => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNewEntry({ ...newEntry, weather: option.value })}
                      className={`flex-1 p-3 rounded-lg border transition-all ${
                        newEntry.weather === option.value
                          ? 'border-realpro-turquoise bg-realpro-turquoise/10'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                      }`}
                      title={option.label}
                    >
                      <Icon className={`h-6 w-6 mx-auto ${option.color}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Notes et observations
            </label>
            <textarea
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
              rows={4}
              placeholder="Activités réalisées, observations..."
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Main d'œuvre présente
              </label>
              <Button variant="outline" size="sm" onClick={addWorkforceRow}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>

            {newEntry.workforce.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-4">Aucune main d'oeuvre enregistree</p>
            ) : (
              <div className="space-y-2">
                {newEntry.workforce.map((w, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Entreprise"
                      value={w.company}
                      onChange={(e) => {
                        const updated = [...newEntry.workforce];
                        updated[idx].company = e.target.value;
                        setNewEntry({ ...newEntry, workforce: updated });
                      }}
                      className="flex-1 px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Ouvriers"
                      value={w.workers || ''}
                      onChange={(e) => {
                        const updated = [...newEntry.workforce];
                        updated[idx].workers = parseInt(e.target.value) || 0;
                        setNewEntry({ ...newEntry, workforce: updated });
                      }}
                      className="w-24 px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Heures"
                      value={w.hours || ''}
                      onChange={(e) => {
                        const updated = [...newEntry.workforce];
                        updated[idx].hours = parseInt(e.target.value) || 0;
                        setNewEntry({ ...newEntry, workforce: updated });
                      }}
                      className="w-20 px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    />
                    <button
                      onClick={() => {
                        const updated = newEntry.workforce.filter((_, i) => i !== idx);
                        setNewEntry({ ...newEntry, workforce: updated });
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <Button variant="outline" onClick={() => setShowNewForm(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateEntry} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </Card>
      )}

      {entries.length === 0 ? (
        <Card className="text-center py-16">
          <FileText className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-4">Aucun rapport journalier disponible</p>
          <Button onClick={() => setShowNewForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Creer le premier rapport
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const { Icon: WeatherIcon, color: weatherColor } = getWeatherIcon(entry.weather);
            const workforce = entry.workforce as any[] | null;
            const issues = entry.issues as any[] | null;
            const isExpanded = expandedEntryId === entry.id;
            const totalWorkersEntry = workforce?.reduce((s, w) => s + (w.workers || 0), 0) || 0;
            const totalHours = workforce?.reduce((s, w) => s + (w.workers || 0) * (w.hours || 0), 0) || 0;

            return (
              <Card key={entry.id} className="overflow-hidden">
                <div
                  className="p-6 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                          {format(new Date(entry.entry_date), 'd')}
                        </p>
                        <p className="text-sm text-neutral-500 uppercase">
                          {format(new Date(entry.entry_date), 'MMM', { locale: fr })}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-white capitalize">
                          {formatEntryDate(entry.entry_date)}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                          <span className="flex items-center gap-1">
                            <WeatherIcon className={`h-4 w-4 ${weatherColor}`} />
                            {WEATHER_OPTIONS.find(w => w.value === entry.weather)?.label || 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {totalWorkersEntry} ouvrier{totalWorkersEntry > 1 ? 's' : ''}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {totalHours}h
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {issues && issues.filter(i => !i.resolved).length > 0 && (
                        <Badge variant="error">
                          {issues.filter(i => !i.resolved).length} probleme{issues.filter(i => !i.resolved).length > 1 ? 's' : ''}
                        </Badge>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteEntry(entry.id); }}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {isExpanded ? <ChevronUp className="h-5 w-5 text-neutral-400" /> : <ChevronDown className="h-5 w-5 text-neutral-400" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    {entry.notes && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Notes</h4>
                        <p className="text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">{entry.notes}</p>
                      </div>
                    )}

                    {workforce && workforce.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Main d'oeuvre</h4>
                        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                                <th className="text-left py-2 px-3 text-neutral-600 dark:text-neutral-400">Entreprise</th>
                                <th className="text-right py-2 px-3 text-neutral-600 dark:text-neutral-400">Ouvriers</th>
                                <th className="text-right py-2 px-3 text-neutral-600 dark:text-neutral-400">Heures</th>
                                <th className="text-right py-2 px-3 text-neutral-600 dark:text-neutral-400">Total H.</th>
                              </tr>
                            </thead>
                            <tbody>
                              {workforce.map((w: any, idx: number) => (
                                <tr key={idx} className="border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                  <td className="py-2 px-3 text-neutral-900 dark:text-white">{w.company}</td>
                                  <td className="py-2 px-3 text-right text-neutral-900 dark:text-white">{w.workers}</td>
                                  <td className="py-2 px-3 text-right text-neutral-900 dark:text-white">{w.hours}h</td>
                                  <td className="py-2 px-3 text-right font-semibold text-neutral-900 dark:text-white">{w.workers * w.hours}h</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {issues && issues.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Problemes signales</h4>
                        <div className="space-y-2">
                          {issues.map((issue: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                              {issue.resolved ? (
                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                              )}
                              <p className={`flex-1 ${issue.resolved ? 'line-through text-neutral-500' : 'text-neutral-900 dark:text-white'}`}>
                                {issue.description}
                              </p>
                              <Badge variant={issue.resolved ? 'success' : issue.severity === 'high' ? 'error' : 'warning'}>
                                {issue.resolved ? 'Resolu' : issue.severity === 'high' ? 'Urgent' : 'Moyen'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
