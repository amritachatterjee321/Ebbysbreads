// EmailJS Configuration for Production
// Update these values with your actual EmailJS production credentials

export const EMAILJS_CONFIG = {
  // Your EmailJS Service ID (from Email Services tab)
  // Example: 'service_abc123'
  SERVICE_ID: 'service_des65sk',
  
  // Your EmailJS Public Key (from Account > API Keys)
  // Example: 'user_xyz789'
  PUBLIC_KEY: 'CHOpZWvCB0w7AqTnN',
  
  // Template IDs (from Email Templates tab)
  TEMPLATES: {
    // Admin notification template ID
    // Example: 'template_admin123'
    ADMIN_NOTIFICATION: 'template_npy1hav',
    
    // Customer confirmation template ID
    // Example: 'template_customer456'
    CUSTOMER_CONFIRMATION: 'template_1pyvh5w'
  }
};

// Helper function to check if EmailJS is configured
export const isEmailJSConfigured = (): boolean => {
  return EMAILJS_CONFIG.SERVICE_ID !== 'service_des65sk' && 
         EMAILJS_CONFIG.PUBLIC_KEY !== 'CHOpZWvCB0w7AqTnN' &&
         EMAILJS_CONFIG.TEMPLATES.ADMIN_NOTIFICATION !== 'template_npy1hav' &&
         EMAILJS_CONFIG.TEMPLATES.CUSTOMER_CONFIRMATION !== 'template_1pyvh5w';
};

// Helper function to get template ID based on email type
export const getTemplateId = (isAdminEmail: boolean): string => {
  return isAdminEmail 
    ? EMAILJS_CONFIG.TEMPLATES.ADMIN_NOTIFICATION 
    : EMAILJS_CONFIG.TEMPLATES.CUSTOMER_CONFIRMATION;
};

// Production Configuration Instructions:
// 1. Replace 'YOUR_PRODUCTION_SERVICE_ID' with your actual Service ID
// 2. Replace 'YOUR_PRODUCTION_PUBLIC_KEY' with your actual Public Key
// 3. Replace 'YOUR_PRODUCTION_ADMIN_TEMPLATE_ID' with your Admin template ID
// 4. Replace 'YOUR_PRODUCTION_CUSTOMER_TEMPLATE_ID' with your Customer template ID
// 5. Make sure your EmailJS templates are updated with the new table format
// 6. Test the email flow after updating 