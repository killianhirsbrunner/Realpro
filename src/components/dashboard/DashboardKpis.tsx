import { Card } from '../ui/Card';

interface KpiData {
  projects: number;
  lotsSold: number;
  paid: number;
  delayedPayments: number;
  activeSoumissions: number;
  documentsRecent: number;
  unreadMessages: number;
}

interface DashboardKpisProps {
  kpis: KpiData;
}

export function DashboardKpis({ kpis }: DashboardKpisProps) {
  const items = [
    { label: "Projets actifs", value: kpis.projects },
    { label: "Lots vendus", value: kpis.lotsSold },
    { label: "Montant encaissé", value: `CHF ${kpis.paid.toLocaleString('fr-CH')}` },
    { label: "Acomptes en retard", value: kpis.delayedPayments },
    { label: "Soumissions actives", value: kpis.activeSoumissions },
    { label: "Documents récents", value: kpis.documentsRecent },
    { label: "Messages non lus", value: kpis.unreadMessages },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.label}</p>
          <p className="text-2xl font-semibold mt-2">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
