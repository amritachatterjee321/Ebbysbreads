-- Add new fields to homepage_settings table
ALTER TABLE homepage_settings ADD COLUMN menu_title VARCHAR(255) DEFAULT 'THIS WEEK''S MENU';
ALTER TABLE homepage_settings ADD COLUMN serviceable_pincodes TEXT DEFAULT '110001, 110002, 110003, 110016, 110017, 110019, 110021, 110024, 110025, 110027, 110029, 110030, 122018';

-- Update existing records with default values
UPDATE homepage_settings SET 
  menu_title = 'THIS WEEK''S MENU',
  serviceable_pincodes = '110001, 110002, 110003, 110016, 110017, 110019, 110021, 110024, 110025, 110027, 110029, 110030, 122018'
WHERE menu_title IS NULL OR serviceable_pincodes IS NULL; 