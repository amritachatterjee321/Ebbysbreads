# Customer Email Troubleshooting Guide

## 🔍 **Why Customer Order Confirmation Emails Aren't Working**

### **🚨 Most Common Issues:**

#### **1. EmailJS Configuration Not Updated**
**Problem**: Configuration still has old/placeholder values.

**Check**: Open browser console when placing an order and look for:
- "EmailJS not configured" message
- "Failed to send customer confirmation email" error

**Solution**: Update `src/config/emailjs.ts` with your actual EmailJS credentials.

#### **2. Customer Email Field Empty**
**Problem**: Customer didn't provide an email address.

**Check**: In the order form, ensure the customer enters a valid email address.

**Solution**: The system skips customer emails if no email is provided.

#### **3. EmailJS Template Issues**
**Problem**: Customer template not properly configured.

**Check**: 
- Template ID matches configuration
- Template is published in EmailJS
- Template uses correct variable names

#### **4. Email Service Issues**
**Problem**: EmailJS service not working properly.

**Check**: EmailJS dashboard for failed attempts or errors.

## 🔧 **Step-by-Step Fix:**

### **Step 1: Verify EmailJS Configuration**
Check your `src/config/emailjs.ts`:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_actual_service_id',           // Should start with 'service_'
  PUBLIC_KEY: 'your_actual_public_key',           // Should start with 'user_'
  TEMPLATES: {
    ADMIN_NOTIFICATION: 'your_admin_template_id',  // Should start with 'template_'
    CUSTOMER_CONFIRMATION: 'your_customer_template_id' // Should start with 'template_'
  }
};
```

### **Step 2: Check Customer Email Input**
1. **Place a test order**
2. **Enter a valid email address** in the customer form
3. **Ensure email field is not empty**

### **Step 3: Verify EmailJS Templates**
1. **Go to EmailJS Dashboard**
2. **Check Customer Template**:
   - Template ID matches configuration
   - Template is published
   - Template uses `{{{order_items}}}` (triple braces)
   - Template has all required variables

### **Step 4: Test with Browser Console**
1. **Open browser console** (F12)
2. **Place a test order**
3. **Look for these messages**:
   - "Sending order confirmation to customer: [email]"
   - "Customer confirmation email sent successfully"
   - Any error messages

## 🐛 **Common Error Messages:**

### **"No customer email provided"**
- Customer didn't enter an email address
- Email field is empty or invalid

### **"Failed to send customer confirmation email"**
- EmailJS configuration issue
- Template ID mismatch
- Email service problem

### **"EmailJS not configured"**
- Update `src/config/emailjs.ts` with actual credentials

### **"Template not found"**
- Check template ID in EmailJS dashboard
- Ensure template is published

## 🔍 **Debugging Steps:**

### **1. Browser Console Check**
```javascript
// Look for these console messages:
"Sending order confirmation to customer: customer@example.com"
"Customer confirmation email sent successfully"
"Failed to send customer confirmation email: [error]"
```

### **2. EmailJS Dashboard Check**
1. Go to EmailJS Dashboard
2. Check "Email Logs" or "Activity"
3. Look for failed customer email attempts
4. Check for specific error messages

### **3. Template Variable Check**
Ensure your customer template has these variables:
- `{{order_number}}`
- `{{customer_name}}`
- `{{customer_email}}`
- `{{customer_address}}`
- `{{customer_pincode}}`
- `{{{order_items}}}` (triple braces)
- `{{total_amount}}`
- `{{order_date}}`

### **4. Email Service Check**
1. Verify your email service (Gmail, Outlook, etc.) is working
2. Check if emails are going to spam folder
3. Test email service directly in EmailJS dashboard

## 📋 **Verification Checklist:**

- [ ] Customer enters valid email address in order form
- [ ] EmailJS configuration has actual credentials (not placeholders)
- [ ] Customer template ID matches configuration
- [ ] Customer template is published in EmailJS
- [ ] Customer template uses `{{{order_items}}}` (triple braces)
- [ ] Customer template has all required variables
- [ ] Email service is properly configured
- [ ] No errors in browser console
- [ ] No failed attempts in EmailJS dashboard
- [ ] Check spam folder for test emails

## 🚀 **Quick Test:**

1. **Update EmailJS configuration** with actual credentials
2. **Place test order** with valid customer email
3. **Check browser console** for success/error messages
4. **Check both inbox and spam folder**
5. **Verify EmailJS dashboard** for email attempts

## 💡 **If Still Not Working:**

1. **Check EmailJS dashboard** for specific error messages
2. **Test email service** directly in EmailJS
3. **Verify all template variables** are correctly named
4. **Check if emails are being blocked** by email provider
5. **Try different email address** for testing

## 🎯 **Expected Result:**

After fixing all issues, customer should receive:
- **Subject**: "Order Confirmed - [Order Number] | Ebby's Bakery"
- **Content**: Order details, delivery information, and order items in table format
- **From**: Your configured email service 