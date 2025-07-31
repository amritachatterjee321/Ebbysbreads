# Admin User Setup Guide

This guide will help you create an admin user for your bakery application so that email notifications work properly.

## Why You Need an Admin User

The email notification system requires an admin user in the database to:
- Send order notifications to admin when new orders are placed
- Test the email functionality
- Manage the bakery operations

## Setup Options

### Option 1: Using SQL Script (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to your project
   - Go to "SQL Editor"

2. **Run the SQL Script**
   - Copy the contents of `create-admin-user.sql`
   - Replace `'your-admin-email@example.com'` with your actual email
   - Run the script

3. **Verify the Setup**
   - The script will show you the created admin user
   - You should see your email with role 'admin'

### Option 2: Using JavaScript Script

1. **Install Dependencies** (if not already installed)
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Run the Script**
   ```bash
   node create-admin-simple.js your-email@example.com
   ```

3. **Example Usage**
   ```bash
   node create-admin-simple.js admin@ebbysbakery.com
   ```

### Option 3: Manual Database Setup

1. **Create the Table** (if it doesn't exist)
   ```sql
   CREATE TABLE IF NOT EXISTS user_profiles (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     role VARCHAR(50) DEFAULT 'user',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Insert Admin User**
   ```sql
   INSERT INTO user_profiles (email, role) 
   VALUES ('your-email@example.com', 'admin')
   ON CONFLICT (email) 
   DO UPDATE SET role = 'admin';
   ```

## Testing the Setup

### 1. Check Admin Email Test Page
1. Go to your app: `http://localhost:3000`
2. Click the **"📧 Test"** button in the header
3. Or go directly to: `http://localhost:3000/admin-email-test`
4. You should see "✅ Admin Email Found: your-email@example.com"

### 2. Test Email Functionality
1. Go to: `http://localhost:3000/email-test`
2. Click **"Test Both Emails"**
3. Check the results - admin email should show "Success"

### 3. Test Real Order Flow
1. Place a test order with a customer email
2. Check that admin notification is sent
3. Check that customer confirmation is sent

## Troubleshooting

### "No admin email found" Error

**Cause**: No user with role='admin' in the database

**Solution**:
1. Run one of the setup scripts above
2. Check the admin email test page for verification
3. Ensure the email address is correct

### "Table user_profiles does not exist" Error

**Cause**: The user_profiles table hasn't been created

**Solution**:
1. Run the SQL script in Supabase SQL Editor
2. Or create the table manually using the SQL provided

### "Database connection failed" Error

**Cause**: Supabase credentials are incorrect

**Solution**:
1. Check your `.env` file has correct credentials
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Test connection in Supabase dashboard

## Environment Variables Required

Make sure your `.env` file contains:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Multiple Admin Users

You can have multiple admin users by running the insert script multiple times with different email addresses:

```sql
INSERT INTO user_profiles (email, role) VALUES 
('admin1@example.com', 'admin'),
('admin2@example.com', 'admin');
```

## Security Notes

- Only trusted email addresses should be given admin role
- Admin users will receive all order notifications
- Consider using a dedicated admin email for the business
- Regularly review and update admin user list

## Next Steps

After setting up the admin user:

1. **Test Email Functionality**: Use the test pages to verify everything works
2. **Configure EmailJS**: Follow the `EMAIL_SETUP.md` guide to set up actual email sending
3. **Monitor Notifications**: Check that admin receives order notifications
4. **Customize Templates**: Modify email templates as needed

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify database connection in Supabase dashboard
3. Test with the admin email test page
4. Review the troubleshooting section above 