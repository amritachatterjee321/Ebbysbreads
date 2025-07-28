import { supabase } from '../lib/supabase';

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

export const emailService = {
  // Send email notification for new order
  async sendNewOrderNotification(orderData: OrderEmailData, adminEmail: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Sending new order notification to:', adminEmail);
      
      const emailContent = this.generateNewOrderEmail(orderData);
      
      // For now, just log the email content since Edge Function isn't set up
      console.log('Email would be sent with content:', {
        to: adminEmail,
        subject: `New Order Received - ${orderData.orderNumber}`,
        html: emailContent.html.substring(0, 200) + '...', // Log first 200 chars
        text: emailContent.text.substring(0, 200) + '...'
      });

      // TODO: Set up actual email service (Resend, SendGrid, etc.)
      // For now, return success to test the flow
      console.log('Email notification logged successfully (not actually sent)');
      return { success: true, error: 'Email service not configured - check console for email content' };
    } catch (error) {
      console.error('Error in sendNewOrderNotification:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Generate HTML email content for new order
  generateNewOrderEmail(orderData: OrderEmailData): { html: string; text: string } {
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
- Address: ${orderData.customerAddress}
- Pincode: ${orderData.customerPincode}

Order Items:
${orderData.items.map(item => `- ${item.name} x${item.quantity} = ₹${item.price * item.quantity}`).join('\n')}

Total Amount: ₹${orderData.total}

Action Required: Please review this order and update its status in the admin dashboard.
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