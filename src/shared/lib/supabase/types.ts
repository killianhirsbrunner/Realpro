/**
 * RealPro | Database Types
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type LanguageCode = 'FR' | 'DE' | 'EN' | 'IT';

export type ProjectStatus = 'PLANNING' | 'CONSTRUCTION' | 'SELLING' | 'COMPLETED' | 'ARCHIVED';

export type LotType = 'APARTMENT' | 'COMMERCIAL' | 'PARKING' | 'STORAGE' | 'VILLA' | 'HOUSE';

export type LotStatus = 'AVAILABLE' | 'RESERVED' | 'OPTION' | 'SOLD' | 'DELIVERED';

export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';

export type BillingCycle = 'MONTHLY' | 'YEARLY';

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          default_language: LanguageCode;
          logo_url: string | null;
          settings: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['organizations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          language: LanguageCode;
          avatar_url: string | null;
          phone: string | null;
          is_active: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          code: string;
          description: string | null;
          address: string | null;
          city: string | null;
          postal_code: string | null;
          country: string;
          status: ProjectStatus;
          start_date: string | null;
          end_date: string | null;
          total_surface: number | null;
          image_url: string | null;
          settings: Json;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      lots: {
        Row: {
          id: string;
          project_id: string;
          building_id: string;
          floor_id: string | null;
          code: string;
          type: LotType;
          status: LotStatus;
          rooms_count: number | null;
          surface_living: number | null;
          surface_total: number | null;
          price_base: number | null;
          price_total: number | null;
          orientation: string | null;
          floor_level: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['lots']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['lots']['Insert']>;
      };
      buyers: {
        Row: {
          id: string;
          project_id: string;
          lot_id: string | null;
          user_id: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          address: string | null;
          city: string | null;
          postal_code: string | null;
          country: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['buyers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['buyers']['Insert']>;
      };
      documents: {
        Row: {
          id: string;
          project_id: string;
          folder_id: string | null;
          name: string;
          type: string;
          size: number;
          url: string;
          uploaded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['documents']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          data: Json | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      plans: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: Json;
          price_monthly: number;
          price_yearly: number;
          currency: string;
          features: Json;
          limits: Json;
          is_active: boolean;
          trial_days: number;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['plans']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['plans']['Insert']>;
      };
      subscriptions: {
        Row: {
          id: string;
          organization_id: string;
          plan_id: string;
          status: SubscriptionStatus;
          billing_cycle: BillingCycle;
          current_period_start: string;
          current_period_end: string;
          trial_start: string | null;
          trial_end: string | null;
          cancel_at_period_end: boolean;
          cancelled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
    };
  };
}

// Convenient type aliases
export type Organization = Database['public']['Tables']['organizations']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Lot = Database['public']['Tables']['lots']['Row'];
export type Buyer = Database['public']['Tables']['buyers']['Row'];
export type Document = Database['public']['Tables']['documents']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type Plan = Database['public']['Tables']['plans']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
