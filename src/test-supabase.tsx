import { useState } from 'react';
import { supabase } from './lib/supabase';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const TestSupabase = () => {
  const [status, setStatus] = useState('Ready to test');
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    try {
      setStatus('Testing connection...');
      setError(null);
      
      const { error } = await supabase.from('products').select('count').limit(1);
      
      if (error) {
        throw error;
      }
      
      setStatus('✅ Connection successful!');
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Connection failed');
      setStatus('❌ Connection failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Test Supabase Connection</h1>
      
      <div className="bg-white border rounded-lg p-6">
        <div className="space-y-4">
          <button
            onClick={testConnection}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <Loader2 className="h-4 w-4 mr-2" />
            Test Connection
          </button>

          <div className="flex items-center space-x-2">
            {status.includes('✅') ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : status.includes('❌') ? (
              <XCircle className="h-5 w-5 text-red-500" />
            ) : (
              <Loader2 className="h-5 w-5 text-blue-500" />
            )}
            <span className="text-sm">{status}</span>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestSupabase; 