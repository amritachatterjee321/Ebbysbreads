// EmailJS Configuration
// Replace these values with your actual EmailJS credentials

export const EMAILJS_CONFIG = {
  // Your EmailJS Service ID (from Email Services tab)
  SERVICE_ID: 'YOUR_SERVICE_ID',
  
  // Your EmailJS Public Key (from Account > API Keys)
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY',
  
  // Template IDs (from Email Templates tab)
  TEMPLATES: {
    ADMIN_NOTIFICATION: 'YOUR_ADMIN_TEMPLATE_ID',
    CUSTOMER_CONFIRMATION: 'YOUR_CUSTOMER_TEMPLATE_ID'
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