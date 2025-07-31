# EmailJS Templates Setup

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
    .items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    .items-table th { background: #f97316; color: white; padding: 10px; text-align: left; }
    .items-table td { padding: 8px; border-bottom: 1px solid #eee; }
    .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 15px; }
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
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {{order_items}}
          </tbody>
        </table>
        
        <div class="total">
          <h3>💰 Total Amount: ₹{{total_amount}}</h3>
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
    .items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    .items-table th { background: #10b981; color: white; padding: 10px; text-align: left; }
    .items-table td { padding: 8px; border-bottom: 1px solid #eee; }
    .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 15px; }
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
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {{order_items}}
          </tbody>
        </table>
        
        <div class="total">
          <h3>💰 Total Amount: ₹{{total_amount}}</h3>
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

## How to Create Templates in EmailJS

1. **Go to EmailJS Dashboard**
   - Visit https://dashboard.emailjs.com/
   - Go to "Email Templates" tab

2. **Create Admin Template**
   - Click "Create New Template"
   - Name: `Admin Order Notification`
   - Subject: `New Order Received - {{order_number}}`
   - Copy the HTML from Template 1 above
   - Save and publish

3. **Create Customer Template**
   - Click "Create New Template"
   - Name: `Customer Order Confirmation`
   - Subject: `Order Confirmed - {{order_number}} | Ebby's Bakery`
   - Copy the HTML from Template 2 above
   - Save and publish

4. **Copy Template IDs**
   - After creating each template, copy the Template ID
   - You'll need these for the configuration 