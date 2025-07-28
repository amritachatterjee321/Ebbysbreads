import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Copy } from 'lucide-react';
import { authService } from '../services/auth';

const OAuthProductionChecker: React.FC = () => {
  const [checks, setChecks] = useState<{
    environmentVariables: boolean;
    supabaseConnection: boolean;
    currentDomain: string;
    expectedRedirects: string[];
    googleOAuthConfigured: boolean;
  }>({
    environmentVariables: false,
    supabaseConnection: false,
    currentDomain: '',
    expectedRedirects: [],
    googleOAuthConfigured: false
  });

  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    runChecks();
  }, []);

  const runChecks = async () => {
    const currentDomain = window.location.origin;
    const expectedRedirects = [
      `${currentDomain}/auth/callback`,
      `${currentDomain}/admin`
    ];

    // Check environment variables
    const configStatus = authService.getConfigurationStatus();
    
    // Check Supabase connection
    let supabaseConnected = false;
    try {
      await authService.getCurrentUser();
      supabaseConnected = true; // If no error, connection works
    } catch (error) {
      console.error('Supabase connection error:', error);
    }

    setChecks({
      environmentVariables: configStatus.configured,
      supabaseConnection: supabaseConnected,
      currentDomain,
      expectedRedirects,
      googleOAuthConfigured: configStatus.configured && supabaseConnected
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const getGoogleCloudConsoleUrl = () => {
    return 'https://console.cloud.google.com/apis/credentials';
  };

  const getSupabaseAuthUrl = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    return supabaseUrl ? `${supabaseUrl.replace('/rest/v1', '')}/auth/providers` : '';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          OAuth Production Configuration Checker
        </h1>
        <p className="text-gray-600">
          Diagnosing Google OAuth configuration for production deployment
        </p>
      </div>

      <div className="space-y-6">
        {/* Environment Variables Check */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            {checks.environmentVariables ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            <h3 className="text-lg font-semibold">Environment Variables</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">VITE_SUPABASE_URL:</span>
              <span className={`text-sm ${import.meta.env.VITE_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}`}>
                {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">VITE_SUPABASE_ANON_KEY:</span>
              <span className={`text-sm ${import.meta.env.VITE_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}`}>
                {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
              </span>
            </div>
          </div>
        </div>

        {/* Current Domain */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <h3 className="text-lg font-semibold">Current Domain</h3>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-gray-800">{checks.currentDomain}</span>
              <button
                onClick={() => copyToClipboard(checks.currentDomain)}
                className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
              >
                <Copy className="h-4 w-4 mr-1" />
                {copied === checks.currentDomain ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Required Redirect URIs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            <h3 className="text-lg font-semibold">Required Google Cloud Console Redirect URIs</h3>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-4">
              Add these URLs to your Google Cloud Console OAuth 2.0 Client ID:
            </p>
            
            {checks.expectedRedirects.map((url, index) => (
              <div key={index} className="bg-gray-50 rounded-md p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-gray-800">{url}</span>
                  <button
                    onClick={() => copyToClipboard(url)}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {copied === url ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <a
              href={getGoogleCloudConsoleUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Google Cloud Console
            </a>
          </div>
        </div>

        {/* Supabase Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            {checks.supabaseConnection ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            <h3 className="text-lg font-semibold">Supabase Configuration</h3>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-4">
              Update these settings in your Supabase dashboard:
            </p>
            
            <div className="bg-gray-50 rounded-md p-4">
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Site URL:</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-mono text-gray-800">{checks.currentDomain}</span>
                    <button
                      onClick={() => copyToClipboard(checks.currentDomain)}
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      {copied === checks.currentDomain ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Redirect URLs:</span>
                  {checks.expectedRedirects.map((url, index) => (
                    <div key={index} className="flex items-center justify-between mt-1">
                      <span className="text-sm font-mono text-gray-800">{url}</span>
                      <button
                        onClick={() => copyToClipboard(url)}
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {copied === url ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {getSupabaseAuthUrl() && (
            <div className="mt-4">
              <a
                href={getSupabaseAuthUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Supabase Auth Settings
              </a>
            </div>
          )}
        </div>

        {/* Action Items */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Action Required
              </h3>
              <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
                <li>Update Google Cloud Console OAuth 2.0 Client ID with the redirect URIs above</li>
                <li>Update Supabase Authentication Settings with the Site URL and Redirect URLs above</li>
                <li>Ensure your production environment variables are set correctly</li>
                <li>Test the OAuth flow in an incognito browser window</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Test Button */}
        <div className="text-center">
          <button
            onClick={runChecks}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 mr-4"
          >
            Re-run Checks
          </button>
          <a
            href="/admin"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Test OAuth Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default OAuthProductionChecker; 