import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useThreads } from '../hooks/useThreads';
import { useMessages } from '../hooks/useMessages';
import { ThreadList } from '../components/messages/ThreadList';
import { MessageList } from '../components/messages/MessageList';
import { MessageInput } from '../components/messages/MessageInput';
import { Button } from '../components/ui/Button';
import { Plus, MessageSquare } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function ProjectMessages() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const threadId = searchParams.get('thread');

  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');

  const { threads, loading: threadsLoading, createThread } = useThreads(projectId!);
  const {
    messages,
    loading: messagesLoading,
    sendMessage,
    markAsRead,
  } = useMessages(threadId || undefined);

  const handleCreateThread = async () => {
    if (!newThreadTitle.trim()) return;

    try {
      const thread = await createThread({
        title: newThreadTitle,
        context_type: 'project',
      });

      setNewThreadTitle('');
      setShowNewThreadModal(false);
      setSearchParams({ thread: thread.id });
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  const handleSendMessage = async (content: string, files?: File[]) => {
    if (!threadId) return;

    await sendMessage(content, files);
    await markAsRead();
  };

  return (
    <div className="h-[calc(100vh-64px)] flex">
      <div className="w-80 border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-y-auto">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Conversations</h2>
            <Button
              size="sm"
              onClick={() => setShowNewThreadModal(true)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          {threadsLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ThreadList threads={threads} currentThreadId={threadId || undefined} />
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-neutral-50 dark:bg-neutral-950">
        {threadId ? (
          <>
            <div className="flex-1 overflow-hidden">
              <MessageList
                messages={messages}
                loading={messagesLoading}
              />
            </div>

            <MessageInput
              onSend={handleSendMessage}
              placeholder="Écrire un message..."
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Sélectionnez une conversation
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Choisissez une conversation existante ou créez-en une nouvelle
              </p>
              <Button onClick={() => setShowNewThreadModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle conversation
              </Button>
            </div>
          </div>
        )}
      </div>

      {showNewThreadModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowNewThreadModal(false)}
        >
          <Card
            className="w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Nouvelle conversation</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  placeholder="Ex: Discussion avec l'architecte"
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateThread();
                    }
                  }}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewThreadModal(false);
                    setNewThreadTitle('');
                  }}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleCreateThread}
                  disabled={!newThreadTitle.trim()}
                  className="flex-1"
                >
                  Créer
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
