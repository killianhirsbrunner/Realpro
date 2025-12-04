import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ArrowLeft, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';

interface Showroom {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  categories: string[];
}

export default function ProjectMaterialsSuppliers() {
  const { projectId } = useParams<{ projectId: string }>();
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShowrooms();
  }, [projectId]);

  const fetchShowrooms = async () => {
    try {
      const { data, error } = await supabase
        .from('supplier_showrooms')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      setShowrooms(data || []);
    } catch (error) {
      console.error('Error fetching showrooms:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/projects/${projectId}/materials`}
          className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour aux matériaux
        </Link>
        <h1 className="text-3xl font-bold">Fournisseurs & Showrooms</h1>
        <p className="text-neutral-600 mt-1">
          Prenez rendez-vous avec les fournisseurs pour vos choix de matériaux
        </p>
      </div>

      {showrooms.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-neutral-600">Aucun showroom disponible pour ce projet.</p>
          <p className="text-sm text-neutral-500 mt-2">
            Les showrooms seront bientôt disponibles.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showrooms.map((showroom) => (
            <Link
              key={showroom.id}
              to={`/projects/${projectId}/materials/suppliers/${showroom.id}`}
            >
              <Card className="p-6 hover:shadow-lg transition cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold">{showroom.name}</h3>
                  <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 transition flex-shrink-0" />
                </div>

                {(showroom.address || showroom.city) && (
                  <div className="flex items-start gap-2 text-sm text-neutral-600 mb-2">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      {showroom.address && <div>{showroom.address}</div>}
                      {showroom.city && (
                        <div>
                          {showroom.postal_code} {showroom.city}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {showroom.contact_phone && (
                  <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                    <Phone className="w-4 h-4" />
                    {showroom.contact_phone}
                  </div>
                )}

                {showroom.contact_email && (
                  <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
                    <Mail className="w-4 h-4" />
                    {showroom.contact_email}
                  </div>
                )}

                {showroom.categories && showroom.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-neutral-200">
                    {showroom.categories.map((cat, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
