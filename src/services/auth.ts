import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export const authService = {
  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting current user:', error);
        return null;
      }
      return user;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return null;
    }
  },

  // Get current session
  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting current session:', error);
        return null;
      }
      return session;
    } catch (error) {
      console.error('Error in getCurrentSession:', error);
      return null;
    }
  },

  // Sign in with Google
  async signInWithGoogle(): Promise<{ error: any }> {
    try {
      // Get the current URL to use as redirect
      const currentUrl = window.location.origin;
      const redirectUrl = `${currentUrl}/admin`;

      console.log('Initiating Google OAuth with redirect URL:', redirectUrl);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google OAuth error:', error);
        return { error };
      }

      // If no error, the user should be redirected to Google
      console.log('Google OAuth initiated successfully');
      return { error: null };
    } catch (error) {
      console.error('Unexpected error in signInWithGoogle:', error);
      return { error };
    }
  },

  // Sign out
  async signOut(): Promise<{ error: any }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      return { error };
    } catch (error) {
      console.error('Unexpected error in signOut:', error);
      return { error };
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Check if user is admin (you can customize this logic)
  async isAdmin(user: User | null): Promise<boolean> {
    if (!user) return false;
    
    // For now, we'll consider any authenticated user as admin
    // You can add more specific logic here based on your requirements
    // For example, check user metadata, role, or email domain
    
    // Example: Only allow specific email domains
    // const allowedDomains = ['yourcompany.com', 'gmail.com'];
    // const userDomain = user.email?.split('@')[1];
    // return allowedDomains.includes(userDomain || '');
    
    // Example: Only allow specific email addresses
    // const allowedEmails = ['admin@yourcompany.com', 'owner@gmail.com'];
    // return allowedEmails.includes(user.email || '');
    
    return true;
  },

  // Get user profile data
  async getUserProfile(userId: string): Promise<AuthUser | null> {
    try {
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
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  },

  // Create or update user profile
  async upsertUserProfile(user: User): Promise<{ data: any; error: any }> {
    try {
      const profile = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
        updated_at: new Date().toISOString(),
      };

      console.log('Upserting user profile:', profile);

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profile, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.error('Error upserting user profile:', error);
      } else {
        console.log('User profile upserted successfully:', data);
      }

      return { data, error };
    } catch (error) {
      console.error('Unexpected error in upsertUserProfile:', error);
      return { data: null, error };
    }
  },

  // Check if Supabase is properly configured
  isSupabaseConfigured(): boolean {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    return !!(url && key && url !== 'your_supabase_project_url' && key !== 'your_supabase_anon_key');
  },

  // Get configuration status
  getConfigurationStatus(): { configured: boolean; missing: string[] } {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    const missing = [];
    if (!url || url === 'your_supabase_project_url') {
      missing.push('VITE_SUPABASE_URL');
    }
    if (!key || key === 'your_supabase_anon_key') {
      missing.push('VITE_SUPABASE_ANON_KEY');
    }
    
    return {
      configured: missing.length === 0,
      missing
    };
  }
}; 