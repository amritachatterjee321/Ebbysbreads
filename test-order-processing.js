#!/usr/bin/env node

/**
 * Order Processing Test Script
 * 
 * This script helps debug order processing issues by testing
 * the database connection and order creation functionality
 */

import { createClient } from '@supabase/supabase-js';

// You'll need to set these environment variables or replace with your actual values
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project-ref.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...\n');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('products').select('count').limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (err) {
    console.log('❌ Database connection error:', err.message);
    return false;
  }
}

async function testOrderCreation() {
  console.log('\n🔍 Testing Order Creation...\n');
  
  try {
    // Test order data
    const testOrder = {
      order_number: `TEST${Date.now().toString().slice(-6)}`,
      customer_name: 'Test Customer',
      customer_phone: '1234567890',
      customer_address: 'Test Address',
      customer_pincode: '111111',
      items: [
        {
          id: 1,
          name: 'Test Product',
          quantity: 1,
          price: 100,
          weight: '500g'
        }
      ],
      total: 100,
      status: 'pending',
      payment_status: 'pending',
      order_date: new Date().toISOString().split('T')[0]
    };
    
    console.log('📝 Test order data:', JSON.stringify(testOrder, null, 2));
    
    // Try to create the order
    const { data, error } = await supabase
      .from('orders')
      .insert(testOrder)
      .select()
      .single();
    
    if (error) {
      console.log('❌ Order creation failed:', error.message);
      console.log('Error details:', error);
      return false;
    }
    
    console.log('✅ Order created successfully:', data);
    
    // Clean up - delete the test order
    await supabase.from('orders').delete().eq('order_number', testOrder.order_number);
    console.log('🧹 Test order cleaned up');
    
    return true;
  } catch (err) {
    console.log('❌ Order creation error:', err.message);
    return false;
  }
}

async function checkTableStructure() {
  console.log('\n🔍 Checking Table Structure...\n');
  
  try {
    // Check orders table structure
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Cannot access orders table:', error.message);
      return false;
    }
    
    console.log('✅ Orders table accessible');
    console.log('📋 Table columns available');
    
    return true;
  } catch (err) {
    console.log('❌ Table structure check error:', err.message);
    return false;
  }
}

async function runTests() {
  console.log('🔧 Order Processing Debug Test');
  console.log('================================\n');
  
  // Test 1: Database Connection
  const dbConnected = await testDatabaseConnection();
  
  if (!dbConnected) {
    console.log('\n❌ Cannot proceed - database connection failed');
    console.log('Please check your Supabase configuration');
    return;
  }
  
  // Test 2: Table Structure
  const tableOk = await checkTableStructure();
  
  if (!tableOk) {
    console.log('\n❌ Cannot proceed - table structure issues');
    return;
  }
  
  // Test 3: Order Creation
  const orderCreated = await testOrderCreation();
  
  console.log('\n📊 Test Results:');
  console.log('================');
  console.log(`Database Connection: ${dbConnected ? '✅' : '❌'}`);
  console.log(`Table Structure: ${tableOk ? '✅' : '❌'}`);
  console.log(`Order Creation: ${orderCreated ? '✅' : '❌'}`);
  
  if (orderCreated) {
    console.log('\n✅ All tests passed! Order processing should work.');
    console.log('If orders are still not processing, check:');
    console.log('1. Browser console for JavaScript errors');
    console.log('2. Network tab for failed requests');
    console.log('3. Form validation errors');
  } else {
    console.log('\n❌ Order creation failed. Check:');
    console.log('1. Supabase RLS policies');
    console.log('2. Database permissions');
    console.log('3. Table constraints');
  }
}

runTests().catch(console.error); 