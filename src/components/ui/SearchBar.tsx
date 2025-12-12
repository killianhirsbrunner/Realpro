import { useState, useEffect, useRef } from 'react';
import { Search, X, Home, User, Building2, FileText, Briefcase } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatCHF } from '../../lib/utils/format';

interface SearchResult {
  type: 'project' | 'lot' | 'buyer' | 'company' | 'contract';
  id: string;
  title: string;
  subtitle: string;
  url: string;
}

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = 'Rechercher un projet, lot, acheteur, entreprise...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 2) {
        performSearch(query);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  async function performSearch(searchQuery: string) {
    setLoading(true);
    const results: SearchResult[] = [];

    try {
      const lowerQuery = searchQuery.toLowerCase();

      // Search projects
      const { data: projects } = await supabase
        .from('projects')
        .select('id, name, city')
        .or(`name.ilike.%${lowerQuery}%,city.ilike.%${lowerQuery}%`)
        .limit(3);

      if (projects) {
        projects.forEach(p => {
          results.push({
            type: 'project',
            id: p.id,
            title: p.name,
            subtitle: p.city || '',
            url: `/projects/${p.id}`,
          });
        });
      }

      // Search lots by number
      const { data: lots } = await supabase
        .from('lots')
        .select('id, lot_number, projects(name), price_total')
        .ilike('lot_number', `%${lowerQuery}%`)
        .limit(3);

      if (lots) {
        lots.forEach(l => {
          results.push({
            type: 'lot',
            id: l.id,
            title: `Lot ${l.lot_number}`,
            subtitle: `${l.projects?.name || ''} • ${formatCHF(l.price_total)}`,
            url: `/lots/${l.id}`,
          });
        });
      }

      // Search buyers
      const { data: buyers } = await supabase
        .from('buyers')
        .select('id, first_name, last_name, email, projects(name)')
        .or(`first_name.ilike.%${lowerQuery}%,last_name.ilike.%${lowerQuery}%,email.ilike.%${lowerQuery}%`)
        .limit(3);

      if (buyers) {
        buyers.forEach(b => {
          results.push({
            type: 'buyer',
            id: b.id,
            title: `${b.first_name} ${b.last_name}`,
            subtitle: `${b.email} • ${b.projects?.name || ''}`,
            url: `/buyers/${b.id}`,
          });
        });
      }

      // Search companies
      const { data: companies } = await supabase
        .from('companies')
        .select('id, name, type')
        .ilike('name', `%${lowerQuery}%`)
        .limit(3);

      if (companies) {
        companies.forEach(c => {
          results.push({
            type: 'company',
            id: c.id,
            title: c.name,
            subtitle: c.type || '',
            url: `/companies/${c.id}`,
          });
        });
      }

      // Search contracts by reference
      const { data: contracts } = await supabase
        .from('contracts')
        .select('id, reference, title, projects(name)')
        .or(`reference.ilike.%${lowerQuery}%,title.ilike.%${lowerQuery}%`)
        .limit(3);

      if (contracts) {
        contracts.forEach(c => {
          results.push({
            type: 'contract',
            id: c.id,
            title: c.reference || c.title,
            subtitle: c.projects?.name || '',
            url: `/contracts/${c.id}`,
          });
        });
      }

      setResults(results);
      setIsOpen(results.length > 0);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }

  function getIcon(type: string) {
    switch (type) {
      case 'project':
        return <Home className="h-4 w-4" />;
      case 'lot':
        return <Building2 className="h-4 w-4" />;
      case 'buyer':
        return <User className="h-4 w-4" />;
      case 'company':
        return <Briefcase className="h-4 w-4" />;
      case 'contract':
        return <FileText className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  }

  function getTypeLabel(type: string) {
    switch (type) {
      case 'project':
        return 'Projet';
      case 'lot':
        return 'Lot';
      case 'buyer':
        return 'Acheteur';
      case 'company':
        return 'Entreprise';
      case 'contract':
        return 'Contrat';
      default:
        return '';
    }
  }

  return (
    <div className="relative flex-1 max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          className="w-full h-10 pl-10 pr-10 py-2.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-realpro-turquoise/50 focus:border-realpro-turquoise"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 max-h-96 overflow-y-auto z-50"
        >
          {loading ? (
            <div className="p-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Recherche en cours...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <a
                  key={`${result.type}-${result.id}-${index}`}
                  href={result.url}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                  }}
                >
                  <div className="flex-shrink-0 p-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-300">
                    {getIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      {result.title}
                    </p>
                    {result.subtitle && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        {result.subtitle}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Aucun résultat trouvé
            </div>
          )}
        </div>
      )}
    </div>
  );
}
