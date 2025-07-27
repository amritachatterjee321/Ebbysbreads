-- Manual Homepage Settings Initialization
-- Run this in your Supabase SQL Editor

-- First, check if the table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'homepage_settings'
) as table_exists;

-- If table doesn't exist, create it
CREATE TABLE IF NOT EXISTS homepage_settings (
  id SERIAL PRIMARY KEY,
  brand_name VARCHAR(255) NOT NULL DEFAULT 'Ebby''s Breads',
  hero_image_url TEXT,
  tagline TEXT NOT NULL DEFAULT 'Fresh sourdough bread and artisanal treats. New menu every week, delivered fresh to your door.',
  order_deadline_text VARCHAR(255) NOT NULL DEFAULT 'Order by Sunday 11:59 PM for next week delivery',
  delivery_info_text VARCHAR(255) NOT NULL DEFAULT 'Deliveries Wednesday onwards • Cash on Delivery',
  menu_title VARCHAR(255) DEFAULT 'THIS WEEK''S MENU',
  serviceable_pincodes TEXT DEFAULT '110001, 110002, 110003, 110016, 110017, 110019, 110021, 110024, 110025, 110027, 110029, 110030, 122018',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check if data exists
SELECT COUNT(*) as record_count FROM homepage_settings;

-- Insert default data if no records exist
INSERT INTO homepage_settings (
  brand_name,
  hero_image_url,
  tagline,
  order_deadline_text,
  delivery_info_text,
  menu_title,
  serviceable_pincodes
) 
SELECT 
  'Ebby''s Breads',
  'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=500&fit=crop',
  'Fresh sourdough bread and artisanal treats. New menu every week, delivered fresh to your door.',
  'Order by Sunday 11:59 PM for next week delivery',
  'Deliveries Wednesday onwards • Cash on Delivery',
  'THIS WEEK''S MENU',
  '110001, 110002, 110003, 110016, 110017, 110019, 110021, 110024, 110025, 110027, 110029, 110030, 122018'
WHERE NOT EXISTS (SELECT 1 FROM homepage_settings);

-- Verify the data was inserted
SELECT * FROM homepage_settings; 