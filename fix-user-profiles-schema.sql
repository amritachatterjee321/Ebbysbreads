-- Fix user_profiles table schema
-- Add missing columns that the application expects

-- First, let's check the current structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public';

-- Add the missing 'name' column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'name' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN name TEXT;
        RAISE NOTICE 'Added name column to user_profiles table';
    ELSE
        RAISE NOTICE 'name column already exists in user_profiles table';
    END IF;
END $$;

-- Add other potentially missing columns
DO $$ 
BEGIN
    -- Add avatar_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'avatar_url' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN avatar_url TEXT;
        RAISE NOTICE 'Added avatar_url column to user_profiles table';
    END IF;
    
    -- Add role column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'role' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN role TEXT DEFAULT 'user';
        RAISE NOTICE 'Added role column to user_profiles table';
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'updated_at' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to user_profiles table';
    END IF;
END $$;

-- Verify the final structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position; 