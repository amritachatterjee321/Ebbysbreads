# EmailJS Templates Setup

## ⚠️ CRITICAL: Use Triple Curly Braces for Order Items

**The most important thing:** You MUST use `{{{order_items}}}` (triple curly braces) in your EmailJS templates, NOT `{{order_items}}` (double curly braces).

- ❌ `{{order_items}}` - HTML will be escaped and shown as raw text
- ✅ `{{{order_items}}}` - HTML will be rendered properly

## Template 1: Admin Order Notification

**Template Name:** `Admin Order Notification`
**Template ID:** Copy this after creating the template

**Subject:** `New Order Received - {{order_number}}`

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Order - {{order_number}}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f97316; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
    .order-details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .items-list { background: #fff; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .item { padding: 8px 0; border-bottom: 1px solid #eee; }
    .item:last-child { border-bottom: none; }
    .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 15px; padding-top: 15px; border-top: 2px solid #f97316; }
    .customer-info { background: #e0f2fe; padding: 15px; border-radius: 5px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎂 New Order Received!</h1>
      <p>Order #{{order_number}} - {{order_date}}</p>
    </div>
    
    <div class="content">
      <h2>Order Details</h2>
      
      <div class="customer-info">
        <h3>👤 Customer Information</h3>
        <p><strong>Name:</strong> {{customer_name}}</p>
        <p><strong>Phone:</strong> {{customer_phone}}</p>
        <p><strong>Email:</strong> {{customer_email}}</p>
        <p><strong>Address:</strong> {{customer_address}}</p>
        <p><strong>Pincode:</strong> {{customer_pincode}}</p>
      </div>
      
      <div class="order-details">
        <h3>📋 Order Items</h3>
        <div class="items-list">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <thead>
              <tr style="background: #f97316; color: white; font-weight: bold;">
                <th style="padding: 10px 12px; text-align: left; width: 50%;">Item</th>
                <th style="padding: 10px 12px; text-align: center; width: 15%;">Qty</th>
                <th style="padding: 10px 12px; text-align: right; width: 15%;">Price</th>
                <th style="padding: 10px 12px; text-align: right; width: 20%;">Total</th>
              </tr>
            </thead>
            <tbody>
              {{{order_items}}}
            </tbody>
          </table>
        </div>
        
        <div class="total">
          <h3>💰 Total Amount: {{total_amount}}</h3>
        </div>
      </div>
      
      <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3>⚠️ Action Required</h3>
        <p>Please review this order and take necessary action:</p>
        <ul>
          <li>Confirm order details</li>
          <li>Check ingredient availability</li>
          <li>Update order status</li>
          <li>Prepare for delivery</li>
        </ul>
      </div>
      
      <p style="text-align: center; color: #666; margin-top: 30px;">
        This is an automated notification from Ebby's Bakery Order System
      </p>
    </div>
  </div>
</body>
</html>
```

## Template 2: Customer Order Confirmation

**Template Name:** `Customer Order Confirmation`
**Template ID:** Copy this after creating the template

**Subject:** `Order Confirmed - {{order_number}} | Ebby's Bakery`

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmed - {{order_number}}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
    .order-details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .items-list { background: #fff; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .item { padding: 8px 0; border-bottom: 1px solid #eee; }
    .item:last-child { border-bottom: none; }
    .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 15px; padding-top: 15px; border-top: 2px solid #10b981; }
    .delivery-info { background: #d1fae5; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .support-info { background: #fef3c7; padding: 15px; border-radius: 5px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Order Confirmed!</h1>
      <p>Thank you for your order, {{customer_name}}!</p>
    </div>
    
    <div class="content">
      <h2>Order #{{order_number}}</h2>
      <p>Your order has been successfully placed on {{order_date}}.</p>
      
      <div class="delivery-info">
        <h3>🚚 Delivery Information</h3>
        <p><strong>Delivery Address:</strong> {{customer_address}}</p>
        <p><strong>Pincode:</strong> {{customer_pincode}}</p>
        <p><strong>Delivery Date:</strong> Wednesday onwards</p>
        <p><strong>Payment:</strong> Cash on Delivery</p>
      </div>
      
      <div class="order-details">
        <h3>📋 Your Order</h3>
        <div class="items-list">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <thead>
              <tr style="background: #10b981; color: white; font-weight: bold;">
                <th style="padding: 10px 12px; text-align: left; width: 50%;">Item</th>
                <th style="padding: 10px 12px; text-align: center; width: 15%;">Qty</th>
                <th style="padding: 10px 12px; text-align: right; width: 15%;">Price</th>
                <th style="padding: 10px 12px; text-align: right; width: 20%;">Total</th>
              </tr>
            </thead>
            <tbody>
              {{{order_items}}}
            </tbody>
          </table>
        </div>
        
        <div class="total">
          <h3>💰 Total Amount: {{total_amount}}</h3>
        </div>
      </div>
      
      <div class="support-info">
        <h3>📞 Need Help?</h3>
        <p>If you have any questions about your order, please contact us:</p>
        <ul>
          <li><strong>Phone:</strong> +91 98765 43210</li>
          <li><strong>Email:</strong> hello@ebbysbakery.com</li>
          <li><strong>WhatsApp:</strong> +91 98765 43210</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #666;">Thank you for choosing Ebby's Bakery!</p>
        <p style="color: #666;">We're excited to bake fresh, delicious treats for you! 🎂</p>
      </div>
    </div>
  </div>
</body>
</html>
```

## 🔧 **Step-by-Step Fix Instructions:**

### **1. Go to EmailJS Dashboard**
- Visit https://dashboard.emailjs.com/
- Go to "Email Templates" tab

### **2. Edit Your Templates**
- Find your existing templates
- **CRITICAL:** Replace `{{order_items}}` with `{{{order_items}}}` (add one more curly brace)
- Save and publish the templates

### **3. Alternative: Create New Templates**
If editing doesn't work, create new templates with the HTML above.

## **Dynamic Variables Reference**

| Variable | Description | Example |
|----------|-------------|---------|
| `{{order_number}}` | Order number (e.g., EB123456) | `EB123456` |
| `{{order_date}}` | Order date in DD/MM/YYYY format | `31/07/2025` |
| `{{customer_name}}` | Customer's full name | `John Doe` |
| `{{customer_phone}}` | Customer's phone number | `9876543210` |
| `{{customer_email}}` | Customer's email address | `john@example.com` |
| `{{customer_address}}` | Customer's delivery address | `123 Main Street, City` |
| `{{customer_pincode}}` | Customer's pincode | `110001` |
| `{{{order_items}}}` | **CRITICAL: Use triple braces** - Formatted order items | `<div style="...">Blueberry Muffin - 1 x ₹60 = ₹60</div>` |
| `{{total_amount}}` | Total order amount with ₹ symbol | `₹280` |

## **Why Triple Curly Braces Matter:**

- **`{{variable}}`** - EmailJS escapes HTML (shows raw code)
- **`{{{variable}}}`** - EmailJS renders HTML (shows formatted content)

## **Testing**

After updating your templates:
1. Go to `http://localhost:5173/`
2. Add multiple items to cart
3. Place a real order
4. Check your email inbox for properly formatted order items

## **Expected Result**

Your order items should now display as:
```
┌─────────────────────┬─────┬─────────┬─────────┐
│ Item                │ Qty │ Price   │ Total   │
├─────────────────────┼─────┼─────────┼─────────┤
│ Blueberry Muffin    │  1  │   ₹60   │   ₹60   │
│ Whole Wheat Bread   │  1  │  ₹100   │  ₹100   │
└─────────────────────┴─────┴─────────┴─────────┘
```

**NOT as raw HTML code!** 