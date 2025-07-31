import React, { useState, useEffect } from 'react';
import { simpleEmailService } from './services/email-simple';

const TestEmailIntegration: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    adminEmail: { success: boolean; error?: string };
    customerEmail: { success: boolean; error?: string };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

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

  // Add debug info on component mount
  useEffect(() => {
    setDebugInfo('Email test page loaded successfully');
    console.log('Email test page loaded');
  }, []);

  const handleTestEmails = async () => {
    setIsLoading(true);
    setDebugInfo('Testing both emails...');
    try {
      console.log('Testing admin email retrieval...');
      const adminEmail = await simpleEmailService.getAdminEmail();
      console.log('Admin email result:', adminEmail);
      
      if (!adminEmail) {
        setDebugInfo('No admin email found in database');
        setTestResults({
          adminEmail: { success: false, error: 'No admin email found' },
          customerEmail: { success: false, error: 'Admin email required' }
        });
        return;
      }

      setDebugInfo(`Found admin email: ${adminEmail}. Testing email sending...`);
      const results = await simpleEmailService.sendOrderEmails(testOrderData, adminEmail);
      console.log('Email results:', results);
      setTestResults(results);
      setDebugInfo('Email test completed');
    } catch (error) {
      console.error('Error in handleTestEmails:', error);
      setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTestResults({
        adminEmail: { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
        customerEmail: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAdminEmail = async () => {
    setIsLoading(true);
    setDebugInfo('Testing admin email only...');
    try {
      const adminEmail = await simpleEmailService.getAdminEmail();
      if (!adminEmail) {
        setDebugInfo('No admin email found');
        setTestResults({
          adminEmail: { success: false, error: 'No admin email found' },
          customerEmail: { success: false, error: 'N/A' }
        });
        return;
      }

      const result = await simpleEmailService.sendNewOrderNotification(testOrderData, adminEmail);
      setTestResults({
        adminEmail: result,
        customerEmail: { success: false, error: 'N/A' }
      });
      setDebugInfo('Admin email test completed');
    } catch (error) {
      console.error('Error in handleTestAdminEmail:', error);
      setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTestResults({
        adminEmail: { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
        customerEmail: { success: false, error: 'N/A' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestCustomerEmail = async () => {
    setIsLoading(true);
    setDebugInfo('Testing customer email only...');
    try {
      const result = await simpleEmailService.sendOrderConfirmation(testOrderData);
      setTestResults({
        adminEmail: { success: false, error: 'N/A' },
        customerEmail: result
      });
      setDebugInfo('Customer email test completed');
    } catch (error) {
      console.error('Error in handleTestCustomerEmail:', error);
      setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTestResults({
        adminEmail: { success: false, error: 'N/A' },
        customerEmail: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Email Integration Test</h1>
          
          {/* Debug Info */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">Debug Info:</h3>
            <p className="text-sm text-blue-700">{debugInfo}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Test Order Data</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm text-gray-600 overflow-x-auto">
                {JSON.stringify(testOrderData, null, 2)}
              </pre>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Test Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleTestEmails}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Both Emails'}
              </button>
              
              <button
                onClick={handleTestAdminEmail}
                disabled={isLoading}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Admin Email Only'}
              </button>
              
              <button
                onClick={handleTestCustomerEmail}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Customer Email Only'}
              </button>
            </div>
          </div>

          {testResults && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Test Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-700 mb-2">Admin Email</h3>
                  <div className={`text-sm ${testResults.adminEmail.success ? 'text-green-600' : 'text-red-600'}`}>
                    <p><strong>Status:</strong> {testResults.adminEmail.success ? 'Success' : 'Failed'}</p>
                    {testResults.adminEmail.error && (
                      <p><strong>Error:</strong> {testResults.adminEmail.error}</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-700 mb-2">Customer Email</h3>
                  <div className={`text-sm ${testResults.customerEmail.success ? 'text-green-600' : 'text-red-600'}`}>
                    <p><strong>Status:</strong> {testResults.customerEmail.success ? 'Success' : 'Failed'}</p>
                    {testResults.customerEmail.error && (
                      <p><strong>Error:</strong> {testResults.customerEmail.error}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Important Notes</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Check the browser console for detailed email logs</li>
              <li>• Make sure you have an admin user in the database with role='admin'</li>
              <li>• Configure EmailJS credentials in the email service for actual sending</li>
              <li>• This test uses sample data - real orders will use actual customer data</li>
              <li>• If you see "EmailJS not configured" errors, that's expected until you set up EmailJS</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestEmailIntegration; 