# Production EmailJS Setup Guide

## 🚀 **Quick Setup for Production**

### **Step 1: Get Your EmailJS Production Credentials**

1. **Go to EmailJS Dashboard**
   - Visit: https://dashboard.emailjs.com/
   - Sign in to your account

2. **Get Service ID**
   - Go to "Email Services" tab
   - Find your email service (Gmail, Outlook, etc.)
   - Copy the Service ID (format: `service_abc123`)

3. **Get Public Key**
   - Go to "Account" tab
   - Click "API Keys"
   - Copy your Public Key (format: `user_xyz789`)

4. **Get Template IDs**
   - Go to "Email Templates" tab
   - For each template, copy the Template ID (format: `template_abc123`)

### **Step 2: Update Configuration File**

Edit `src/config/emailjs.ts` and replace the placeholder values:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'YOUR_ACTUAL_SERVICE_ID',           // Replace this
  PUBLIC_KEY: 'YOUR_ACTUAL_PUBLIC_KEY',           // Replace this
  TEMPLATES: {
    ADMIN_NOTIFICATION: 'YOUR_ADMIN_TEMPLATE_ID',  // Replace this
    CUSTOMER_CONFIRMATION: 'YOUR_CUSTOMER_TEMPLATE_ID' // Replace this
  }
};
```

### **Step 3: Update EmailJS Templates**

Make sure your EmailJS templates are updated with the new table format:

1. **Go to Email Templates**
2. **Edit both templates** (Admin and Customer)
3. **Use the HTML from `EMAILJS_TEMPLATES.md`**
4. **CRITICAL:** Use `{{{order_items}}}` (triple curly braces)

### **Step 4: Test the Setup**

1. **Commit and push changes**
2. **Test with a real order**
3. **Check both admin and customer emails**

## 📋 **Example Configuration**

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_abc123def',
  PUBLIC_KEY: 'user_xyz789abc',
  TEMPLATES: {
    ADMIN_NOTIFICATION: 'template_admin456',
    CUSTOMER_CONFIRMATION: 'template_customer789'
  }
};
```

## ✅ **Verification Checklist**

- [ ] Service ID copied from Email Services
- [ ] Public Key copied from API Keys
- [ ] Admin Template ID copied from Email Templates
- [ ] Customer Template ID copied from Email Templates
- [ ] Templates updated with table format
- [ ] `{{{order_items}}}` used in templates
- [ ] Configuration file updated
- [ ] Test order placed
- [ ] Both emails received with proper formatting

## 🔧 **Troubleshooting**

### **If emails aren't sending:**
1. Check Service ID is correct
2. Verify Public Key is valid
3. Ensure Template IDs match exactly
4. Check EmailJS dashboard for errors

### **If order items show as raw HTML:**
1. Make sure you're using `{{{order_items}}}` (triple braces)
2. Update templates with new table format
3. Save and publish templates

### **If columns aren't aligned:**
1. Use the exact HTML from `EMAILJS_TEMPLATES.md`
2. Ensure table structure is complete
3. Test with multiple items

## 🎯 **Production Ready**

Once you've updated the configuration:
1. **Commit changes** to your repository
2. **Deploy to production**
3. **Test the complete email flow**
4. **Monitor for any issues**

Your bakery will now have professional email notifications in production! 🎂📧 