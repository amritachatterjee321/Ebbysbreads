#!/usr/bin/env node

/**
 * Check Serviceable Pincodes Script
 * 
 * This script displays all serviceable pincodes configured in the database
 */

import { createClient } from '@supabase/supabase-js';

// You'll need to set these environment variables or replace with your actual values
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project-ref.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkServiceablePincodes() {
  console.log('🔍 Checking Serviceable Pincodes...\n');
  
  try {
    // Get homepage settings which contain serviceable pincodes
    const { data, error } = await supabase
      .from('homepage_settings')
      .select('serviceable_pincodes')
      .single();
    
    if (error) {
      console.log('❌ Error fetching homepage settings:', error.message);
      return;
    }
    
    if (!data) {
      console.log('❌ No homepage settings found');
      console.log('Creating default homepage settings...');
      
      // Create default settings
      const defaultSettings = {
        brand_name: "Ebby's Breads",
        tagline: "Fresh sourdough bread and artisanal treats. New menu every week, delivered fresh to your door.",
        order_deadline_text: "Order by Sunday 11:59 PM for next week delivery",
        delivery_info_text: "Deliveries Wednesday onwards • Cash on Delivery",
        menu_title: "THIS WEEK'S MENU",
        serviceable_pincodes: "110001,110002,110003,110016,110017,110019,110021,110024,110025,110027,110029,110030,122018",
        about_title: "About Ebby",
        about_content: "Our story of passion for baking and commitment to quality."
      };
      
      const { data: newData, error: createError } = await supabase
        .from('homepage_settings')
        .insert(defaultSettings)
        .select()
        .single();
      
      if (createError) {
        console.log('❌ Error creating default settings:', createError.message);
        return;
      }
      
      console.log('✅ Default homepage settings created');
      data = newData;
    }
    
    const serviceablePincodes = data.serviceable_pincodes;
    
    if (!serviceablePincodes) {
      console.log('❌ No serviceable pincodes configured');
      return;
    }
    
    // Parse the comma-separated string into an array
    const pincodes = serviceablePincodes.split(',').map(p => p.trim());
    
    console.log('📋 Current Serviceable Pincodes:');
    console.log('================================');
    console.log(`Total: ${pincodes.length} pincodes\n`);
    
    pincodes.forEach((pincode, index) => {
      console.log(`${index + 1}. ${pincode}`);
    });
    
    console.log('\n🔍 Checking if "111111" is in the list...');
    if (pincodes.includes('111111')) {
      console.log('✅ "111111" is in the serviceable pincodes list');
    } else {
      console.log('❌ "111111" is NOT in the serviceable pincodes list');
      console.log('\n💡 To add "111111" to serviceable pincodes:');
      console.log('1. Go to your admin dashboard');
      console.log('2. Navigate to Homepage Settings');
      console.log('3. Add "111111" to the serviceable pincodes field');
      console.log('4. Save the settings');
    }
    
    console.log('\n📝 Raw serviceable_pincodes value:');
    console.log(`"${serviceablePincodes}"`);
    
  } catch (err) {
    console.log('❌ Error:', err.message);
  }
}

checkServiceablePincodes().catch(console.error); 