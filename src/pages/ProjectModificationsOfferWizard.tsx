import { useParams, useNavigate } from 'react-router-dom';
import { ModificationOfferWizard } from '../components/modifications/ModificationOfferWizard';
import { useBuyers } from '../hooks/useBuyers';
import { useLots } from '../hooks/useLots';
import { useSuppliers } from '../hooks/useSuppliers';
import { useStartWorkflow } from '../hooks/useWorkflow';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export default function ProjectModificationsOfferWizard() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { buyers, loading: loadingBuyers } = useBuyers(projectId);
  const { lots, loading: loadingLots } = useLots(projectId);
  const { suppliers, loading: loadingSuppliers } = useSuppliers();
  const { startWorkflow } = useStartWorkflow();

  const handleComplete = async (formData: any) => {
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    try {
      // 1. Create supplier offer
      const { data: offer, error: offerError } = await supabase
        .from('supplier_offers')
        .insert({
          project_id: projectId,
          lot_id: formData.lotId,
          buyer_id: formData.buyerId,
          supplier_id: formData.supplierId,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          amount_ht: formData.amountHT,
          vat_rate: formData.vatRate,
          amount_vat: formData.amountVAT,
          amount_total: formData.amountTotal,
          deadline: formData.deadline,
          payment_terms: formData.paymentTerms,
          status: 'draft',
          supplier_contact: formData.supplierContact,
          supplier_email: formData.supplierEmail,
          supplier_phone: formData.supplierPhone,
          notes: formData.notes,
        })
        .select()
        .single();

      if (offerError) throw offerError;

      // 2. Upload documents if any
      if (formData.documents.length > 0) {
        for (const file of formData.documents) {
          const filePath = `supplier-offers/${offer.id}/${file.name}`;

          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file, { upsert: true });

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            continue;
          }

          // Save document reference
          await supabase.from('supplier_offer_documents').insert({
            offer_id: offer.id,
            file_name: file.name,
            file_path: filePath,
            file_size: file.size,
            file_type: file.type,
          });
        }
      }

      // 3. Get organization ID
      const { data: userData } = await supabase.auth.getUser();
      const { data: userOrg } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', userData.user?.id)
        .single();

      // 4. Start workflow
      if (userOrg) {
        await startWorkflow({
          workflowType: 'modification_offer',
          entityType: 'supplier_offer',
          entityId: offer.id,
          organizationId: userOrg.organization_id,
          projectId: projectId,
        });
      }

      // 5. Navigate to offer detail
      navigate(`/projects/${projectId}/modifications/offers/${offer.id}`);
      toast.success('Offre créée avec succès ! Le workflow a été démarré.');

    } catch (error: any) {
      console.error('Error creating offer:', error);
      throw new Error(error.message || 'Erreur lors de la création de l\'offre');
    }
  };

  const handleCancel = () => {
    navigate(`/projects/${projectId}/modifications/offers`);
  };

  if (loadingBuyers || loadingLots || loadingSuppliers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-realpro-turquoise border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <ModificationOfferWizard
      projectId={projectId!}
      buyers={buyers}
      lots={lots}
      suppliers={suppliers}
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  );
}
