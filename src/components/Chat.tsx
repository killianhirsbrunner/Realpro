import { useState, useEffect, useRef } from 'react';
import { Send, Languages, User } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Card } from './ui/Card';
import { LoadingState } from './ui/LoadingSpinner';

interface ChatProps {
  threadId: string;
}

export function Chat({ threadId }: ChatProps) {
  const { user } = useCurrentUser();
  const { thread, messages, loading, sendMessage, translateMessage } = useChat(threadId);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [translating, setTranslating] = useState<{ [key: string]: boolean }>({});
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleSend() {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  }

  async function handleTranslate(messageId: string, text: string, fromLang: string) {
    setTranslating(prev => ({ ...prev, [messageId]: true }));
    try {
      const userLang = user?.preferred_language || 'fr-CH';
      const translated = await translateMessage(text, fromLang, userLang);
      if (translated) {
        setTranslations(prev => ({ ...prev, [messageId]: translated }));
      }
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setTranslating(prev => ({ ...prev, [messageId]: false }));
    }
  }

  if (loading) return <LoadingState message="Chargement de la conversation..." />;

  return (
    <Card className="flex flex-col h-[600px]">
      <Card.Header>
        <Card.Title>{thread?.title || 'Conversation'}</Card.Title>
        <Card.Description>
          {thread?.context_type && `Contexte: ${thread.context_type}`}
        </Card.Description>
      </Card.Header>

      <Card.Content className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p>Aucun message pour le moment</p>
            <p className="text-sm mt-2">Démarrez la conversation ci-dessous</p>
          </div>
        ) : (
          messages.map(message => {
            const isOwn = message.author_id === user?.id;
            const showTranslation = translations[message.id];

            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} space-y-1`}>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span>{message.author?.email || 'Unknown'}</span>
                    {message.body_lang && (
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {message.body_lang.split('-')[0].toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      isOwn
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.body}</p>

                    {showTranslation && (
                      <div className="mt-2 pt-2 border-t border-white/20">
                        <p className="text-xs opacity-75 mb-1">Traduction:</p>
                        <p className="text-sm">{showTranslation}</p>
                      </div>
                    )}
                  </div>

                  {!isOwn && message.body_lang !== (user?.preferred_language || 'fr-CH') && (
                    <button
                      onClick={() => handleTranslate(message.id, message.body, message.body_lang)}
                      disabled={translating[message.id]}
                      className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 disabled:opacity-50"
                    >
                      <Languages className="h-3 w-3" />
                      {translating[message.id] ? 'Traduction...' : 'Traduire'}
                    </button>
                  )}

                  <p className="text-xs text-gray-400">
                    {new Date(message.created_at).toLocaleTimeString('fr-CH', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Card.Content>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Tapez votre message... (Entrée pour envoyer)"
            className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[44px] max-h-[120px]"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <span className="text-sm">...</span>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </Card>
  );
}
