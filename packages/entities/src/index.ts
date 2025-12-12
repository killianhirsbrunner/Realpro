/**
 * RealPro | Entities Package
 *
 * Structure du package:
 *
 * @realpro/entities
 * ├── shared/          Types partagés (User, Organization, base types)
 * └── promoteur/       Types spécifiques Promoteur (Project, Lot, etc.)
 *
 * ═══════════════════════════════════════════════════════════════════════
 * RÈGLES D'UTILISATION
 * ═══════════════════════════════════════════════════════════════════════
 *
 * 1. SHARED (autorisé partout):
 *    import { User, Organization, LanguageCode } from '@realpro/entities'
 *    import { User } from '@realpro/entities/shared'
 *
 * 2. PROMOTEUR (app promoteur uniquement):
 *    import { Project, Lot, ProjectStatus } from '@realpro/entities/promoteur'
 *
 * 3. PPE-ADMIN: créer les types dans apps/ppe-admin/src/entities/
 *
 * 4. RÉGIE: créer les types dans apps/regie/src/entities/
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

// ============================================================================
// Shared Types (exported at root level for convenience)
// ============================================================================

// Base types
export {
  type Json,
  type LanguageCode,
  LANGUAGE_LABELS,
  type SubscriptionStatus,
  type BillingCycle,
  SUBSCRIPTION_STATUS_LABELS,
  type BaseUserRole,
  BASE_ROLE_LABELS,
  type Address,
  formatFullAddress,
  SWISS_CANTONS,
  type SwissCanton,
} from './shared';

// User types
export {
  type User,
  type UserWithRole,
  type UserOrganization,
  type CreateUserInput,
  type UpdateUserInput,
  getUserFullName,
  getUserInitials,
  getUserDisplayName,
} from './shared';

// Organization types
export {
  type Organization,
  type OrganizationWithStats,
  type CreateOrganizationInput,
  type UpdateOrganizationInput,
  getOrganizationInitials,
  isOrganizationActive,
} from './shared';

// ============================================================================
// Entity exports from individual modules (for backward compatibility)
// ============================================================================

export * from './organization';
export * from './user';
export * from './project';
export * from './lot';
export * from './buyer';
export * from './prospect';
export * from './finance';

// ============================================================================
// LEGACY EXPORTS (backward compatibility - will be deprecated)
// ============================================================================

// Re-export promoteur types at root level for backward compatibility
// TODO: Migrate apps/promoteur to use '@realpro/entities/promoteur' directly
// Note: ProspectStatus, BuyerStatus, PROSPECT_STATUS_LABELS, BUYER_STATUS_LABELS
// are exported from ./prospect and ./buyer modules (not promoteur) to use the correct versions
export {
  // Enums (only promoteur-specific)
  type ProjectStatus,
  type LotType,
  type LotStatus,
  type ReservationStatus,
  type PromoteurUserRole,
  // Labels (only promoteur-specific)
  PROJECT_STATUS_LABELS,
  LOT_STATUS_LABELS,
  LOT_TYPE_LABELS,
  PROMOTEUR_ROLE_LABELS,
  // Entities
  type Project,
  type ProjectWithStats,
  type CreateProjectInput,
  type UpdateProjectInput,
  type Building,
  type Floor,
  type Entrance,
  type Lot,
  type LotWithBuyer,
  type CreateLotInput,
  type UpdateLotInput,
  type LotFilters,
  type Reservation,
  // Utils
  getProjectFullAddress,
  isProjectActive,
  isProjectCompleted,
  getLotDisplayName,
  isLotAvailable,
  isLotSold,
  isLotReserved,
  canConvertProspect,
} from './promoteur';

// ============================================================================
// Backward compatibility aliases (deprecated)
// ============================================================================

/**
 * @deprecated Use PromoteurUserRole instead
 */
export { type PromoteurUserRole as UserRole } from './promoteur';

/**
 * @deprecated Use PROMOTEUR_ROLE_LABELS instead
 */
export { PROMOTEUR_ROLE_LABELS as ROLE_LABELS } from './promoteur';
