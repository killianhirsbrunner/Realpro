import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Home,
  FileText,
  Download,
  Calendar,
  ArrowRight,
  PieChart,
  Activity
} from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function ProjectReportingPage() {
  const { projectId } = useParams();
  const { t } = useI18n();

  const reportCategories = [
    {
      id: 'sales',
      name: 'Ventes & CRM',
      description: 'Rapports de ventes, prospects et acheteurs',
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      path: `/projects/${projectId}/reporting/sales`,
      reports: [
        { name: 'Taux de commercialisation', value: '78%' },
        { name: 'Pipeline prospects', value: '24 actifs' },
        { name: 'Lots disponibles', value: '12/55' }
      ]
    },
    {
      id: 'finance',
      name: 'Finances',
      description: 'Rapports financiers, budgets et trésorerie',
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      path: `/projects/${projectId}/reporting/finance`,
      reports: [
        { name: 'Budget global', value: 'CHF 45.5M' },
        { name: 'Facturé', value: 'CHF 32.1M' },
        { name: 'Variance', value: '+3.2%' }
      ]
    },
    {
      id: 'cfc',
      name: 'CFC & Budgets',
      description: 'Compte final de construction et suivi budgétaire',
      icon: PieChart,
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      path: `/projects/${projectId}/reporting/cfc`,
      reports: [
        { name: 'Budget CFC', value: 'CHF 38.2M' },
        { name: 'Engagé', value: 'CHF 36.8M' },
        { name: 'Disponible', value: 'CHF 1.4M' }
      ]
    },
    {
      id: 'construction',
      name: 'Construction',
      description: 'Avancement chantier et planning',
      icon: Activity,
      color: 'orange',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      path: `/projects/${projectId}/construction`,
      reports: [
        { name: 'Avancement global', value: '65%' },
        { name: 'Phases actives', value: '2/5' },
        { name: 'Retards', value: '0 jour' }
      ]
    }
  ];

  const quickStats = [
    {
      label: 'Rapports Disponibles',
      value: '24',
      icon: FileText,
      color: 'blue'
    },
    {
      label: 'Exports ce mois',
      value: '12',
      icon: Download,
      color: 'green'
    },
    {
      label: 'Alertes',
      value: '3',
      icon: TrendingUp,
      color: 'orange'
    },
    {
      label: 'Dernière MAJ',
      value: "Aujourd'hui",
      icon: Calendar,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            Reporting & Analyses
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Tableaux de bord et rapports du projet
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          <Button className="gap-2">
            <FileText className="w-4 h-4" />
            Nouveau rapport
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                    stat.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30' :
                    'bg-purple-100 dark:bg-purple-900/30'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                      stat.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                      'text-purple-600 dark:text-purple-400'
                    }`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCategories.map((category, index) => {
          const Icon = category.icon;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link to={category.path}>
                <Card className="p-6 hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300 hover:shadow-lg group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 ${category.bgColor} rounded-xl group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-8 h-8 ${category.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1">
                          {category.name}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    {category.reports.map((report, idx) => (
                      <div key={idx}>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                          {report.name}
                        </p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {report.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Récents Exports */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exports Récents
          </h2>
          <Button variant="outline" size="sm" className="gap-2">
            Voir tous
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {[
            { name: 'Rapport Ventes - Décembre 2024', date: '2024-12-07', format: 'PDF', size: '2.4 MB' },
            { name: 'Budget CFC - Q4 2024', date: '2024-12-05', format: 'XLSX', size: '1.8 MB' },
            { name: 'Dashboard Financier', date: '2024-12-01', format: 'PDF', size: '3.1 MB' }
          ].map((export_item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                  <FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 dark:text-white">
                    {export_item.name}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {new Date(export_item.date).toLocaleDateString('fr-CH')} • {export_item.format} • {export_item.size}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Télécharger
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Rapports Planifiés */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Rapports Planifiés
          </h2>
          <Button variant="outline" size="sm">
            Configurer
          </Button>
        </div>

        <div className="space-y-3">
          {[
            { name: 'Rapport hebdomadaire des ventes', frequency: 'Chaque lundi', nextRun: '2024-12-09' },
            { name: 'Dashboard financier mensuel', frequency: 'Le 1er de chaque mois', nextRun: '2025-01-01' },
            { name: 'Suivi CFC trimestriel', frequency: 'Fin de trimestre', nextRun: '2024-12-31' }
          ].map((scheduled, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-white mb-1">
                  {scheduled.name}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {scheduled.frequency}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Prochain export
                </p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {new Date(scheduled.nextRun).toLocaleDateString('fr-CH')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Accès Rapide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to={`/projects/${projectId}/dashboard`}>
          <Card className="p-6 hover:border-brand-300 dark:hover:border-brand-700 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  Dashboard Projet
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Vue d'ensemble en temps réel
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/reporting">
          <Card className="p-6 hover:border-brand-300 dark:hover:border-brand-700 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  Reporting Global
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Tous les projets
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/analytics">
          <Card className="p-6 hover:border-brand-300 dark:hover:border-brand-700 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <PieChart className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  Analytics BI
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Business Intelligence
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
