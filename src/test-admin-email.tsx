import React, { useState, useEffect } from 'react';
import { simpleEmailService } from './services/email-simple';
import { supabase } from './lib/supabase';

const TestAdminEmail: React.FC = () => {
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfiles, setUserProfiles] = useState<any[]>([]);

  const checkAdminEmail = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Checking admin email...');
      const email = await simpleEmailService.getAdminEmail();
      setAdminEmail(email);
      console.log('Admin email result:', email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error checking admin email:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserProfiles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Checking user_profiles table...');
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      setUserProfiles(data || []);
      console.log('User profiles:', data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error checking user profiles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAdminEmail();
    checkUserProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Email Test</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Admin Email Status</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              {isLoading ? (
                <p className="text-blue-600">Loading...</p>
              ) : adminEmail ? (
                <div className="text-green-600">
                  <p><strong>✅ Admin Email Found:</strong> {adminEmail}</p>
                </div>
              ) : (
                <div className="text-red-600">
                  <p><strong>❌ No Admin Email Found</strong></p>
                  {error && <p>Error: {error}</p>}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">User Profiles in Database</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              {userProfiles.length > 0 ? (
                <div>
                  <p className="text-green-600 mb-2">Found {userProfiles.length} user(s):</p>
                  <div className="space-y-2">
                    {userProfiles.map((user, index) => (
                      <div key={index} className="border border-gray-200 p-2 rounded">
                        <p><strong>Email:</strong> {user.email || 'No email'}</p>
                        <p><strong>Role:</strong> {user.role || 'No role'}</p>
                        <p><strong>Admin:</strong> {user.role === 'admin' ? '✅ Yes' : '❌ No'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-red-600">No user profiles found in database</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Actions</h2>
            <div className="flex gap-3">
              <button
                onClick={checkAdminEmail}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Checking...' : 'Check Admin Email'}
              </button>
              
              <button
                onClick={checkUserProfiles}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Checking...' : 'Check User Profiles'}
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• If no admin email is found, you need to create a user with role='admin'</li>
              <li>• Check the browser console for detailed logs</li>
              <li>• Make sure your database connection is working</li>
              <li>• The user_profiles table should have at least one user with role='admin'</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAdminEmail; 