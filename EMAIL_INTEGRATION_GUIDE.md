# 🚀 Email Integration Setup Guide

Your bakery application now has email integration ready! This guide will help you set up and test email notifications for new orders.

## ✅ What's Already Set Up

- ✅ Email service structure integrated with order creation
- ✅ Beautiful HTML email templates with order details
- ✅ Admin email detection from database
- ✅ Error handling that won't break order creation
- ✅ Test components for easy testing

## 🎯 Quick Start (5 minutes)

### Step 1: Set Up Admin User

First, you need to set up an admin user in your database:

1. **Go to your Supabase Dashboard**
   - Navigate to Table Editor → `user_profiles`
   - Insert a new row with your email as admin

2. **Or run this SQL in Supabase SQL Editor:**
   ```sql
   INSERT INTO user_profiles (id, email, name, role) 
   VALUES (
     gen_random_uuid(), 
     'your-email@example.com', 
     'Admin User', 
     'admin'
   );
   ```

### Step 2: Test Email Integration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the test page:**
   - Go to `http://localhost:5173/test-email-simple`
   - Or add the test component to your main app

3. **Click "Test Email Service"**
   - Check the browser console for email logs
   - The email content will be logged (not actually sent yet)

### Step 3: Test with Real Orders

1. **Place a test order** through your main application
2. **Check browser console** for email notification logs
3. **Verify order creation** in your admin dashboard

## 📧 Setting Up Actual Email Sending

### Option 1: EmailJS (Recommended for Testing)

1. **Sign up for EmailJS:**
   - Go to [emailjs.com](https://emailjs.com)
   - Create a free account
   - Add your Gmail account as an email service

2. **Get your credentials:**
   - Copy your Public Key
   - Copy your Service ID
   - Copy your Template ID

3. **Update the email service:**
   - Open `src/services/email-simple.ts`
   - Find the `sendEmailViaService` function
   - Uncomment the EmailJS code
   - Replace the placeholder values with your credentials

### Option 2: Resend (Production Ready)

1. **Sign up for Resend:**
   - Go to [resend.com](https://resend.com)
   - Create a free account (100 emails/day free)
   - Verify your domain

2. **Get your API key:**
   - Go to your Resend dashboard
   - Navigate to API Keys
   - Create a new API key

3. **Update the email service:**
   - Replace the EmailJS code with Resend API calls
   - Use your verified domain in the `from` address

### Option 3: SendGrid

1. **Sign up for SendGrid:**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Create a free account (100 emails/day free)
   - Verify your domain

2. **Get your API key:**
   - Go to Settings → API Keys
   - Create a new API key with "Mail Send" permissions

3. **Update the email service:**
   - Replace the email sending code with SendGrid API calls

## 🔧 Configuration Details

### Email Template Customization

The email template is in `src/services/email-simple.ts`. You can customize:

- **Colors and branding** - Update the CSS styles
- **Content** - Modify the HTML template
- **Layout** - Change the structure and styling

### Admin Email Detection

The system automatically finds admin emails from the `user_profiles` table:
- Looks for users with `role = 'admin'`
- Uses the first admin email found
- Logs errors if no admin email is found

### Error Handling

The email system is designed to be robust:
- Email failures won't break order creation
- All errors are logged to console
- Graceful fallback to logging mode

## 🧪 Testing

### Test Components

1. **TestEmailSimple** (`/test-email-simple`)
   - Tests the email service directly
   - Shows admin setup instructions
   - Displays email content in console

2. **Real Order Testing**
   - Place orders through the main application
   - Check console for email logs
   - Verify admin dashboard shows orders

### Console Logs

Look for these messages in the browser console:
- `"Sending new order notification to: admin@email.com"`
- `"Email would be sent with content: ..."`
- `"Email notification logged successfully"`

## 🚨 Troubleshooting

### No Admin Email Found
- Verify admin user exists in `user_profiles` table
- Check that `role = 'admin'` is set
- Ensure email address is valid

### Email Not Sending
- Check email service configuration
- Verify API keys and credentials
- Test with a simple email first

### Order Creation Issues
- Email failures won't affect order creation
- Check database connection
- Verify order data structure

## 📊 Monitoring

### Email Delivery
- Check your email service dashboard
- Monitor delivery rates and bounces
- Review email logs in browser console

### Order Processing
- Check Supabase logs for database operations
- Monitor admin dashboard for new orders
- Verify email notifications are triggered

## 🎯 Next Steps

1. **Test the current setup** - Verify email logging works
2. **Choose an email service** - EmailJS for testing, Resend/SendGrid for production
3. **Configure the service** - Update the email sending code
4. **Test real emails** - Send actual email notifications
5. **Customize templates** - Update branding and content
6. **Monitor delivery** - Track email success rates

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review browser console logs
3. Verify database configuration
4. Test with the provided test components

The email integration is designed to be robust and won't break your order creation process. All errors are logged for easy debugging. 