/**
 * Subscription Service
 * Handles subscription management and access control
 *
 * NOTE: This is a localStorage-based implementation for development.
 * In production, this will be replaced with Supabase database calls.
 */

import type {
  AppId,
  AppSubscription,
  UserSubscription,
  AccessCheckResult,
  SubscriptionTier
} from './types';
import { TRIAL_DURATION_DAYS } from './config';

const STORAGE_KEY = 'realpro_subscription';

/**
 * Get the current user's subscription data
 */
export function getSubscription(): UserSubscription | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as UserSubscription;
  } catch {
    return null;
  }
}

/**
 * Save subscription data
 */
export function saveSubscription(subscription: UserSubscription): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription));
}

/**
 * Clear subscription data (logout)
 */
export function clearSubscription(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if user has access to a specific app
 */
export function checkAppAccess(appId: AppId): AccessCheckResult {
  const subscription = getSubscription();

  if (!subscription) {
    return { hasAccess: false, reason: 'no_subscription' };
  }

  const appSub = subscription.apps.find(a => a.appId === appId);

  if (!appSub) {
    return { hasAccess: false, reason: 'no_subscription' };
  }

  // Check status
  if (appSub.status === 'cancelled') {
    return { hasAccess: false, subscription: appSub, reason: 'cancelled' };
  }

  if (appSub.status === 'expired') {
    return { hasAccess: false, subscription: appSub, reason: 'expired' };
  }

  // Check trial expiration
  if (appSub.status === 'trial' && appSub.trialEndsAt) {
    const trialEnd = new Date(appSub.trialEndsAt);
    if (trialEnd < new Date()) {
      return { hasAccess: false, subscription: appSub, reason: 'expired' };
    }
  }

  // Check subscription end date
  if (appSub.endDate) {
    const endDate = new Date(appSub.endDate);
    if (endDate < new Date()) {
      return { hasAccess: false, subscription: appSub, reason: 'expired' };
    }
  }

  return { hasAccess: true, subscription: appSub };
}

/**
 * Get all app subscriptions with access status
 */
export function getAllAppAccess(): Record<AppId, AccessCheckResult> {
  return {
    'ppe-admin': checkAppAccess('ppe-admin'),
    'promoteur': checkAppAccess('promoteur'),
    'regie': checkAppAccess('regie'),
  };
}

/**
 * Subscribe to an app (starts trial)
 */
export function startTrial(appId: AppId, tier: SubscriptionTier = 'pro'): void {
  const subscription = getSubscription() || createEmptySubscription();

  const now = new Date();
  const trialEnd = new Date(now.getTime() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000);

  // Check if already subscribed
  const existingIndex = subscription.apps.findIndex(a => a.appId === appId);

  const newAppSub: AppSubscription = {
    appId,
    tier,
    status: 'trial',
    startDate: now.toISOString(),
    trialEndsAt: trialEnd.toISOString(),
  };

  if (existingIndex >= 0) {
    subscription.apps[existingIndex] = newAppSub;
  } else {
    subscription.apps.push(newAppSub);
  }

  subscription.updatedAt = now.toISOString();
  saveSubscription(subscription);
}

/**
 * Activate a paid subscription
 */
export function activateSubscription(
  appId: AppId,
  tier: SubscriptionTier,
  durationMonths: number = 12
): void {
  const subscription = getSubscription() || createEmptySubscription();

  const now = new Date();
  const endDate = new Date(now.getTime() + durationMonths * 30 * 24 * 60 * 60 * 1000);

  const existingIndex = subscription.apps.findIndex(a => a.appId === appId);

  const newAppSub: AppSubscription = {
    appId,
    tier,
    status: 'active',
    startDate: now.toISOString(),
    endDate: endDate.toISOString(),
  };

  if (existingIndex >= 0) {
    subscription.apps[existingIndex] = newAppSub;
  } else {
    subscription.apps.push(newAppSub);
  }

  subscription.updatedAt = now.toISOString();
  saveSubscription(subscription);
}

/**
 * Cancel a subscription
 */
export function cancelSubscription(appId: AppId): void {
  const subscription = getSubscription();
  if (!subscription) return;

  const appSub = subscription.apps.find(a => a.appId === appId);
  if (appSub) {
    appSub.status = 'cancelled';
  }

  subscription.updatedAt = new Date().toISOString();
  saveSubscription(subscription);
}

/**
 * Create empty subscription object
 */
function createEmptySubscription(): UserSubscription {
  const now = new Date().toISOString();
  return {
    userId: 'demo-user', // Will be replaced with real user ID
    apps: [],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Get days remaining in trial
 */
export function getTrialDaysRemaining(appId: AppId): number | null {
  const result = checkAppAccess(appId);

  if (!result.subscription || result.subscription.status !== 'trial') {
    return null;
  }

  if (!result.subscription.trialEndsAt) {
    return null;
  }

  const trialEnd = new Date(result.subscription.trialEndsAt);
  const now = new Date();
  const diffMs = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000));

  return Math.max(0, diffDays);
}

/**
 * Get subscription tier for an app
 */
export function getAppTier(appId: AppId): SubscriptionTier | null {
  const result = checkAppAccess(appId);
  return result.subscription?.tier || null;
}

/**
 * Check if user has any active subscription
 */
export function hasAnySubscription(): boolean {
  const subscription = getSubscription();
  if (!subscription || subscription.apps.length === 0) return false;

  return subscription.apps.some(app =>
    app.status === 'active' || app.status === 'trial'
  );
}

// Demo: Create a demo subscription for testing
export function createDemoSubscription(apps: AppId[]): void {
  const subscription = createEmptySubscription();

  const now = new Date();
  const endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year

  for (const appId of apps) {
    subscription.apps.push({
      appId,
      tier: 'pro',
      status: 'active',
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
    });
  }

  saveSubscription(subscription);
}
