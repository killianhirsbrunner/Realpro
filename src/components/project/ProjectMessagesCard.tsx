import { MessageSquare, Send, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatRelativeTime } from '../../lib/utils/format';

interface Message {
  id: string;
  content: string;
  author_name: string;
  author_role?: string;
  created_at: string;
  is_unread?: boolean;
  priority?: 'high' | 'normal' | 'low';
}

interface ProjectMessagesCardProps {
  projectId: string;
  messages: Message[];
  unreadCount?: number;
}

export function ProjectMessagesCard({ projectId, messages, unreadCount = 0 }: ProjectMessagesCardProps) {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 border-red-200';
      case 'normal':
        return 'bg-blue-50 border-blue-100';
      case 'low':
        return 'bg-gray-50 border-gray-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-600" />
            <Card.Title>Messages récents</Card.Title>
          </div>
          {unreadCount > 0 && (
            <Badge variant="danger" size="sm">
              {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </Card.Header>

      <Card.Content className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-4">Aucun message récent</p>
            <Link to={`/projects/${projectId}/communication`}>
              <Button size="sm" variant="outline">
                Voir les conversations
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {messages.slice(0, 5).map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border transition-all ${
                    message.is_unread
                      ? 'bg-blue-50 border-blue-200 shadow-sm'
                      : getPriorityColor(message.priority)
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                        {message.author_name.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">
                          {message.author_name}
                        </p>
                        {message.author_role && (
                          <Badge variant="default" size="sm">
                            {message.author_role}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(message.created_at)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 line-clamp-2">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <Link to={`/projects/${projectId}/communication`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Toutes les conversations
                </Button>
              </Link>
              <Link to={`/projects/${projectId}/communication/new`}>
                <Button className="gap-2">
                  <Send className="h-4 w-4" />
                  Nouveau message
                </Button>
              </Link>
            </div>
          </>
        )}
      </Card.Content>
    </Card>
  );
}
