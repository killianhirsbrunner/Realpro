/**
 * Utilitaires d'export CSV/Excel et PDF
 * RealPro Suite - Export Tools
 */

// Types pour les exports
export interface ExportColumn<T> {
  key: keyof T | string;
  label: string;
  format?: (value: any, row: T) => string;
}

export interface ExportOptions {
  filename: string;
  title?: string;
  subtitle?: string;
  dateRange?: string;
}

/**
 * Formate une valeur pour l'export CSV (échappement des caractères spéciaux)
 */
function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  // Échapper les guillemets et entourer de guillemets si nécessaire
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Export des données au format CSV (compatible Excel)
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn<T>[],
  options: ExportOptions
): void {
  // Créer les en-têtes
  const headers = columns.map(col => escapeCSV(col.label)).join(',');

  // Créer les lignes de données
  const rows = data.map(row => {
    return columns.map(col => {
      const value = typeof col.key === 'string'
        ? col.key.split('.').reduce((obj, key) => obj?.[key], row)
        : row[col.key];
      const formattedValue = col.format ? col.format(value, row) : value;
      return escapeCSV(formattedValue);
    }).join(',');
  });

  // Assemblage du CSV avec BOM pour Excel (UTF-8)
  const BOM = '\uFEFF';
  const csvContent = BOM + [headers, ...rows].join('\n');

  // Téléchargement
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${options.filename}.csv`);
}

/**
 * Export des données au format Excel (xlsx via tableau HTML)
 * Cette méthode utilise un tableau HTML que Excel peut ouvrir
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn<T>[],
  options: ExportOptions
): void {
  // Créer le contenu HTML du tableau
  const tableHTML = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head>
      <meta charset="UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${options.title || options.filename}</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; width: 100%; }
        th { background-color: #1e3a5f; color: white; padding: 10px; text-align: left; font-weight: bold; }
        td { padding: 8px; border: 1px solid #ddd; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .subtitle { font-size: 14px; color: #666; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      ${options.title ? `<div class="title">${options.title}</div>` : ''}
      ${options.subtitle ? `<div class="subtitle">${options.subtitle}</div>` : ''}
      ${options.dateRange ? `<div class="subtitle">Période: ${options.dateRange}</div>` : ''}
      <table>
        <thead>
          <tr>
            ${columns.map(col => `<th>${col.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${columns.map(col => {
                const value = typeof col.key === 'string'
                  ? col.key.split('.').reduce((obj, key) => obj?.[key], row)
                  : row[col.key as keyof T];
                const formattedValue = col.format ? col.format(value, row) : value ?? '';
                return `<td>${formattedValue}</td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([tableHTML], {
    type: 'application/vnd.ms-excel;charset=utf-8;'
  });
  downloadBlob(blob, `${options.filename}.xls`);
}

/**
 * Génère un PDF via impression du navigateur
 * Ouvre une fenêtre d'impression avec les données formatées
 */
export function exportToPDF<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn<T>[],
  options: ExportOptions
): void {
  // Créer le contenu HTML pour l'impression
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${options.title || options.filename}</title>
      <style>
        @media print {
          @page {
            size: A4 landscape;
            margin: 15mm;
          }
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1a1a1a;
          padding: 20px;
        }
        .header {
          border-bottom: 2px solid #1e3a5f;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #1e3a5f;
        }
        .title {
          font-size: 20px;
          font-weight: bold;
          margin: 15px 0 5px;
        }
        .subtitle {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }
        .date {
          font-size: 12px;
          color: #888;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-size: 11px;
        }
        th {
          background-color: #1e3a5f;
          color: white;
          padding: 10px 8px;
          text-align: left;
          font-weight: 600;
          border: 1px solid #1e3a5f;
        }
        td {
          padding: 8px;
          border: 1px solid #ddd;
          vertical-align: top;
        }
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
          font-size: 10px;
          color: #888;
          text-align: center;
        }
        .total-row {
          font-weight: bold;
          background-color: #e5e7eb !important;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">RealPro Suite</div>
        <div class="title">${options.title || options.filename}</div>
        ${options.subtitle ? `<div class="subtitle">${options.subtitle}</div>` : ''}
        ${options.dateRange ? `<div class="subtitle">Période: ${options.dateRange}</div>` : ''}
        <div class="date">Généré le ${new Date().toLocaleDateString('fr-CH', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</div>
      </div>

      <table>
        <thead>
          <tr>
            ${columns.map(col => `<th>${col.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${columns.map(col => {
                const value = typeof col.key === 'string'
                  ? col.key.split('.').reduce((obj, key) => obj?.[key], row)
                  : row[col.key as keyof T];
                const formattedValue = col.format ? col.format(value, row) : value ?? '';
                return `<td>${formattedValue}</td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>Document généré par RealPro Suite • ${data.length} enregistrement${data.length > 1 ? 's' : ''}</p>
        <p>© ${new Date().getFullYear()} Realpro SA - Tous droits réservés</p>
      </div>

      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `;

  // Ouvrir dans une nouvelle fenêtre pour l'impression
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
  }
}

/**
 * Télécharge un Blob sous forme de fichier
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formate un montant en CHF
 */
export function formatCHF(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formate une date au format suisse
 */
export function formatDateCH(date: string | Date | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formate un pourcentage
 */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return `${value.toFixed(1)}%`;
}

// === Colonnes pré-définies pour les exports courants ===

export const prospectExportColumns: ExportColumn<any>[] = [
  { key: 'name', label: 'Nom' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Téléphone' },
  { key: 'source', label: 'Source' },
  { key: 'status', label: 'Statut' },
  { key: 'targetLot', label: 'Lot ciblé' },
  { key: 'createdAt', label: 'Date création', format: formatDateCH },
  { key: 'notes', label: 'Notes' },
];

export const buyerExportColumns: ExportColumn<any>[] = [
  { key: 'name', label: 'Nom' },
  { key: 'email', label: 'Email' },
  { key: 'lotNumber', label: 'Lot' },
  { key: 'status', label: 'Statut' },
  { key: 'salePrice', label: 'Prix', format: formatCHF },
  { key: 'reservationDate', label: 'Date réservation', format: formatDateCH },
  { key: 'contractDate', label: 'Date contrat', format: formatDateCH },
];

export const invoiceExportColumns: ExportColumn<any>[] = [
  { key: 'invoiceNumber', label: 'N° Facture' },
  { key: 'buyerName', label: 'Acheteur' },
  { key: 'amount', label: 'Montant', format: formatCHF },
  { key: 'dueDate', label: 'Échéance', format: formatDateCH },
  { key: 'status', label: 'Statut' },
  { key: 'paid', label: 'Payé', format: (v) => v ? 'Oui' : 'Non' },
  { key: 'paidDate', label: 'Date paiement', format: formatDateCH },
];

export const lotExportColumns: ExportColumn<any>[] = [
  { key: 'code', label: 'Code' },
  { key: 'type', label: 'Type' },
  { key: 'rooms', label: 'Pièces' },
  { key: 'surface_total', label: 'Surface (m²)' },
  { key: 'price_total', label: 'Prix', format: formatCHF },
  { key: 'status', label: 'Statut' },
  { key: 'building.name', label: 'Bâtiment' },
  { key: 'floor.name', label: 'Étage' },
];

export const submissionExportColumns: ExportColumn<any>[] = [
  { key: 'label', label: 'Libellé' },
  { key: 'cfc_code', label: 'Code CFC' },
  { key: 'status', label: 'Statut' },
  { key: 'deadline', label: 'Échéance', format: formatDateCH },
  { key: 'budget_estimate', label: 'Budget estimé', format: formatCHF },
  { key: 'offers_count', label: 'Offres' },
];
