/**
 * Realpro Suite | © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          default_language: 'FR' | 'DE' | 'EN' | 'IT';
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
          language: 'FR' | 'DE' | 'EN' | 'IT';
          avatar_url: string | null;
          phone: string | null;
          is_active: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
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
          status: 'PLANNING' | 'CONSTRUCTION' | 'SELLING' | 'COMPLETED' | 'ARCHIVED';
          start_date: string | null;
          end_date: string | null;
          total_surface: number | null;
          image_url: string | null;
          settings: Json;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      lots: {
        Row: {
          id: string;
          project_id: string;
          building_id: string;
          floor_id: string | null;
          code: string;
          type: 'APARTMENT' | 'COMMERCIAL' | 'PARKING' | 'STORAGE' | 'VILLA' | 'HOUSE';
          status: 'AVAILABLE' | 'RESERVED' | 'OPTION' | 'SOLD' | 'DELIVERED';
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
      };
      subscriptions: {
        Row: {
          id: string;
          organization_id: string;
          plan_id: string;
          status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
          billing_cycle: 'MONTHLY' | 'YEARLY';
          current_period_start: string;
          current_period_end: string;
          trial_start: string | null;
          trial_end: string | null;
          cancel_at_period_end: boolean;
          cancelled_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}
