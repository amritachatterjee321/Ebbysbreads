import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';

const GoogleOAuthSetupGuide: React.FC = () => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const steps = [
    {
      id: 1,
      title: "Create Google Cloud Project",
      description: "Set up a new project in Google Cloud Console",
      details: [
        "Go to Google Cloud Console",
        "Create a new project or select existing one",
        "Enable Google+ API"
      ],
      link: "https://console.cloud.google.com/",
      code: null
    },
    {
      id: 2,
      title: "Configure OAuth Consent Screen",
      description: "Set up the OAuth consent screen for your application",
      details: [
        "Go to 'APIs & Services' > 'OAuth consent screen'",
        "Choose 'External' user type",
        "Fill in app name: 'Bakery Admin'",
        "Add scopes: openid, email, profile",
        "Add test users (your email addresses)"
      ],
      link: null,
      code: null
    },
    {
      id: 3,
      title: "Create OAuth 2.0 Credentials",
      description: "Generate OAuth client ID and secret",
      details: [
        "Go to 'APIs & Services' > 'Credentials'",
        "Click 'Create Credentials' > 'OAuth 2.0 Client IDs'",
        "Choose 'Web application'",
        "Set name: 'Bakery Admin Web Client'",
        "Add authorized redirect URIs"
      ],
      link: null,
      code: null
    },
    {
      id: 4,
      title: "Add Redirect URIs",
      description: "Configure the redirect URIs in Google Cloud Console",
      details: [
        "Add these URIs to your OAuth client:"
      ],
      link: null,
      code: [
        "https://your-project-ref.supabase.co/auth/v1/callback",
        "http://localhost:5173/auth/callback",
        "http://localhost:5181/auth/callback"
      ]
    },
    {
      id: 5,
      title: "Configure Supabase",
      description: "Set up Google provider in Supabase dashboard",
      details: [
        "Go to Supabase dashboard > Authentication > Providers",
        "Find 'Google' and click 'Enable'",
        "Enter Google Client ID and Client Secret",
        "Set redirect URL to: https://your-project-ref.supabase.co/auth/v1/callback"
      ],
      link: null,
      code: null
    },
    {
      id: 6,
      title: "Set Site URL in Supabase",
      description: "Configure the site URL for authentication",
      details: [
        "In Supabase dashboard > Authentication > Settings",
        "Set 'Site URL' to: http://localhost:5181",
        "Add additional redirect URLs"
      ],
      link: null,
      code: [
        "http://localhost:5181/admin",
        "http://localhost:5173/admin"
      ]
    },
    {
      id: 7,
      title: "Create Environment File",
      description: "Set up your local environment variables",
      details: [
        "Create a .env file in your project root",
        "Add your Supabase credentials"
      ],
      link: null,
      code: [
        "VITE_SUPABASE_URL=https://your-project-ref.supabase.co",
        "VITE_SUPABASE_ANON_KEY=your-anon-key"
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Google OAuth Setup Guide
        </h1>
        <p className="text-gray-600">
          Follow these steps to set up Google OAuth authentication for your bakery admin panel
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {step.id}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open
                    </a>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">{step.description}</p>
                
                <div className="space-y-2">
                  {step.details.map((detail, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{detail}</span>
                    </div>
                  ))}
                </div>

                {step.code && (
                  <div className="mt-4">
                    <div className="bg-gray-50 rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Code/URLs:</span>
                        <button
                          onClick={() => copyToClipboard(step.code!.join('\n'), step.id)}
                          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          {copiedStep === step.id ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <div className="space-y-1">
                        {step.code.map((line, index) => (
                          <div key={index} className="text-sm font-mono text-gray-800 bg-white px-2 py-1 rounded">
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Important Notes
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Make sure to replace 'your-project-ref' with your actual Supabase project reference</li>
              <li>• Keep your Google Client Secret secure and never commit it to version control</li>
              <li>• Add your production domain to redirect URIs when deploying</li>
              <li>• Test the authentication flow in an incognito window to avoid cached sessions</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <a
          href="/admin"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Login
        </a>
      </div>
    </div>
  );
};

export default GoogleOAuthSetupGuide; 