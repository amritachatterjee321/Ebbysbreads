import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, AlertTriangle } from 'lucide-react';

const OAuthDebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState({
    currentUrl: '',
    origin: '',
    href: '',
    searchParams: '',
    redirectUrl: ''
  });

  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const currentUrl = window.location.href;
    const origin = window.location.origin;
    const href = window.location.href;
    const searchParams = window.location.search;
    
    // Calculate what the redirect URL would be
    const redirectUrl = `${origin}/admin`;

    setDebugInfo({
      currentUrl,
      origin,
      href,
      searchParams,
      redirectUrl
    });
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const testOAuthRedirect = () => {
    const redirectUrl = `${window.location.origin}/admin`;
    console.log('Testing OAuth redirect to:', redirectUrl);
    
    // This will help us see what URL the OAuth is trying to redirect to
    alert(`OAuth should redirect to: ${redirectUrl}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          OAuth Debug Information
        </h1>
        <p className="text-gray-600">
          Current URL and redirect configuration
        </p>
      </div>

      <div className="space-y-6">
        {/* Current URL Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Current URL Information</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Current URL:</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-gray-800 max-w-md truncate">{debugInfo.currentUrl}</span>
                <button
                  onClick={() => copyToClipboard(debugInfo.currentUrl)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Origin:</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-gray-800">{debugInfo.origin}</span>
                <button
                  onClick={() => copyToClipboard(debugInfo.origin)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Search Params:</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-gray-800">{debugInfo.searchParams || 'None'}</span>
                {debugInfo.searchParams && (
                  <button
                    onClick={() => copyToClipboard(debugInfo.searchParams)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* OAuth Redirect Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">OAuth Redirect Configuration</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Expected Redirect URL:</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-gray-800">{debugInfo.redirectUrl}</span>
                <button
                  onClick={() => copyToClipboard(debugInfo.redirectUrl)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={testOAuthRedirect}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Test OAuth Redirect
            </button>
          </div>
        </div>

        {/* Required Configuration */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Required Configuration Updates
              </h3>
              <div className="space-y-2 text-sm text-yellow-800">
                <p><strong>Google Cloud Console:</strong> Add these redirect URIs:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>{debugInfo.origin}/auth/callback</li>
                  <li>{debugInfo.origin}/admin</li>
                </ul>
                <p className="mt-2"><strong>Supabase:</strong> Set Site URL to: {debugInfo.origin}</p>
                <p><strong>Supabase:</strong> Add redirect URLs: {debugInfo.origin}/auth/callback, {debugInfo.origin}/admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-x-4">
          <a
            href="https://console.cloud.google.com/apis/credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Google Cloud Console
          </a>
          <a
            href="/admin"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Test Admin Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default OAuthDebugger; 