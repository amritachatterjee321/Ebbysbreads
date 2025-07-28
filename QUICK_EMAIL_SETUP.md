# Quick Email Setup for Testing

This guide will help you quickly set up email notifications for testing purposes.

## 🚀 Quick Start (5 minutes)

### Option 1: Use EmailJS (Easiest)

1. **Sign up for EmailJS**
   - Go to [emailjs.com](https://emailjs.com)
   - Create a free account
   - Add your Gmail account as an email service

2. **Get your credentials**
   - Copy your Public Key
   - Copy your Service ID
   - Copy your Template ID

3. **Update the email service**
   - Replace the placeholder in `src/services/email-simple.ts`
   - Update the `sendEmailViaService` function with EmailJS code

### Option 2: Use a Test Email Service

For immediate testing, you can use services like:
- **Mailtrap** (for testing)
- **Ethereal Email** (fake SMTP for testing)
- **MailHog** (local email testing)

## 🔧 Quick Configuration

### 1. Set Admin Role

Run this SQL in your Supabase dashboard:

```sql
-- Set your email as admin
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Or insert a new admin user
INSERT INTO user_profiles (id, email, name, role) 
VALUES (
  gen_random_uuid(), 
  'your-email@example.com', 
  'Admin User', 
  'admin'
);
```

### 2. Test the System

1. **Place a test order** in your application
2. **Check browser console** for email logs
3. **Check your email** for the notification

## 📧 EmailJS Integration Example

Replace the `sendEmailViaService` function in `src/services/email-simple.ts`:

```typescript
async sendEmailViaService(emailData: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Load EmailJS
    const emailjs = await import('@emailjs/browser');
    
    const result = await emailjs.send(
      'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
      'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
      {
        to_email: emailData.to,
        subject: emailData.subject,
        message: emailData.html,
        from_name: 'Ebby\'s Bakery',
      },
      'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
    );

    if (result.status === 200) {
      return { success: true };
    } else {
      return { success: false, error: 'Failed to send email' };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
```

### Install EmailJS

```bash
npm install @emailjs/browser
```

## 🧪 Testing Without Email Service

If you want to test the order creation without setting up email:

1. **Comment out the email sending code** in `src/EbbysBakeryFlow.tsx`:

```typescript
// Comment out this section for testing
/*
try {
  const adminEmail = await emailService.getAdminEmail();
  if (adminEmail) {
    // ... email sending code
  }
} catch (emailError) {
  console.error('Error sending email notification:', emailError);
}
*/
```

2. **Test order creation** - orders will still be saved to the database
3. **Check the admin dashboard** to see new orders

## 📊 Monitor Order Creation

### Check Database

Go to your Supabase dashboard → Table Editor → `orders` table to see new orders.

### Check Console Logs

Open browser developer tools and look for:
- "Creating order in database"
- "Order created successfully"
- "Email notification sent successfully" (if email is configured)

## 🎯 Next Steps

1. **Test order creation** without email first
2. **Set up a simple email service** (EmailJS recommended)
3. **Test email notifications**
4. **Customize email template** if needed

## 🚨 Troubleshooting

### Order Not Creating
- Check browser console for errors
- Verify database connection
- Check Supabase logs

### Email Not Sending
- Verify email service configuration
- Check API keys and credentials
- Test with a simple email first

### No Admin Email Found
- Run the SQL to set admin role
- Verify email address in user_profiles table

The system is designed to work even if email fails - orders will still be created and saved to the database. 