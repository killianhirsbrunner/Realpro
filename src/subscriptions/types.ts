/**
 * Subscription types for Realpro Suite
 * Defines apps, plans, and access control
 */

// Available applications
export type AppId = 'ppe-admin' | 'promoteur' | 'regie';

// Subscription tiers
export type SubscriptionTier = 'starter' | 'pro' | 'enterprise';

// Subscription status
export type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'cancelled';

// Individual app subscription
export interface AppSubscription {
  appId: AppId;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  trialEndsAt?: string;
}

// User's complete subscription data
export interface UserSubscription {
  userId: string;
  apps: AppSubscription[];
  createdAt: string;
  updatedAt: string;
}

// App metadata
export interface AppInfo {
  id: AppId;
  name: string;
  description: string;
  path: string;
  color: string;
  icon: string;
}

// Plan pricing info
export interface PlanInfo {
  tier: SubscriptionTier;
  name: string;
  price: number | 'custom';
  features: string[];
  limits: {
    [key: string]: number | 'unlimited';
  };
}

// Access check result
export interface AccessCheckResult {
  hasAccess: boolean;
  subscription?: AppSubscription;
  reason?: 'no_subscription' | 'expired' | 'cancelled';
}
