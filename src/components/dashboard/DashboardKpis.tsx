import { Card } from '../ui/Card';
import { motion } from 'framer-motion';
import { Building2, Home, Banknote, AlertCircle, FileText, File, Mail, TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';

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
    {
      label: "Projets actifs",
      value: kpis.projects,
      icon: Building2,
      color: "brand",
      trend: { value: 8, isUp: true }
    },
    {
      label: "Lots vendus",
      value: kpis.lotsSold,
      icon: Home,
      color: "primary",
      trend: { value: 12, isUp: true }
    },
    {
      label: "Montant encaissé",
      value: `${(kpis.paid / 1000).toFixed(0)}K`,
      fullValue: `CHF ${kpis.paid.toLocaleString('fr-CH')}`,
      icon: Banknote,
      color: "green",
      trend: { value: 15, isUp: true }
    },
    {
      label: "Acomptes en retard",
      value: kpis.delayedPayments,
      icon: AlertCircle,
      color: kpis.delayedPayments > 0 ? "red" : "neutral",
      trend: { value: 3, isUp: false }
    },
    {
      label: "Soumissions actives",
      value: kpis.activeSoumissions,
      icon: FileText,
      color: "blue",
      trend: { value: 5, isUp: true }
    },
    {
      label: "Documents récents",
      value: kpis.documentsRecent,
      icon: File,
      color: "neutral"
    },
    {
      label: "Messages non lus",
      value: kpis.unreadMessages,
      icon: Mail,
      color: kpis.unreadMessages > 0 ? "brand" : "neutral"
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      brand: {
        bg: "bg-brand-500/10 dark:bg-brand-500/20",
        icon: "text-brand-600 dark:text-brand-400",
        border: "border-brand-200 dark:border-brand-800/30",
        hover: "hover:shadow-brand-500/10 hover:border-brand-300 dark:hover:border-brand-700"
      },
      primary: {
        bg: "bg-primary-500/10 dark:bg-primary-500/20",
        icon: "text-primary-600 dark:text-primary-400",
        border: "border-primary-200 dark:border-primary-800/30",
        hover: "hover:shadow-primary-500/10 hover:border-primary-300 dark:hover:border-primary-700"
      },
      green: {
        bg: "bg-green-500/10 dark:bg-green-500/20",
        icon: "text-green-600 dark:text-green-400",
        border: "border-green-200 dark:border-green-800/30",
        hover: "hover:shadow-green-500/10 hover:border-green-300 dark:hover:border-green-700"
      },
      red: {
        bg: "bg-red-500/10 dark:bg-red-500/20",
        icon: "text-red-600 dark:text-red-400",
        border: "border-red-200 dark:border-red-800/30",
        hover: "hover:shadow-red-500/10 hover:border-red-300 dark:hover:border-red-700"
      },
      blue: {
        bg: "bg-blue-500/10 dark:bg-blue-500/20",
        icon: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800/30",
        hover: "hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-700"
      },
      neutral: {
        bg: "bg-neutral-100 dark:bg-neutral-800",
        icon: "text-neutral-600 dark:text-neutral-400",
        border: "border-neutral-200 dark:border-neutral-700",
        hover: "hover:shadow-neutral-500/10 hover:border-neutral-300 dark:hover:border-neutral-600"
      }
    };
    return colors[color as keyof typeof colors] || colors.neutral;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
      {items.map((item, index) => {
        const Icon = item.icon;
        const colorClasses = getColorClasses(item.color);

        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: index * 0.05,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={clsx(
                "relative overflow-hidden p-5 border transition-all duration-300 cursor-pointer group",
                colorClasses.border,
                colorClasses.hover
              )}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/0 to-white/5 dark:from-white/0 dark:to-white/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />

              <div className="relative flex items-start justify-between mb-3">
                <div className={clsx("p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110", colorClasses.bg)}>
                  <Icon className={clsx("w-4 h-4", colorClasses.icon)} />
                </div>
                {item.trend && (
                  <div className={clsx(
                    "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                    item.trend.isUp
                      ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                      : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  )}>
                    {item.trend.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {item.trend.value}%
                  </div>
                )}
              </div>

              <div className="relative">
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wide">
                  {item.label}
                </p>
                <p
                  className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight"
                  title={item.fullValue}
                >
                  {item.value}
                </p>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
