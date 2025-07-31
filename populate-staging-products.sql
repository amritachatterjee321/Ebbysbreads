-- Populate staging database with sample products
-- Run this in your Supabase staging project SQL Editor

-- Clear existing products (optional - remove this if you want to keep existing products)
-- DELETE FROM products;

-- Insert sample products
INSERT INTO products (
    name,
    price,
    weight,
    description,
    stock,
    is_bestseller,
    is_new,
    is_active,
    image_url
) VALUES 
(
    'Sourdough Bread',
    120.00,
    '500g',
    'Traditional sourdough bread made with our 100-year-old starter. Crusty exterior with a soft, tangy interior.',
    50,
    true,
    false,
    true,
    'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&h=400&fit=crop'
),
(
    'Chocolate Croissant',
    80.00,
    '80g',
    'Buttery, flaky croissant filled with rich dark chocolate. Perfect for breakfast or afternoon tea.',
    30,
    true,
    false,
    true,
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&fit=crop'
),
(
    'Whole Wheat Bread',
    100.00,
    '500g',
    'Nutritious whole wheat bread packed with fiber and nutrients. Great for sandwiches and toast.',
    40,
    false,
    false,
    true,
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop'
),
(
    'Blueberry Muffin',
    60.00,
    '100g',
    'Moist muffin bursting with fresh blueberries. Made with real butter and farm-fresh eggs.',
    25,
    false,
    true,
    true,
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop'
),
(
    'Baguette',
    90.00,
    '250g',
    'Classic French baguette with a crisp crust and airy interior. Perfect for sandwiches or dipping in soup.',
    35,
    false,
    false,
    true,
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop'
),
(
    'Cinnamon Roll',
    70.00,
    '120g',
    'Sweet and gooey cinnamon roll with cream cheese frosting. A perfect treat for any time of day.',
    20,
    false,
    true,
    true,
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop'
),
(
    'Multigrain Bread',
    110.00,
    '500g',
    'Hearty multigrain bread with seeds and grains. Packed with nutrition and flavor.',
    30,
    false,
    false,
    true,
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop'
),
(
    'Pain au Chocolat',
    85.00,
    '85g',
    'Classic French pastry with chocolate batons. Flaky, buttery, and absolutely delicious.',
    25,
    true,
    false,
    true,
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&fit=crop'
);

-- Verify the products were inserted
SELECT 
    name,
    price,
    weight,
    is_bestseller,
    is_new,
    is_active,
    sort_order
FROM products 
ORDER BY sort_order; 