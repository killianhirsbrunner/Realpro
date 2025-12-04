import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  MessageSquare,
  AlertTriangle,
  XCircle,
  Calendar,
  MapPin,
} from 'lucide-react';
import { useAfterSales, SavTicket, SavSeverity } from '@/hooks/useAfterSales';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';

interface BuyerAfterSalesProps {
  projectId: string;
  lotId: string;
  buyerId: string;
}

export default function BuyerAfterSales({
  projectId,
  lotId,
  buyerId,
}: BuyerAfterSalesProps) {
  const { t } = useTranslation();
  const { loading, listTickets, createTicket, getTicket } = useAfterSales();

  const [tickets, setTickets] = useState<SavTicket[]>([]);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SavTicket | null>(null);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    location: '',
    severity: 'MINOR' as SavSeverity,
  });

  const loadTickets = async () => {
    setLoadingTickets(true);
    const data = await listTickets({ projectId, lotId, buyerId });
    setTickets(data);
    setLoadingTickets(false);
  };

  useEffect(() => {
    loadTickets();
  }, [projectId, lotId, buyerId]);

  const handleCreateTicket = async () => {
    if (!newTicket.title || !newTicket.description) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const result = await createTicket({
      projectId,
      lotId,
      buyerId,
      title: newTicket.title,
      description: newTicket.description,
      location: newTicket.location || undefined,
      severity: newTicket.severity,
    });

    if (result) {
      setShowNewTicketForm(false);
      setNewTicket({
        title: '',
        description: '',
        location: '',
        severity: 'MINOR',
      });
      await loadTickets();
    }
  };

  const handleViewTicket = async (ticketId: string) => {
    const ticket = await getTicket(ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('fr-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (selectedTicket) {
    return (
      <TicketDetailView
        ticket={selectedTicket}
        onBack={() => setSelectedTicket(null)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-brand-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              Service Après-Vente
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Signalez un problème ou suivez vos demandes d'intervention
          </p>
        </div>
        <Button onClick={() => setShowNewTicketForm(!showNewTicketForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau ticket
        </Button>
      </header>

      {showNewTicketForm && (
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-50">
            Créer un nouveau ticket SAV
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Titre *
              </label>
              <Input
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                placeholder="Ex: Fuite d'eau dans la salle de bain"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Localisation
              </label>
              <Input
                value={newTicket.location}
                onChange={(e) => setNewTicket({ ...newTicket, location: e.target.value })}
                placeholder="Ex: Salle de bain principale"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sévérité
              </label>
              <Select
                value={newTicket.severity}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, severity: e.target.value as SavSeverity })
                }
              >
                <option value="MINOR">Mineur (cosmétique)</option>
                <option value="MAJOR">Majeur (fonctionnalité impactée)</option>
                <option value="CRITICAL">Critique (sécurité)</option>
                <option value="BLOCKING">Bloquant (inhabitable)</option>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description *
              </label>
              <Textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                placeholder="Décrivez le problème en détail..."
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateTicket} disabled={loading}>
                {loading ? 'Création...' : 'Créer le ticket'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowNewTicketForm(false);
                  setNewTicket({
                    title: '',
                    description: '',
                    location: '',
                    severity: 'MINOR',
                  });
                }}
              >
                Annuler
              </Button>
            </div>
          </div>
        </Card>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Mes tickets SAV
        </h2>

        {loadingTickets ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : tickets.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Vous n'avez aucun ticket SAV pour le moment
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Cliquez sur "Nouveau ticket" pour signaler un problème
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                        {ticket.title}
                      </h3>
                      <TicketStatusBadge status={ticket.status} />
                      <SeverityBadge severity={ticket.severity} />
                    </div>

                    {ticket.location && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {ticket.location}
                      </div>
                    )}

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {ticket.description.length > 150
                        ? `${ticket.description.substring(0, 150)}...`
                        : ticket.description}
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Créé le {formatDate(ticket.created_at)}
                      </span>
                      {ticket.assigned_company && (
                        <span>Assigné à: {ticket.assigned_company.name}</span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewTicket(ticket.id)}
                  >
                    Voir détails
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TicketDetailView({
  ticket,
  onBack,
}: {
  ticket: SavTicket;
  onBack: () => void;
}) {
  const formatDate = (iso?: string) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString('fr-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <Button variant="secondary" onClick={onBack} className="mb-4">
          ← Retour
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              {ticket.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Ticket #{ticket.id.substring(0, 8)}
            </p>
          </div>
          <div className="flex gap-2">
            <TicketStatusBadge status={ticket.status} />
            <SeverityBadge severity={ticket.severity} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-3 font-semibold text-gray-900 dark:text-gray-50">
            Informations
          </h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-gray-500">Localisation</dt>
              <dd className="font-medium text-gray-900 dark:text-gray-50">
                {ticket.location || '-'}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Créé le</dt>
              <dd className="font-medium text-gray-900 dark:text-gray-50">
                {formatDate(ticket.created_at)}
              </dd>
            </div>
            {ticket.assigned_company && (
              <div>
                <dt className="text-gray-500">Entreprise assignée</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-50">
                  {ticket.assigned_company.name}
                </dd>
              </div>
            )}
            {ticket.fixed_at && (
              <div>
                <dt className="text-gray-500">Corrigé le</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-50">
                  {formatDate(ticket.fixed_at)}
                </dd>
              </div>
            )}
          </dl>
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 font-semibold text-gray-900 dark:text-gray-50">
            Description
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {ticket.description}
          </p>
        </Card>
      </div>

      {ticket.messages && ticket.messages.length > 0 && (
        <Card className="p-4">
          <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">
            Messages ({ticket.messages.length})
          </h2>
          <div className="space-y-3">
            {ticket.messages.map((message) => (
              <div
                key={message.id}
                className="rounded-lg border bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    {message.author?.first_name} {message.author?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(message.created_at)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {message.body}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function TicketStatusBadge({ status }: { status: string }) {
  const config = {
    NEW: { label: 'Nouveau', variant: 'info' as const, icon: AlertCircle },
    ASSIGNED: { label: 'Assigné', variant: 'secondary' as const, icon: Clock },
    IN_PROGRESS: { label: 'En cours', variant: 'warning' as const, icon: Clock },
    FIXED: { label: 'Corrigé', variant: 'success' as const, icon: CheckCircle2 },
    VALIDATED: { label: 'Validé', variant: 'success' as const, icon: CheckCircle2 },
    CLOSED: { label: 'Clôturé', variant: 'secondary' as const, icon: CheckCircle2 },
    REJECTED: { label: 'Rejeté', variant: 'error' as const, icon: XCircle },
    EXPIRED: { label: 'Expiré', variant: 'error' as const, icon: Calendar },
  };

  const { label, variant, icon: Icon } = config[status as keyof typeof config] || config.NEW;

  return (
    <Badge variant={variant} size="sm" className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

function SeverityBadge({ severity }: { severity: SavSeverity }) {
  const config = {
    MINOR: { label: 'Mineur', variant: 'secondary' as const },
    MAJOR: { label: 'Majeur', variant: 'warning' as const },
    CRITICAL: { label: 'Critique', variant: 'error' as const },
    BLOCKING: { label: 'Bloquant', variant: 'error' as const },
  };

  const { label, variant } = config[severity] || config.MINOR;

  return (
    <Badge variant={variant} size="sm">
      {label}
    </Badge>
  );
}
