/**
 * Promoteur - Local Entity Types
 *
 * These types are specific to the Promoteur (Real Estate Developer) application.
 * Do NOT import these from other apps.
 */

// ============================================================================
// PROJETS
// ============================================================================

export interface Project {
  id: string;
  name: string;
  code: string;
  address: string;
  postalCode: string;
  city: string;
  canton: string;
  description?: string;
  type: 'residential' | 'commercial' | 'mixed';
  status: 'planning' | 'pre_sales' | 'construction' | 'delivery' | 'completed' | 'archived';
  totalLots: number;
  soldLots: number;
  reservedLots: number;
  constructionStart?: string;
  constructionEnd?: string;
  deliveryDate?: string;
  totalBudget: number;
  salesTarget: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectPhase {
  id: string;
  projectId: string;
  name: string;
  order: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  progress: number; // 0-100
  milestones: string[];
}

export interface ProjectTeamMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'manager' | 'sales' | 'construction' | 'finance' | 'admin';
  permissions: string[];
  addedAt: string;
}

// ============================================================================
// LOTS
// ============================================================================

export interface Lot {
  id: string;
  projectId: string;
  number: string;
  building?: string;
  floor: number;
  type: 'apartment' | 'villa' | 'commercial' | 'parking' | 'storage';
  rooms?: number;
  surface: number;
  balconySurface?: number;
  gardenSurface?: number;
  orientation?: string;
  basePrice: number;
  currentPrice: number;
  pricePerSqm: number;
  status: 'available' | 'reserved' | 'sold' | 'blocked';
  reservedUntil?: string;
  buyerId?: string;
  reservationId?: string;
  planUrl?: string;
  virtualTourUrl?: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LotPriceHistory {
  id: string;
  lotId: string;
  oldPrice: number;
  newPrice: number;
  reason: string;
  changedBy: string;
  changedAt: string;
}

// ============================================================================
// CRM & PROSPECTS
// ============================================================================

export interface Prospect {
  id: string;
  projectId?: string;
  source: 'website' | 'referral' | 'broker' | 'event' | 'advertising' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'visit_scheduled' | 'visit_done' | 'negotiation' | 'won' | 'lost';
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  budget?: number;
  preferredRooms?: number;
  preferredFloor?: string;
  timeline?: string;
  notes?: string;
  score?: number;
  assignedTo?: string;
  lastContactAt?: string;
  lostReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProspectActivity {
  id: string;
  prospectId: string;
  type: 'call' | 'email' | 'visit' | 'meeting' | 'note';
  date: string;
  description: string;
  outcome?: string;
  nextAction?: string;
  nextActionDate?: string;
  createdBy: string;
  createdAt: string;
}

// ============================================================================
// RESERVATIONS
// ============================================================================

export interface Reservation {
  id: string;
  projectId: string;
  lotId: string;
  prospectId: string;
  status: 'pending' | 'confirmed' | 'expired' | 'converted' | 'cancelled';
  reservationDate: string;
  expirationDate: string;
  depositAmount: number;
  depositPaid: boolean;
  depositPaidAt?: string;
  conditions?: string;
  cancelledReason?: string;
  convertedToBuyerId?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// ACQUEREURS
// ============================================================================

export interface Buyer {
  id: string;
  projectId: string;
  lotId: string;
  type: 'individual' | 'company' | 'couple';
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  dateOfBirth?: string;
  nationality?: string;
  idNumber?: string;
  profession?: string;
  purchasePrice: number;
  paymentPlan: PaymentMilestone[];
  notaryId?: string;
  status: 'active' | 'completed' | 'cancelled';
  portalAccess: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMilestone {
  id: string;
  buyerId: string;
  description: string;
  percentage: number;
  amount: number;
  dueDate: string;
  paidAt?: string;
  paidAmount?: number;
  status: 'pending' | 'invoiced' | 'paid' | 'overdue';
}

export interface BuyerDocument {
  id: string;
  buyerId: string;
  type: 'id' | 'proof_of_funds' | 'contract' | 'amendment' | 'correspondence' | 'other';
  name: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

// ============================================================================
// FINANCE & CFC
// ============================================================================

export interface CFCBudget {
  id: string;
  projectId: string;
  version: number;
  status: 'draft' | 'approved' | 'active' | 'closed';
  totalBudget: number;
  committedAmount: number;
  invoicedAmount: number;
  paidAmount: number;
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CFCCategory {
  id: string;
  budgetId: string;
  code: string; // CFC code (e.g., "211", "271")
  name: string;
  budgetAmount: number;
  committedAmount: number;
  invoicedAmount: number;
  paidAmount: number;
  variance: number;
}

export interface Invoice {
  id: string;
  projectId: string;
  cfcCategoryId: string;
  supplierId: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  vatAmount: number;
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'paid' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  documentUrl?: string;
  createdAt: string;
}

// ============================================================================
// CONSTRUCTION
// ============================================================================

export interface ConstructionProgress {
  id: string;
  projectId: string;
  phaseId: string;
  date: string;
  overallProgress: number;
  notes?: string;
  weatherConditions?: string;
  workersOnSite?: number;
  photoUrls: string[];
  createdBy: string;
  createdAt: string;
}

export interface QualityInspection {
  id: string;
  projectId: string;
  lotId?: string;
  type: 'standard' | 'pre_delivery' | 'final';
  date: string;
  inspector: string;
  status: 'scheduled' | 'completed' | 'issues_found' | 'resolved';
  issuesCount: number;
  resolvedCount: number;
  reportUrl?: string;
  createdAt: string;
}

export interface ConstructionIssue {
  id: string;
  inspectionId: string;
  lotId?: string;
  location: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'verified';
  assignedTo?: string;
  resolvedAt?: string;
  photoUrls: string[];
  createdAt: string;
}

// ============================================================================
// MATERIAUX & CHOIX
// ============================================================================

export interface MaterialCategory {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  deadline?: string;
  order: number;
}

export interface MaterialOption {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  supplier?: string;
  basePrice: number;
  upgradePrice: number;
  isDefault: boolean;
  imageUrl?: string;
  specifications?: string;
}

export interface BuyerChoice {
  id: string;
  buyerId: string;
  lotId: string;
  categoryId: string;
  optionId: string;
  status: 'pending' | 'confirmed' | 'locked';
  confirmedAt?: string;
  additionalCost: number;
  notes?: string;
  createdAt: string;
}

// ============================================================================
// SOUMISSIONS
// ============================================================================

export interface Tender {
  id: string;
  projectId: string;
  cfcCode: string;
  title: string;
  description: string;
  status: 'draft' | 'open' | 'closed' | 'awarded' | 'cancelled';
  openingDate: string;
  closingDate: string;
  budget: number;
  invitedCompanies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TenderOffer {
  id: string;
  tenderId: string;
  companyId: string;
  amount: number;
  discount?: number;
  finalAmount: number;
  submittedAt: string;
  status: 'submitted' | 'under_review' | 'clarification' | 'accepted' | 'rejected';
  notes?: string;
  documentUrl?: string;
}

// ============================================================================
// NOTAIRE
// ============================================================================

export interface NotaryDossier {
  id: string;
  buyerId: string;
  notaryId: string;
  status: 'preparation' | 'documents_pending' | 'ready' | 'signed' | 'registered';
  actDate?: string;
  registrationNumber?: string;
  checklist: NotaryChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface NotaryChecklistItem {
  id: string;
  dossierId: string;
  item: string;
  required: boolean;
  status: 'pending' | 'received' | 'validated' | 'missing';
  documentUrl?: string;
  notes?: string;
}

// ============================================================================
// SAV
// ============================================================================

export interface SAVTicket {
  id: string;
  projectId: string;
  lotId: string;
  buyerId: string;
  title: string;
  description: string;
  category: 'defect' | 'finish' | 'equipment' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  warrantyType?: 'construction' | 'equipment' | 'none';
  warrantyExpiry?: string;
  assignedTo?: string;
  resolvedAt?: string;
  satisfactionRating?: number;
  photoUrls: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// COURTIERS
// ============================================================================

export interface Broker {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address?: string;
  licenseNumber?: string;
  commissionRate: number;
  status: 'active' | 'inactive';
  portalAccess: boolean;
  assignedProjects: string[];
  assignedLots: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BrokerCommission {
  id: string;
  brokerId: string;
  projectId: string;
  lotId: string;
  buyerId: string;
  salePrice: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'approved' | 'paid';
  paidAt?: string;
  invoiceUrl?: string;
  createdAt: string;
}
