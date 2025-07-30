// Environment configuration utility
export interface EnvironmentConfig {
  env: string;
  appName: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  emailService: string;
  enableEmailNotifications: boolean;
  enableAnalytics: boolean;
  enableDebugMode: boolean;
  enableMockData: boolean;
  testMode: boolean;
  mockOrders: boolean;
  mockProducts: boolean;
}

export const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = import.meta.env.VITE_ENV || 'development';
  
  // Debug logging
  console.log('Environment Config Debug:', {
    VITE_ENV: import.meta.env.VITE_ENV,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    env,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    MODE: import.meta.env.MODE
  });
  
  return {
    env,
    appName: import.meta.env.VITE_APP_NAME || 'Ebby\'s Bakery',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    emailService: import.meta.env.VITE_EMAIL_SERVICE || 'log',
    enableEmailNotifications: import.meta.env.VITE_ENABLE_EMAIL_NOTIFICATIONS === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
    enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
    testMode: import.meta.env.VITE_TEST_MODE === 'true',
    mockOrders: import.meta.env.VITE_MOCK_ORDERS === 'true',
    mockProducts: import.meta.env.VITE_MOCK_PRODUCTS === 'true',
  };
};

export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

export const isStaging = (): boolean => {
  return import.meta.env.VITE_ENV === 'staging';
};

export const isTest = (): boolean => {
  return import.meta.env.VITE_ENV === 'test';
};

export const getEnvironmentName = (): string => {
  if (isTest()) return 'Test';
  if (isStaging()) return 'Staging';
  if (isProduction()) return 'Production';
  return 'Development';
};

// Environment-specific logging
export const log = (message: string, data?: any) => {
  const config = getEnvironmentConfig();
  
  if (config.enableDebugMode || isDevelopment()) {
    console.log(`[${getEnvironmentName()}] ${message}`, data || '');
  }
};

export const logError = (message: string, error?: any) => {
  const config = getEnvironmentConfig();
  
  if (config.enableDebugMode || isDevelopment()) {
    console.error(`[${getEnvironmentName()}] ERROR: ${message}`, error || '');
  }
};

// Environment-specific feature flags
export const shouldEnableEmailNotifications = (): boolean => {
  const config = getEnvironmentConfig();
  return config.enableEmailNotifications;
};

export const shouldUseMockData = (): boolean => {
  const config = getEnvironmentConfig();
  return config.enableMockData || config.testMode;
};

export const shouldEnableAnalytics = (): boolean => {
  const config = getEnvironmentConfig();
  return config.enableAnalytics && isProduction();
}; 