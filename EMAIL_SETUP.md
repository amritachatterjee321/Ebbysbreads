# Email Notification Setup Guide

This guide will help you set up email notifications for new orders received in your bakery application.

## 🚀 Overview

The email notification system will automatically send emails to admin users whenever a new order is placed. The system includes:

- **Beautiful HTML email templates** with order details
- **Automatic admin email detection** from user profiles
- **Error handling** that doesn't break order creation
- **Professional email formatting** with your bakery branding

## 📧 Email Service Options

### Option 1: Resend (Recommended)

[Resend](https://resend.com) is a modern email API that's easy to set up and has excellent deliverability.

#### Setup Steps:

1. **Sign up for Resend**
   - Go to [resend.com](https://resend.com)
   - Create a free account (100 emails/day free)
   - Verify your domain or use their sandbox domain

2. **Get your API key**
   - Go to your Resend dashboard
   - Navigate to API Keys
   - Create a new API key
   - Copy the key (starts with `re_`)

3. **Configure Supabase Edge Function**
   - Go to your Supabase dashboard
   - Navigate to Settings → Edge Functions
   - Add environment variable: `RESEND_API_KEY = your_api_key_here`

4. **Deploy the Edge Function**
   ```bash
   # Install Supabase CLI if you haven't already
   npm install -g supabase

   # Login to Supabase
   supabase login

   # Deploy the function
   supabase functions deploy send-email
   ```

### Option 2: SendGrid

[SendGrid](https://sendgrid.com) is another popular email service.

#### Setup Steps:

1. **Sign up for SendGrid**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Create a free account (100 emails/day free)
   - Verify your domain

2. **Get your API key**
   - Go to Settings → API Keys
   - Create a new API key with "Mail Send" permissions
   - Copy the key

3. **Update the Edge Function**
   - Replace the Resend code in `supabase/functions/send-email/index.ts` with SendGrid code
   - Set environment variable: `SENDGRID_API_KEY = your_api_key_here`

### Option 3: Gmail SMTP (Simple Setup)

For testing or small volume, you can use Gmail SMTP.

#### Setup Steps:

1. **Enable 2-factor authentication** on your Gmail account
2. **Generate an App Password**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Update the Edge Function** to use SMTP instead of API

## 🔧 Configuration

### 1. Update Email From Address

In `supabase/functions/send-email/index.ts`, update the `from` address:

```typescript
const emailData = {
  from: 'orders@yourbakery.com', // Update this with your verified domain
  to: [to],
  subject: subject,
  html: html,
  text: text || '',
};
```

### 2. Set Admin Email

The system automatically detects admin emails from the `user_profiles` table. Make sure your admin user has:

- `role = 'admin'` in the `user_profiles` table
- A valid email address

You can update this manually in Supabase:

```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

### 3. Test Email Notifications

1. **Place a test order** through your application
2. **Check the browser console** for email sending logs
3. **Check your admin email** for the notification
4. **Check Supabase logs** for any errors

## 📧 Email Template Customization

The email template is generated in `src/services/email.ts`. You can customize:

### Colors and Branding
```typescript
// Update these colors in the HTML template
.header { background: #f97316; } // Orange header
.items-table th { background: #f97316; } // Table headers
```

### Content
```typescript
// Update the email content
const html = `
  <h1>🍞 New Order Received!</h1>
  <p>Order #${orderData.orderNumber}</p>
  // ... rest of template
`;
```

### Styling
The email uses inline CSS for maximum compatibility. You can modify the styles in the `generateNewOrderEmail` function.

## 🚨 Troubleshooting

### Email Not Sending

1. **Check API Key**
   - Verify your email service API key is set correctly
   - Check Supabase environment variables

2. **Check Domain Verification**
   - Ensure your domain is verified with your email service
   - Use a verified domain in the `from` address

3. **Check Edge Function Logs**
   - Go to Supabase Dashboard → Edge Functions → Logs
   - Look for errors in the `send-email` function

4. **Check Browser Console**
   - Open browser developer tools
   - Look for email-related errors in the console

### Common Errors

**"Email service not configured"**
- Set the API key environment variable in Supabase

**"Failed to send email"**
- Check your email service account status
- Verify API key permissions
- Check domain verification

**"No admin email found"**
- Ensure admin user has `role = 'admin'` in `user_profiles`
- Verify email address is valid

## 🔒 Security Considerations

1. **API Key Security**
   - Never commit API keys to version control
   - Use environment variables in Supabase
   - Rotate API keys regularly

2. **Email Validation**
   - The system validates email addresses before sending
   - Admin emails are fetched from the database

3. **Rate Limiting**
   - Email services have rate limits
   - Monitor your usage to avoid hitting limits

## 📊 Monitoring

### Email Delivery Tracking

Most email services provide delivery tracking:

- **Resend**: Dashboard shows delivery status
- **SendGrid**: Activity feed shows email status
- **Gmail**: Check sent folder for delivery

### Logs and Analytics

- **Supabase Logs**: Edge function execution logs
- **Email Service Dashboard**: Delivery rates and bounces
- **Application Logs**: Console logs for debugging

## 🎯 Next Steps

1. **Set up your preferred email service**
2. **Deploy the Edge Function**
3. **Test with a sample order**
4. **Customize the email template**
5. **Monitor delivery rates**

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Supabase Edge Function logs
3. Verify email service configuration
4. Test with a simple email first

The email notification system is designed to be robust and won't break order creation if email sending fails. All errors are logged for debugging purposes. 