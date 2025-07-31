// EmailJS Configuration
// Replace these values with your actual EmailJS credentials

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
  return EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' && 
         EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
         EMAILJS_CONFIG.TEMPLATES.ADMIN_NOTIFICATION !== 'YOUR_ADMIN_TEMPLATE_ID' &&
         EMAILJS_CONFIG.TEMPLATES.CUSTOMER_CONFIRMATION !== 'YOUR_CUSTOMER_TEMPLATE_ID';
};

// Helper function to get template ID based on email type
export const getTemplateId = (isAdminEmail: boolean): string => {
  return isAdminEmail 
    ? EMAILJS_CONFIG.TEMPLATES.ADMIN_NOTIFICATION 
    : EMAILJS_CONFIG.TEMPLATES.CUSTOMER_CONFIRMATION;
}; 