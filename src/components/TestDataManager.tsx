import React, { useState } from 'react';
import { isTest, isStaging, isDevelopment, log } from '../lib/environment';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../EbbysBakeryFlow';

const TestDataManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { setCurrentPage } = useAppContext();

  // Debug environment detection
  console.log('TestDataManager: Environment check', {
    isTest: isTest(),
    isStaging: isStaging(),
    isDevelopment: isDevelopment(),
    VITE_ENV: import.meta.env.VITE_ENV,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD
  });

  // Show in test, staging, or development environments
  if (!isTest() && !isStaging() && !isDevelopment()) {
    console.log('TestDataManager: Not showing - environment check failed', {
      isTest: isTest(),
      isStaging: isStaging(),
      isDevelopment: isDevelopment(),
      VITE_ENV: import.meta.env.VITE_ENV,
      MODE: import.meta.env.MODE
    });
    return null;
  }

  const clearTestData = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      log('Clearing test data...');
      
      // Clear test orders
      const { error: ordersError } = await supabase
        .from('orders')
        .delete()
        .like('order_number', 'TEST-%');
      
      if (ordersError) {
        throw new Error(`Failed to clear test orders: ${ordersError.message}`);
      }

      // Clear test customers
      const { error: customersError } = await supabase
        .from('customers')
        .delete()
        .like('email', '%test%');
      
      if (customersError) {
        throw new Error(`Failed to clear test customers: ${customersError.message}`);
      }

      setMessage('Test data cleared successfully!');
      log('Test data cleared successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`Error: ${errorMessage}`);
      log('Error clearing test data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTestData = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      log('Generating test data...');
      
      // Generate test customer
      const testCustomer = {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+91 9876543210',
        address: '123 Test Street, Test City',
        pincode: '123456'
      };

      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert(testCustomer)
        .select()
        .single();

      if (customerError) {
        throw new Error(`Failed to create test customer: ${customerError.message}`);
      }

      // Generate test order
      const testOrder = {
        order_number: `TEST-${Date.now()}`,
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_address: customer.address,
        customer_pincode: customer.pincode,
        total: 1050,
        status: 'pending',
        items: JSON.stringify([
          { name: 'Chocolate Cake', quantity: 2, price: 500 },
          { name: 'Bread Loaf', quantity: 1, price: 50 }
        ])
      };

      const { error: orderError } = await supabase
        .from('orders')
        .insert(testOrder);

      if (orderError) {
        throw new Error(`Failed to create test order: ${orderError.message}`);
      }

      setMessage('Test data generated successfully!');
      log('Test data generated successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`Error: ${errorMessage}`);
      log('Error generating test data', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        🧪 Test Data Manager
      </h3>
      
      <div className="space-y-3">
        <button
          onClick={generateTestData}
          disabled={isLoading}
          className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 'Generate Test Data'}
        </button>
        
        <button
          onClick={clearTestData}
          disabled={isLoading}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Clearing...' : 'Clear Test Data'}
        </button>

        <button
          onClick={() => setCurrentPage('email-test')}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          📧 Test Email Integration
        </button>

        <button
          onClick={() => setCurrentPage('admin-email-test')}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          🔍 Test Admin Email Setup
        </button>
      </div>
      
      {message && (
        <div className={`mt-3 p-2 rounded text-sm ${
          message.includes('Error') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500">
        Only visible in {isTest() ? 'test' : 'staging'} environment
      </div>
    </div>
  );
};

export default TestDataManager; 