-- Simple fix for RLS policy recursion issue
-- Remove the problematic admin policy that causes recursion

-- Disable RLS temporarily
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop the problematic admin policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Keep only the basic user policies (these don't cause recursion)
-- Users can read their own profile
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY IF NOT EXISTS "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Verify the fix
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_profiles'; 