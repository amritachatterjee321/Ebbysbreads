// Simple script to create admin user for Ebby's Bakery
// Run this with: node create-admin-simple.js

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read environment variables from .env file
function loadEnvFile() {
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    
    return envVars;
  } catch (error) {
    console.log('No .env file found, using process.env');
    return process.env;
  }
}

const env = loadEnvFile();

// Get Supabase credentials
const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.log('Please check your .env file or environment variables:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Get admin email from command line arguments
const adminEmail = process.argv[2];

if (!adminEmail) {
  console.error('❌ Error: Please provide an admin email address');
  console.log('Usage: node create-admin-simple.js your-email@example.com');
  process.exit(1);
}

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...');
    console.log(`📧 Admin email: ${adminEmail}`);
    console.log(`🔗 Supabase URL: ${supabaseUrl}`);
    
    // Check if user_profiles table exists by trying to query it
    console.log('📋 Checking user_profiles table...');
    const { data: existingUsers, error: checkError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (checkError) {
      console.error('❌ Error accessing user_profiles table:', checkError.message);
      console.log('\n💡 You may need to create the table manually in Supabase SQL Editor:');
      console.log(`
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `);
      return;
    }
    
    // Insert or update admin user
    console.log('👤 Creating admin user...');
    const { data: user, error: insertError } = await supabase
      .from('user_profiles')
      .upsert({
        email: adminEmail,
        role: 'admin'
      }, {
        onConflict: 'email'
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Error creating admin user:', insertError.message);
      return;
    }
    
    console.log('✅ Admin user created successfully!');
    console.log('📋 User details:', {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    });
    
    // Verify admin user exists
    console.log('🔍 Verifying admin user...');
    const { data: adminUsers, error: verifyError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'admin');
    
    if (verifyError) {
      console.error('❌ Error verifying admin user:', verifyError.message);
      return;
    }
    
    console.log(`✅ Found ${adminUsers.length} admin user(s):`);
    adminUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });
    
    console.log('\n🎉 Admin user setup complete!');
    console.log('📧 You can now test email notifications with this admin email.');
    console.log('🌐 Go to your app and click the "📧 Test" button to test email functionality.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the script
createAdminUser(); 