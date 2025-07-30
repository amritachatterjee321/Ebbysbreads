import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export const authService = {
  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Get current session
  async getCurrentSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Sign in with Google
  async signInWithGoogle(): Promise<{ error: any }> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`
      }
    });
    return { error };
  },

  // Sign out
  async signOut(): Promise<{ error: any }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  },

  // Create or update user profile
  async upsertUserProfile(profile: Partial<UserProfile>): Promise<{ error: any }> {
    const { error } = await supabase
      .from('user_profiles')
      .upsert(profile, { onConflict: 'id' });

    return { error };
  },

  // Check if user is admin
  async isAdmin(userId: string): Promise<boolean> {
    const profile = await this.getUserProfile(userId);
    return profile?.role === 'admin';
  },

  // Check if Supabase is configured
  isConfigured(): boolean {
    // Check for both VITE_ prefixed and standard environment variable names
    const url = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;
    
    return !!(url && key && url !== 'your_supabase_project_url' && key !== 'your_supabase_anon_key');
  },

  // Get configuration status
  getConfigurationStatus(): { configured: boolean; missing: string[] } {
    // Check for both VITE_ prefixed and standard environment variable names
    const url = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;
    
    const missing = [];
    if (!url || url === 'your_supabase_project_url') {
      missing.push('VITE_SUPABASE_URL or SUPABASE_URL');
    }
    if (!key || key === 'your_supabase_anon_key') {
      missing.push('VITE_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY');
    }
    
    return {
      configured: missing.length === 0,
      missing
    };
  }
}; 