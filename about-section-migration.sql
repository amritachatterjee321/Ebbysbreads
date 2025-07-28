-- Migration to add about section fields to homepage_settings table
-- Run this in your Supabase SQL Editor

-- Add the new columns
ALTER TABLE homepage_settings 
ADD COLUMN about_title VARCHAR(255),
ADD COLUMN about_content TEXT,
ADD COLUMN about_image_url TEXT;

-- Update existing records with default values
UPDATE homepage_settings 
SET 
  about_title = 'About Ebby',
  about_content = 'Our story of passion for baking and commitment to quality. Every loaf is crafted with love and the finest ingredients, bringing you the authentic taste of homemade bread.',
  about_image_url = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=500&fit=crop'
WHERE about_title IS NULL;

-- Make the columns NOT NULL after setting default values
ALTER TABLE homepage_settings 
ALTER COLUMN about_title SET NOT NULL,
ALTER COLUMN about_content SET NOT NULL,
ALTER COLUMN about_image_url SET NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN homepage_settings.about_title IS 'Title for the about section on the homepage';
COMMENT ON COLUMN homepage_settings.about_content IS 'Content/description for the about section';
COMMENT ON COLUMN homepage_settings.about_image_url IS 'URL of the image displayed in the about section'; 