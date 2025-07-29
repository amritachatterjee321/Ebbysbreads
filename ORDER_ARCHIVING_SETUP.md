# 📦 Order Archiving Setup Guide

This guide will help you set up the order archiving functionality in your bakery application.

## ✅ What's Been Added

- ✅ **Archive/Unarchive functionality** for orders
- ✅ **Separate archived orders section** in admin dashboard
- ✅ **Toggle between active and archived orders**
- ✅ **Database migration** to add `is_archived` field
- ✅ **TypeScript types** updated for the new field

## 🗄️ Database Setup

### Step 1: Run the Migration

You need to add the `is_archived` field to your orders table. Run this SQL in your Supabase dashboard:

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Run the migration:**

```sql
-- Add is_archived field to orders table
ALTER TABLE orders ADD COLUMN is_archived BOOLEAN DEFAULT FALSE;

-- Create index for better performance when filtering archived orders
CREATE INDEX idx_orders_archived ON orders(is_archived);
```

### Step 2: Verify the Migration

After running the migration, you can verify it worked by checking:

```sql
-- Check if the column was added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'is_archived';

-- Check if the index was created
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'orders' AND indexname LIKE '%archived%';
```

## 🎯 How to Use Order Archiving

### In the Admin Dashboard

1. **Go to Admin Dashboard** (`/admin`)
2. **Click on the "Orders" tab**
3. **You'll see two buttons:**
   - **"Active Orders"** - Shows current orders
   - **"Archived Orders"** - Shows archived orders

### Archiving an Order

1. **In the Active Orders section:**
   - Find the order you want to archive
   - Click the **"Archive"** button
   - The order will move to the archived section

### Unarchiving an Order

1. **In the Archived Orders section:**
   - Find the order you want to restore
   - Click the **"Unarchive"** button
   - The order will move back to the active section

### Features

- **Order counts** are displayed on the toggle buttons
- **Archived orders** have a gray background to distinguish them
- **Status updates** are only available for active orders
- **Empty state messages** when no orders are found

## 🔧 Technical Details

### Database Changes

- **New field:** `is_archived` (boolean, default: false)
- **New index:** `idx_orders_archived` for performance
- **Existing orders:** All existing orders will have `is_archived = false`

### TypeScript Types

The following types have been updated:
- `Order` interface now includes `is_archived: boolean`
- `OrderInsert` and `OrderUpdate` interfaces include optional `is_archived` field

### API Functions

New functions added to the admin dashboard:
- `archiveOrder(orderId: string)` - Archives an order
- `unarchiveOrder(orderId: string)` - Unarchives an order
- `fetchOrders()` - Now separates active and archived orders

## 🎨 UI Features

### Visual Indicators

- **Active Orders:** Normal white background
- **Archived Orders:** Light gray background (`bg-gray-50`)
- **Toggle buttons:** Orange for active section, gray for inactive
- **Archive button:** Gray button for archiving
- **Unarchive button:** Green button for unarchiving

### Responsive Design

- **Mobile-friendly** toggle buttons
- **Responsive table** with horizontal scroll
- **Compact action buttons** for mobile devices

## 🚨 Troubleshooting

### Migration Issues

If you get an error when running the migration:

```sql
-- Check if the column already exists
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'is_archived';

-- If it exists, you can skip the ALTER TABLE command
-- Just run the index creation:
CREATE INDEX IF NOT EXISTS idx_orders_archived ON orders(is_archived);
```

### TypeScript Errors

If you see TypeScript errors about `is_archived`:

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Clear TypeScript cache:**
   ```bash
   npx tsc --build --clean
   ```

### Build Issues

If the build fails:

1. **Check that the migration was run successfully**
2. **Verify the database types are updated**
3. **Restart the development server**

## 📊 Benefits

### Organization

- **Clean active orders list** - Only shows current orders
- **Historical data preservation** - Archived orders are kept for reference
- **Better performance** - Smaller active orders list loads faster

### Workflow

- **Completed orders** can be archived to declutter the active list
- **Cancelled orders** can be archived to keep them for reference
- **Easy restoration** - Orders can be unarchived if needed

### Data Management

- **No data loss** - Orders are preserved, just marked as archived
- **Audit trail** - All order history is maintained
- **Flexible filtering** - Easy to switch between active and archived views

## 🎯 Next Steps

1. **Run the database migration** in Supabase
2. **Test the archiving functionality** with some sample orders
3. **Archive completed orders** to keep your active list clean
4. **Monitor performance** and adjust if needed

The order archiving system is designed to be simple, efficient, and user-friendly while maintaining all your order data for future reference. 