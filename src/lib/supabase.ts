import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          name: string;
          price: number;
          weight: string;
          image_url: string;
          description: string;
          stock: number;
          is_bestseller: boolean;
          is_new: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          price: number;
          weight: string;
          image_url?: string;
          description: string;
          stock: number;
          is_bestseller?: boolean;
          is_new?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          price?: number;
          weight?: string;
          image_url?: string;
          description?: string;
          stock?: number;
          is_bestseller?: boolean;
          is_new?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_name: string;
          customer_phone: string;
          customer_address: string;
          customer_pincode: string;
          items: any;
          total: number;
          status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
          payment_status: 'pending' | 'paid';
          order_date: string;
          delivery_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_name: string;
          customer_phone: string;
          customer_address: string;
          customer_pincode: string;
          items: any;
          total: number;
          status?: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
          payment_status?: 'pending' | 'paid';
          order_date?: string;
          delivery_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_name?: string;
          customer_phone?: string;
          customer_address?: string;
          customer_pincode?: string;
          items?: any;
          total?: number;
          status?: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
          payment_status?: 'pending' | 'paid';
          order_date?: string;
          delivery_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email?: string;
          address: string;
          pincode: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string;
          address: string;
          pincode: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string;
          address?: string;
          pincode?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      homepage_settings: {
        Row: {
          id: number;
          brand_name: string;
          hero_image_url: string | null;
          tagline: string;
          order_deadline_text: string;
          delivery_info_text: string;
          menu_title: string;
          serviceable_pincodes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          brand_name: string;
          hero_image_url?: string | null;
          tagline: string;
          order_deadline_text: string;
          delivery_info_text: string;
          menu_title?: string;
          serviceable_pincodes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          brand_name?: string;
          hero_image_url?: string | null;
          tagline?: string;
          order_deadline_text?: string;
          delivery_info_text?: string;
          menu_title?: string;
          serviceable_pincodes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
} 