/**
 * Subscription configuration
 * Defines app info and pricing plans
 */

import type { AppId, AppInfo, PlanInfo, SubscriptionTier } from './types';

// App definitions
export const APPS: Record<AppId, AppInfo> = {
  'ppe-admin': {
    id: 'ppe-admin',
    name: 'PPE Admin',
    description: 'Gestion de copropriétés (syndic)',
    path: '/ppe',
    color: 'blue',
    icon: 'Building2',
  },
  'promoteur': {
    id: 'promoteur',
    name: 'Promoteur',
    description: 'Promotion immobilière',
    path: '/promoteur',
    color: 'emerald',
    icon: 'Home',
  },
  'regie': {
    id: 'regie',
    name: 'Régie',
    description: 'Gérance immobilière',
    path: '/regie',
    color: 'purple',
    icon: 'Users',
  },
};

// Plans by app
export const PLANS: Record<AppId, Record<SubscriptionTier, PlanInfo>> = {
  'ppe-admin': {
    starter: {
      tier: 'starter',
      name: 'Starter',
      price: 49,
      features: [
        'Jusqu\'à 3 immeubles',
        '50 lots maximum',
        'Assemblées générales',
        'Comptabilité de base',
        'Support email',
      ],
      limits: {
        buildings: 3,
        units: 50,
      },
    },
    pro: {
      tier: 'pro',
      name: 'Pro',
      price: 149,
      features: [
        'Jusqu\'à 20 immeubles',
        '500 lots maximum',
        'Toutes les fonctionnalités',
        'Portail copropriétaires',
        'Support prioritaire',
        'API access',
      ],
      limits: {
        buildings: 20,
        units: 500,
      },
    },
    enterprise: {
      tier: 'enterprise',
      name: 'Enterprise',
      price: 'custom',
      features: [
        'Immeubles illimités',
        'Lots illimités',
        'Multi-entités',
        'SSO / SAML',
        'Support dédié',
        'Formation sur site',
      ],
      limits: {
        buildings: 'unlimited',
        units: 'unlimited',
      },
    },
  },
  'promoteur': {
    starter: {
      tier: 'starter',
      name: 'Starter',
      price: 99,
      features: [
        '1 projet actif',
        '20 lots maximum',
        'CRM basique',
        'Suivi ventes',
        'Support email',
      ],
      limits: {
        projects: 1,
        units: 20,
      },
    },
    pro: {
      tier: 'pro',
      name: 'Pro',
      price: 299,
      features: [
        '5 projets actifs',
        '200 lots maximum',
        'CRM complet',
        'Finance & CFC',
        'Portail acquéreurs',
        'Support prioritaire',
      ],
      limits: {
        projects: 5,
        units: 200,
      },
    },
    enterprise: {
      tier: 'enterprise',
      name: 'Enterprise',
      price: 'custom',
      features: [
        'Projets illimités',
        'Lots illimités',
        'Multi-entités',
        'Intégrations custom',
        'Support dédié',
        'SLA garanti',
      ],
      limits: {
        projects: 'unlimited',
        units: 'unlimited',
      },
    },
  },
  'regie': {
    starter: {
      tier: 'starter',
      name: 'Starter',
      price: 79,
      features: [
        'Jusqu\'à 5 immeubles',
        '50 objets locatifs',
        'Gestion baux',
        'Encaissements',
        'Support email',
      ],
      limits: {
        buildings: 5,
        objects: 50,
      },
    },
    pro: {
      tier: 'pro',
      name: 'Pro',
      price: 199,
      features: [
        'Jusqu\'à 30 immeubles',
        '500 objets locatifs',
        'Toutes fonctionnalités',
        'Portails web',
        'Comptabilité mandants',
        'Support prioritaire',
      ],
      limits: {
        buildings: 30,
        objects: 500,
      },
    },
    enterprise: {
      tier: 'enterprise',
      name: 'Enterprise',
      price: 'custom',
      features: [
        'Objets illimités',
        'Multi-entités',
        'Intégrations comptables',
        'SSO / SAML',
        'Support dédié',
        'Formation',
      ],
      limits: {
        buildings: 'unlimited',
        objects: 'unlimited',
      },
    },
  },
};

// Trial duration in days
export const TRIAL_DURATION_DAYS = 30;

// Get all app IDs
export const APP_IDS: AppId[] = ['ppe-admin', 'promoteur', 'regie'];
