import { supabase } from '../lib/supabase';
import { EMAILJS_CONFIG, isEmailJSConfigured, getTemplateId } from '../config/emailjs';

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  customerPincode: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  orderDate: string;
}

// Track email sending to prevent duplicates
let emailSendingInProgress = false;

export const simpleEmailService = {
  // Send email notification for new order to admin
  async sendNewOrderNotification(orderData: OrderEmailData, adminEmail: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Sending new order notification to admin:', adminEmail);
      
      const emailContent = this.generateAdminOrderEmail(orderData);
      
      // Try to send via EmailJS if configured
      const emailResult = await this.sendEmailViaService({
        to: adminEmail,
        subject: `New Order Received - ${orderData.orderNumber}`,
        html: emailContent.html,
        text: emailContent.text,
        orderData: orderData
      });

      if (emailResult.success) {
        console.log('Admin email notification sent successfully');
        return { success: true };
      } else {
        console.log('Admin email service failed, logging email content:', {
          to: adminEmail,
          subject: `New Order Received - ${orderData.orderNumber}`,
          html: emailContent.html.substring(0, 200) + '...',
          text: emailContent.text.substring(0, 200) + '...'
        });
        return { success: false, error: emailResult.error };
      }
    } catch (error) {
      console.error('Error in sendNewOrderNotification:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Send order confirmation email to customer
  async sendOrderConfirmation(orderData: OrderEmailData): Promise<{ success: boolean; error?: string }> {
    try {
      if (!orderData.customerEmail) {
        console.log('No customer email provided, skipping confirmation email');
        return { success: true, error: 'No customer email provided' };
      }

      console.log('Sending order confirmation to customer:', orderData.customerEmail);
      
      const emailContent = this.generateCustomerOrderEmail(orderData);
      
      // Try to send via EmailJS if configured
      const emailResult = await this.sendEmailViaService({
        to: orderData.customerEmail,
        subject: `Order Confirmed - ${orderData.orderNumber} | Ebby's Bakery`,
        html: emailContent.html,
        text: emailContent.text,
        orderData: orderData
      });

      if (emailResult.success) {
        console.log('Customer confirmation email sent successfully');
        return { success: true };
      } else {
        console.log('Customer email service failed, logging email content:', {
          to: orderData.customerEmail,
          subject: `Order Confirmed - ${orderData.orderNumber} | Ebby's Bakery`,
          html: emailContent.html.substring(0, 200) + '...',
          text: emailContent.text.substring(0, 200) + '...'
        });
        return { success: false, error: emailResult.error };
      }
    } catch (error) {
      console.error('Error in sendOrderConfirmation:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Send both admin notification and customer confirmation
  async sendOrderEmails(orderData: OrderEmailData, adminEmail: string): Promise<{ 
    adminEmail: { success: boolean; error?: string }; 
    customerEmail: { success: boolean; error?: string } 
  }> {
    // Prevent duplicate email sending
    if (emailSendingInProgress) {
      console.log('🛑 Email sending already in progress, ignoring duplicate request');
      return {
        adminEmail: { success: false, error: 'Duplicate email request ignored' },
        customerEmail: { success: false, error: 'Duplicate email request ignored' }
      };
    }

    emailSendingInProgress = true;
    
    try {
      const [adminResult, customerResult] = await Promise.allSettled([
        this.sendNewOrderNotification(orderData, adminEmail),
        this.sendOrderConfirmation(orderData)
      ]);

      return {
        adminEmail: adminResult.status === 'fulfilled' ? adminResult.value : { success: false, error: 'Promise rejected' },
        customerEmail: customerResult.status === 'fulfilled' ? customerResult.value : { success: false, error: 'Promise rejected' }
      };
    } finally {
      emailSendingInProgress = false;
    }
  },

  // Send email via EmailJS service
  async sendEmailViaService(emailData: {
    to: string;
    subject: string;
    html: string;
    text: string;
    orderData?: OrderEmailData;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if EmailJS is configured
      if (!isEmailJSConfigured()) {
        console.log('EmailJS not configured - logging email content instead:', {
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html.substring(0, 200) + '...',
          text: emailData.text.substring(0, 200) + '...'
        });
        return { success: true, error: 'EmailJS not configured - check console for email content' };
      }

      // Import EmailJS
      const emailjs = await import('@emailjs/browser');
      
      // Determine which template to use based on email content
      const isAdminEmail = emailData.subject.includes('New Order Received');
      const templateId = getTemplateId(isAdminEmail);
      
      // Prepare template parameters
      const templateParams = {
        to_email: emailData.to,
        subject: emailData.subject,
        message: emailData.html,
        from_name: 'Ebby\'s Bakery',
        // Use actual order data if available
        order_number: emailData.orderData?.orderNumber || emailData.subject.match(/Order #([A-Z0-9]+)/)?.[1] || 'N/A',
        order_date: emailData.orderData?.orderDate || new Date().toLocaleDateString('en-IN'),
        customer_name: emailData.orderData?.customerName || 'Customer',
        customer_phone: emailData.orderData?.customerPhone || 'N/A',
        customer_email: emailData.orderData?.customerEmail || emailData.to,
        customer_address: emailData.orderData?.customerAddress || 'N/A',
        customer_pincode: emailData.orderData?.customerPincode || 'N/A',
        order_items: emailData.orderData ? emailData.orderData.items.map(item => 
          `<div style="padding: 8px 0; border-bottom: 1px solid #eee;">
            <span style="display: inline-block; width: 50%;">${item.name}</span>
            <span style="display: inline-block; width: 15%; text-align: center;">${item.quantity}</span>
            <span style="display: inline-block; width: 15%; text-align: right;">₹${item.price}</span>
            <span style="display: inline-block; width: 20%; text-align: right;">₹${item.price * item.quantity}</span>
          </div>`
        ).join('') : 'Order items will be populated from template',
        total_amount: emailData.orderData ? `₹${emailData.orderData.total}` : 'N/A'
      };

      console.log('Sending email via EmailJS:', {
        serviceId: EMAILJS_CONFIG.SERVICE_ID,
        templateId: templateId,
        to: emailData.to,
        subject: emailData.subject,
        orderNumber: emailData.orderData?.orderNumber || 'N/A'
      });

      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        templateId,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      if (result.status === 200) {
        console.log('Email sent successfully via EmailJS');
        return { success: true };
      } else {
        console.error('EmailJS returned non-200 status:', result.status);
        return { success: false, error: 'Failed to send email' };
      }
    } catch (error) {
      console.error('Error sending email via EmailJS:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Generate HTML email content for admin notification
  generateAdminOrderEmail(orderData: OrderEmailData): { html: string; text: string } {
    const itemsList = orderData.items.map(item => 
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>`
    ).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Order - ${orderData.orderNumber}</title>
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
            <h1>🍞 New Order Received!</h1>
            <p>Order #${orderData.orderNumber}</p>
          </div>
          <div class="content">
            <h2>Order Details</h2>
            <div class="order-details">
              <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
              <p><strong>Order Date:</strong> ${orderData.orderDate}</p>
              <p><strong>Status:</strong> Pending</p>
            </div>

            <h3>Customer Information</h3>
            <div class="customer-info">
              <p><strong>Name:</strong> ${orderData.customerName}</p>
              <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
              ${orderData.customerEmail ? `<p><strong>Email:</strong> ${orderData.customerEmail}</p>` : ''}
              <p><strong>Address:</strong> ${orderData.customerAddress}</p>
              <p><strong>Pincode:</strong> ${orderData.customerPincode}</p>
            </div>

            <h3>Order Items</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>

            <div class="total">
              <strong>Total Amount: ₹${orderData.total}</strong>
            </div>

            <p style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 5px;">
              <strong>Action Required:</strong> Please review this order and update its status in the admin dashboard.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
New Order Received - ${orderData.orderNumber}

Order Details:
- Order Number: ${orderData.orderNumber}
- Order Date: ${orderData.orderDate}
- Status: Pending

Customer Information:
- Name: ${orderData.customerName}
- Phone: ${orderData.customerPhone}
${orderData.customerEmail ? `- Email: ${orderData.customerEmail}` : ''}
- Address: ${orderData.customerAddress}
- Pincode: ${orderData.customerPincode}

Order Items:
${orderData.items.map(item => `- ${item.name} x${item.quantity} = ₹${item.price * item.quantity}`).join('\n')}

Total Amount: ₹${orderData.total}

Action Required: Please review this order and update its status in the admin dashboard.
    `;

    return { html, text };
  },

  // Generate HTML email content for customer confirmation
  generateCustomerOrderEmail(orderData: OrderEmailData): { html: string; text: string } {
    const itemsList = orderData.items.map(item => 
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>`
    ).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmed - ${orderData.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
          .order-details { background: #f0fdf4; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #10b981; }
          .items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .items-table th { background: #10b981; color: white; padding: 10px; text-align: left; }
          .items-table td { padding: 8px; border-bottom: 1px solid #eee; }
          .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 15px; }
          .delivery-info { background: #eff6ff; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .contact-info { background: #fef3c7; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍞 Order Confirmed!</h1>
            <p>Thank you for your order, ${orderData.customerName}!</p>
          </div>
          <div class="content">
            <h2>Order Details</h2>
            <div class="order-details">
              <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
              <p><strong>Order Date:</strong> ${orderData.orderDate}</p>
              <p><strong>Status:</strong> Confirmed</p>
              <p><strong>Payment Method:</strong> Cash on Delivery</p>
            </div>

            <h3>Delivery Information</h3>
            <div class="delivery-info">
              <p><strong>Delivery Address:</strong></p>
              <p>${orderData.customerAddress}</p>
              <p><strong>Pincode:</strong> ${orderData.customerPincode}</p>
              <p><strong>Expected Delivery:</strong> Wednesday - Friday</p>
            </div>

            <h3>Order Items</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>

            <div class="total">
              <strong>Total Amount: ₹${orderData.total}</strong>
            </div>

            <div class="contact-info">
              <h3>Need Help?</h3>
              <p><strong>Phone Support:</strong> +91 98765 43210</p>
              <p><strong>Support Hours:</strong> Monday - Saturday: 9:00 AM - 7:00 PM</p>
              <p><strong>Follow Us:</strong> @ebbysbreads</p>
            </div>

            <p style="margin-top: 20px; text-align: center; color: #666;">
              Thank you for choosing Ebby's Bakery! 🍰
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Order Confirmed - ${orderData.orderNumber}

Dear ${orderData.customerName},

Thank you for your order! We're excited to bake fresh goodies for you.

Order Details:
- Order Number: ${orderData.orderNumber}
- Order Date: ${orderData.orderDate}
- Status: Confirmed
- Payment Method: Cash on Delivery

Delivery Information:
- Address: ${orderData.customerAddress}
- Pincode: ${orderData.customerPincode}
- Expected Delivery: Wednesday - Friday

Order Items:
${orderData.items.map(item => `- ${item.name} x${item.quantity} = ₹${item.price * item.quantity}`).join('\n')}

Total Amount: ₹${orderData.total}

Need Help?
- Phone Support: +91 98765 43210
- Support Hours: Monday - Saturday: 9:00 AM - 7:00 PM
- Follow Us: @ebbysbreads

Thank you for choosing Ebby's Bakery!
    `;

    return { html, text };
  },

  // Get admin email from user profiles
  async getAdminEmail(): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('role', 'admin')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching admin email:', error);
        return null;
      }

      return data?.email || null;
    } catch (error) {
      console.error('Error in getAdminEmail:', error);
      return null;
    }
  }
}; 