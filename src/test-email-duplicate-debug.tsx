import React, { useState } from 'react';
import { simpleEmailService } from './services/email-simple';

const TestEmailDuplicateDebug: React.FC = () => {
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLog(prev => [...prev, `${timestamp}: ${message}`]);
  };

  const testDuplicateEmails = async () => {
    setIsLoading(true);
    addLog('🧪 Starting duplicate email test...');
    
    try {
      const adminEmail = await simpleEmailService.getAdminEmail();
      if (!adminEmail) {
        addLog('❌ No admin email found');
        return;
      }

      const testOrderData = {
        orderNumber: `TEST-${Date.now()}`,
        customerName: 'Test Customer',
        customerPhone: '9876543210',
        customerEmail: 'test@example.com',
        customerAddress: '123 Test Street',
        customerPincode: '110001',
        items: [
          { name: 'Test Item', quantity: 1, price: 100 }
        ],
        total: 100,
        orderDate: new Date().toLocaleDateString('en-IN')
      };

      addLog(`📧 Sending email for order: ${testOrderData.orderNumber}`);
      
      // Send emails multiple times to test duplicate prevention
      const promises = [];
      for (let i = 1; i <= 3; i++) {
        addLog(`🔄 Attempt ${i}: Sending emails...`);
        promises.push(
          simpleEmailService.sendOrderEmails(testOrderData, adminEmail)
            .then(result => {
              addLog(`✅ Attempt ${i} completed - Admin: ${result.adminEmail.success}, Customer: ${result.customerEmail.success}`);
              if (result.adminEmail.error) addLog(`⚠️ Attempt ${i} Admin Error: ${result.adminEmail.error}`);
              if (result.customerEmail.error) addLog(`⚠️ Attempt ${i} Customer Error: ${result.customerEmail.error}`);
              return result;
            })
            .catch(error => {
              addLog(`❌ Attempt ${i} failed: ${error.message}`);
              return null;
            })
        );
      }

      const results = await Promise.all(promises);
      addLog('🎯 All attempts completed');
      
      const successfulEmails = results.filter(r => r && r.adminEmail.success && r.customerEmail.success).length;
      addLog(`📊 Summary: ${successfulEmails} out of 3 attempts sent emails successfully`);
      
    } catch (error) {
      addLog(`❌ Test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLog = () => {
    setDebugLog([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Duplicate Email Debug Tool</h1>
          
          <div className="mb-6">
            <button 
              onClick={testDuplicateEmails} 
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Duplicate Email Prevention'}
            </button>
            <button 
              onClick={clearLog}
              className="ml-3 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Clear Log
            </button>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Debug Log:</h3>
            <div className="bg-gray-100 p-4 rounded-md max-h-96 overflow-y-auto">
              {debugLog.length === 0 ? (
                <p className="text-gray-500">No logs yet. Click "Test Duplicate Email Prevention" to start.</p>
              ) : (
                <div className="space-y-1">
                  {debugLog.map((log, index) => (
                    <div key={index} className="text-sm font-mono text-gray-800">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-semibold text-yellow-800 mb-2">How to Use:</h3>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Click "Test Duplicate Email Prevention"</li>
              <li>Watch the debug log for email sending attempts</li>
              <li>Check your email inbox for actual emails received</li>
              <li>Compare the number of emails received vs attempts made</li>
              <li>If you receive more emails than expected, there's a duplicate issue</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestEmailDuplicateDebug; 