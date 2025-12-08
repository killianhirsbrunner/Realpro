import { useState } from 'react';
import { Plus, Search, Filter, Users } from 'lucide-react';
import { useContactsCRM } from '../hooks/useContactsCRM';
import { useNavigate } from 'react-router-dom';

export default function ContactsList() {
  const { contacts, loading } = useContactsCRM();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      `${contact.first_name} ${contact.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === 'all' || contact.contact_type === filterType;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contacts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => navigate('/contacts/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Nouveau contact
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
        >
          <option value="all">Tous les types</option>
          <option value="client">Clients</option>
          <option value="prospect">Prospects</option>
          <option value="partner">Partenaires</option>
          <option value="supplier">Fournisseurs</option>
          <option value="broker">Courtiers</option>
          <option value="notary">Notaires</option>
          <option value="architect">Architectes</option>
        </select>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucun contact trouvé
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Commencez par ajouter votre premier contact
          </p>
          <button
            onClick={() => navigate('/contacts/new')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Ajouter un contact
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => navigate(`/contacts/${contact.id}`)}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 text-left hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-xl font-medium text-blue-600 dark:text-blue-400">
                      {contact.first_name[0]}{contact.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {contact.first_name} {contact.last_name}
                    </h3>
                    {contact.position && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {contact.position}
                      </p>
                    )}
                  </div>
                </div>
                {contact.is_primary && (
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">
                    Principal
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {contact.email && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {contact.email}
                  </p>
                )}
                {contact.phone && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {contact.phone}
                  </p>
                )}
              </div>

              {contact.tags && contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {contact.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
