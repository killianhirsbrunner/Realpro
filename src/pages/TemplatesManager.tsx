import { useEffect, useState } from 'react';
import { FileText, Save, Code, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

type Template = {
  id: string;
  name: string;
  code: string;
  scope: string;
  language: string;
  content: string;
  createdAt: string;
};

export function TemplatesManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const organizationId = '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    loadTemplates();
  }, [organizationId]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/templates`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId }),
      });

      if (!response.ok) throw new Error('Erreur lors du chargement des templates');

      const json = await response.json();
      setTemplates(json);

      if (!selected && json.length > 0) {
        setSelected(json[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selected) return;

    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/templates`;

      const response = await fetch(`${apiUrl}/${selected.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId,
          name: selected.name,
          content: selected.content,
          language: selected.language,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

      await loadTemplates();
      setMessage('Template sauvegardé avec succès');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Impossible de sauvegarder le template');
    } finally {
      setSaving(false);
    }
  };

  const handleSelect = (template: Template) => {
    if (selected && hasUnsavedChanges()) {
      if (!confirm('Vous avez des modifications non sauvegardées. Continuer ?')) {
        return;
      }
    }
    setSelected(template);
    setError(null);
    setMessage(null);
  };

  const hasUnsavedChanges = () => {
    if (!selected) return false;
    const original = templates.find(t => t.id === selected.id);
    if (!original) return false;
    return (
      original.name !== selected.name ||
      original.content !== selected.content ||
      original.language !== selected.language
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
      <aside className="w-72 flex-shrink-0 space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">
            Modèles de documents
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Configurez les modèles utilisés pour générer automatiquement vos documents
          </p>
        </div>

        <Card>
          <div className="space-y-1">
            {templates.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                <p className="text-xs text-neutral-500">
                  Aucun template disponible
                </p>
              </div>
            ) : (
              templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleSelect(template)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    selected?.id === template.id
                      ? 'bg-brand-50 text-brand-700 font-medium'
                      : 'hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{template.name}</span>
                  </div>
                  <span className="text-[10px] uppercase text-neutral-400 font-semibold flex-shrink-0">
                    {template.language}
                  </span>
                </button>
              ))
            )}
          </div>
        </Card>

        <Card className="bg-brand-50 border-brand-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-brand-600" />
              <p className="text-xs font-semibold text-neutral-900">
                Variables disponibles
              </p>
            </div>
            <div className="text-[11px] text-neutral-700 space-y-1 font-mono">
              <p>{'{{project.name}}'}</p>
              <p>{'{{project.address}}'}</p>
              <p>{'{{lot.lotNumber}}'}</p>
              <p>{'{{lot.price}}'}</p>
              <p>{'{{buyer.firstName}}'}</p>
              <p>{'{{buyer.lastName}}'}</p>
              <p>{'{{buyer.email}}'}</p>
              <p>{'{{contract.totalAmount}}'}</p>
              <p>{'{{now}}'}</p>
            </div>
          </div>
        </Card>
      </aside>

      <main className="flex-1 space-y-4">
        {error && (
          <Card className="bg-red-50 border-red-200">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          </Card>
        )}

        {message && (
          <Card className="bg-green-50 border-green-200">
            <div className="flex items-center gap-3 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm">{message}</p>
            </div>
          </Card>
        )}

        {!selected ? (
          <Card>
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                Sélectionnez un template
              </h3>
              <p className="text-sm text-neutral-500">
                Choisissez un template dans la liste de gauche pour le modifier
              </p>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-neutral-700 block mb-1">
                    Nom du modèle
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    value={selected.name}
                    onChange={(e) =>
                      setSelected({ ...selected, name: e.target.value })
                    }
                  />
                </div>

                <div className="w-32">
                  <label className="text-xs font-medium text-neutral-700 block mb-1">
                    Langue
                  </label>
                  <select
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    value={selected.language}
                    onChange={(e) =>
                      setSelected({ ...selected, language: e.target.value })
                    }
                  >
                    <option value="FR">Français</option>
                    <option value="DE">Deutsch</option>
                    <option value="IT">Italiano</option>
                    <option value="EN">English</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-neutral-700 mb-1">
                    Code
                  </p>
                  <p className="text-sm text-neutral-900 font-mono bg-neutral-50 px-3 py-2 rounded-lg">
                    {selected.code}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-700 mb-1">
                    Portée
                  </p>
                  <p className="text-sm text-neutral-900 bg-neutral-50 px-3 py-2 rounded-lg">
                    {selected.scope}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-neutral-700">
                    Contenu du modèle
                  </label>
                  <p className="text-[11px] text-neutral-500">
                    {selected.content.length} caractères
                  </p>
                </div>
                <p className="text-[11px] text-neutral-500 mb-2">
                  Utilisez les variables comme{' '}
                  <code className="rounded bg-neutral-100 px-1 py-0.5">
                    {'{{project.name}}'}
                  </code>{' '}
                  pour insérer des données dynamiques
                </p>
                <textarea
                  className="w-full h-[28rem] rounded-lg border border-neutral-300 px-3 py-3 text-sm font-mono focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
                  value={selected.content}
                  onChange={(e) =>
                    setSelected({ ...selected, content: e.target.value })
                  }
                  spellCheck={false}
                />
              </div>

              <div className="flex items-center gap-3 pt-2 border-t">
                <Button
                  onClick={handleSave}
                  disabled={saving || !hasUnsavedChanges()}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>

                {hasUnsavedChanges() && (
                  <p className="text-xs text-amber-600">
                    Modifications non sauvegardées
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {selected && (
          <Card className="bg-neutral-50">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-neutral-900">
                Comment utiliser ce template ?
              </h3>
              <ol className="text-xs text-neutral-700 space-y-1 list-decimal list-inside">
                <li>Modifiez le contenu en utilisant les variables disponibles</li>
                <li>Sauvegardez vos modifications avec le bouton ci-dessus</li>
                <li>Générez un document via l'API POST /templates/generate</li>
                <li>Le système remplacera automatiquement les variables par les vraies données</li>
              </ol>
              <div className="mt-3 pt-3 border-t border-neutral-200">
                <p className="text-xs font-medium text-neutral-700 mb-2">
                  Exemple d'appel API:
                </p>
                <pre className="text-[11px] bg-neutral-800 text-neutral-100 p-3 rounded-lg overflow-x-auto">
{`POST /templates/generate
{
  "templateId": "${selected.id}",
  "projectId": "...",
  "lotId": "...",
  "buyerId": "..."
}`}
                </pre>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
