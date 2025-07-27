// Test script to check homepage settings status
// Run this in your browser console on the admin dashboard page

console.log('=== Homepage Settings Status Check ===');

// Check if homepageSettings state exists
if (typeof window !== 'undefined') {
  // This will help us see what's happening
  console.log('1. Checking if we can access the admin dashboard state...');
  
  // Add a global function to test the database
  window.testHomepageSettings = async () => {
    try {
      console.log('2. Testing homepage settings service...');
      
      // Import the service (this might not work in browser, but let's try)
      const response = await fetch('/api/test-homepage-settings');
      const result = await response.json();
      console.log('3. Test result:', result);
      
    } catch (error) {
      console.error('4. Error testing homepage settings:', error);
    }
  };
  
  console.log('5. Test function added. Run: testHomepageSettings() in console');
}

console.log('=== End Status Check ==='); 