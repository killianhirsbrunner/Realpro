import { FileText, File, Image, FileSpreadsheet, Upload, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatRelativeTime } from '../../lib/utils/format';

interface Document {
  id: string;
  name: string;
  type: string;
  size?: number;
  uploaded_at: string;
  uploaded_by?: string;
  category?: string;
}

interface ProjectDocumentsCardProps {
  projectId: string;
  documents: Document[];
  totalCount?: number;
}

export function ProjectDocumentsCard({ projectId, documents, totalCount }: ProjectDocumentsCardProps) {
  const getDocumentIcon = (type: string) => {
    if (type.includes('image')) return Image;
    if (type.includes('spreadsheet') || type.includes('excel')) return FileSpreadsheet;
    if (type.includes('pdf')) return FileText;
    return File;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <Card.Title>Documents récents</Card.Title>
          </div>
          {totalCount && totalCount > 0 && (
            <span className="text-sm text-gray-500">
              {totalCount} document{totalCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </Card.Header>

      <Card.Content className="space-y-4">
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-4">Aucun document récent</p>
            <Link to={`/projects/${projectId}/documents`}>
              <Button size="sm" variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Uploader un document
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {documents.slice(0, 6).map((doc) => {
                const Icon = getDocumentIcon(doc.type);

                return (
                  <Link
                    key={doc.id}
                    to={`/projects/${projectId}/documents/${doc.id}`}
                  >
                    <div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Icon className="h-4 w-4 text-blue-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {doc.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <Clock className="h-3 w-3" />
                          <span>{formatRelativeTime(doc.uploaded_at)}</span>
                          {doc.size && (
                            <>
                              <span>•</span>
                              <span>{formatFileSize(doc.size)}</span>
                            </>
                          )}
                          {doc.uploaded_by && (
                            <>
                              <span>•</span>
                              <span>{doc.uploaded_by}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <Link to={`/projects/${projectId}/documents`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Tous les documents
                </Button>
              </Link>
              <Link to={`/projects/${projectId}/documents/upload`}>
                <Button className="gap-2">
                  <Upload className="h-4 w-4" />
                  Uploader
                </Button>
              </Link>
            </div>
          </>
        )}
      </Card.Content>
    </Card>
  );
}
