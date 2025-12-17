// Materials Types - Shared type definitions for materials/choices module

/**
 * Material category
 */
export interface MaterialCategory {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  options: MaterialOption[];
  deadline?: string;
  is_mandatory: boolean;
}

/**
 * Material option within a category
 */
export interface MaterialOption {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  supplier_id?: string;
  supplier_name?: string;
  reference?: string;
  price_base: number;
  price_upgrade: number;
  is_default: boolean;
  is_available: boolean;
  image_url?: string;
  specifications?: Record<string, string>;
  created_at: string;
}

/**
 * Buyer material choice
 */
export interface MaterialChoice {
  id: string;
  lot_id: string;
  buyer_id: string;
  category_id: string;
  option_id: string;
  status: 'pending' | 'confirmed' | 'ordered' | 'delivered' | 'installed';
  notes?: string;
  confirmed_at?: string;
  confirmed_by?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Material choice with details
 */
export interface MaterialChoiceWithDetails extends MaterialChoice {
  category: MaterialCategory;
  option: MaterialOption;
}

/**
 * Supplier data
 */
export interface Supplier {
  id: string;
  name: string;
  type: 'kitchen' | 'bathroom' | 'flooring' | 'electrical' | 'other';
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  showroom_address?: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
}

/**
 * Supplier appointment
 */
export interface SupplierAppointment {
  id: string;
  lot_id: string;
  buyer_id: string;
  supplier_id: string;
  date: string;
  time_slot: string;
  duration_minutes: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  location?: string;
  notes?: string;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Appointment with relations
 */
export interface AppointmentWithDetails extends SupplierAppointment {
  supplier: Supplier;
  buyer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  lot: {
    id: string;
    code: string;
  };
}

/**
 * Available time slot
 */
export interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
  supplier_id: string;
}

/**
 * Material modification request
 */
export interface ModificationRequest {
  id: string;
  lot_id: string;
  buyer_id: string;
  category: string;
  description: string;
  current_option?: string;
  requested_option?: string;
  price_impact: number;
  status: 'pending' | 'reviewing' | 'quoted' | 'approved' | 'rejected' | 'completed';
  rejection_reason?: string;
  quote_amount?: number;
  quote_valid_until?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Materials summary for a lot
 */
export interface MaterialsSummary {
  lot_id: string;
  total_categories: number;
  completed_choices: number;
  pending_choices: number;
  total_upgrades: number;
  appointments_scheduled: number;
  appointments_completed: number;
  next_deadline?: string;
}

/**
 * UseMaterialCategories hook return type
 */
export interface UseMaterialCategoriesReturn {
  categories: MaterialCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * UseMaterialChoices hook return type
 */
export interface UseMaterialChoicesReturn {
  choices: MaterialChoiceWithDetails[];
  summary: MaterialsSummary;
  loading: boolean;
  error: string | null;
  saveChoice: (categoryId: string, optionId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * UseSupplierAppointments hook return type
 */
export interface UseSupplierAppointmentsReturn {
  appointments: AppointmentWithDetails[];
  availableSlots: TimeSlot[];
  loading: boolean;
  error: string | null;
  bookAppointment: (supplierId: string, date: string, time: string) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  refetch: () => Promise<void>;
}
