# Fix Homepage Settings Issue

## Problem
The admin dashboard shows "No Homepage Settings Found" because the database schema is missing required fields that the application expects.

## Root Cause
The `homepage_settings` table in your Supabase database is missing these required fields:
- `menu_title`
- `serviceable_pincodes`
- `about_title`
- `about_content`
- `about_image_url`

## Solution

### Step 1: Update Database Schema

1. **Go to your Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your project
   - Go to the "SQL Editor" tab

2. **Run the Migration Script**
   - Copy the contents of `update-homepage-settings-schema.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute the script

3. **Verify the Changes**
   - Go to "Table Editor" → "homepage_settings"
   - You should see the new columns added
   - There should be at least one record with default values

### Step 2: Test the Connection

1. **Set Environment Variables** (if testing locally)
   ```bash
   export SUPABASE_URL="your-supabase-url"
   export SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```

2. **Run the Test Script**
   ```bash
   node test-homepage-settings-check.js
   ```

3. **Expected Output**
   ```
   ✅ Successfully connected to homepage_settings table
   📊 Found 1 record(s)
   🎉 All required fields are present!
   ```

### Step 3: Refresh the Admin Dashboard

1. **Clear Browser Cache**
   - Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
   - Or open Developer Tools → Network tab → check "Disable cache"

2. **Reload the Page**
   - Go to your admin dashboard
   - The homepage settings should now load properly

### Step 4: Customize Settings (Optional)

1. **Click "Edit Settings"** in the admin dashboard
2. **Update the following fields:**
   - **Brand Name**: Your bakery name
   - **Tagline**: Your business tagline
   - **Order Deadline**: When orders close for the week
   - **Delivery Info**: Delivery schedule and payment info
   - **Menu Title**: Title for the menu section
   - **Serviceable Pincodes**: Comma-separated list of delivery pincodes
   - **About Section**: Your business description and image

## Troubleshooting

### If the migration fails:
1. **Check Table Permissions**
   - Go to Supabase Dashboard → Authentication → Policies
   - Ensure `homepage_settings` table has proper RLS policies

2. **Manual Table Creation**
   ```sql
   -- Drop and recreate the table if needed
   DROP TABLE IF EXISTS homepage_settings;
   
   CREATE TABLE homepage_settings (
       id SERIAL PRIMARY KEY,
       brand_name VARCHAR(255) NOT NULL DEFAULT 'Ebby''s Breads',
       hero_image_url TEXT,
       tagline TEXT NOT NULL DEFAULT 'Fresh sourdough bread and artisanal treats.',
       order_deadline_text VARCHAR(255) NOT NULL DEFAULT 'Order by Sunday 11:59 PM',
       delivery_info_text VARCHAR(255) NOT NULL DEFAULT 'Deliveries Wednesday onwards',
       menu_title VARCHAR(255) DEFAULT 'Our Menu',
       serviceable_pincodes TEXT DEFAULT '400001,400002,400003',
       about_title VARCHAR(255) DEFAULT 'About Ebby''s Bakery',
       about_content TEXT DEFAULT 'We are passionate about creating fresh bread.',
       about_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### If the admin dashboard still shows "No Homepage Settings":
1. **Check Browser Console**
   - Press F12 → Console tab
   - Look for any JavaScript errors

2. **Check Network Tab**
   - Press F12 → Network tab
   - Look for failed API calls to Supabase

3. **Verify Environment Variables**
   - Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
   - Check that they match your Supabase project settings

## Expected Result

After completing these steps, your admin dashboard should:
- ✅ Show the homepage settings form instead of "No Homepage Settings Found"
- ✅ Allow you to edit and save settings
- ✅ Display the settings on your main homepage
- ✅ Show proper branding and content

## Next Steps

1. **Customize the Settings**: Update the default values with your actual business information
2. **Add Products**: Go to the "Products" tab to add your bakery items
3. **Test Orders**: Create a test order to ensure everything works
4. **Set Up Email**: Configure email notifications for new orders

## Support

If you continue to have issues:
1. Check the browser console for errors
2. Run the test script to verify database connectivity
3. Ensure all environment variables are correctly set
4. Verify that your Supabase project is active and accessible 