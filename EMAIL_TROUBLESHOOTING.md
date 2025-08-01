# Email Flow Troubleshooting Guide

## 🔍 **Why Emails Aren't Working in Production**

Based on the analysis, here are the main issues and solutions:

## 🚨 **Critical Issues Found:**

### **1. EmailJS Configuration Not Updated**
**Problem**: The configuration still has placeholder values instead of actual EmailJS credentials.

**Solution**: Update `src/config/emailjs.ts` with your actual credentials:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_actual_service_id',           // Replace this
  PUBLIC_KEY: 'your_actual_public_key',           // Replace this
  TEMPLATES: {
    ADMIN_NOTIFICATION: 'your_admin_template_id',  // Replace this
    CUSTOMER_CONFIRMATION: 'your_customer_template_id' // Replace this
  }
};
```

### **2. Admin User Missing**
**Problem**: No admin user in the `user_profiles` table to receive notifications.

**Solution**: Create an admin user using the setup script:

```bash
node setup-admin-user.js your-email@example.com
```

### **3. EmailJS Templates Not Updated**
**Problem**: Templates might not be using the correct format.

**Solution**: Update your EmailJS templates with the new table format from `EMAILJS_TEMPLATES.md`.

## 🔧 **Step-by-Step Fix:**

### **Step 1: Update EmailJS Configuration**
1. Go to EmailJS Dashboard: https://dashboard.emailjs.com/
2. Get your credentials:
   - Service ID from "Email Services"
   - Public Key from "Account > API Keys"
   - Template IDs from "Email Templates"
3. Update `src/config/emailjs.ts` with actual values

### **Step 2: Create Admin User**
```bash
node setup-admin-user.js your-admin-email@example.com
```

### **Step 3: Update EmailJS Templates**
1. Go to EmailJS Templates
2. Update both templates with HTML from `EMAILJS_TEMPLATES.md`
3. Use `{{{order_items}}}` (triple curly braces)
4. Save and publish templates

### **Step 4: Test the Flow**
1. Place a test order
2. Check browser console for errors
3. Verify emails are received

## 🐛 **Common Error Messages:**

### **"EmailJS not configured"**
- Update `src/config/emailjs.ts` with actual credentials

### **"No admin email found"**
- Run `node setup-admin-user.js your-email@example.com`

### **"Failed to send email"**
- Check EmailJS dashboard for errors
- Verify template IDs are correct
- Check email service configuration

### **"Order items show as raw HTML"**
- Use `{{{order_items}}}` (triple braces) in templates
- Update templates with table format

## 🔍 **Debugging Steps:**

### **1. Check Browser Console**
Open browser console when placing an order and look for:
- EmailJS configuration errors
- Network request failures
- JavaScript errors

### **2. Check EmailJS Dashboard**
- Go to EmailJS dashboard
- Check for failed email attempts
- Verify service and template status

### **3. Check Database**
- Verify admin user exists in `user_profiles` table
- Check for any database connection issues

### **4. Check Environment Variables**
- Ensure Supabase credentials are correct
- Verify production environment is set

## 📋 **Verification Checklist:**

- [ ] EmailJS credentials updated in `src/config/emailjs.ts`
- [ ] Admin user created in database
- [ ] EmailJS templates updated with table format
- [ ] Templates use `{{{order_items}}}` (triple braces)
- [ ] Templates are published in EmailJS
- [ ] Email service is properly configured
- [ ] Test order placed successfully
- [ ] Both admin and customer emails received
- [ ] Order items display in proper table format

## 🚀 **Quick Test:**

1. **Update configuration** with actual EmailJS credentials
2. **Create admin user**: `node setup-admin-user.js your-email@example.com`
3. **Place a test order** with multiple items
4. **Check both email inboxes** for properly formatted emails

## 💡 **If Still Not Working:**

1. **Check EmailJS dashboard** for specific error messages
2. **Verify all credentials** are correct and active
3. **Test with browser console open** to see detailed errors
4. **Check spam folder** for test emails
5. **Verify email service** (Gmail, Outlook, etc.) is working

## 🎯 **Expected Result:**

After fixing all issues, you should receive:
- **Admin email**: New order notification with customer details and order items in table format
- **Customer email**: Order confirmation with delivery details and order items in table format

Both emails should have properly aligned columns and no raw HTML code displayed. 