import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseMigration() {
  console.log('🔍 Testing database migration status...\n');

  try {
    // Test 1: Check if customer_email column exists in orders table
    console.log('1. Checking if customer_email column exists in orders table...');
    const { data: columns, error: columnError } = await supabase
      .from('orders')
      .select('customer_email')
      .limit(1);

    if (columnError) {
      console.log('❌ customer_email column does not exist');
      console.log('Error:', columnError.message);
      console.log('\n📋 ACTION REQUIRED:');
      console.log('Run this SQL migration in your Supabase dashboard:');
      console.log(`
-- Add customer_email field to orders table
ALTER TABLE orders ADD COLUMN customer_email VARCHAR(255);

-- Add index for better performance when searching by email
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
      `);
    } else {
      console.log('✅ customer_email column exists');
    }

    // Test 2: Check if customers table exists and has required columns
    console.log('\n2. Checking customers table structure...');
    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .select('id, name, phone, email, address, pincode')
      .limit(1);

    if (customerError) {
      console.log('❌ customers table error:', customerError.message);
    } else {
      console.log('✅ customers table is accessible');
    }

    // Test 3: Test order creation with minimal data
    console.log('\n3. Testing order creation...');
    const testOrderData = {
      order_number: `TEST${Date.now()}`,
      customer_name: 'Test Customer',
      customer_phone: '1234567890',
      customer_email: 'test@example.com',
      customer_address: 'Test Address',
      customer_pincode: '110001',
      items: [{ name: 'Test Item', quantity: 1, price: 100 }],
      total: 100,
      status: 'pending',
      payment_status: 'pending',
      order_date: new Date().toISOString().split('T')[0]
    };

    const { data: testOrder, error: orderError } = await supabase
      .from('orders')
      .insert(testOrderData)
      .select()
      .single();

    if (orderError) {
      console.log('❌ Order creation failed:', orderError.message);
      console.log('This is likely the cause of your "failed to place order" error');
    } else {
      console.log('✅ Order creation test successful');
      
      // Clean up test order
      await supabase
        .from('orders')
        .delete()
        .eq('order_number', testOrderData.order_number);
      console.log('🧹 Test order cleaned up');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testDatabaseMigration(); 