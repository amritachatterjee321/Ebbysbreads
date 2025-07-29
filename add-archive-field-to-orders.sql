-- Add is_archived field to orders table
ALTER TABLE orders ADD COLUMN is_archived BOOLEAN DEFAULT FALSE;

-- Create index for better performance when filtering archived orders
CREATE INDEX idx_orders_archived ON orders(is_archived);

-- Update the updated_at trigger to include the new field
-- (The existing trigger will automatically handle the updated_at field) 