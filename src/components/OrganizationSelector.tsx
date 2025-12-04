import { useState, useRef, useEffect } from 'react';
import { useOrganizationContext } from '../contexts/OrganizationContext';
import { Building2, Check, ChevronDown } from 'lucide-react';

export function OrganizationSelector() {
  const { currentOrganization, organizations, setCurrentOrganization } = useOrganizationContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentOrganization || organizations.length === 0) {
    return null;
  }

  if (organizations.length === 1) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
        {currentOrganization.logo_url ? (
          <img
            src={currentOrganization.logo_url}
            alt={currentOrganization.name}
            className="w-8 h-8 rounded-lg object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
            {currentOrganization.name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors w-full"
      >
        {currentOrganization.logo_url ? (
          <img
            src={currentOrganization.logo_url}
            alt={currentOrganization.name}
            className="w-8 h-8 rounded-lg object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
        )}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
            {currentOrganization.name}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {organizations.length} organisations
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl z-50 overflow-hidden">
          <div className="p-2">
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => {
                  setCurrentOrganization(org);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 w-full transition-colors"
              >
                {org.logo_url ? (
                  <img
                    src={org.logo_url}
                    alt={org.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {org.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {org.slug}
                  </p>
                </div>
                {org.id === currentOrganization.id && (
                  <Check className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
