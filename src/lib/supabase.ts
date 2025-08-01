import { createClient } from '@supabase/supabase-js';

// Check for both VITE_ prefixed and standard environment variable names
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co' || supabaseUrl === 'your_supabase_project_url') {
  console.error('❌ VITE_SUPABASE_URL is not properly configured');
  console.error('Please set VITE_SUPABASE_URL in your environment variables');
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.error('❌ VITE_SUPABASE_ANON_KEY is not properly configured');
  console.error('Please set VITE_SUPABASE_ANON_KEY in your environment variables');
}

// Create Supabase client with validated credentials
export const supabase = createClient(
  supabaseUrl || 'https://your-project.supabase.co',
  supabaseAnonKey || 'your-anon-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

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
          image_url: string | null;
          description: string;
          stock: number;
          is_bestseller: boolean;
          is_new: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          sort_order: number;
        };
        Insert: {
          id?: number;
          name: string;
          price: number;
          weight: string;
          image_url?: string | null;
          description: string;
          stock?: number;
          is_bestseller?: boolean;
          is_new?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          sort_order?: number;
        };
        Update: {
          id?: number;
          name?: string;
          price?: number;
          weight?: string;
          image_url?: string | null;
          description?: string;
          stock?: number;
          is_bestseller?: boolean;
          is_new?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          sort_order?: number;
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
          delivery_date: string | null;
          created_at: string;
          updated_at: string;
          customer_email: string | null;
          is_archived: boolean;
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
          delivery_date?: string | null;
          created_at?: string;
          updated_at?: string;
          customer_email?: string | null;
          is_archived?: boolean;
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
          delivery_date?: string | null;
          created_at?: string;
          updated_at?: string;
          customer_email?: string | null;
          is_archived?: boolean;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          address: string;
          pincode: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          address: string;
          pincode: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          address?: string;
          pincode?: string;
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
      homepage_settings: {
        Row: {
          id: number;
          brand_name: string;
          hero_image_url: string | null;
          tagline: string;
          order_deadline_text: string;
          delivery_info_text: string;
          menu_title: string | null;
          serviceable_pincodes: string | null;
          created_at: string;
          updated_at: string;
          about_title: string;
          about_content: string;
          about_image_url: string;
        };
        Insert: {
          id?: number;
          brand_name?: string;
          hero_image_url?: string | null;
          tagline?: string;
          order_deadline_text?: string;
          delivery_info_text?: string;
          menu_title?: string | null;
          serviceable_pincodes?: string | null;
          created_at?: string;
          updated_at?: string;
          about_title: string;
          about_content: string;
          about_image_url: string;
        };
        Update: {
          id?: number;
          brand_name?: string;
          hero_image_url?: string | null;
          tagline?: string;
          order_deadline_text?: string;
          delivery_info_text?: string;
          menu_title?: string | null;
          serviceable_pincodes?: string | null;
          created_at?: string;
          updated_at?: string;
          about_title?: string;
          about_content?: string;
          about_image_url?: string;
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