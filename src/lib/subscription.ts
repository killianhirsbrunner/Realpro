const PLAN_HIERARCHY = {
  demo: 0,
  starter: 1,
  professional: 2,
  business: 2, // alias pour professional
  enterprise: 3,
} as const;

type PlanName = keyof typeof PLAN_HIERARCHY;

// Vérifier si un plan est un plan démo
export function isDemoPlan(planName: string): boolean {
  return planName.toLowerCase() === 'demo';
}

export function getPlanLevel(planName: string): number {
  const normalized = planName.toLowerCase() as PlanName;
  return PLAN_HIERARCHY[normalized] || 0;
}

export function canUpgrade(currentPlan: string, targetPlan: string): boolean {
  return getPlanLevel(targetPlan) > getPlanLevel(currentPlan);
}

export function canDowngrade(lastPlanChange: string | Date): boolean {
  const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

  const lastChangeDate = typeof lastPlanChange === 'string'
    ? new Date(lastPlanChange)
    : lastPlanChange;

  const now = new Date();
  const elapsed = now.getTime() - lastChangeDate.getTime();

  return elapsed >= SIX_MONTHS_MS;
}

export function getNextDowngradeDate(lastPlanChange: string | Date): Date {
  const lastChangeDate = typeof lastPlanChange === 'string'
    ? new Date(lastPlanChange)
    : lastPlanChange;

  const nextDate = new Date(lastChangeDate);
  nextDate.setMonth(nextDate.getMonth() + 6);

  return nextDate;
}

export function getMonthsUntilDowngrade(lastPlanChange: string | Date): number {
  const nextDate = getNextDowngradeDate(lastPlanChange);
  const now = new Date();

  const diffMs = nextDate.getTime() - now.getTime();
  const diffMonths = Math.ceil(diffMs / (30 * 24 * 60 * 60 * 1000));

  return Math.max(0, diffMonths);
}

export function formatDowngradeWaitMessage(lastPlanChange: string | Date): string {
  if (canDowngrade(lastPlanChange)) {
    return 'Downgrade disponible maintenant';
  }

  const nextDate = getNextDowngradeDate(lastPlanChange);
  const monthsLeft = getMonthsUntilDowngrade(lastPlanChange);

  return `Downgrade possible le ${nextDate.toLocaleDateString('fr-CH')} (dans ${monthsLeft} mois)`;
}

export interface PlanChangeValidation {
  allowed: boolean;
  isUpgrade: boolean;
  isDowngrade: boolean;
  reason?: string;
  nextDowngradeDate?: Date;
}

export function validatePlanChange(
  currentPlan: string,
  targetPlan: string,
  lastPlanChange: string | Date
): PlanChangeValidation {
  if (currentPlan.toLowerCase() === targetPlan.toLowerCase()) {
    return {
      allowed: false,
      isUpgrade: false,
      isDowngrade: false,
      reason: 'Vous êtes déjà sur ce forfait',
    };
  }

  const isUpgradeChange = canUpgrade(currentPlan, targetPlan);
  const isDowngradeChange = !isUpgradeChange;

  if (isUpgradeChange) {
    return {
      allowed: true,
      isUpgrade: true,
      isDowngrade: false,
    };
  }

  const canDowngradeNow = canDowngrade(lastPlanChange);
  const nextDate = getNextDowngradeDate(lastPlanChange);

  if (!canDowngradeNow) {
    return {
      allowed: false,
      isUpgrade: false,
      isDowngrade: true,
      reason: `Le downgrade n'est possible qu'après 6 mois. Disponible le ${nextDate.toLocaleDateString('fr-CH')}`,
      nextDowngradeDate: nextDate,
    };
  }

  return {
    allowed: true,
    isUpgrade: false,
    isDowngrade: true,
  };
}

export const PLANS = [
  {
    id: 'demo',
    name: 'Demo',
    price: 0,
    billingPeriod: 'gratuit',
    yearlyPrice: 0,
    features: [
      '1 projet de démonstration',
      '14 jours d\'accès',
      'Toutes les fonctionnalités',
      'Support email',
    ],
    maxProjects: 1,
    maxUsers: 1,
    storageGb: 1,
    isDemo: true,
    trialDays: 14,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 99,
    billingPeriod: 'mois',
    yearlyPrice: 990,
    features: [
      '5 projets actifs',
      '10 utilisateurs',
      '50 GB de stockage',
      'Support email',
      'Exports PDF',
    ],
    maxProjects: 5,
    maxUsers: 10,
    storageGb: 50,
  },
  {
    id: 'business',
    name: 'Business',
    price: 299,
    billingPeriod: 'mois',
    yearlyPrice: 2990,
    features: [
      '20 projets actifs',
      '50 utilisateurs',
      '500 GB de stockage',
      'Support prioritaire',
      'Exports avancés',
      'API access',
      'Intégrations tierces',
    ],
    maxProjects: 20,
    maxUsers: 50,
    storageGb: 500,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 799,
    billingPeriod: 'mois',
    yearlyPrice: 7990,
    features: [
      'Projets illimités',
      'Utilisateurs illimités',
      'Stockage illimité',
      'Support 24/7',
      'Gestionnaire de compte dédié',
      'SLA garanti',
      'Branding personnalisé',
      'Formation sur site',
    ],
    maxProjects: -1,
    maxUsers: -1,
    storageGb: -1,
  },
] as const;
