import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar,
  MessageSquare, Edit2, Trash2, Plus, User, Building2
} from 'lucide-react';
import { useContactsCRM, Contact, ContactInteraction } from '../hooks/useContactsCRM';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ContactDetail() {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { contacts, getContactInteractions, createInteraction, updateContact, deleteContact } = useContactsCRM();
  const [contact, setContact] = useState<Contact | null>(null);
  const [interactions, setInteractions] = useState<ContactInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewInteraction, setShowNewInteraction] = useState(false);
  const [interactionForm, setInteractionForm] = useState({
    interaction_type: 'call',
    subject: '',
    description: '',
    interaction_date: format(new Date(), 'yyyy-MM-dd'),
    outcome: '',
    next_action: '',
    next_action_date: '',
  });

  useEffect(() => {
    loadContactData();
  }, [contactId, contacts]);

  const loadContactData = async () => {
    if (!contactId) return;

    const foundContact = contacts.find((c) => c.id === contactId);
    setContact(foundContact || null);

    if (foundContact) {
      const contactInteractions = await getContactInteractions(contactId);
      setInteractions(contactInteractions);
    }

    setLoading(false);
  };

  const handleSaveInteraction = async () => {
    if (!contact || !interactionForm.subject) {
      toast.error('Le sujet est requis');
      return;
    }

    try {
      await createInteraction({
        contact_id: contact.id,
        ...interactionForm,
      });
      toast.success('Interaction enregistrée');
      setShowNewInteraction(false);
      setInteractionForm({
        interaction_type: 'call',
        subject: '',
        description: '',
        interaction_date: format(new Date(), 'yyyy-MM-dd'),
        outcome: '',
        next_action: '',
        next_action_date: '',
      });
      loadContactData();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleDeleteContact = async () => {
    if (!contact) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) return;

    try {
      await deleteContact(contact.id);
      toast.success('Contact supprimé');
      navigate('/contacts');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-5 h-5 text-blue-500" />;
      case 'email':
        return <Mail className="w-5 h-5 text-green-500" />;
      case 'meeting':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'note':
        return <MessageSquare className="w-5 h-5 text-gray-500" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Contact introuvable
        </h3>
        <button
          onClick={() => navigate('/contacts')}
          className="text-blue-600 hover:text-blue-700"
        >
          Retour aux contacts
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/contacts')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux contacts
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit2 className="w-4 h-4" />
            Modifier
          </button>
          <button
            onClick={handleDeleteContact}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-4xl font-medium text-blue-600 dark:text-blue-400">
                  {contact.first_name[0]}{contact.last_name[0]}
                </span>
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {contact.first_name} {contact.last_name}
              </h2>
              {contact.position && (
                <p className="text-gray-600 dark:text-gray-400">{contact.position}</p>
              )}
              {contact.is_primary && (
                <span className="inline-block mt-2 px-3 py-1 text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                  Contact principal
                </span>
              )}
            </div>

            <div className="space-y-4">
              {contact.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
              )}

              {contact.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-gray-900 dark:text-white hover:underline"
                  >
                    {contact.phone}
                  </a>
                </div>
              )}

              {contact.mobile && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a
                    href={`tel:${contact.mobile}`}
                    className="text-gray-900 dark:text-white hover:underline"
                  >
                    {contact.mobile}
                  </a>
                </div>
              )}

              {(contact.address_street || contact.address_city) && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="text-gray-900 dark:text-white">
                    {contact.address_street && <div>{contact.address_street}</div>}
                    {contact.address_city && (
                      <div>
                        {contact.address_postal_code} {contact.address_city}
                      </div>
                    )}
                    {contact.address_country && <div>{contact.address_country}</div>}
                  </div>
                </div>
              )}

              {contact.company_id && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    Entreprise liée
                  </span>
                </div>
              )}

              {contact.department && (
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {contact.department}
                  </span>
                </div>
              )}
            </div>

            {contact.tags && contact.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {contact.notes && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{contact.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Historique des interactions
                </h3>
                <button
                  onClick={() => setShowNewInteraction(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle interaction
                </button>
              </div>
            </div>

            {showNewInteraction && (
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                  Nouvelle interaction
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type
                      </label>
                      <select
                        value={interactionForm.interaction_type}
                        onChange={(e) =>
                          setInteractionForm({ ...interactionForm, interaction_type: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                      >
                        <option value="call">Appel</option>
                        <option value="email">Email</option>
                        <option value="meeting">Réunion</option>
                        <option value="note">Note</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={interactionForm.interaction_date}
                        onChange={(e) =>
                          setInteractionForm({ ...interactionForm, interaction_date: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sujet *
                    </label>
                    <input
                      type="text"
                      value={interactionForm.subject}
                      onChange={(e) =>
                        setInteractionForm({ ...interactionForm, subject: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                      placeholder="Sujet de l'interaction"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={interactionForm.description}
                      onChange={(e) =>
                        setInteractionForm({ ...interactionForm, description: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                      rows={3}
                      placeholder="Détails de l'interaction"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Résultat
                    </label>
                    <input
                      type="text"
                      value={interactionForm.outcome}
                      onChange={(e) =>
                        setInteractionForm({ ...interactionForm, outcome: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                      placeholder="Résultat ou décision"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prochaine action
                      </label>
                      <input
                        type="text"
                        value={interactionForm.next_action}
                        onChange={(e) =>
                          setInteractionForm({ ...interactionForm, next_action: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                        placeholder="Action à faire"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date prochaine action
                      </label>
                      <input
                        type="date"
                        value={interactionForm.next_action_date}
                        onChange={(e) =>
                          setInteractionForm({ ...interactionForm, next_action_date: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowNewInteraction(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveInteraction}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6">
              {interactions.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Aucune interaction enregistrée
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {interactions.map((interaction) => (
                    <div
                      key={interaction.id}
                      className="flex gap-4 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <div className="flex-shrink-0">
                        {getInteractionIcon(interaction.interaction_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {interaction.subject}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {format(new Date(interaction.interaction_date), 'dd/MM/yyyy')} •{' '}
                              <span className="capitalize">{interaction.interaction_type}</span>
                            </p>
                          </div>
                        </div>
                        {interaction.description && (
                          <p className="text-gray-600 dark:text-gray-400 mb-2">
                            {interaction.description}
                          </p>
                        )}
                        {interaction.outcome && (
                          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <strong>Résultat:</strong> {interaction.outcome}
                            </p>
                          </div>
                        )}
                        {interaction.next_action && (
                          <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <strong>Prochaine action:</strong> {interaction.next_action}
                              {interaction.next_action_date && (
                                <span className="ml-2">
                                  ({format(new Date(interaction.next_action_date), 'dd/MM/yyyy')})
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
