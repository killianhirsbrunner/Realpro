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
      color: 'bg-gray-100 dark:bg-gray-800',
      badgeColor: 'bg-gray-600'
    },
    {
      key: 'reserved' as keyof PipelineData,
      title: 'Réservé',
      icon: Clock,
      color: 'bg-yellow-50 dark:bg-yellow-950',
      badgeColor: 'bg-yellow-600'
    },
    {
      key: 'in_progress' as keyof PipelineData,
      title: 'Vente en cours',
      icon: FileCheck,
      color: 'bg-blue-50 dark:bg-blue-950',
      badgeColor: 'bg-blue-600'
    },
    {
      key: 'signed' as keyof PipelineData,
      title: 'Acte signé',
      icon: CheckCircle2,
      color: 'bg-green-50 dark:bg-green-950',
      badgeColor: 'bg-green-600'
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
            <div className={`p-4 rounded-t-xl ${col.color} border-b-2 border-gray-200 dark:border-gray-700`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {col.title}
                  </h3>
                </div>
                <span className={`${col.badgeColor} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                  {items.length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className={`flex-1 p-4 ${col.color} rounded-b-xl space-y-3 min-h-[400px]`}>
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
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                      {/* Contact Name */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {item.name}
                          </h4>
                          {item.lotNumber && (
                            <div className="flex items-center gap-1 mt-1">
                              <Home className="w-3 h-3 text-gray-500" />
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Lot {item.lotNumber}
                              </p>
                            </div>
                          )}
                        </div>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{item.email}</span>
                        </div>
                        {item.phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            <span>{item.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Footer Info */}
                      {item.daysInStage && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.daysInStage} jours dans cette étape
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
