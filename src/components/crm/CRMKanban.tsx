import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Clock,
  FileCheck,
  CheckCircle2,
  Phone,
  Mail,
  Home,
  MoreVertical
} from 'lucide-react';

interface CRMContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  lotNumber?: string;
  lotId?: string;
  status: string;
  daysInStage?: number;
  lastContact?: string;
}

interface PipelineData {
  prospect: CRMContact[];
  reserved: CRMContact[];
  in_progress: CRMContact[];
  signed: CRMContact[];
}

interface CRMKanbanProps {
  pipeline: PipelineData;
  projectId: string;
}

export default function CRMKanban({ pipeline, projectId }: CRMKanbanProps) {
  const columns = [
    {
      key: 'prospect' as keyof PipelineData,
      title: 'Prospects',
      icon: User,
      color: 'bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800',
      badgeColor: 'bg-gradient-to-r from-neutral-600 to-neutral-700',
      borderColor: 'border-neutral-200 dark:border-neutral-700'
    },
    {
      key: 'reserved' as keyof PipelineData,
      title: 'Réservé',
      icon: Clock,
      color: 'bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-900/20 dark:to-brand-800/20',
      badgeColor: 'bg-gradient-to-r from-brand-600 to-brand-700',
      borderColor: 'border-brand-200 dark:border-brand-800'
    },
    {
      key: 'in_progress' as keyof PipelineData,
      title: 'Vente en cours',
      icon: FileCheck,
      color: 'bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/20',
      badgeColor: 'bg-gradient-to-r from-orange-600 to-orange-700',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    {
      key: 'signed' as keyof PipelineData,
      title: 'Acte signé',
      icon: CheckCircle2,
      color: 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20',
      badgeColor: 'bg-gradient-to-r from-green-600 to-green-700',
      borderColor: 'border-green-200 dark:border-green-800'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((col) => {
        const Icon = col.icon;
        const items = pipeline[col.key] || [];

        return (
          <div key={col.key} className="flex flex-col">
            {/* Column Header */}
            <div className={`p-4 rounded-t-xl ${col.color} border-b-2 ${col.borderColor}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${col.badgeColor.replace('bg-gradient-to-r', 'bg-gradient-to-br')} shadow-sm`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">
                    {col.title}
                  </h3>
                </div>
                <span className={`${col.badgeColor} text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-md`}>
                  {items.length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className={`flex-1 p-4 ${col.color} rounded-b-xl space-y-3 min-h-[500px] border-l border-r border-b ${col.borderColor}`}>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Aucun contact
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <Link
                    key={item.id}
                    to={`/projects/${projectId}/crm/${col.key === 'prospect' ? 'prospects' : 'buyers'}/${item.id}`}
                    className="block"
                  >
                    <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-lg hover:border-brand-500 dark:hover:border-brand-600 transition-all cursor-pointer group">
                      {/* Contact Name */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-neutral-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {item.name}
                          </h4>
                          {item.lotNumber && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <div className="p-1 rounded bg-brand-100 dark:bg-brand-900/30">
                                <Home className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                              </div>
                              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                Lot {item.lotNumber}
                              </p>
                            </div>
                          )}
                        </div>
                        <button className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                          <MoreVertical className="w-4 h-4 text-neutral-500" />
                        </button>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                          <Mail className="w-3.5 h-3.5 flex-shrink-0 text-neutral-500" />
                          <span className="truncate">{item.email}</span>
                        </div>
                        {item.phone && (
                          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                            <Phone className="w-3.5 h-3.5 flex-shrink-0 text-neutral-500" />
                            <span>{item.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Footer Info */}
                      {item.daysInStage && (
                        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-700">
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {item.daysInStage} {item.daysInStage === 1 ? 'jour' : 'jours'} dans cette étape
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
