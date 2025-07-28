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

type HomepageSettings = Database['public']['Tables']['homepage_settings']['Row'];
type HomepageSettingsInsert = Database['public']['Tables']['homepage_settings']['Insert'];
type HomepageSettingsUpdate = Database['public']['Tables']['homepage_settings']['Update'];

// Product Services
export const productService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getActive(): Promise<Product[]> {
    console.log('Fetching active products from database...');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching active products:', error);
      throw error;
    }
    console.log('Active products fetched:', data);
    console.log('Number of active products:', data?.length || 0);
    if (data && data.length > 0) {
      console.log('First product details:', data[0]);
    }
    return data || [];
  },

  async getById(id: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(product: ProductInsert): Promise<Product> {
    // Get the next sort order if not provided
    if (!product.sort_order) {
      product.sort_order = await this.getNextSortOrder();
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: number, updates: ProductUpdate): Promise<Product> {
    console.log('Updating product:', id, 'with updates:', updates);
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
    console.log('Product updated successfully:', data);
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async toggleActive(id: number): Promise<Product> {
    const product = await this.getById(id);
    if (!product) throw new Error('Product not found');
    
    return this.update(id, { is_active: !product.is_active });
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

// Order Services
export const orderService = {
  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
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
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: OrderUpdate): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
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

// Customer Services
export const customerService = {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getByPhone(phone: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(customer: CustomerInsert): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// File Upload Service
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

// Analytics Service
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

// Homepage Settings Service
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
    console.log('Fetching homepage settings...');
    const { data, error } = await supabase
      .from('homepage_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Error fetching homepage settings:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No homepage settings found');
      return null;
    }
    
    console.log('Homepage settings fetched successfully:', data[0]);
    return data[0];
  },

  async update(id: number, settings: HomepageSettingsUpdate): Promise<HomepageSettings> {
    console.log('Updating homepage settings:', id, settings);
    const { data, error } = await supabase
      .from('homepage_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating homepage settings:', error);
      throw error;
    }
    console.log('Homepage settings updated successfully:', data);
    return data;
  },

  async create(settings: HomepageSettingsInsert): Promise<HomepageSettings> {
    console.log('Creating homepage settings:', settings);
    
    try {
      const { data, error } = await supabase
        .from('homepage_settings')
        .insert(settings)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error creating homepage settings:', error);
        throw new Error(`Database error: ${error.message} (Code: ${error.code})`);
      }
      
      if (!data) {
        throw new Error('No data returned after creating homepage settings');
      }
      
      console.log('Homepage settings created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in create homepage settings:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Unknown error creating homepage settings: ${JSON.stringify(error)}`);
      }
    }
  }
}; 