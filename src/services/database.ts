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
type ServiceablePincodeUpdate = Database['public']['Tables']['serviceable_pincodes']['Update'];

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
      .single();

    if (error) {
      console.error('Error fetching homepage settings:', error);
      return null;
    }

    return data;
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