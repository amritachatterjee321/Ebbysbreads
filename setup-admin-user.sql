-- Setup Admin User in user_profiles table
-- Replace 'your-email@example.com' with the actual admin email

-- Option 1: Insert new admin user (if user doesn't exist)
INSERT INTO user_profiles (id, email, name, role, created_at, updated_at)
VALUES (
    gen_random_uuid(), -- Generate new UUID
    'your-email@example.com', -- Replace with actual admin email
    'Admin User', -- Admin name
    'admin', -- Admin role
    NOW(), -- Created timestamp
    NOW() -- Updated timestamp
)
ON CONFLICT (email) DO NOTHING; -- Don't insert if email already exists

-- Option 2: Update existing user to admin role
UPDATE user_profiles 
SET 
    role = 'admin',
    name = COALESCE(name, 'Admin User'),
    updated_at = NOW()
WHERE email = 'your-email@example.com'; -- Replace with actual admin email

-- Option 3: Upsert admin user (insert if not exists, update if exists)
INSERT INTO user_profiles (id, email, name, role, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'your-email@example.com', -- Replace with actual admin email
    'Admin User',
    'admin',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    role = 'admin',
    name = COALESCE(user_profiles.name, 'Admin User'),
    updated_at = NOW();

-- Verify admin user was created/updated
SELECT id, email, name, role, created_at, updated_at
FROM user_profiles 
WHERE email = 'your-email@example.com'; -- Replace with actual admin email 