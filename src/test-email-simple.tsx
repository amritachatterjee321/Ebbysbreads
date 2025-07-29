import React from 'react';
import { simpleEmailService } from './services/email-simple';

const TestEmailSimple: React.FC = () => {
  const testEmailService = async () => {
    console.log('Testing simple email service...');
    
    // Test data
    const testOrderData = {
      orderNumber: 'TEST-001',
      customerName: 'Test Customer',
      customerPhone: '+91 9876543210',
      customerEmail: 'test@example.com',
      customerAddress: '123 Test Street, Test City',
      customerPincode: '123456',
      items: [
        { name: 'Chocolate Cake', quantity: 2, price: 500 },
        { name: 'Bread Loaf', quantity: 1, price: 50 }
      ],
      total: 1050,
      orderDate: new Date().toLocaleDateString()
    };

    try {
      // Get admin email
      const adminEmail = await simpleEmailService.getAdminEmail();
      console.log('Admin email found:', adminEmail);

      if (!adminEmail) {
        console.error('No admin email found. Please set up an admin user in the database.');
        alert('No admin email found. Please set up an admin user in the database.');
        return;
      }

      // Send test email
      console.log('Sending test email to:', adminEmail);
      const emailResult = await simpleEmailService.sendNewOrderNotification(testOrderData, adminEmail);
      
      if (emailResult.success) {
        console.log('Test email sent successfully!');
        alert('Test email sent successfully! Check console for details.');
      } else {
        console.error('Failed to send test email:', emailResult.error);
        alert(`Failed to send test email: ${emailResult.error}`);
      }
    } catch (error) {
      console.error('Error testing email service:', error);
      alert(`Error testing email service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const setupAdminUser = async () => {
    try {
      // This would typically be done through your admin interface
      // For testing, we'll just show instructions
      alert(`To set up an admin user:

1. Go to your Supabase dashboard
2. Navigate to Table Editor → user_profiles
3. Insert a new row with:
   - id: (auto-generated UUID)
   - email: your-email@example.com
   - name: Admin User
   - role: admin

Or run this SQL:
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';`);
    } catch (error) {
      console.error('Error setting up admin user:', error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Email Service Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={setupAdminUser}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Setup Admin User
        </button>
        
        <button
          onClick={testEmailService}
          className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Test Email Service
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>First, set up an admin user in your database</li>
          <li>Click "Test Email Service" to send a test email</li>
          <li>Check the browser console for detailed logs</li>
          <li>Check your email for the notification</li>
        </ol>
      </div>
      
      <div className="mt-4 p-4 bg-yellow-100 rounded-md">
        <h3 className="font-semibold mb-2">Note:</h3>
        <p className="text-sm">
          The email service is currently in "log mode" - it will log the email content to the console 
          but won't actually send emails until you configure EmailJS or another email service.
        </p>
      </div>
    </div>
  );
};

export default TestEmailSimple; 