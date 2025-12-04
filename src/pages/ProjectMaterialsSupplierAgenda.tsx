import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AppointmentCalendar } from '../components/materials/AppointmentCalendar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ArrowLeft, MapPin, Phone, Mail } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { SupplierTimeSlot } from '../hooks/useSupplierAppointments';

export default function ProjectMaterialsSupplierAgenda() {
  const { projectId, supplierId } = useParams<{ projectId: string; supplierId: string }>();
  const [showroom, setShowroom] = useState<any>(null);
  const [slots, setSlots] = useState<SupplierTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyerId, setBuyerId] = useState<string>('');
  const [lotId, setLotId] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, [supplierId]);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [showroomResult, slotsResult, buyerResult] = await Promise.all([
        supabase
          .from('supplier_showrooms')
          .select('*, company:companies(name)')
          .eq('id', supplierId)
          .single(),

        supabase
          .from('supplier_time_slots')
          .select('*')
          .eq('showroom_id', supplierId)
          .eq('is_active', true)
          .gte('start_at', new Date().toISOString())
          .order('start_at'),

        supabase
          .from('buyers')
          .select('id, lot_id')
          .eq('user_id', user.id)
          .maybeSingle(),
      ]);

      if (showroomResult.error) throw showroomResult.error;
      if (slotsResult.error) throw slotsResult.error;

      setShowroom(showroomResult.data);
      setSlots(slotsResult.data || []);

      if (buyerResult.data) {
        setBuyerId(buyerResult.data.id);
        setLotId(buyerResult.data.lot_id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

  if (!showroom) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Showroom non trouvé</p>
        <Link to={`/projects/${projectId}/materials/suppliers`}>
          <button className="mt-4 text-blue-600 hover:underline">
            Retour aux fournisseurs
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/projects/${projectId}/materials/suppliers`}
          className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour aux fournisseurs
        </Link>
        <h1 className="text-3xl font-bold">{showroom.name}</h1>
        {showroom.company && (
          <p className="text-neutral-600 mt-1">{showroom.company.name}</p>
        )}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Informations</h2>
        <div className="space-y-3">
          {(showroom.address || showroom.city) && (
            <div className="flex items-start gap-2 text-neutral-700">
              <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-neutral-500" />
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
            <div className="flex items-center gap-2 text-neutral-700">
              <Phone className="w-5 h-5 text-neutral-500" />
              {showroom.contact_phone}
            </div>
          )}

          {showroom.contact_email && (
            <div className="flex items-center gap-2 text-neutral-700">
              <Mail className="w-5 h-5 text-neutral-500" />
              {showroom.contact_email}
            </div>
          )}
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Prendre rendez-vous</h2>
        <AppointmentCalendar
          slots={slots}
          showroomId={supplierId!}
          showroomName={showroom.name}
          projectId={projectId!}
          lotId={lotId}
          buyerId={buyerId}
        />
      </div>
    </div>
  );
}
