import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSignatures } from '../hooks/useSignatures';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { FileSignature, ExternalLink } from 'lucide-react';

interface DocumentSignatureProps {
  documentId: string;
}

export function DocumentSignature({ documentId }: DocumentSignatureProps) {
  const { t } = useTranslation();
  const { signatures, loading, initSignature } = useSignatures(documentId);
  const [showForm, setShowForm] = useState(false);
  const [signerEmail, setSignerEmail] = useState('');
  const [signerName, setSignerName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleInit = async () => {
    if (!signerEmail) return;

    setSubmitting(true);
    try {
      const result = await initSignature('CONTRACT', signerEmail, signerName);
      if (result.signingUrl) {
        window.open(result.signingUrl, '_blank');
      }
      setShowForm(false);
      setSignerEmail('');
      setSignerName('');
    } catch (error) {
      console.error('Failed to init signature:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SIGNED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300';
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileSignature className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            <h3 className="font-medium text-neutral-900 dark:text-neutral-50">
              {t('signature.title')}
            </h3>
          </div>
          {!showForm && (
            <Button size="sm" onClick={() => setShowForm(true)}>
              {t('signature.request')}
            </Button>
          )}
        </div>

        {showForm && (
          <div className="space-y-3 rounded-lg border border-brand-200 bg-brand-50 p-3 dark:border-brand-800 dark:bg-brand-900/20">
            <Input
              placeholder={t('signature.signerEmail')}
              type="email"
              value={signerEmail}
              onChange={(e) => setSignerEmail(e.target.value)}
            />
            <Input
              placeholder={t('signature.signerName')}
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleInit}
                disabled={!signerEmail || submitting}
                className="flex-1"
              >
                {submitting ? t('common.loading') : t('signature.send')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t('common.loading')}
          </p>
        ) : signatures.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t('signature.noRequests')}
          </p>
        ) : (
          <div className="space-y-2">
            {signatures.map((sig) => (
              <div
                key={sig.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-700"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                    {sig.signer_email}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {new Date(sig.created_at).toLocaleDateString('fr-CH')}
                  </p>
                </div>
                <Badge className={getStatusColor(sig.status)}>
                  {t(`signature.status.${sig.status.toLowerCase()}`)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
