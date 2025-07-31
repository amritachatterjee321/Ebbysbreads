# EmailJS Setup Guide for Staging

This guide will help you set up EmailJS for testing email notifications in your staging environment.

## Prerequisites

- EmailJS account (free tier available)
- Your staging environment running at `http://localhost:3000`
- Admin user already created in the database

## Step 1: Create EmailJS Account

1. **Go to [EmailJS](https://www.emailjs.com/)**
2. **Sign up for a free account**
3. **Verify your email address**

## Step 2: Create Email Service

1. **In EmailJS Dashboard**, go to "Email Services"
2. **Click "Add New Service"**
3. **Choose your email provider**:
   - **Gmail** (recommended for testing)
   - **Outlook**
   - **Yahoo**
   - Or any other provider
4. **Follow the authentication steps**
5. **Note down your Service ID** (starts with `service_`)

## Step 3: Create Email Templates

### Admin Notification Template

1. **Go to "Email Templates"** in EmailJS dashboard
2. **Click "Create New Template"**
3. **Name it**: "Admin Order Notification"
4. **Use this template**:

```html
<!DOCTYPE html>
<html>
<head>
    <title>New Order - {{order_number}}</title>
</head>
<body>
    <h1>🍞 New Order Received!</h1>
    <p>Order #{{order_number}}</p>
    
    <h2>Order Details</h2>
    <p><strong>Order Number:</strong> {{order_number}}</p>
    <p><strong>Order Date:</strong> {{order_date}}</p>
    <p><strong>Status:</strong> Pending</p>

    <h3>Customer Information</h3>
    <p><strong>Name:</strong> {{customer_name}}</p>
    <p><strong>Phone:</strong> {{customer_phone}}</p>
    <p><strong>Email:</strong> {{customer_email}}</p>
    <p><strong>Address:</strong> {{customer_address}}</p>
    <p><strong>Pincode:</strong> {{customer_pincode}}</p>

    <h3>Order Items</h3>
    {{order_items}}

    <p><strong>Total Amount: ₹{{total_amount}}</strong></p>

    <p><strong>Action Required:</strong> Please review this order and update its status in the admin dashboard.</p>
</body>
</html>
```

### Customer Confirmation Template

1. **Create another template** named "Customer Order Confirmation"
2. **Use this template**:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Order Confirmed - {{order_number}}</title>
</head>
<body>
    <h1>🍞 Order Confirmed!</h1>
    <p>Thank you for your order, {{customer_name}}!</p>
    
    <h2>Order Details</h2>
    <p><strong>Order Number:</strong> {{order_number}}</p>
    <p><strong>Order Date:</strong> {{order_date}}</p>
    <p><strong>Status:</strong> Confirmed</p>
    <p><strong>Payment Method:</strong> Cash on Delivery</p>

    <h3>Delivery Information</h3>
    <p><strong>Delivery Address:</strong></p>
    <p>{{customer_address}}</p>
    <p><strong>Pincode:</strong> {{customer_pincode}}</p>
    <p><strong>Expected Delivery:</strong> Wednesday - Friday</p>

    <h3>Order Items</h3>
    {{order_items}}

    <p><strong>Total Amount: ₹{{total_amount}}</strong></p>

    <h3>Need Help?</h3>
    <p><strong>Phone Support:</strong> +91 98765 43210</p>
    <p><strong>Support Hours:</strong> Monday - Saturday: 9:00 AM - 7:00 PM</p>
    <p><strong>Follow Us:</strong> @ebbysbreads</p>

    <p>Thank you for choosing Ebby's Bakery! 🍰</p>
</body>
</html>
```

## Step 4: Get Your Credentials

1. **Go to "Account" → "API Keys"** in EmailJS dashboard
2. **Copy your Public Key** (starts with `user_`)

## Step 5: Update Configuration

1. **Open the file**: `src/config/emailjs.ts`
2. **Replace the placeholder values** with your actual credentials:

```typescript
export const EMAILJS_CONFIG = {
  // Your EmailJS Service ID (from Email Services tab)
  SERVICE_ID: 'service_abc123', // Replace with your actual service ID
  
  // Your EmailJS Public Key (from Account > API Keys)
  PUBLIC_KEY: 'user_xyz789', // Replace with your actual public key
  
  // Template IDs (from Email Templates tab)
  TEMPLATES: {
    ADMIN_NOTIFICATION: 'template_admin123', // Replace with admin template ID
    CUSTOMER_CONFIRMATION: 'template_customer456' // Replace with customer template ID
  }
};
```

## Step 6: Find Your Template IDs

1. **Go to "Email Templates"** in EmailJS dashboard
2. **Click on each template** you created
3. **Copy the Template ID** (starts with `template_`)
4. **Update the configuration** with these IDs

## Step 7: Test the Integration

### Test 1: Admin Email Test Page
1. **Go to**: `http://localhost:3000/admin-email-test`
2. **You should see**: "✅ Admin Email Found: your-email@example.com"

### Test 2: Email Functionality Test
1. **Go to**: `http://localhost:3000/email-test`
2. **Click "Test Both Emails"**
3. **Check the results**:
   - Admin email should show "Success"
   - Customer email should show "Success"
4. **Check your email inbox** for the test emails

### Test 3: Real Order Flow
1. **Place a test order** with a customer email
2. **Check that admin receives notification**
3. **Check that customer receives confirmation**

## Troubleshooting

### "EmailJS not configured" Error
- Check that you've updated all credentials in `src/config/emailjs.ts`
- Verify your Service ID, Public Key, and Template IDs are correct

### "Failed to send email" Error
- Check EmailJS dashboard for any errors
- Verify your email service is properly connected
- Check that your email provider allows sending from your account

### "Template not found" Error
- Verify your Template IDs are correct
- Make sure templates are published in EmailJS dashboard

### "Service not found" Error
- Verify your Service ID is correct
- Make sure your email service is active in EmailJS dashboard

## EmailJS Free Tier Limits

- **200 emails per month** (free tier)
- **2 email services**
- **5 email templates**
- **Basic analytics**

## Production Considerations

For production deployment:
1. **Use environment variables** for EmailJS credentials
2. **Set up proper email domain** for better deliverability
3. **Monitor email delivery rates**
4. **Consider upgrading** to paid plan for higher limits

## Next Steps

After successful EmailJS setup:
1. **Test all email scenarios**
2. **Customize email templates** to match your branding
3. **Set up email monitoring**
4. **Configure production environment**

## Support

If you encounter issues:
1. Check EmailJS dashboard for error messages
2. Verify all credentials are correct
3. Test with the email test pages
4. Check browser console for detailed logs 