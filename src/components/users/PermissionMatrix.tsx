import { useState } from 'react';
import { UserPermission } from '../../hooks/useUsers';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Check, X, Shield, Eye, Edit } from 'lucide-react';

interface PermissionMatrixProps {
  permissions: UserPermission[];
  onGrant: (module: string, level: 'read' | 'write' | 'admin') => void;
  onRevoke: (permissionId: string) => void;
}

const MODULES = [
  { id: 'projects', name: 'Projets' },
  { id: 'lots', name: 'Lots' },
  { id: 'buyers', name: 'Acheteurs' },
  { id: 'documents', name: 'Documents' },
  { id: 'finances', name: 'Finances' },
  { id: 'cfc', name: 'CFC & Budget' },
  { id: 'submissions', name: 'Soumissions' },
  { id: 'planning', name: 'Planning' },
  { id: 'materials', name: 'Matériaux' },
  { id: 'sav', name: 'SAV' },
  { id: 'reporting', name: 'Reporting' },
  { id: 'messages', name: 'Messages' },
];

const PERMISSION_LEVELS = [
  { id: 'read', name: 'Lecture', icon: Eye, color: 'text-blue-600' },
  { id: 'write', name: 'Écriture', icon: Edit, color: 'text-orange-600' },
  { id: 'admin', name: 'Admin', icon: Shield, color: 'text-red-600' },
];

export function PermissionMatrix({ permissions, onGrant, onRevoke }: PermissionMatrixProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'read' | 'write' | 'admin' | null>(null);

  const getPermissionForModule = (moduleId: string) => {
    return permissions.find((p) => p.module === moduleId && !p.project_id);
  };

  const hasPermission = (moduleId: string, level: 'read' | 'write' | 'admin') => {
    const perm = getPermissionForModule(moduleId);
    if (!perm) return false;

    if (level === 'read') return ['read', 'write', 'admin'].includes(perm.permission_level);
    if (level === 'write') return ['write', 'admin'].includes(perm.permission_level);
    if (level === 'admin') return perm.permission_level === 'admin';

    return false;
  };

  const handleTogglePermission = async (moduleId: string, level: 'read' | 'write' | 'admin') => {
    const perm = getPermissionForModule(moduleId);

    if (perm && perm.permission_level === level) {
      await onRevoke(perm.id);
    } else {
      await onGrant(moduleId, level);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Matrice de permissions
        </h3>
        <div className="flex items-center gap-4">
          {PERMISSION_LEVELS.map((level) => {
            const Icon = level.icon;
            return (
              <div key={level.id} className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${level.color}`} />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {level.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-800">
              <th className="text-left py-3 px-4 text-sm font-medium text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-700">
                Module
              </th>
              {PERMISSION_LEVELS.map((level) => {
                const Icon = level.icon;
                return (
                  <th
                    key={level.id}
                    className="text-center py-3 px-4 border-b border-l border-neutral-200 dark:border-neutral-700"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Icon className={`w-4 h-4 ${level.color}`} />
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {level.name}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {MODULES.map((module, index) => (
              <tr
                key={module.id}
                className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/50 ${
                  index !== MODULES.length - 1 ? 'border-b border-neutral-200 dark:border-neutral-700' : ''
                }`}
              >
                <td className="py-3 px-4 text-sm font-medium text-neutral-900 dark:text-white">
                  {module.name}
                </td>
                {PERMISSION_LEVELS.map((level) => {
                  const hasLevel = hasPermission(module.id, level.id as any);
                  const perm = getPermissionForModule(module.id);
                  const isCurrentLevel = perm?.permission_level === level.id;

                  return (
                    <td
                      key={level.id}
                      className="text-center py-3 px-4 border-l border-neutral-200 dark:border-neutral-700"
                    >
                      <button
                        onClick={() => handleTogglePermission(module.id, level.id as any)}
                        className={`p-2 rounded-lg transition ${
                          isCurrentLevel
                            ? 'bg-blue-100 dark:bg-blue-900/20'
                            : hasLevel
                            ? 'bg-neutral-100 dark:bg-neutral-800'
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                        }`}
                      >
                        {hasLevel ? (
                          <Check
                            className={`w-5 h-5 ${
                              isCurrentLevel ? 'text-blue-600' : 'text-neutral-400'
                            }`}
                          />
                        ) : (
                          <X className="w-5 h-5 text-neutral-300 dark:text-neutral-600" />
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Note:</strong> Les permissions en cascade s'appliquent automatiquement.
          Par exemple, la permission "Admin" inclut automatiquement "Écriture" et "Lecture".
        </p>
      </div>
    </div>
  );
}
