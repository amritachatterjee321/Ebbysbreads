import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { authService } from '../services/auth';

const OAuthTroubleshooter: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: any = {};

    try {
      // Check environment variables
      const configStatus = authService.getConfigurationStatus();
      results.environment = {
        configured: configStatus.configured,
        missing: configStatus.missing,
        status: configStatus.configured ? 'success' : 'error'
      };

      // Check Supabase connection
      try {
        const user = await authService.getCurrentUser();
        results.supabaseConnection = {
          status: 'success',
          message: 'Supabase connection successful',
          user: user ? 'User found' : 'No user logged in'
        };
      } catch (error) {
        results.supabaseConnection = {
          status: 'error',
          message: 'Failed to connect to Supabase',
          error: error
        };
      }

      // Check current URL
      results.currentUrl = {
        status: 'info',
        url: window.location.href,
        origin: window.location.origin,
        protocol: window.location.protocol
      };

      // Check browser compatibility
      results.browser = {
        status: 'info',
        userAgent: navigator.userAgent,
        cookiesEnabled: navigator.cookieEnabled,
        localStorage: typeof localStorage !== 'undefined' ? 'Available' : 'Not available'
      };

    } catch (error) {
      results.general = {
        status: 'error',
        message: 'Diagnostics failed',
        error: error
      };
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const commonIssues = [
    {
      title: "Redirect URI Mismatch",
      description: "The redirect URI in Google Cloud Console doesn't match your Supabase callback URL",
      solution: "Add https://your-project-ref.supabase.co/auth/v1/callback to your Google OAuth client's authorized redirect URIs",
      link: "https://console.cloud.google.com/apis/credentials"
    },
    {
      title: "Invalid Client ID/Secret",
      description: "The Google OAuth credentials are incorrect or not properly configured in Supabase",
      solution: "Verify your Google Client ID and Client Secret in Supabase Authentication > Providers > Google",
      link: null
    },
    {
      title: "Missing Environment Variables",
      description: "Supabase URL or Anon Key not properly configured",
      solution: "Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY",
      link: null
    },
    {
      title: "OAuth Consent Screen Not Configured",
      description: "The OAuth consent screen needs to be set up in Google Cloud Console",
      solution: "Configure the OAuth consent screen and add your email as a test user",
      link: "https://console.cloud.google.com/apis/credentials/consent"
    },
    {
      title: "Site URL Not Set in Supabase",
      description: "The site URL in Supabase Authentication settings is incorrect",
      solution: "Set the Site URL to http://localhost:5181 in Supabase Authentication > Settings",
      link: null
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          OAuth Troubleshooter
        </h1>
        <p className="text-gray-600">
          Diagnose and fix Google OAuth authentication issues
        </p>
      </div>

      <div className="mb-8">
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            'Run Diagnostics'
          )}
        </button>
      </div>

      {diagnostics && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Diagnostic Results</h2>
          
          {Object.entries(diagnostics).map(([key, value]: [string, any]) => (
            <div key={key} className={`border rounded-lg p-4 ${getStatusColor(value.status)}`}>
              <div className="flex items-start space-x-3">
                {getStatusIcon(value.status)}
                <div className="flex-1">
                  <h3 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                  {value.message && <p className="text-sm mt-1">{value.message}</p>}
                  {value.missing && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Missing variables:</p>
                      <ul className="text-sm mt-1 space-y-1">
                        {value.missing.map((item: string) => (
                          <li key={item} className="font-mono bg-white bg-opacity-50 px-2 py-1 rounded">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {value.url && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Current URL:</p>
                      <p className="text-sm font-mono bg-white bg-opacity-50 px-2 py-1 rounded mt-1">
                        {value.url}
                      </p>
                    </div>
                  )}
                  {value.error && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Error:</p>
                      <p className="text-sm font-mono bg-white bg-opacity-50 px-2 py-1 rounded mt-1">
                        {JSON.stringify(value.error, null, 2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Issues & Solutions</h2>
        <div className="space-y-4">
          {commonIssues.map((issue, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{issue.title}</h3>
              <p className="text-gray-600 mb-3">{issue.description}</p>
              <div className="bg-gray-50 rounded-md p-3 mb-3">
                <p className="text-sm text-gray-800">{issue.solution}</p>
              </div>
              {issue.link && (
                <a
                  href={issue.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open in Google Cloud Console
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <a
          href="/admin"
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to Login
        </a>
      </div>
    </div>
  );
};

export default OAuthTroubleshooter; 