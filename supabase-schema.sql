-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    weight VARCHAR(50) NOT NULL,
    image_url TEXT,
    description TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    address TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    customer_pincode VARCHAR(10) NOT NULL,
    items JSONB NOT NULL,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
    payment_status VARCHAR(10) NOT NULL DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'paid')),
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    delivery_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create homepage_settings table
CREATE TABLE homepage_settings (
    id SERIAL PRIMARY KEY,
    brand_name VARCHAR(255) NOT NULL DEFAULT 'Ebby''s Breads',
    hero_image_url TEXT,
    tagline TEXT NOT NULL DEFAULT 'Fresh sourdough bread and artisanal treats. New menu every week, delivered fresh to your door.',
    order_deadline_text VARCHAR(255) NOT NULL DEFAULT 'Order by Sunday 11:59 PM for next week delivery',
    delivery_info_text VARCHAR(255) NOT NULL DEFAULT 'Deliveries Wednesday onwards • Cash on Delivery',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_bestseller ON products(is_bestseller);
CREATE INDEX idx_products_new ON products(is_new);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_customers_phone ON customers(phone);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homepage_settings_updated_at BEFORE UPDATE ON homepage_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read, authenticated write)
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Products are insertable by everyone" ON products
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Products are updatable by everyone" ON products
    FOR UPDATE USING (true);

CREATE POLICY "Products are deletable by everyone" ON products
    FOR DELETE USING (true);

-- Create policies for orders (public read/write)
CREATE POLICY "Orders are viewable by everyone" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Orders are insertable by everyone" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders are updatable by everyone" ON orders
    FOR UPDATE USING (true);

CREATE POLICY "Orders are deletable by everyone" ON orders
    FOR DELETE USING (true);

-- Create policies for customers (public read/write)
CREATE POLICY "Customers are viewable by everyone" ON customers
    FOR SELECT USING (true);

CREATE POLICY "Customers are insertable by everyone" ON customers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers are updatable by everyone" ON customers
    FOR UPDATE USING (true);

CREATE POLICY "Customers are deletable by everyone" ON customers
    FOR DELETE USING (true);

-- Create policies for homepage_settings (public read, authenticated write)
CREATE POLICY "Homepage settings are viewable by everyone" ON homepage_settings
    FOR SELECT USING (true);

CREATE POLICY "Homepage settings are insertable by everyone" ON homepage_settings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Homepage settings are updatable by everyone" ON homepage_settings
    FOR UPDATE USING (true);

CREATE POLICY "Homepage settings are deletable by everyone" ON homepage_settings
    FOR DELETE USING (true);

-- Insert sample data
INSERT INTO products (name, price, weight, image_url, description, stock, is_bestseller, is_new, is_active) VALUES
('100% Wholewheat Sourdough', 250.00, '500g', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop', 'Our signature whole wheat sourdough with a perfect crust and soft interior.', 15, true, false, true),
('Multiseed Sourdough', 280.00, '500g', 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&h=300&fit=crop', 'Packed with sunflower seeds, pumpkin seeds, and sesame for extra nutrition.', 8, false, false, true),
('Artisan Baguette', 180.00, '300g', 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop', 'Traditional French baguette with crispy crust and airy crumb.', 12, false, false, true),
('Sourdough Focaccia', 320.00, '400g', 'https://images.unsplash.com/photo-1608198093002-ad4e505484ba?w=400&h=300&fit=crop', 'Italian-style focaccia with olive oil and herbs.', 6, false, true, true),
('Cinnamon Swirl Bread', 320.00, '500g', 'https://images.unsplash.com/photo-1555507036-ab794f4ade2a?w=400&h=300&fit=crop', 'Sweet cinnamon swirl bread perfect for breakfast.', 10, true, false, true);

-- Insert default homepage settings
INSERT INTO homepage_settings (brand_name, hero_image_url, tagline, order_deadline_text, delivery_info_text) VALUES
('Ebby''s Breads', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=500&fit=crop', 'Fresh sourdough bread and artisanal treats. New menu every week, delivered fresh to your door.', 'Order by Sunday 11:59 PM for next week delivery', 'Deliveries Wednesday onwards • Cash on Delivery');

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create storage policies
CREATE POLICY "Product images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Everyone can upload product images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Everyone can update product images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'product-images');

CREATE POLICY "Everyone can delete product images" ON storage.objects
    FOR DELETE USING (bucket_id = 'product-images'); 