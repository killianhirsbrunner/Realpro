import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Bell,
  Activity,
  Users,
  Mail,
  Phone,
  Calendar,
  ArrowRight,
  Send,
  UserPlus
} from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useMessages } from '../hooks/useMessages';
import { useProjectActivity } from '../hooks/useProjectActivity';

export function ProjectCommunicationPage() {
  const { projectId } = useParams();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'messages' | 'activity' | 'notifications'>('messages');

  const { threads, loading: messagesLoading } = useMessages(projectId || '');
  const { activities, loading: activitiesLoading } = useProjectActivity(projectId || '');

  const notifications = [
    {
      id: '1',
      type: 'mention',
      message: 'Marc Durant vous a mentionné dans un message',
      time: '5 min',
      unread: true
    },
    {
      id: '2',
      type: 'update',
      message: 'Le lot B.03 a été mis à jour',
      time: '1h',
      unread: true
    },
    {
      id: '3',
      type: 'deadline',
      message: 'Échéance: Signature acte notarié demain',
      time: '2h',
      unread: false
    }
  ];

  const stats = {
    totalMessages: threads?.length || 0,
    unreadMessages: threads?.filter(t => t.unread_count > 0).length || 0,
    activeConversations: threads?.filter(t => t.last_message_at &&
      new Date(t.last_message_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length || 0,
    teamMembers: 12
  };

  const tabs = [
    { id: 'messages', label: 'Messages', icon: MessageSquare, count: stats.unreadMessages },
    { id: 'activity', label: 'Activité', icon: Activity, count: 0 },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: 2 }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            Communication
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Messages, activités et notifications du projet
          </p>
        </div>

        <div className="flex gap-3">
          <Link to={`/projects/${projectId}/messages`}>
            <Button className="gap-2">
              <Send className="w-4 h-4" />
              Nouveau message
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Messages</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.totalMessages}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Non lus</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.unreadMessages}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Mail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Conversations</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.activeConversations}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Participants</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.teamMembers}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  isActive
                    ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
                {tab.count > 0 && (
                  <Badge variant="error" className="ml-2">
                    {tab.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'messages' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Messages Récents
              </h2>
              <Link to={`/projects/${projectId}/messages`}>
                <Button variant="outline" size="sm" className="gap-2">
                  Voir tous les messages
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {messagesLoading ? (
              <div className="text-center py-8 text-neutral-500">Chargement...</div>
            ) : threads && threads.length > 0 ? (
              <div className="space-y-4">
                {threads.slice(0, 5).map((thread) => (
                  <Link
                    key={thread.id}
                    to={`/projects/${projectId}/messages?thread=${thread.id}`}
                    className="block border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-neutral-900 dark:text-white">
                        {thread.title}
                      </h3>
                      {thread.unread_count > 0 && (
                        <Badge variant="error">{thread.unread_count}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {thread.last_message_content || 'Aucun message'}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
                      <span>{thread.participants?.length || 0} participants</span>
                      <span>•</span>
                      <span>
                        {thread.last_message_at
                          ? new Date(thread.last_message_at).toLocaleString('fr-CH')
                          : 'Jamais'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucun message pour le moment</p>
                <Link to={`/projects/${projectId}/messages`}>
                  <Button variant="outline" size="sm" className="mt-4 gap-2">
                    <Send className="w-4 h-4" />
                    Envoyer un message
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        )}

        {activeTab === 'activity' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Activité Récente
              </h2>
              <Link to={`/projects/${projectId}/activity`}>
                <Button variant="outline" size="sm" className="gap-2">
                  Voir toute l'activité
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {activitiesLoading ? (
              <div className="text-center py-8 text-neutral-500">Chargement...</div>
            ) : activities && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.slice(0, 10).map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700 last:border-0"
                  >
                    <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-lg">
                      <Activity className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-900 dark:text-white">
                        <span className="font-medium">{activity.user_name}</span>
                        {' '}
                        {activity.action_type}
                      </p>
                      {activity.metadata && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          {JSON.stringify(activity.metadata)}
                        </p>
                      )}
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(activity.created_at).toLocaleString('fr-CH')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucune activité récente</p>
              </div>
            )}
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Notifications
              </h2>
              <Button variant="ghost" size="sm">
                Marquer tout comme lu
              </Button>
            </div>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    notif.unread
                      ? 'bg-brand-50 dark:bg-brand-950/20 border-brand-200 dark:border-brand-800'
                      : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    notif.type === 'mention' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    notif.type === 'update' ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-orange-100 dark:bg-orange-900/30'
                  }`}>
                    {notif.type === 'mention' && <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    {notif.type === 'update' && <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />}
                    {notif.type === 'deadline' && <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${
                      notif.unread
                        ? 'text-neutral-900 dark:text-white font-medium'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">Il y a {notif.time}</p>
                  </div>
                  {notif.unread && (
                    <div className="w-2 h-2 bg-brand-600 rounded-full mt-2" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to={`/projects/${projectId}/messages`}>
          <Card className="p-6 hover:border-brand-300 dark:hover:border-brand-700 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  Centre de Messages
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Conversations et fils de discussion
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to={`/projects/${projectId}/team`}>
          <Card className="p-6 hover:border-brand-300 dark:hover:border-brand-700 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  Équipe Projet
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Gérer les participants
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/notifications">
          <Card className="p-6 hover:border-brand-300 dark:hover:border-brand-700 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <Bell className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  Notifications
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Paramètres et préférences
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
