import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { InvoiceDetailCard } from '../components/finance/InvoiceDetailCard';
import { QRInvoiceCard } from '../components/finance/QRInvoiceCard';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { ScrollReveal } from '../components/ui/PageTransition';

export function ProjectFinancesInvoiceDetail() {
  const { projectId, invoiceId } = useParams<{ projectId: string; invoiceId: string }>();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceId) return;

      try {
        setLoading(true);

        const { data, error: fetchError } = await supabase
          .from('buyer_invoices')
          .select(`
            *,
            buyer:buyer_id (
              nom,
              prenom,
              email,
              telephone
            ),
            invoice_items (
              description,
              quantity,
              unit_price,
              total
            )
          `)
          .eq('id', invoiceId)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          setInvoice({
            id: data.id,
            invoiceNumber: data.invoice_number,
            buyerName: data.buyer ? `${data.buyer.prenom} ${data.buyer.nom}` : 'N/A',
            amount: data.montant_total,
            dueDate: data.date_echeance,
            paid: data.paid,
            paidDate: data.paid_date,
            status: data.status || 'draft',
            createdAt: data.created_at,
            qrCodeUrl: data.qr_code_url,
            iban: data.iban,
            reference: data.reference,
            items: data.invoice_items?.map((item: any) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unit_price,
              total: item.total
            })) || []
          });
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <ErrorState
        title="Erreur de chargement"
        message="Impossible de charger la facture"
      />
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link to={`/projects/${projectId}/finances/invoices`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux factures
          </Button>
        </Link>
      </div>

      <ScrollReveal>
        <InvoiceDetailCard invoice={invoice} />
      </ScrollReveal>

      <ScrollReveal>
        <QRInvoiceCard
          qrCodeUrl={invoice.qrCodeUrl}
          iban={invoice.iban}
          reference={invoice.reference}
          amount={invoice.amount}
          beneficiary={{
            name: 'Realpro SA',
            address: 'Avenue de la Gare 10',
            city: 'Genève',
            postalCode: '1003'
          }}
        />
      </ScrollReveal>
    </div>
  );
}
