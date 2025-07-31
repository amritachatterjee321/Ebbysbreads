// Test script to check homepage settings
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

console.log('Testing homepage settings connection...');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? '***' + supabaseKey.slice(-4) : 'Not set');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testHomepageSettings() {
  try {
    console.log('\n1. Checking if homepage_settings table exists...');
    
    // Try to fetch homepage settings
    const { data, error } = await supabase
      .from('homepage_settings')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error fetching homepage settings:', error);
      
      if (error.code === '42P01') {
        console.log('💡 The homepage_settings table does not exist. You need to run the migration script.');
      } else if (error.code === 'PGRST116') {
        console.log('💡 No rows returned. The table exists but is empty.');
      }
      
      return;
    }
    
    console.log('✅ Successfully connected to homepage_settings table');
    console.log('📊 Found', data.length, 'record(s)');
    
    if (data.length > 0) {
      console.log('\n2. Current homepage settings:');
      console.log(JSON.stringify(data[0], null, 2));
      
      // Check for required fields
      const requiredFields = [
        'brand_name', 'tagline', 'order_deadline_text', 'delivery_info_text',
        'menu_title', 'serviceable_pincodes', 'about_title', 'about_content', 'about_image_url'
      ];
      
      console.log('\n3. Checking required fields:');
      const missingFields = [];
      
      requiredFields.forEach(field => {
        if (data[0][field] === null || data[0][field] === undefined) {
          missingFields.push(field);
          console.log(`❌ Missing: ${field}`);
        } else {
          console.log(`✅ ${field}: ${data[0][field]}`);
        }
      });
      
      if (missingFields.length > 0) {
        console.log('\n⚠️  Some required fields are missing. Run the migration script to fix this.');
      } else {
        console.log('\n🎉 All required fields are present!');
      }
    } else {
      console.log('\n💡 The table is empty. You can create settings through the admin dashboard.');
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

// Run the test
testHomepageSettings(); 