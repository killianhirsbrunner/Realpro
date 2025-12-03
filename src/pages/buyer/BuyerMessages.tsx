import { useEffect, useState, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { LoadingState } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { supabase } from '../../lib/supabase';
import { formatDateTimeCH } from '../../lib/utils/format';

interface BuyerMessage {
  id: string;
  author_type: 'BUYER' | 'PROMOTER' | 'OTHER';
  author_name: string;
  body: string;
  created_at: string;
}

interface BuyerMessagesData {
  buyer: {
    id: string;
    first_name: string;
    last_name: string;
  };
  messages: BuyerMessage[];
}

export function BuyerMessages() {
  const { buyerId } = useParams<{ buyerId: string }>();
  const [data, setData] = useState<BuyerMessagesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (buyerId) {
      fetchMessages(buyerId);
    }
  }, [buyerId]);

  async function fetchMessages(id: string) {
    try {
      setLoading(true);
      setError(null);

      // Fetch buyer info
      const { data: buyer, error: buyerError } = await supabase
        .from('buyers')
        .select('id, first_name, last_name')
        .eq('id', id)
        .single();

      if (buyerError) throw buyerError;

      // Fetch messages
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('id, author_type, author_name, body, created_at')
        .eq('buyer_id', id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      setData({
        buyer: {
          id: buyer.id,
          first_name: buyer.first_name,
          last_name: buyer.last_name,
        },
        messages: messages || [],
      });
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!body.trim() || !data) return;

    setSending(true);
    setError(null);

    try {
      // Insert new message
      const { data: newMessage, error: messageError } = await supabase
        .from('messages')
        .insert({
          buyer_id: buyerId,
          author_type: 'BUYER',
          author_name: `${data.buyer.first_name} ${data.buyer.last_name}`,
          body: body.trim(),
        })
        .select()
        .single();

      if (messageError) throw messageError;

      // Add to local state
      setData({
        ...data,
        messages: [...data.messages, newMessage],
      });

      setBody('');
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Impossible d\'envoyer votre message pour le moment.');
    } finally {
      setSending(false);
    }
  }

  if (loading) return <LoadingState message="Chargement..." />;
  if (error && !data) return <ErrorState message={error} retry={() => fetchMessages(buyerId!)} />;
  if (!data) return <ErrorState message="Aucune donnée disponible" />;

  const { buyer, messages } = data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500">
          Échanges entre vous et l'équipe en charge du projet, {buyer.first_name}{' '}
          {buyer.last_name}.
        </p>
      </header>

      {/* Messages List */}
      <section className="space-y-3">
        <div className="rounded-2xl border bg-white px-4 py-3 h-72 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucun message pour l'instant. Posez votre première question
              ci-dessous.
            </p>
          ) : (
            <ul className="space-y-3 text-sm">
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  className={`flex ${
                    msg.author_type === 'BUYER' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                      msg.author_type === 'BUYER'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-xs opacity-80 mb-0.5">
                      {msg.author_type === 'BUYER' ? 'Vous' : msg.author_name}
                    </p>
                    <p>{msg.body}</p>
                    <p className="mt-1 text-[10px] opacity-80">
                      {formatDateTimeCH(msg.created_at)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </section>

      {/* Send Form */}
      <section>
        <form
          onSubmit={handleSubmit}
          className="space-y-2 rounded-2xl border bg-white px-4 py-3"
        >
          <label className="text-sm font-medium text-gray-900">
            Écrire un message
          </label>
          <textarea
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Posez votre question ou laissez un message à l'équipe…"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending || !body.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {sending ? (
                'Envoi…'
              ) : (
                <>
                  <Send className="h-3 w-3" />
                  Envoyer
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
