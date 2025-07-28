import { supabase } from '../lib/supabase';

export interface PincodeValidationResult {
  isValid: boolean;
  message: string;
  isServiceable: boolean;
}

export const pincodeService = {
  /**
   * Validates a pincode format and checks if it's serviceable
   */
  async validatePincode(pincode: string): Promise<PincodeValidationResult> {
    // Basic pincode format validation (6 digits for Indian pincodes)
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    
    if (!pincodeRegex.test(pincode)) {
      return {
        isValid: false,
        message: 'Please enter a valid 6-digit pincode',
        isServiceable: false
      };
    }

    try {
      // Get homepage settings to check serviceable pincodes
      const { data: settings, error } = await supabase
        .from('homepage_settings')
        .select('serviceable_pincodes')
        .limit(1)
        .order('created_at', { ascending: false })
        .single();

      if (error) {
        console.error('Error fetching homepage settings:', error);
        return {
          isValid: true,
          message: 'Pincode format is valid',
          isServiceable: false
        };
      }

      if (!settings?.serviceable_pincodes) {
        return {
          isValid: true,
          message: 'Pincode format is valid, but service area not configured',
          isServiceable: false
        };
      }

      // Parse serviceable pincodes (comma-separated or newline-separated)
      const serviceablePincodes = settings.serviceable_pincodes
        .split(/[,\n]/)
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0);

      const isServiceable = serviceablePincodes.includes(pincode);

      return {
        isValid: true,
        message: isServiceable 
          ? 'Great! We deliver to your area' 
          : 'Sorry, we don\'t deliver to this pincode yet',
        isServiceable
      };

    } catch (error) {
      console.error('Error validating pincode:', error);
      return {
        isValid: true,
        message: 'Pincode format is valid',
        isServiceable: false
      };
    }
  },

  /**
   * Get all serviceable pincodes from settings
   */
  async getServiceablePincodes(): Promise<string[]> {
    try {
      const { data: settings, error } = await supabase
        .from('homepage_settings')
        .select('serviceable_pincodes')
        .limit(1)
        .order('created_at', { ascending: false })
        .single();

      if (error || !settings?.serviceable_pincodes) {
        return [];
      }

      return settings.serviceable_pincodes
        .split(/[,\n]/)
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0);

    } catch (error) {
      console.error('Error fetching serviceable pincodes:', error);
      return [];
    }
  }
}; 