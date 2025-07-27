# Supabase Setup Guide for Ebby's Bakery

This guide will help you set up Supabase as the backend database for your bakery application.

## 🚀 Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `ebbys-bakery`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
5. Click "Create new project"

### 2. Get Your Project Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### 3. Set Up Environment Variables

1. Create a `.env` file in your project root:
```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace the placeholder values with your actual Supabase credentials

### 4. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL commands
4. This will create all necessary tables, indexes, and sample data

### 5. Configure Storage

1. Go to **Storage** in your Supabase dashboard
2. The `product-images` bucket should be created automatically
3. If not, create it manually:
   - **Name**: `product-images`
   - **Public bucket**: ✅ Enabled

### 6. Set Up Authentication (Optional)

For admin access, you can set up authentication:

1. Go to **Authentication** → **Settings**
2. Configure your preferred auth providers
3. Update the RLS policies in the SQL schema if needed

## 📊 Database Schema

The application uses three main tables:

### Products Table
- `id`: Unique product identifier
- `name`: Product name
- `price`: Product price (decimal)
- `weight`: Product weight (e.g., "500g")
- `image_url`: URL to product image
- `description`: Product description
- `stock`: Available stock quantity
- `is_bestseller`: Best seller flag
- `is_new`: New product flag
- `is_active`: Active/inactive status

### Orders Table
- `id`: Unique order identifier (UUID)
- `order_number`: Human-readable order number
- `customer_name`: Customer's full name
- `customer_phone`: Customer's phone number
- `customer_address`: Delivery address
- `customer_pincode`: Delivery pincode
- `items`: JSON array of ordered items
- `total`: Order total amount
- `status`: Order status (pending, confirmed, etc.)
- `payment_status`: Payment status
- `order_date`: Order date
- `delivery_date`: Expected delivery date

### Customers Table
- `id`: Unique customer identifier (UUID)
- `name`: Customer name
- `phone`: Phone number (unique)
- `email`: Email address (optional)
- `address`: Customer address
- `pincode`: Customer pincode

## 🔐 Row Level Security (RLS)

The database uses RLS policies for security:

- **Products**: Public read access, authenticated write access
- **Orders**: Authenticated users only
- **Customers**: Authenticated users only
- **Storage**: Public read, authenticated write

## 🖼️ File Storage

Product images are stored in Supabase Storage:

- **Bucket**: `product-images`
- **Access**: Public read, authenticated upload
- **File types**: Images only (PNG, JPG, GIF)
- **Size limit**: 5MB per file

## 🔧 API Endpoints

The application uses these Supabase operations:

### Products
- `GET /products` - Get all products
- `GET /products?is_active=eq.true` - Get active products
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Orders
- `GET /orders` - Get all orders
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order status
- `GET /orders?status=eq.pending` - Get orders by status

### Storage
- `POST /storage/v1/object/upload` - Upload image
- `DELETE /storage/v1/object/remove` - Delete image

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check your environment variables
   - Ensure you're using the anon key, not the service role key

2. **"Table doesn't exist" error**
   - Run the SQL schema in Supabase SQL Editor
   - Check table names match exactly

3. **"Permission denied" error**
   - Check RLS policies are enabled
   - Verify authentication is working

4. **Image upload fails**
   - Check storage bucket exists
   - Verify storage policies are set correctly
   - Check file size and type restrictions

### Debug Mode

Enable debug logging by adding to your `.env`:
```bash
VITE_DEBUG=true
```

## 📈 Performance Tips

1. **Indexes**: The schema includes indexes on frequently queried columns
2. **Pagination**: Use `range` headers for large datasets
3. **Caching**: Consider implementing client-side caching
4. **CDN**: Supabase automatically serves images via CDN

## 🔄 Real-time Features

Supabase supports real-time subscriptions:

```typescript
// Subscribe to order updates
supabase
  .channel('orders')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
    console.log('Order updated:', payload)
  })
  .subscribe()
```

## 📱 Mobile Considerations

- Images are automatically optimized for mobile
- API responses are JSON for easy parsing
- Offline support can be added with local storage

## 🔒 Security Best Practices

1. **Never expose service role key** in client code
2. **Use RLS policies** for data access control
3. **Validate input** on both client and server
4. **Rate limiting** is handled by Supabase
5. **HTTPS only** for production

## 🆘 Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

---

**Next Steps**: After completing this setup, your bakery application will have a fully functional backend with real-time data, file storage, and scalable infrastructure! 🍞✨ 