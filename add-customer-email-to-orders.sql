-- Add customer_email field to orders table
ALTER TABLE orders ADD COLUMN customer_email VARCHAR(255);

-- Add index for better performance when searching by email
CREATE INDEX idx_orders_customer_email ON orders(customer_email); 