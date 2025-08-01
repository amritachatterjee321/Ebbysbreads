// Setup Admin User for Email Notifications
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAdminUser() {
  console.log('🔧 Setting up admin user for email notifications...\n');

  // Get admin email from user input
  const adminEmail = process.argv[2];
  
  if (!adminEmail) {
    console.log('❌ Please provide an admin email address');
    console.log('Usage: node setup-admin-user.js your-email@example.com');
    process.exit(1);
  }

  console.log(`📧 Setting up admin user: ${adminEmail}`);

  try {
    // First, create the user_profiles table if it doesn't exist
    console.log('🗄️  Creating user_profiles table...');
    
    const { error: tableError } = await supabase.rpc('create_user_profiles_table');
    
    if (tableError && !tableError.message.includes('already exists')) {
      console.log('⚠️  Table creation error (might already exist):', tableError.message);
    } else {
      console.log('✅ user_profiles table ready');
    }

    // Insert or update admin user
    console.log('👤 Creating admin user...');
    
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        email: adminEmail,
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })
      .select();

    if (error) {
      console.error('❌ Error creating admin user:', error.message);
      
      // Try alternative approach with direct SQL
      console.log('🔄 Trying alternative approach...');
      
      const { error: sqlError } = await supabase.rpc('create_admin_user', {
        admin_email: adminEmail
      });
      
      if (sqlError) {
        console.error('❌ Alternative approach failed:', sqlError.message);
        console.log('\n💡 Manual setup required:');
        console.log('1. Go to your Supabase dashboard');
        console.log('2. Create a user_profiles table with columns: email, role, created_at, updated_at');
        console.log('3. Insert a record: email=your-email, role=admin');
      } else {
        console.log('✅ Admin user created successfully via SQL function');
      }
    } else {
      console.log('✅ Admin user created/updated successfully');
      console.log('   Email:', data[0].email);
      console.log('   Role:', data[0].role);
    }

    // Verify admin user exists
    console.log('\n🔍 Verifying admin user...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('user_profiles')
      .select('email, role, created_at')
      .eq('role', 'admin');

    if (verifyError) {
      console.log('❌ Verification error:', verifyError.message);
    } else if (!verifyData || verifyData.length === 0) {
      console.log('❌ No admin users found');
    } else {
      console.log('✅ Admin users found:', verifyData.length);
      verifyData.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`);
      });
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }

  console.log('\n🎯 Next steps:');
  console.log('1. Update EmailJS credentials in src/config/emailjs.ts');
  console.log('2. Test email flow with a new order');
  console.log('3. Check browser console for any errors');
}

setupAdminUser().catch(console.error); 