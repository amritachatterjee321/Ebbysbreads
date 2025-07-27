// Test script to verify database connection and homepage settings
// Run this in your browser console on the admin dashboard page

console.log('=== Database Connection Test ===');

// Test function to check homepage settings
window.testDatabaseConnection = async () => {
  try {
    console.log('1. Testing Supabase connection...');
    
    // Test if we can access the homepageSettingsService
    if (typeof homepageSettingsService !== 'undefined') {
      console.log('✅ homepageSettingsService is available');
      
      // Test getting homepage settings
      console.log('2. Fetching homepage settings...');
      const settings = await homepageSettingsService.get();
      console.log('3. Homepage settings result:', settings);
      
      if (settings) {
        console.log('✅ Homepage settings found:', {
          brand_name: settings.brand_name,
          menu_title: settings.menu_title,
          has_hero_image: !!settings.hero_image_url
        });
        alert(`✅ Database connection successful!\n\nFound settings for: ${settings.brand_name}\nMenu title: ${settings.menu_title}`);
      } else {
        console.log('⚠️ No homepage settings found');
        alert('⚠️ Database connected but no homepage settings found');
      }
      
    } else {
      console.log('❌ homepageSettingsService not available');
      alert('❌ homepageSettingsService not available - check imports');
    }
    
  } catch (error) {
    console.error('❌ Error testing database connection:', error);
    alert(`❌ Database connection error: ${error.message}`);
  }
};

// Test function to check table existence
window.checkTableExists = async () => {
  try {
    console.log('1. Checking if homepage_settings table exists...');
    
    if (typeof homepageSettingsService !== 'undefined') {
      const exists = await homepageSettingsService.checkTableExists();
      console.log('2. Table exists:', exists);
      alert(`Table exists: ${exists}`);
    } else {
      alert('❌ homepageSettingsService not available');
    }
    
  } catch (error) {
    console.error('❌ Error checking table:', error);
    alert(`❌ Error: ${error.message}`);
  }
};

console.log('Test functions added:');
console.log('- testDatabaseConnection() - Test database connection and fetch settings');
console.log('- checkTableExists() - Check if homepage_settings table exists');
console.log('=== End Test Setup ==='); 