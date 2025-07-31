-- Check homepage settings data
-- Run this in your Supabase SQL editor

-- Check if table exists and has data
SELECT 
    'Table Info' as info_type,
    COUNT(*) as record_count,
    'homepage_settings' as table_name
FROM homepage_settings;

-- Show all records
SELECT 
    id,
    brand_name,
    tagline,
    menu_title,
    about_title,
    created_at,
    updated_at
FROM homepage_settings
ORDER BY id;

-- Check for null values in required fields
SELECT 
    id,
    CASE WHEN brand_name IS NULL THEN 'NULL' ELSE 'OK' END as brand_name_status,
    CASE WHEN tagline IS NULL THEN 'NULL' ELSE 'OK' END as tagline_status,
    CASE WHEN menu_title IS NULL THEN 'NULL' ELSE 'OK' END as menu_title_status,
    CASE WHEN about_title IS NULL THEN 'NULL' ELSE 'OK' END as about_title_status,
    CASE WHEN about_content IS NULL THEN 'NULL' ELSE 'OK' END as about_content_status,
    CASE WHEN about_image_url IS NULL THEN 'NULL' ELSE 'OK' END as about_image_url_status
FROM homepage_settings;

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'homepage_settings'; 