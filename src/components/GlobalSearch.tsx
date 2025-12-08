import { useState, useEffect, useRef } from 'react';
import { Search, Building2, Users, FileText, Briefcase, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useOrganization } from '../contexts/OrganizationContext';

interface SearchResult {
  id: string;
  type: 'project' | 'lot' | 'contact' | 'company' | 'document';
  title: string;
  subtitle?: string;
  path: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { currentOrganization } = useOrganization();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, results, selectedIndex]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const debounce = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, currentOrganization?.id]);

  const performSearch = async (searchQuery: string) => {
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const searchResults: SearchResult[] = [];

      const [projects, lots, contacts, companies, documents] = await Promise.all([
        supabase
          .from('projects')
          .select('id, name, code')
          .eq('organization_id', currentOrganization.id)
          .or(`name.ilike.%${searchQuery}%,code.ilike.%${searchQuery}%`)
          .limit(5),
        supabase
          .from('lots')
          .select('id, code, project_id')
          .or(`code.ilike.%${searchQuery}%`)
          .limit(5),
        supabase
          .from('contacts')
          .select('id, first_name, last_name, email, company_id')
          .eq('organization_id', currentOrganization.id)
          .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
          .limit(5),
        supabase
          .from('companies')
          .select('id, name, email')
          .eq('organization_id', currentOrganization.id)
          .or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
          .limit(5),
        supabase
          .from('documents')
          .select('id, name, project_id')
          .eq('is_folder', false)
          .ilike('name', `%${searchQuery}%`)
          .limit(5),
      ]);

      if (projects.data) {
        projects.data.forEach((p) => {
          searchResults.push({
            id: p.id,
            type: 'project',
            title: p.name,
            subtitle: p.code,
            path: `/projects/${p.id}`,
          });
        });
      }

      if (lots.data) {
        lots.data.forEach((l) => {
          searchResults.push({
            id: l.id,
            type: 'lot',
            title: `Lot ${l.code}`,
            subtitle: 'Lot',
            path: `/projects/${l.project_id}/lots/${l.id}`,
          });
        });
      }

      if (contacts.data) {
        contacts.data.forEach((c) => {
          searchResults.push({
            id: c.id,
            type: 'contact',
            title: `${c.first_name} ${c.last_name}`,
            subtitle: c.email,
            path: `/contacts/${c.id}`,
          });
        });
      }

      if (companies.data) {
        companies.data.forEach((c) => {
          searchResults.push({
            id: c.id,
            type: 'company',
            title: c.name,
            subtitle: c.email,
            path: `/companies/${c.id}`,
          });
        });
      }

      if (documents.data) {
        documents.data.forEach((d) => {
          searchResults.push({
            id: d.id,
            type: 'document',
            title: d.name,
            subtitle: 'Document',
            path: `/projects/${d.project_id}/documents`,
          });
        });
      }

      setResults(searchResults);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    navigate(result.path);
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Building2 className="w-5 h-5 text-blue-500" />;
      case 'lot':
        return <Building2 className="w-5 h-5 text-green-500" />;
      case 'contact':
        return <Users className="w-5 h-5 text-purple-500" />;
      case 'company':
        return <Briefcase className="w-5 h-5 text-orange-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-gray-500" />;
      default:
        return <Search className="w-5 h-5 text-gray-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl">
        <div className="flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 px-4 py-4 text-lg bg-transparent border-none outline-none"
            placeholder="Rechercher projets, lots, contacts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {query.trim().length >= 2 && (
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="p-8 text-center text-gray-500">
                Recherche en cours...
              </div>
            )}

            {!loading && results.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Aucun résultat trouvé
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelect(result)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      index === selectedIndex
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {getIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {result.title}
                      </div>
                      {result.subtitle && (
                        <div className="text-sm text-gray-500 truncate">
                          {result.subtitle}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {result.type}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {query.trim().length < 2 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            <div className="mb-2">Tapez au moins 2 caractères pour rechercher</div>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">↑</kbd>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">↓</kbd>
              <span>pour naviguer</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Enter</kbd>
              <span>pour sélectionner</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
