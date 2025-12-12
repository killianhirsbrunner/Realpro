import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, MapPin, Building2, Globe,
  Edit2, Trash2, Users, Calendar, MessageSquare
} from 'lucide-react';
import { useCompanies, Company } from '../hooks/useCompanies';
import { useContactsCRM, ContactInteraction } from '../hooks/useContactsCRM';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function CompanyDetail() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { companies, deleteCompany } = useCompanies();
  const { getContactInteractions } = useContactsCRM();
  const [company, setCompany] = useState<Company | null>(null);
  const [interactions, setInteractions] = useState<ContactInteraction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanyData();
  }, [companyId, companies]);

  const loadCompanyData = async () => {
    if (!companyId) return;

    const foundCompany = companies.find((c) => c.id === companyId);
    setCompany(foundCompany || null);

    setLoading(false);
  };

  const handleDeleteCompany = async () => {
    if (!company) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) return;

    try {
      await deleteCompany(company.id);
      toast.success('Entreprise supprimée');
      navigate('/companies');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getCompanyTypeLabel = (type?: string) => {
    const types: Record<string, string> = {
      EG: 'Entreprise Générale',
      NOTARY: 'Notaire',
      BROKER: 'Courtier',
      ARCHITECT: 'Architecte',
      ENGINEER: 'Ingénieur',
      SUPPLIER: 'Fournisseur',
      OTHER: 'Autre',
    };
    return type ? types[type] || type : '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
          Entreprise introuvable
        </h3>
        <button
          onClick={() => navigate('/companies')}
          className="text-blue-600 hover:text-blue-700"
        >
          Retour aux entreprises
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/companies')}
          className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux entreprises
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/companies/${company.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit2 className="w-4 h-4" />
            Modifier
          </button>
          <button
            onClick={handleDeleteCompany}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Building2 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                {company.name}
              </h2>
              {company.type && (
                <p className="text-neutral-600 dark:text-neutral-400">
                  {getCompanyTypeLabel(company.type)}
                </p>
              )}
              {company.legal_form && (
                <p className="text-sm text-neutral-500 mt-1">{company.legal_form}</p>
              )}
            </div>

            <div className="space-y-4">
              {company.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-neutral-400" />
                  <a
                    href={`mailto:${company.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {company.email}
                  </a>
                </div>
              )}

              {company.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-neutral-400" />
                  <a
                    href={`tel:${company.phone}`}
                    className="text-neutral-900 dark:text-white hover:underline"
                  >
                    {company.phone}
                  </a>
                </div>
              )}

              {company.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-neutral-400" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {company.website}
                  </a>
                </div>
              )}

              {(company.address_street || company.address_city) && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-neutral-400 mt-1" />
                  <div className="text-neutral-900 dark:text-white">
                    {company.address_street && <div>{company.address_street}</div>}
                    {company.address_city && (
                      <div>
                        {company.address_postal_code} {company.address_city}
                      </div>
                    )}
                    {company.address_country && <div>{company.address_country}</div>}
                  </div>
                </div>
              )}

              {company.vat_number && (
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    <strong>TVA:</strong> {company.vat_number}
                  </p>
                </div>
              )}

              {company.ide_number && (
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    <strong>IDE:</strong> {company.ide_number}
                  </p>
                </div>
              )}

              {company.trade_register_number && (
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    <strong>RC:</strong> {company.trade_register_number}
                  </p>
                </div>
              )}
            </div>

            {company.industry && (
              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Secteur
                </h3>
                <p className="text-neutral-900 dark:text-white">{company.industry}</p>
              </div>
            )}

            {company.tags && company.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {company.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex flex-wrap gap-2">
                {company.is_client && (
                  <span className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                    Client
                  </span>
                )}
                {company.is_supplier && (
                  <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                    Fournisseur
                  </span>
                )}
                {company.is_partner && (
                  <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                    Partenaire
                  </span>
                )}
              </div>
            </div>

            {company.notes && (
              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Notes
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{company.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Contacts
                </h3>
              </div>
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Aucun contact associé à cette entreprise
                </p>
                <button className="text-blue-600 hover:text-blue-700">
                  Ajouter un contact
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Projets associés
                </h3>
              </div>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  Aucun projet associé à cette entreprise
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Activité récente
                </h3>
              </div>
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  Aucune activité récente
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
