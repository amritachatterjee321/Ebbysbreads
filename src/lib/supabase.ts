import { createClient } from '@supabase/supabase-js';

// Check for both VITE_ prefixed and standard environment variable names
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category: string;
          available: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category: string;
          available?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string;
          price?: number;
          image_url?: string;
          category?: string;
          available?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: number;
          customer_name: string;
          customer_phone: string;
          customer_address: string;
          customer_pincode: string;
          total: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          customer_name: string;
          customer_phone: string;
          customer_address: string;
          customer_pincode: string;
          total: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          customer_name?: string;
          customer_phone?: string;
          customer_address?: string;
          customer_pincode?: string;
          total?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: number;
          name: string;
          email: string;
          phone: string;
          address: string;
          pincode: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          email: string;
          phone: string;
          address: string;
          pincode: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          email?: string;
          phone?: string;
          address?: string;
          pincode?: string;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      homepage_settings: {
        Row: {
          id: number;
          hero_title: string;
          hero_subtitle: string;
          hero_image_url: string;
          about_text: string;
          contact_email: string;
          contact_phone: string;
          contact_address: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          hero_title: string;
          hero_subtitle: string;
          hero_image_url: string;
          about_text: string;
          contact_email: string;
          contact_phone: string;
          contact_address: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          hero_title?: string;
          hero_subtitle?: string;
          hero_image_url?: string;
          about_text?: string;
          contact_email?: string;
          contact_phone?: string;
          contact_address?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      serviceable_pincodes: {
        Row: {
          id: number;
          pincode: string;
          city: string;
          state: string;
          delivery_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          pincode: string;
          city: string;
          state: string;
          delivery_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          pincode?: string;
          city?: string;
          state?: string;
          delivery_available?: boolean;
          created_at?: string;
        };
      };
    };
  };
} 