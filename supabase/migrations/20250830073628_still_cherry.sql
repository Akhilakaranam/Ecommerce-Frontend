/*
  # Sample Data for Filpmart E-commerce

  1. Sample Categories
    - Electronics with subcategories
    - Fashion categories
    - Home & Kitchen

  2. Sample Products
    - Various electronics items
    - Clothing and accessories
    - Home appliances

  3. Sample Admin User
    - Default admin account for testing
*/

-- Insert sample categories
INSERT INTO categories (id, name, description, parent_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Electronics', 'Electronic gadgets and devices', NULL),
  ('550e8400-e29b-41d4-a716-446655440002', 'Fashion', 'Clothing and accessories', NULL),
  ('550e8400-e29b-41d4-a716-446655440003', 'Home & Kitchen', 'Home appliances and kitchen items', NULL),
  ('550e8400-e29b-41d4-a716-446655440004', 'Smartphones', 'Mobile phones and accessories', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Laptops', 'Laptops and computers', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Mens Clothing', 'Clothing for men', '550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Womens Clothing', 'Clothing for women', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample admin user (password: admin123)
INSERT INTO users (id, email, password, first_name, last_name, phone, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'admin@filpmart.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewBJ8HbVLSWaYRo6', 'Admin', 'User', '9999999999', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample vendor user (password: vendor123)
INSERT INTO users (id, email, password, first_name, last_name, phone, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440010', 'vendor@filpmart.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewBJ8HbVLSWaYRo6', 'Vendor', 'User', '8888888888', 'vendor')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (id, name, description, price, category_id, brand, stock_quantity, images, created_by) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440100',
    'iPhone 15 Pro',
    'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system',
    999.99,
    '550e8400-e29b-41d4-a716-446655440004',
    'Apple',
    50,
    '{"https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg"}',
    '550e8400-e29b-41d4-a716-446655440010'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440101',
    'Samsung Galaxy S24',
    'Premium Android smartphone with AI features and excellent camera',
    799.99,
    '550e8400-e29b-41d4-a716-446655440004',
    'Samsung',
    75,
    '{"https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg"}',
    '550e8400-e29b-41d4-a716-446655440010'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440102',
    'MacBook Pro 16"',
    'Powerful laptop with M3 chip, perfect for professionals and creators',
    2499.99,
    '550e8400-e29b-41d4-a716-446655440005',
    'Apple',
    25,
    '{"https://images.pexels.com/photos/18104/pexels-photo-18104.jpeg"}',
    '550e8400-e29b-41d4-a716-446655440010'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440103',
    'Dell XPS 13',
    'Ultra-portable laptop with stunning display and premium build quality',
    1299.99,
    '550e8400-e29b-41d4-a716-446655440005',
    'Dell',
    40,
    '{"https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg"}',
    '550e8400-e29b-41d4-a716-446655440010'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440104',
    'Casual Cotton T-Shirt',
    'Comfortable cotton t-shirt perfect for everyday wear',
    19.99,
    '550e8400-e29b-41d4-a716-446655440006',
    'Generic',
    200,
    '{"https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg"}',
    '550e8400-e29b-41d4-a716-446655440010'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440105',
    'Womens Summer Dress',
    'Elegant summer dress with floral patterns, perfect for casual outings',
    49.99,
    '550e8400-e29b-41d4-a716-446655440007',
    'Fashion Brand',
    100,
    '{"https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg"}',
    '550e8400-e29b-41d4-a716-446655440010'
  )
ON CONFLICT (id) DO NOTHING;