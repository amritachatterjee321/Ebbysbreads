# 🗄️ Database Setup Guide for Staging and Test Environments

This guide will help you set up the database schema in your new Supabase projects.

## 📋 Prerequisites

- ✅ Staging Supabase project created
- ✅ Test Supabase project created
- ✅ Project credentials copied

## 🚀 Step-by-Step Setup

### 1. Set Up Staging Database

1. **Go to Staging Project**
   - Open your Supabase dashboard
   - Select the staging project (`ebbys-bakery-staging`)

2. **Run Schema Migration**
   - Go to SQL Editor
   - Copy the entire content from `supabase-schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration

3. **Verify Tables Created**
   - Go to Table Editor
   - You should see these tables:
     - `products`
     - `orders`
     - `customers`
     - `user_profiles`
     - `homepage_settings`
     - `serviceable_pincodes`

### 2. Set Up Test Database

1. **Go to Test Project**
   - Open your Supabase dashboard
   - Select the test project (`ebbys-bakery-test`)

2. **Run Schema Migration**
   - Go to SQL Editor
   - Copy the entire content from `supabase-schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration

3. **Verify Tables Created**
   - Go to Table Editor
   - Verify all tables are created successfully

### 3. Set Up Admin Users

#### For Staging Environment:
```sql
-- Create admin user for staging
INSERT INTO user_profiles (id, email, name, role) 
VALUES (
  gen_random_uuid(), 
  'your-staging-admin@example.com', 
  'Staging Admin', 
  'admin'
);
```

#### For Test Environment:
```sql
-- Create admin user for test
INSERT INTO user_profiles (id, email, name, role) 
VALUES (
  gen_random_uuid(), 
  'your-test-admin@example.com', 
  'Test Admin', 
  'admin'
);
```

### 4. Add Sample Data (Optional)

#### For Staging Environment:
```sql
-- Add sample products for staging
INSERT INTO products (name, price, weight, image, stock, description, sort_order) VALUES
('Sourdough Bread', 120, '500g', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400', 50, 'Classic sourdough bread', 1),
('Chocolate Cake', 500, '1kg', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', 20, 'Rich chocolate cake', 2),
('Croissant', 80, '100g', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', 30, 'Buttery croissant', 3);

-- Add sample pincodes for staging
INSERT INTO serviceable_pincodes (pincode, city, state) VALUES
('400001', 'Mumbai', 'Maharashtra'),
('400002', 'Mumbai', 'Maharashtra'),
('400003', 'Mumbai', 'Maharashtra');
```

#### For Test Environment:
```sql
-- Add test products
INSERT INTO products (name, price, weight, image, stock, description, sort_order) VALUES
('Test Bread', 100, '500g', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400', 10, 'Test product', 1),
('Test Cake', 400, '1kg', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', 5, 'Test product', 2);

-- Add test pincodes
INSERT INTO serviceable_pincodes (pincode, city, state) VALUES
('123456', 'Test City', 'Test State');
```

## 🔧 Update Environment Files

### Update env.staging:
```bash
# Replace with your actual staging credentials
VITE_SUPABASE_URL=https://your-staging-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_staging_anon_key_here
```

### Update env.test:
```bash
# Replace with your actual test credentials
VITE_SUPABASE_URL=https://your-test-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_test_anon_key_here
```

## 🧪 Test the Setup

### 1. Test Staging Environment:
```bash
npm run dev:staging
```
- Open http://localhost:3000
- You should see a yellow banner saying "Staging Environment"
- Test creating an order
- Check admin dashboard

### 2. Test Test Environment:
```bash
npm run dev:test
```
- Open http://localhost:3001
- You should see a red banner saying "Test Environment"
- Use the Test Data Manager to generate/clear test data
- Test all features

## 🔒 Security Notes

1. **Keep credentials secure** - Don't commit real credentials to git
2. **Use different passwords** for each environment
3. **Monitor usage** - Check Supabase dashboard for usage metrics
4. **Backup data** - Regularly backup important data

## 🚨 Troubleshooting

### Database Connection Issues:
- Verify project URL and anon key are correct
- Check if project is active in Supabase dashboard
- Ensure schema migration completed successfully

### Missing Tables:
- Re-run the schema migration
- Check SQL Editor for any errors
- Verify table names match exactly

### Admin User Issues:
- Check if admin user was created successfully
- Verify email address is correct
- Ensure role is set to 'admin'

## ✅ Verification Checklist

- [ ] Staging project created and active
- [ ] Test project created and active
- [ ] Schema migration completed for both projects
- [ ] Admin users created for both environments
- [ ] Environment files updated with correct credentials
- [ ] Staging environment tested and working
- [ ] Test environment tested and working
- [ ] Test Data Manager functional in test environment

Once you've completed these steps, your testing and staging environments will be fully functional! 