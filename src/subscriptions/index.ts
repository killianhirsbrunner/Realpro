/**
 * Subscription Module
 * Exports all subscription-related types, config, and services
 */

// Types
export type {
  AppId,
  SubscriptionTier,
  SubscriptionStatus,
  AppSubscription,
  UserSubscription,
  AppInfo,
  PlanInfo,
  AccessCheckResult,
} from './types';

// Config
export {
  APPS,
  PLANS,
  APP_IDS,
  TRIAL_DURATION_DAYS,
} from './config';

// Service functions
export {
  getSubscription,
  saveSubscription,
  clearSubscription,
  checkAppAccess,
  getAllAppAccess,
  startTrial,
  activateSubscription,
  cancelSubscription,
  getTrialDaysRemaining,
  getAppTier,
  hasAnySubscription,
  createDemoSubscription,
} from './service';
