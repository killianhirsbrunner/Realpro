import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MessageSquare, Send } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useSubmissionClarifications } from '../hooks/useSubmissions';
import { supabase } from '../lib/supabase';
import { formatDate } from '../lib/utils/format';

export function SubmissionClarifications() {
  const { projectId, submissionId } = useParams<{ projectId: string; submissionId: string }>();
  const { clarifications, loading, error, refetch } = useSubmissionClarifications(submissionId);
  const [newQuestion, setNewQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSendQuestion() {
    if (!submissionId || !newQuestion.trim()) return;

    try {
      setSubmitting(true);
      const { error } = await supabase.from('submission_clarifications').insert({
        submission_id: submissionId,
        question: newQuestion.trim(),
        asked_by_role: 'promoter',
      });

      if (error) throw error;

      setNewQuestion('');
      await refetch();
    } catch (error) {
      console.error('Error sending question:', error);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des clarifications</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/submissions/${submissionId}`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour à la soumission
        </Link>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 shadow-lg">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Questions & Clarifications
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {clarifications.length} message{clarifications.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
          {clarifications.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 dark:text-neutral-400">Aucune clarification pour le moment</p>
            </div>
          ) : (
            clarifications.map((msg: any) => (
              <div
                key={msg.id}
                className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-neutral-900 dark:text-white">
                      {msg.asked_by_role === 'company' ? 'Entreprise' : 'Promoteur'}
                    </span>
                    {msg.company_name && (
                      <span className="text-xs text-neutral-500">• {msg.company_name}</span>
                    )}
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatDate(msg.created_at)}
                  </span>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
                  <strong>Q:</strong> {msg.question}
                </p>
                {msg.answer && (
                  <div className="pl-4 border-l-2 border-brand-500">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      <strong>R:</strong> {msg.answer}
                    </p>
                    {msg.answered_at && (
                      <p className="text-xs text-neutral-500 mt-1">
                        Répondu le {formatDate(msg.answered_at)}
                      </p>
                    )}
                  </div>
                )}
                {!msg.answer && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">En attente de réponse</p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <h3 className="font-medium text-neutral-900 dark:text-white mb-3">
            Poser une nouvelle question
          </h3>
          <div className="space-y-3">
            <Textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Saisissez votre question ou demande de clarification..."
              rows={4}
            />
            <Button
              onClick={handleSendQuestion}
              disabled={!newQuestion.trim() || submitting}
            >
              <Send className="h-4 w-4 mr-2" />
              {submitting ? 'Envoi...' : 'Envoyer la question'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
