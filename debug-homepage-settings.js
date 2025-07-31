// Debug script for homepage settings
import { createClient } from '@supabase/supabase-js';

// Get environment variables from .env file or process.env
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

console.log('🔍 Debugging homepage settings...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? '***' + supabaseKey.slice(-4) : 'Not set');

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugHomepageSettings() {
  try {
    console.log('\n1️⃣ Testing basic connection...');
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('homepage_settings')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Connection failed:', testError);
      return;
    }
    
    console.log('✅ Connection successful');
    
    console.log('\n2️⃣ Fetching homepage settings...');
    
    // Try the exact same query as the application
    const { data, error } = await supabase
      .from('homepage_settings')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error fetching homepage settings:', error);
      console.log('Error code:', error.code);
      console.log('Error message:', error.message);
      console.log('Error details:', error.details);
      return;
    }
    
    console.log('✅ Query successful');
    console.log('📊 Data length:', data ? data.length : 0);
    
    if (data && data.length > 0) {
      console.log('\n3️⃣ Homepage settings found:');
      console.log('ID:', data[0].id);
      console.log('Brand Name:', data[0].brand_name);
      console.log('Tagline:', data[0].tagline);
      console.log('Menu Title:', data[0].menu_title);
      console.log('About Title:', data[0].about_title);
      console.log('Created At:', data[0].created_at);
      
      // Check for null fields
      const nullFields = Object.entries(data[0])
        .filter(([key, value]) => value === null)
        .map(([key]) => key);
      
      if (nullFields.length > 0) {
        console.log('\n⚠️  Null fields found:', nullFields);
      } else {
        console.log('\n✅ All fields have values');
      }
      
    } else {
      console.log('\n💡 No homepage settings found in database');
    }
    
    console.log('\n4️⃣ Testing with .single()...');
    
    // Test with .single() to see if that's the issue
    const { data: singleData, error: singleError } = await supabase
      .from('homepage_settings')
      .select('*')
      .single();
    
    if (singleError) {
      console.error('❌ .single() failed:', singleError);
      console.log('This might be the issue - multiple records or no records');
    } else {
      console.log('✅ .single() worked fine');
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

debugHomepageSettings(); 