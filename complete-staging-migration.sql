-- Complete Staging Database Migration
-- Run this in your Supabase staging project SQL Editor
-- This will add all missing columns to match the production database

-- 1. Add sort_order column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Update existing products with sort order based on their current order
UPDATE products SET sort_order = id WHERE sort_order = 0;

-- Create index for better performance on sort_order
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);

-- Make sort_order NOT NULL after setting default values
ALTER TABLE products ALTER COLUMN sort_order SET NOT NULL;

-- 2. Add missing columns to homepage_settings table
ALTER TABLE homepage_settings 
ADD COLUMN IF NOT EXISTS menu_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS serviceable_pincodes TEXT,
ADD COLUMN IF NOT EXISTS about_title VARCHAR(255) DEFAULT 'About Ebby''s Bakery',
ADD COLUMN IF NOT EXISTS about_content TEXT DEFAULT 'We are passionate about creating fresh, artisanal sourdough bread and delicious treats. Our commitment to quality and traditional baking methods ensures every bite is a delight.',
ADD COLUMN IF NOT EXISTS about_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80';

-- Insert default homepage settings if table is empty
INSERT INTO homepage_settings (
    brand_name,
    hero_image_url,
    tagline,
    order_deadline_text,
    delivery_info_text,
    menu_title,
    serviceable_pincodes,
    about_title,
    about_content,
    about_image_url
) 
SELECT 
    'Ebby''s Breads',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
    'Fresh sourdough bread and artisanal treats. New menu every week, delivered fresh to your door.',
    'Order by Sunday 11:59 PM for next week delivery',
    'Deliveries Wednesday onwards • Cash on Delivery',
    'Our Menu',
    '400001,400002,400003,400004,400005,400006,400007,400008,400009,400010',
    'About Ebby''s Bakery',
    'We are passionate about creating fresh, artisanal sourdough bread and delicious treats. Our commitment to quality and traditional baking methods ensures every bite is a delight.',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80'
WHERE NOT EXISTS (SELECT 1 FROM homepage_settings);

-- Update existing records to have the new fields if they don't have them
UPDATE homepage_settings 
SET 
    menu_title = COALESCE(menu_title, 'Our Menu'),
    serviceable_pincodes = COALESCE(serviceable_pincodes, '400001,400002,400003,400004,400005,400006,400007,400008,400009,400010'),
    about_title = COALESCE(about_title, 'About Ebby''s Bakery'),
    about_content = COALESCE(about_content, 'We are passionate about creating fresh, artisanal sourdough bread and delicious treats. Our commitment to quality and traditional baking methods ensures every bite is a delight.'),
    about_image_url = COALESCE(about_image_url, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')
WHERE id > 0;

-- 3. Add missing columns to orders table (if needed)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;

-- 4. Verify the migration
SELECT 'Migration completed successfully!' as status;

-- Show current table structures
SELECT 'Products table columns:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

SELECT 'Homepage settings table columns:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'homepage_settings' 
ORDER BY ordinal_position; 