import React, { useState, useEffect } from 'react';
import { simpleEmailService } from './services/email-simple';
import { EMAILJS_CONFIG, isEmailJSConfigured } from './config/emailjs';
import { supabase } from './lib/supabase';

const TestEmailDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => prev + '\n' + new Date().toLocaleTimeString() + ': ' + info);
  };

  const testEmailConfiguration = async () => {
    setIsLoading(true);
    addDebugInfo('🔍 Testing EmailJS Configuration...');
    
    try {
      // Check EmailJS config
      addDebugInfo(`Service ID: ${EMAILJS_CONFIG.SERVICE_ID}`);
      addDebugInfo(`Public Key: ${EMAILJS_CONFIG.PUBLIC_KEY?.substring(0, 10)}...`);
      addDebugInfo(`Admin Template: ${EMAILJS_CONFIG.TEMPLATES.ADMIN_NOTIFICATION}`);
      addDebugInfo(`Customer Template: ${EMAILJS_CONFIG.TEMPLATES.CUSTOMER_CONFIRMATION}`);
      
      const isConfigured = isEmailJSConfigured();
      addDebugInfo(`EmailJS Configured: ${isConfigured ? '✅ YES' : '❌ NO'}`);
      
      if (!isConfigured) {
        addDebugInfo('❌ EmailJS is not properly configured. Please update src/config/emailjs.ts');
        return;
      }

      // Test admin email retrieval
      addDebugInfo('🔍 Testing Admin Email Retrieval...');
      const adminEmail = await simpleEmailService.getAdminEmail();
      addDebugInfo(`Admin Email Found: ${adminEmail ? '✅ ' + adminEmail : '❌ NOT FOUND'}`);
      
      if (!adminEmail) {
        addDebugInfo('❌ No admin email found. Please run the admin setup script.');
        return;
      }

      // Test EmailJS import
      addDebugInfo('🔍 Testing EmailJS Import...');
      try {
        const emailjs = await import('@emailjs/browser');
        addDebugInfo('✅ EmailJS imported successfully');
      } catch (error) {
        addDebugInfo(`❌ EmailJS import failed: ${error}`);
        return;
      }

      // Test actual email sending
      addDebugInfo('🔍 Testing Email Sending...');
      const testOrderData = {
        orderNumber: 'TEST123456',
        customerName: 'Test Customer',
        customerPhone: '9876543210',
        customerEmail: 'test@example.com',
        customerAddress: '123 Test Street, Test City',
        customerPincode: '110001',
        items: [
          { name: 'Chocolate Cake', quantity: 2, price: 500 },
          { name: 'Bread Loaf', quantity: 1, price: 100 }
        ],
        total: 1100,
        orderDate: new Date().toLocaleDateString('en-IN')
      };

      const emailResults = await simpleEmailService.sendOrderEmails(testOrderData, adminEmail);
      
      addDebugInfo('📧 Email Results:');
      addDebugInfo(`Admin Email: ${emailResults.adminEmail.success ? '✅ Success' : '❌ Failed - ' + emailResults.adminEmail.error}`);
      addDebugInfo(`Customer Email: ${emailResults.customerEmail.success ? '✅ Success' : '❌ Failed - ' + emailResults.customerEmail.error}`);
      
      setTestResults(emailResults);
      
    } catch (error) {
      addDebugInfo(`❌ Test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testDatabaseConnection = async () => {
    setIsLoading(true);
    addDebugInfo('🔍 Testing Database Connection...');
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);
      
      if (error) {
        addDebugInfo(`❌ Database error: ${error.message}`);
      } else {
        addDebugInfo(`✅ Database connected. Found ${data?.length || 0} user profiles`);
        if (data && data.length > 0) {
          addDebugInfo(`Sample user: ${data[0].email} (${data[0].role})`);
        }
      }
    } catch (error) {
      addDebugInfo(`❌ Database connection failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearDebugInfo = () => {
    setDebugInfo('');
    setTestResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Email Debug Tool</h1>
          
          {/* Configuration Status */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">Configuration Status:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <div>Service ID: {EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID' ? '❌ Not Set' : '✅ Configured'}</div>
              <div>Public Key: {EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY' ? '❌ Not Set' : '✅ Configured'}</div>
              <div>Admin Template: {EMAILJS_CONFIG.TEMPLATES.ADMIN_NOTIFICATION === 'YOUR_ADMIN_TEMPLATE_ID' ? '❌ Not Set' : '✅ Configured'}</div>
              <div>Customer Template: {EMAILJS_CONFIG.TEMPLATES.CUSTOMER_CONFIRMATION === 'YOUR_CUSTOMER_TEMPLATE_ID' ? '❌ Not Set' : '✅ Configured'}</div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mb-6 flex gap-3">
            <button 
              onClick={testEmailConfiguration} 
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Email Flow'}
            </button>
            <button 
              onClick={testDatabaseConnection} 
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Database'}
            </button>
            <button 
              onClick={clearDebugInfo}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Clear Debug Info
            </button>
          </div>
          
          {/* Debug Output */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Debug Output:</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">{debugInfo || 'No debug info yet. Click "Test Email Flow" to start.'}</pre>
            </div>
          </div>
          
          {/* Test Results */}
          {testResults && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Test Results:</h3>
              <div className="bg-gray-100 p-4 rounded-md">
                <pre className="text-sm text-gray-800">{JSON.stringify(testResults, null, 2)}</pre>
              </div>
            </div>
          )}
          
          {/* Troubleshooting Guide */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting Steps:</h3>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Update <code>src/config/emailjs.ts</code> with your EmailJS credentials</li>
              <li>Create admin user: <code>node create-admin-simple.js your-email@example.com</code></li>
              <li>Verify EmailJS templates are published</li>
              <li>Check browser console for detailed error messages</li>
              <li>Ensure EmailJS service is active and has proper permissions</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestEmailDebug; 