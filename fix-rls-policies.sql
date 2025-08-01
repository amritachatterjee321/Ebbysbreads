-- Fix RLS policy recursion issue in user_profiles table
-- Drop existing problematic policies and recreate them properly

-- First, disable RLS temporarily
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- For admin access, we'll use a different approach
-- Create a function to check if user is admin (without recursion)
CREATE OR REPLACE FUNCTION is_admin_user(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user exists and has admin role
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = user_id AND role = 'admin'
    );
EXCEPTION
    -- If there's any error, return false
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin policy using the function
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (is_admin_user(auth.uid()));

-- Alternative: Simple admin policy (if the function approach doesn't work)
-- CREATE POLICY "Admins can view all profiles" ON user_profiles
--     FOR SELECT USING (role = 'admin');

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_profiles'; 