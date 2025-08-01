// Email Flow Diagnostic Script
// Run this to check why emails aren't being sent from production

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseEmailFlow() {
  console.log('🔍 Email Flow Diagnostic Starting...\n');

  // 1. Check EmailJS Configuration
  console.log('📧 1. Checking EmailJS Configuration...');
  try {
    // Read the config file directly
    const fs = await import('fs');
    const configContent = fs.readFileSync('./src/config/emailjs.ts', 'utf8');
    
    // Check if configuration has placeholder values
    const hasPlaceholders = configContent.includes('YOUR_PRODUCTION_SERVICE_ID') || 
                           configContent.includes('YOUR_PRODUCTION_PUBLIC_KEY') ||
                           configContent.includes('YOUR_PRODUCTION_ADMIN_TEMPLATE_ID') ||
                           configContent.includes('YOUR_PRODUCTION_CUSTOMER_TEMPLATE_ID');
    
    console.log('✅ EmailJS config file found');
    console.log('📋 Configuration Status:', hasPlaceholders ? '❌ Has Placeholders' : '✅ Configured');
    
    if (hasPlaceholders) {
      console.log('⚠️  EmailJS has placeholder values!');
      console.log('   Please update src/config/emailjs.ts with your actual credentials');
    }
  } catch (error) {
    console.log('❌ Error reading EmailJS config:', error.message);
  }

  // 2. Check Admin User in Database
  console.log('\n👤 2. Checking Admin User in Database...');
  try {
    const { data: adminUsers, error } = await supabase
      .from('user_profiles')
      .select('email, role, created_at')
      .eq('role', 'admin');

    if (error) {
      console.log('❌ Database error:', error.message);
    } else if (!adminUsers || adminUsers.length === 0) {
      console.log('❌ No admin users found in database');
      console.log('   Please create an admin user using setup-admin-user.sql');
    } else {
      console.log('✅ Admin users found:', adminUsers.length);
      adminUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.role}) - Created: ${user.created_at}`);
      });
    }
  } catch (error) {
    console.log('❌ Error checking admin users:', error.message);
  }

  // 3. Check user_profiles table structure
  console.log('\n🗄️ 3. Checking user_profiles table...');
  try {
    const { data: tableInfo, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ user_profiles table error:', error.message);
      console.log('   Table might not exist or have permission issues');
    } else {
      console.log('✅ user_profiles table accessible');
      if (tableInfo && tableInfo.length > 0) {
        console.log('   Sample record structure:', Object.keys(tableInfo[0]));
      }
    }
  } catch (error) {
    console.log('❌ Error checking table structure:', error.message);
  }

  // 4. Check EmailJS Templates
  console.log('\n📋 4. EmailJS Template Check...');
  console.log('   Please verify in EmailJS Dashboard:');
  console.log('   - Templates exist and are published');
  console.log('   - Template IDs match configuration');
  console.log('   - Templates use {{{order_items}}} (triple braces)');
  console.log('   - Email service is properly configured');

  // 5. Check Environment Variables
  console.log('\n🔧 5. Environment Variables Check...');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
  
  // Check for other relevant env vars
  const envVars = ['VITE_ENV', 'MODE', 'NODE_ENV'];
  envVars.forEach(varName => {
    const value = process.env[varName];
    console.log(`${varName}:`, value ? `✅ ${value}` : '❌ Not Set');
  });

  // 6. Recommendations
  console.log('\n💡 6. Recommendations:');
  console.log('   If emails still not working:');
  console.log('   1. Update EmailJS credentials in src/config/emailjs.ts');
  console.log('   2. Create admin user: node setup-admin-user.js');
  console.log('   3. Check EmailJS dashboard for errors');
  console.log('   4. Verify templates are published');
  console.log('   5. Test with browser console open for errors');

  console.log('\n🔍 Email Flow Diagnostic Complete!');
}

// Run the diagnostic
diagnoseEmailFlow().catch(console.error); 