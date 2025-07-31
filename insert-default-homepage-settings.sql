-- Insert default homepage settings
-- Run this in your Supabase SQL editor

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
VALUES (
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
)
ON CONFLICT (id) DO NOTHING; 