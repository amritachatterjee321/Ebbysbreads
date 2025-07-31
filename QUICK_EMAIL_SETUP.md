# 🚀 Quick Email Setup Guide

## The Problem
Your EmailJS configuration still has placeholder values, which is why emails aren't being sent.

## Immediate Fix

### Step 1: Update EmailJS Configuration
Edit `src/config/emailjs.ts` and replace the placeholder values:

```typescript
export const EMAILJS_CONFIG = {
  // Replace with your actual EmailJS Service ID
  SERVICE_ID: 'your_service_id_here',
  
  // Replace with your actual EmailJS Public Key
  PUBLIC_KEY: 'your_public_key_here',
  
  // Replace with your actual Template IDs
  TEMPLATES: {
    ADMIN_NOTIFICATION: 'your_admin_template_id_here',
    CUSTOMER_CONFIRMATION: 'your_customer_template_id_here'
  }
};
```

### Step 2: Get Your EmailJS Credentials

1. **Go to**: https://www.emailjs.com/
2. **Sign up/Login** to your account
3. **Get Service ID**:
   - Go to "Email Services" tab
   - Create a new service (Gmail, Outlook, etc.)
   - Copy the Service ID
4. **Get Public Key**:
   - Go to "Account" → "API Keys"
   - Copy your Public Key
5. **Get Template IDs**:
   - Go to "Email Templates" tab
   - Create the two templates (see below)
   - Copy the Template IDs

### Step 3: Create Email Templates

#### Admin Notification Template
- **Name**: "Admin Order Notification"
- **Subject**: "New Order Received - {{order_number}}"
- **Content**: Use the HTML from `EMAILJS_SETUP.md`

#### Customer Confirmation Template
- **Name**: "Customer Order Confirmation"
- **Subject**: "Order Confirmed - {{order_number}} | Ebby's Bakery"
- **Content**: Use the HTML from `EMAILJS_SETUP.md`

### Step 4: Test the Setup

1. **Go to**: `http://localhost:3000/email-debug`
2. **Click**: "Test Email Flow"
3. **Check**: All items should show ✅

### Step 5: Test Real Order

1. **Go to**: `http://localhost:3000`
2. **Add items** to cart
3. **Place order** with your email
4. **Check inbox** for both emails

## Quick Commands

```bash
# Start the app
npm run dev

# Create admin user (if needed)
node create-admin-simple.js your-email@example.com
```

## Troubleshooting

### If "EmailJS not configured":
- Update `src/config/emailjs.ts` with real values
- Make sure templates are published in EmailJS dashboard

### If "No admin email found":
```bash
node create-admin-simple.js your-email@example.com
```

### If emails not sending:
- Check browser console for errors
- Verify EmailJS service is active
- Check email provider permissions

## Need Help?

Use the **🐛 Debug** button on the homepage to run comprehensive tests and see exactly what's failing! 