-- Add sort_order column to products table
ALTER TABLE products ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Update existing products with sort order based on their current order
UPDATE products SET sort_order = id WHERE sort_order = 0;

-- Create index for better performance on sort_order
CREATE INDEX idx_products_sort_order ON products(sort_order);

-- Update the products table to make sort_order NOT NULL after setting default values
ALTER TABLE products ALTER COLUMN sort_order SET NOT NULL; 