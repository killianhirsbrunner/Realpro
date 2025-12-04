import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function usePdfExports() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generatePdf = async (documentType: string, data: any, options?: {
    organizationId?: string;
    projectId?: string;
    download?: boolean;
    openInNewTab?: boolean;
  }) => {
    try {
      setGenerating(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/exports`;

      const response = await fetch(`${apiUrl}/pdf/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentType,
          data,
          organizationId: options?.organizationId,
          projectId: options?.projectId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la génération: ${response.statusText}`);
      }

      const htmlContent = await response.text();
      const title = response.headers.get('X-Document-Title') || 'document';

      if (options?.download) {
        downloadHtmlAsPdf(htmlContent, title);
      } else if (options?.openInNewTab) {
        openHtmlInNewTab(htmlContent, title);
      }

      return { htmlContent, title };
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError(err as Error);
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  const generateBuyerDossier = async (buyerId: string, options?: { download?: boolean; openInNewTab?: boolean }) => {
    try {
      setGenerating(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/exports`;

      const response = await fetch(`${apiUrl}/projects/${buyerId}/buyer-dossier.pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la génération: ${response.statusText}`);
      }

      const htmlContent = await response.text();
      const contentDisposition = response.headers.get('Content-Disposition') || '';
      const filenameMatch = contentDisposition.match(/filename="(.+?)"/);
      const title = filenameMatch ? filenameMatch[1].replace('.html', '') : 'dossier_acheteur';

      if (options?.download) {
        downloadHtmlAsPdf(htmlContent, title);
      } else if (options?.openInNewTab) {
        openHtmlInNewTab(htmlContent, title);
      }

      return { htmlContent, title };
    } catch (err) {
      console.error('Error generating buyer dossier:', err);
      setError(err as Error);
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  const generateFinancialReport = async (projectId: string, options?: { download?: boolean; openInNewTab?: boolean }) => {
    try {
      setGenerating(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/exports`;

      const response = await fetch(`${apiUrl}/projects/${projectId}/financial-report.pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la génération: ${response.statusText}`);
      }

      const htmlContent = await response.text();
      const contentDisposition = response.headers.get('Content-Disposition') || '';
      const filenameMatch = contentDisposition.match(/filename="(.+?)"/);
      const title = filenameMatch ? filenameMatch[1].replace('.html', '') : 'rapport_financier';

      if (options?.download) {
        downloadHtmlAsPdf(htmlContent, title);
      } else if (options?.openInNewTab) {
        openHtmlInNewTab(htmlContent, title);
      }

      return { htmlContent, title };
    } catch (err) {
      console.error('Error generating financial report:', err);
      setError(err as Error);
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  const exportLotsCSV = async (projectId: string) => {
    try {
      setGenerating(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/exports`;

      const response = await fetch(`${apiUrl}/projects/${projectId}/lots.csv`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l'export: ${response.statusText}`);
      }

      const csvContent = await response.text();
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `programme_vente_${projectId}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      return csvContent;
    } catch (err) {
      console.error('Error exporting lots CSV:', err);
      setError(err as Error);
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  const exportCfcCSV = async (projectId: string) => {
    try {
      setGenerating(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/exports`;

      const response = await fetch(`${apiUrl}/projects/${projectId}/cfc.csv`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l'export: ${response.statusText}`);
      }

      const csvContent = await response.text();
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cfc_${projectId}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      return csvContent;
    } catch (err) {
      console.error('Error exporting CFC CSV:', err);
      setError(err as Error);
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  return {
    generating,
    error,
    generatePdf,
    generateBuyerDossier,
    generateFinancialReport,
    exportLotsCSV,
    exportCfcCSV,
  };
}

function downloadHtmlAsPdf(htmlContent: string, filename: string) {
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

function openHtmlInNewTab(htmlContent: string, title: string) {
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(htmlContent);
    newWindow.document.title = title;
    newWindow.document.close();
  }
}
