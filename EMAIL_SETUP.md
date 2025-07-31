# Email Service Setup Guide

This guide will help you set up email notifications for your bakery application using EmailJS.

## Overview

The application now sends two types of emails when an order is placed:
1. **Admin Notification** - Sent to the admin when a new order is received
2. **Customer Confirmation** - Sent to the customer confirming their order

## Setup Steps

### 1. Create EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/) and create a free account
2. Verify your email address

### 2. Create Email Service

1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Note down your **Service ID**

### 3. Create Email Templates

#### Admin Notification Template

1. Go to "Email Templates" in EmailJS dashboard
2. Click "Create New Template"
3. Name it "Admin Order Notification"
4. Use this template:

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

#### Customer Confirmation Template

1. Create another template named "Customer Order Confirmation"
2. Use this template:

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

### 4. Get Your Credentials

1. Go to "Account" → "API Keys" in EmailJS dashboard
2. Copy your **Public Key**

### 5. Update the Code

Open `src/services/email-simple.ts` and update the `sendEmailViaService` function:

```typescript
// Replace the TODO section with:
const emailjs = await import('@emailjs/browser');

const result = await emailjs.send(
  'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
  'YOUR_ADMIN_TEMPLATE_ID', // Replace with admin template ID
  {
    order_number: emailData.orderNumber,
    order_date: new Date().toLocaleDateString('en-IN'),
    customer_name: orderData.customerName,
    customer_phone: orderData.customerPhone,
    customer_email: orderData.customerEmail || 'Not provided',
    customer_address: orderData.customerAddress,
    customer_pincode: orderData.customerPincode,
    order_items: this.formatOrderItemsForEmail(orderData.items),
    total_amount: orderData.total,
  },
  'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
);

if (result.status === 200) {
  return { success: true };
} else {
  return { success: false, error: 'Failed to send email' };
}
```

### 6. Install EmailJS Package

Run this command in your project directory:

```bash
npm install @emailjs/browser
```

### 7. Set Up Admin Email

Make sure you have an admin user in your `user_profiles` table with `role = 'admin'` and a valid email address.

## Testing

1. Place a test order with a customer email
2. Check the browser console for email logs
3. Verify that both admin and customer emails are being sent

## Troubleshooting

### Email Not Sending
- Check EmailJS dashboard for any errors
- Verify your service ID, template ID, and public key
- Ensure your email service is properly connected

### Admin Email Not Found
- Check that you have a user in `user_profiles` table with `role = 'admin'`
- Verify the admin user has a valid email address

### Customer Email Not Sending
- Ensure the customer provided an email address
- Check that the email format is valid

## Email Templates Variables

### Admin Template Variables
- `{{order_number}}` - Order number
- `{{order_date}}` - Order date
- `{{customer_name}}` - Customer name
- `{{customer_phone}}` - Customer phone
- `{{customer_email}}` - Customer email
- `{{customer_address}}` - Customer address
- `{{customer_pincode}}` - Customer pincode
- `{{order_items}}` - Formatted order items
- `{{total_amount}}` - Total order amount

### Customer Template Variables
- `{{order_number}}` - Order number
- `{{order_date}}` - Order date
- `{{customer_name}}` - Customer name
- `{{customer_address}}` - Customer address
- `{{customer_pincode}}` - Customer pincode
- `{{order_items}}` - Formatted order items
- `{{total_amount}}` - Total order amount

## Security Notes

- Never commit your EmailJS credentials to version control
- Use environment variables for sensitive data in production
- Consider rate limiting for email sending
- Monitor your EmailJS usage to stay within free tier limits

## Production Considerations

1. **Environment Variables**: Store EmailJS credentials in environment variables
2. **Rate Limiting**: Implement rate limiting for email sending
3. **Error Handling**: Add proper error handling and retry logic
4. **Monitoring**: Set up monitoring for email delivery success rates
5. **Backup Service**: Consider having a backup email service provider 