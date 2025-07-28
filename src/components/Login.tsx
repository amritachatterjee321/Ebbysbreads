import React, { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { Loader2, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configStatus, setConfigStatus] = useState<{ configured: boolean; missing: string[] } | null>(null);

  useEffect(() => {
    // Check configuration status on component mount
    const status = authService.getConfigurationStatus();
    setConfigStatus(status);
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if Supabase is properly configured
      if (!authService.isSupabaseConfigured()) {
        setError('Supabase is not properly configured. Please check your environment variables.');
        return;
      }

      const { error } = await authService.signInWithGoogle();
      
      if (error) {
        console.error('Google OAuth error:', error);
        
        // Provide more specific error messages
        if (error.message?.includes('redirect_uri_mismatch')) {
          setError('Redirect URI mismatch. Please check your Google OAuth configuration.');
        } else if (error.message?.includes('invalid_client')) {
          setError('Invalid OAuth client. Please check your Google OAuth credentials.');
        } else if (error.message?.includes('access_denied')) {
          setError('Access denied. Please try again or contact support.');
        } else {
          setError(error.message || 'Failed to sign in with Google. Please try again.');
        }
      } else {
        // The user will be redirected to Google OAuth
        console.log('Redirecting to Google OAuth...');
        // Don't set loading to false here as the user will be redirected
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      // Only set loading to false if there was an error
      if (error) {
        setIsLoading(false);
      }
    }
  };

  const renderConfigurationStatus = () => {
    if (!configStatus) return null;

    if (!configStatus.configured) {
      return (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Configuration Required</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Missing environment variables: {configStatus.missing.join(', ')}
              </p>
              <p className="text-sm text-yellow-600 mt-2">
                Please create a <code className="bg-yellow-100 px-1 rounded">.env</code> file with your Supabase credentials.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
        <div className="flex">
          <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-green-800">Configuration Ready</h3>
            <p className="text-sm text-green-700 mt-1">
              Supabase is properly configured and ready for authentication.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Admin Access
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the bakery admin panel
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {renderConfigurationStatus()}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading || !configStatus?.configured}
              className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Only authorized users can access the admin panel
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-xs text-gray-400">
            Protected by Supabase Authentication
          </p>
          <div className="space-y-1">
            <a
              href="/setup-guide"
              className="text-xs text-blue-600 hover:text-blue-800 underline block"
            >
              Need help setting up Google OAuth?
            </a>
            <a
              href="/troubleshooter"
              className="text-xs text-blue-600 hover:text-blue-800 underline block"
            >
              Troubleshoot authentication issues
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 