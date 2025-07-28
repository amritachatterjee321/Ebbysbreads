import React, { useState } from 'react';
import { emailService } from './services/email';

const TestEmail = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testEmailService = async () => {
    setLoading(true);
    setResult('Testing...');

    try {
      // Test getting admin email
      const adminEmail = await emailService.getAdminEmail();
      console.log('Admin email found:', adminEmail);

      if (!adminEmail) {
        setResult('❌ No admin email found. Please set up admin role in database.');
        return;
      }

      // Test sending email
      const testOrderData = {
        orderNumber: 'TEST123',
        customerName: 'Test Customer',
        customerPhone: '9876543210',
        customerAddress: '123 Test Street',
        customerPincode: '110001',
        items: [
          { name: 'Test Bread', quantity: 2, price: 150 },
          { name: 'Test Cake', quantity: 1, price: 200 }
        ],
        total: 500,
        orderDate: new Date().toLocaleDateString('en-IN')
      };

      console.log('Sending test email to:', adminEmail);
      const emailResult = await emailService.sendNewOrderNotification(testOrderData, adminEmail);

      if (emailResult.success) {
        setResult('✅ Test email sent successfully! Check your inbox.');
      } else {
        setResult(`❌ Email failed: ${emailResult.error}`);
      }
    } catch (error) {
      console.error('Test error:', error);
      setResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Email Test</h2>
          <p className="mt-2 text-gray-600">Test the email notification system</p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <button
            onClick={testEmailService}
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Email Service'}
          </button>

          {result && (
            <div className="mt-4 p-4 rounded-md bg-gray-50">
              <p className="text-sm">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestEmail; 