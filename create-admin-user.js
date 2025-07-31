// Script to create admin user for Ebby's Bakery
// Run this with: node create-admin-user.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.log('Please set the following environment variables:');
  console.log('- VITE_SUPABASE_URL or SUPABASE_URL');
  console.log('- VITE_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Get admin email from command line arguments or prompt
const adminEmail = process.argv[2] || 'admin@ebbysbakery.com';

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...');
    console.log(`📧 Admin email: ${adminEmail}`);
    
    // First, check if user_profiles table exists
    console.log('📋 Checking if user_profiles table exists...');
    const { data: tableExists, error: tableError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (tableError && tableError.code === '42P01') {
      console.log('📋 Creating user_profiles table...');
      const { error: createTableError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS user_profiles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (createTableError) {
        console.error('❌ Error creating table:', createTableError);
        console.log('💡 You may need to create the table manually in Supabase SQL Editor');
        return;
      }
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
      console.error('❌ Error creating admin user:', insertError);
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
      console.error('❌ Error verifying admin user:', verifyError);
      return;
    }
    
    console.log(`✅ Found ${adminUsers.length} admin user(s):`);
    adminUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });
    
    console.log('\n🎉 Admin user setup complete!');
    console.log('📧 You can now test email notifications with this admin email.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
createAdminUser(); 