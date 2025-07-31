-- Script to create admin user for Ebby's Bakery
-- Run this in your Supabase SQL Editor

-- First, let's check if the user_profiles table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles'
);

-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert admin user (replace 'your-admin-email@example.com' with your actual email)
INSERT INTO user_profiles (email, role) 
VALUES ('your-admin-email@example.com', 'admin')
ON CONFLICT (email) 
DO UPDATE SET 
    role = 'admin',
    updated_at = NOW();

-- Verify the admin user was created
SELECT * FROM user_profiles WHERE role = 'admin';

-- Show all users in the system
SELECT id, email, role, created_at FROM user_profiles ORDER BY created_at DESC; 