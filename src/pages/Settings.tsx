import { SettingCard } from '../components/settings/SettingCard';
import {
  Building2,
  Users,
  Shield,
  Globe,
  FileText,
  Palette,
  CreditCard,
  Lock,
  Package,
  Settings as SettingsIcon
} from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-8 pb-12">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 via-white to-neutral-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-brand-900/20 border border-brand-100 dark:border-brand-900/30 p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Paramètres
            </h1>
          </div>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Configurez votre organisation, permissions et préférences
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-200/20 to-neutral-200/20 dark:from-brand-900/10 dark:to-neutral-900/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
          Organisation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SettingCard
            title="Entreprise"
            description="Raison sociale, adresse, N° IDE et informations légales"
            icon={Building2}
            link="/company"
          />
          <SettingCard
            title="Utilisateurs"
            description="Gérer les membres de l'équipe et leurs accès"
            icon={Users}
            link="/admin/users"
          />
          <SettingCard
            title="Permissions"
            description="Configuration avancée des rôles et permissions"
            icon={Shield}
            link="/admin/organizations"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
          Configuration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SettingCard
            title="Localisation"
            description="Langue, devise, TVA et formats suisses"
            icon={Globe}
            link="/settings/localization"
          />
          <SettingCard
            title="Modèles documents"
            description="Templates de contrats, actes et courriers"
            icon={FileText}
            link="/templates"
          />
          <SettingCard
            title="Branding"
            description="Logos, couleurs et personnalisation visuelle"
            icon={Palette}
            link="/settings/branding"
            badge="Pro"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
          Facturation & Sécurité
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SettingCard
            title="Abonnement"
            description="Plan actuel, facturation et paiements"
            icon={CreditCard}
            link="/billing"
          />
          <SettingCard
            title="Sécurité"
            description="2FA, audit logs et conformité GDPR"
            icon={Lock}
            link="/settings/security"
          />
          <SettingCard
            title="Fournisseurs"
            description="Gérer vos partenaires et prestataires"
            icon={Package}
            link="/settings/suppliers"
          />
        </div>
      </div>
    </div>
  );
}
