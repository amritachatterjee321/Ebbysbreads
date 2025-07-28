import React, { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { User } from '@supabase/supabase-js';
import Login from './Login';
import AdminDashboard from '../AdminDashboard';
import { Loader2, Shield } from 'lucide-react';

const ProtectedAdminRoute: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await handleUserSignIn(session.user);
        } else if (event === 'SIGNED_OUT') {
          handleUserSignOut();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      
      if (currentUser) {
        await handleUserSignIn(currentUser);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('Error checking auth:', err);
      setError('Failed to check authentication status');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSignIn = async (user: User) => {
    try {
      // Check if user is admin
      const adminStatus = await authService.isAdmin(user);
      
      if (adminStatus) {
        setUser(user);
        setIsAdmin(true);
        setError(null);
        
        // Create or update user profile
        await authService.upsertUserProfile(user);
      } else {
        setError('Access denied. You do not have admin privileges.');
        setUser(null);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('Error handling user sign in:', err);
      setError('Failed to verify admin privileges');
      setUser(null);
      setIsAdmin(false);
    }
  };

  const handleUserSignOut = () => {
    setUser(null);
    setIsAdmin(false);
    setError(null);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      handleUserSignOut();
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Login onLoginSuccess={checkAuth} />;
  }

  return (
    <div>
      {/* Admin Header with User Info */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Bakery Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">
                    {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
                  </p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Dashboard */}
      <AdminDashboard />
    </div>
  );
};

export default ProtectedAdminRoute; 