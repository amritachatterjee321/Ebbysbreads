import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];

type Customer = Database['public']['Tables']['customers']['Row'];
type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

type HomepageSettings = Database['public']['Tables']['homepage_settings']['Row'];
type HomepageSettingsInsert = Database['public']['Tables']['homepage_settings']['Insert'];
type HomepageSettingsUpdate = Database['public']['Tables']['homepage_settings']['Update'];

type ServiceablePincode = Database['public']['Tables']['serviceable_pincodes']['Row'];
type ServiceablePincodeInsert = Database['public']['Tables']['serviceable_pincodes']['Insert'];

export const databaseService = {
  // Product operations
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  },

  async getActiveProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching active products:', error);
      return [];
    }

    return data || [];
  },

  async getProduct(id: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data;
  },

  async createProduct(product: ProductInsert): Promise<{ data: Product | null; error: any }> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
    }

    return { data, error };
  },

  async updateProduct(id: number, updates: ProductUpdate): Promise<{ data: Product | null; error: any }> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
    }

    return { data, error };
  },

  async deleteProduct(id: number): Promise<{ error: any }> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
    }

    return { error };
  },

  async toggleProductActive(id: number): Promise<{ data: Product | null; error: any }> {
    const product = await this.getProduct(id);
    if (!product) {
      return { data: null, error: 'Product not found' };
    }

    return this.updateProduct(id, { is_active: !product.is_active });
  },

  // Order operations
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data || [];
  },

  async getOrder(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return data;
  },

  async createOrder(order: OrderInsert): Promise<{ data: Order | null; error: any }> {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
    }

    return { data, error };
  },

  async updateOrder(id: string, updates: OrderUpdate): Promise<{ data: Order | null; error: any }> {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
    }

    return { data, error };
  },

  async deleteOrder(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting order:', error);
    }

    return { error };
  },

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customers:', error);
      return [];
    }

    return data || [];
  },

  async getCustomer(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching customer:', error);
      return null;
    }

    return data;
  },

  async createCustomer(customer: CustomerInsert): Promise<{ data: Customer | null; error: any }> {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();

    if (error) {
      console.error('Error creating customer:', error);
    }

    return { data, error };
  },

  async updateCustomer(id: string, updates: CustomerUpdate): Promise<{ data: Customer | null; error: any }> {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating customer:', error);
    }

    return { data, error };
  },

  async deleteCustomer(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting customer:', error);
    }

    return { error };
  },

  // Homepage settings operations
  async getHomepageSettings(): Promise<HomepageSettings | null> {
    const { data, error } = await supabase
      .from('homepage_settings')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error fetching homepage settings:', error);
      return null;
    }

    return data && data.length > 0 ? data[0] : null;
  },

  async updateHomepageSettings(updates: HomepageSettingsUpdate): Promise<{ data: HomepageSettings | null; error: any }> {
    const { data, error } = await supabase
      .from('homepage_settings')
      .update(updates)
      .eq('id', 1)
      .select()
      .single();

    if (error) {
      console.error('Error updating homepage settings:', error);
    }

    return { data, error };
  },

  async initializeHomepageSettings(settings: HomepageSettingsInsert): Promise<{ data: HomepageSettings | null; error: any }> {
    const { data, error } = await supabase
      .from('homepage_settings')
      .insert(settings)
      .select()
      .single();

    if (error) {
      console.error('Error initializing homepage settings:', error);
    }

    return { data, error };
  },

  // Serviceable pincodes operations
  async getServiceablePincodes(): Promise<ServiceablePincode[]> {
    const { data, error } = await supabase
      .from('serviceable_pincodes')
      .select('*')
      .order('pincode', { ascending: true });

    if (error) {
      console.error('Error fetching serviceable pincodes:', error);
      return [];
    }

    return data || [];
  },

  async checkPincodeServiceability(pincode: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('serviceable_pincodes')
      .select('delivery_available')
      .eq('pincode', pincode)
      .single();

    if (error) {
      console.error('Error checking pincode serviceability:', error);
      return false;
    }

    return data?.delivery_available || false;
  },

  async addServiceablePincode(pincode: ServiceablePincodeInsert): Promise<{ data: ServiceablePincode | null; error: any }> {
    const { data, error } = await supabase
      .from('serviceable_pincodes')
      .insert(pincode)
      .select()
      .single();

    if (error) {
      console.error('Error adding serviceable pincode:', error);
    }

    return { data, error };
  },

  async removeServiceablePincode(id: number): Promise<{ error: any }> {
    const { error } = await supabase
      .from('serviceable_pincodes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing serviceable pincode:', error);
    }

    return { error };
  }
};

// Individual service exports for backward compatibility
export const productService = {
  async getAll(): Promise<Product[]> {
    return databaseService.getProducts();
  },

  async getActive(): Promise<Product[]> {
    return databaseService.getActiveProducts();
  },

  async getById(id: number): Promise<Product | null> {
    return databaseService.getProduct(id);
  },

  async create(product: ProductInsert): Promise<Product> {
    const { data, error } = await databaseService.createProduct(product);
    if (error) throw error;
    return data!;
  },

  async update(id: number, updates: ProductUpdate): Promise<Product> {
    const { data, error } = await databaseService.updateProduct(id, updates);
    if (error) throw error;
    return data!;
  },

  async delete(id: number): Promise<void> {
    const { error } = await databaseService.deleteProduct(id);
    if (error) throw error;
  },

  async toggleActive(id: number): Promise<Product> {
    const { data, error } = await databaseService.toggleProductActive(id);
    if (error) throw error;
    return data!;
  },

  async reorderProducts(productIds: number[]): Promise<void> {
    console.log('Reordering products:', productIds);
    
    if (!productIds || productIds.length === 0) {
      console.warn('No product IDs provided for reordering');
      return;
    }
    
    try {
      // Update sort_order for each product based on the new order
      const updates = productIds.map((id, index) => ({
        id,
        sort_order: index + 1
      }));

      console.log('Updates to be applied:', updates);

      // Perform batch update using individual updates instead of upsert
      for (const update of updates) {
        console.log(`Updating product ${update.id} with sort_order ${update.sort_order}`);
        const { error } = await supabase
          .from('products')
          .update({ sort_order: update.sort_order, updated_at: new Date().toISOString() })
          .eq('id', update.id);
        
        if (error) {
          console.error(`Error updating product ${update.id}:`, error);
          throw new Error(`Failed to update product ${update.id}: ${error.message}`);
        }
      }
      
      console.log('Products reordered successfully');
    } catch (error) {
      console.error('Error in reorderProducts:', error);
      throw error;
    }
  },

  async getNextSortOrder(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1);
      
      if (error) {
        console.warn('Error getting next sort order, using fallback:', error);
        // Fallback: use the highest ID + 1
        const { data: idData, error: idError } = await supabase
          .from('products')
          .select('id')
          .order('id', { ascending: false })
          .limit(1);
        
        if (idError) throw idError;
        return (idData?.[0]?.id || 0) + 1;
      }
      
      return (data?.[0]?.sort_order || 0) + 1;
    } catch (error) {
      console.error('Error in getNextSortOrder:', error);
      throw error;
    }
  },

  async checkSortOrderColumn(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .select('sort_order')
        .limit(1);
      
      if (error) {
        console.warn('sort_order column may not exist:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking sort_order column:', error);
      return false;
    }
  }
};

export const orderService = {
  async getAll(): Promise<Order[]> {
    return databaseService.getOrders();
  },

  async getById(id: string): Promise<Order | null> {
    return databaseService.getOrder(id);
  },

  async getByOrderNumber(orderNumber: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(order: OrderInsert): Promise<Order> {
    const { data, error } = await databaseService.createOrder(order);
    if (error) throw error;
    return data!;
  },

  async update(id: string, updates: OrderUpdate): Promise<Order> {
    const { data, error } = await databaseService.updateOrder(id, updates);
    if (error) throw error;
    return data!;
  },

  async updateStatus(id: string, status: Order['status']): Promise<Order> {
    return this.update(id, { status });
  },

  async getByStatus(status: Order['status']): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};

export const customerService = {
  async getAll(): Promise<Customer[]> {
    return databaseService.getCustomers();
  },

  async getById(id: string): Promise<Customer | null> {
    return databaseService.getCustomer(id);
  },

  async getByPhone(phone: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async isPhoneNumberTaken(phone: string): Promise<boolean> {
    const customer = await this.getByPhone(phone);
    return customer !== null;
  },

  async create(customer: CustomerInsert): Promise<Customer> {
    const { data, error } = await databaseService.createCustomer(customer);
    if (error) {
      // Handle unique constraint violation specifically
      if (error.code === '23505' && error.message.includes('phone')) {
        throw new Error('A customer with this phone number already exists');
      }
      throw error;
    }
    return data!;
  },

  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    // Remove phone number from updates to prevent changes
    const { phone, ...safeUpdates } = updates;
    
    if (phone !== undefined) {
      console.warn('Phone number update attempted but blocked for customer ID:', id);
    }
    
    const { data, error } = await supabase
      .from('customers')
      .update({ ...safeUpdates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async createOrUpdate(customerData: CustomerInsert): Promise<Customer> {
    // First try to find existing customer by phone number
    const existingCustomer = await this.getByPhone(customerData.phone);
    
    if (existingCustomer) {
      // Update existing customer with new information (EXCLUDING phone number)
      return this.update(existingCustomer.id, {
        name: customerData.name,
        email: customerData.email,
        address: customerData.address,
        pincode: customerData.pincode
        // Note: phone number is intentionally excluded to prevent changes
      });
    } else {
      // Create new customer
      try {
        return await this.create(customerData);
      } catch (error) {
        // If creation fails due to unique constraint, try to find and update
        if (error instanceof Error && error.message.includes('phone number already exists')) {
          const retryCustomer = await this.getByPhone(customerData.phone);
          if (retryCustomer) {
            return this.update(retryCustomer.id, {
              name: customerData.name,
              email: customerData.email,
              address: customerData.address,
              pincode: customerData.pincode
              // Note: phone number is intentionally excluded to prevent changes
            });
          }
        }
        throw error;
      }
    }
  }
};

export const homepageSettingsService = {
  async checkTableExists(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('homepage_settings')
        .select('id')
        .limit(1);
      
      if (error) {
        console.log('Table check error (might not exist):', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.log('Table does not exist:', error);
      return false;
    }
  },

  async createTable(): Promise<void> {
    console.log('Attempting to create homepage_settings table...');
    // Note: This would require admin privileges in Supabase
    // For now, we'll provide instructions to the user
    throw new Error('Table homepage_settings does not exist. Please run the initialization SQL script in your Supabase dashboard.');
  },

  async get(): Promise<HomepageSettings | null> {
    return databaseService.getHomepageSettings();
  },

  async update(settings: HomepageSettingsUpdate): Promise<HomepageSettings> {
    const { data, error } = await databaseService.updateHomepageSettings(settings);
    if (error) throw error;
    return data!;
  },

  async create(settings: HomepageSettingsInsert): Promise<HomepageSettings> {
    const { data, error } = await databaseService.initializeHomepageSettings(settings);
    if (error) throw error;
    return data!;
  }
};

export const fileService = {
  async uploadImage(file: File, fileName: string): Promise<string> {
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  async deleteImage(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from('product-images')
      .remove([path]);

    if (error) throw error;
  }
};

export const analyticsService = {
  async getOrderStats() {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('total, status, created_at');

    if (error) throw error;

    const totalOrders = orders?.length || 0;
    const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;
    const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
    const deliveredOrders = orders?.filter(order => order.status === 'delivered').length || 0;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders
    };
  },

  async getProductStats() {
    const { data: products, error } = await supabase
      .from('products')
      .select('is_active');

    if (error) throw error;

    const totalProducts = products?.length || 0;
    const activeProducts = products?.filter(product => product.is_active).length || 0;

    return {
      totalProducts,
      activeProducts
    };
  }
}; 