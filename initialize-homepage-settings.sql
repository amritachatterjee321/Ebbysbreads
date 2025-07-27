-- Initialize Homepage Settings Table
-- Run this in your Supabase SQL editor

-- First, create the table if it doesn't exist
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

-- Insert default homepage settings if none exist
INSERT INTO homepage_settings (
  brand_name,
  hero_image_url,
  tagline,
  order_deadline_text,
  delivery_info_text,
  menu_title,
  serviceable_pincodes
) VALUES (
  'Ebby''s Breads',
  'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=500&fit=crop',
  'Fresh sourdough bread and artisanal treats. New menu every week, delivered fresh to your door.',
  'Order by Sunday 11:59 PM for next week delivery',
  'Deliveries Wednesday onwards • Cash on Delivery',
  'THIS WEEK''S MENU',
  '110001, 110002, 110003, 110016, 110017, 110019, 110021, 110024, 110025, 110027, 110029, 110030, 122018'
) ON CONFLICT DO NOTHING;

-- Verify the data was inserted
SELECT * FROM homepage_settings; 