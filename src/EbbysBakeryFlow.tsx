import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { 
  Home,
  ShoppingCart, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Plus, 
  Minus, 
  Trash2, 
  Settings,
  X,
  ArrowLeft,
  ArrowRight,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import TestSupabase from './test-supabase';
import TestPincode from './test-pincode';
import TestPincodeSimple from './test-pincode-simple';
import { productService, homepageSettingsService, orderService, customerService } from './services/database';
import { emailService } from './services/email';
import { supabase } from './lib/supabase';
import { PincodeInput } from './components/PincodeInput';
import { PincodeValidationResult } from './services/pincode';

// --- src/types/index.ts ---

type Product = {
  id: number;
  name: string;
  price: number;
  weight: string;
  image: string;
  stock: number;
  isBestseller?: boolean;
  isNew?: boolean;
  description: string;
};

type CartItem = Product & {
  quantity: number;
};

type CustomerInfo = {
  name: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  addressType: 'Home' | 'Office' | 'Other';
  landmark: string;
};

type ValidationErrors = {
  [K in keyof CustomerInfo]?: string;
};

// --- src/components/ui/Button.tsx ---
interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  [key: string]: any;
}

const Button = ({ children, className = '', variant = 'default', size = 'default', disabled = false, onClick, ...props }: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default: 'bg-orange-600 text-white hover:bg-orange-700',
    outline: 'border border-orange-200 text-orange-600 hover:bg-orange-50',
    ghost: 'hover:bg-orange-50 text-orange-600'
  };
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-12 px-8 text-lg'
  };
  return <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled} onClick={onClick} {...props}>{children}</button>;
};

// --- src/components/ui/Input.tsx ---
interface InputProps {
  className?: string;
  [key: string]: any;
}

const Input = ({ className = '', ...props }: InputProps) => <input className={`flex h-10 w-full rounded-md border border-orange-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />;

// --- src/components/ui/Card.tsx ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => <div className={`rounded-lg border border-orange-200 bg-white shadow-sm ${className}`}>{children}</div>;
const CardContent = ({ children, className = '' }: CardProps) => <div className={`p-6 ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }: CardProps) => <div className={`flex flex-col space-y-1.5 p-6 pb-2 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }: CardProps) => <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const Badge = ({ children, className = '' }: BadgeProps) => <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>{children}</div>;

interface LabelProps {
  children: React.ReactNode;
  htmlFor: string;
  className?: string;
}

const Label = ({ children, htmlFor, className = '' }: LabelProps) => <label htmlFor={htmlFor} className={`text-sm font-medium leading-none ${className}`}>{children}</label>;

interface SelectProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
}

const Select = ({ children, value, onValueChange }: SelectProps) => <select value={value} onChange={(e) => onValueChange(e.target.value)} className="flex h-10 w-full items-center justify-between rounded-md border border-orange-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600">{children}</select>;

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
}

const SelectItem = ({ children, value }: SelectItemProps) => <option value={value}>{children}</option>;

// --- src/data/bakery-data.ts ---
const initialProducts: Product[] = [
    { id: 1, name: "100% Wholewheat Sourdough", price: 250, weight: "500g", image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop", stock: 10, isBestseller: true, description: "Our signature whole wheat sourdough with a perfect crust and soft interior." },
    { id: 2, name: "Multiseed Sourdough", price: 280, weight: "500g", image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&h=300&fit=crop", stock: 8, description: "Packed with sunflower seeds, pumpkin seeds, and sesame for extra nutrition." },
    { id: 3, name: "Artisan Baguette", price: 180, weight: "300g", image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop", stock: 15, description: "Traditional French baguette with crispy crust and airy crumb." },
    { id: 4, name: "Sourdough Focaccia", price: 320, weight: "400g", image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop", stock: 5, description: "Italian-style focaccia with herbs and olive oil, soft and flavorful." },
    { id: 5, name: "Rye Sesame Crackers", price: 180, weight: "200g", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop", stock: 0, isNew: true, description: "Crispy rye crackers topped with sesame seeds, perfect for cheese platters." },
    { id: 6, name: "Cinnamon Swirl Bread", price: 320, weight: "450g", image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=300&fit=crop", stock: 12, description: "Sweet sourdough bread with cinnamon swirl, perfect for breakfast toast." }
];



// --- src/context/AppContext.tsx ---

type AppContextType = {
  currentPage: string;
  cart: CartItem[];
  customerInfo: CustomerInfo;
  orderNumber: string;
  orderTotal: number;
  products: Product[];
  serviceablePincodes: string[];
  homepageSettings: {
    brandName: string;
    heroImageUrl: string;
    tagline: string;
    orderDeadlineText: string;
    deliveryInfoText: string;
    menuTitle: string;
    serviceablePincodes: string[];
    aboutTitle: string;
    aboutContent: string;
    aboutImageUrl: string;
  } | null;
  lastRefreshTime: Date;
  subtotal: number;
  deliveryCharges: number;
  total: number;
  cartItemCount: number;
  setCurrentPage: (page: string) => void;
  addToCart: (product: Product, quantity: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  placeOrder: (customerData: CustomerInfo, validationRules: (data: CustomerInfo) => ValidationErrors) => Promise<boolean>;
  resetApp: () => void;
  refreshProducts: () => Promise<void>;
  refreshHomepageSettings: () => Promise<void>;
};

const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [currentPage, setCurrentPage] = useState('homepage');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: '', phone: '', email: '', address: '', pincode: '', addressType: 'Home', landmark: '' });
  const [orderNumber, setOrderNumber] = useState('');
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);

  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [homepageSettings, setHomepageSettings] = useState<{
    brandName: string;
    heroImageUrl: string;
    tagline: string;
    orderDeadlineText: string;
    deliveryInfoText: string;
    menuTitle: string;
    serviceablePincodes: string[];
    aboutTitle: string;
    aboutContent: string;
    aboutImageUrl: string;
  } | null>(null);

  // Fetch data from database on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Initial data fetch started...');
        // Fetch products
        const productsData = await productService.getActive();
        console.log('Initial products data:', productsData);
        const mappedProducts = productsData.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          weight: product.weight,
          image: product.image_url || '',
          description: product.description,
          isBestseller: product.is_bestseller,
          isNew: product.is_new,
          stock: product.stock || 0 // Assuming stock is available in the product object
        }));
        console.log('Initial mapped products:', mappedProducts);
        setProducts(mappedProducts);

        // Fetch homepage settings
        const settingsData = await homepageSettingsService.get();
        if (settingsData) {
          setHomepageSettings({
            brandName: settingsData.brand_name,
            heroImageUrl: settingsData.hero_image_url || '',
            tagline: settingsData.tagline,
            orderDeadlineText: settingsData.order_deadline_text,
            deliveryInfoText: settingsData.delivery_info_text,
            menuTitle: settingsData.menu_title || 'THIS WEEK\'S MENU',
            serviceablePincodes: settingsData.serviceable_pincodes ? settingsData.serviceable_pincodes.split(',').map(p => p.trim()) : ['110001', '110002', '110003', '110016', '110017', '110019', '110021', '110024', '110025', '110027', '110029', '110030', '122018'],
            aboutTitle: settingsData.about_title || 'About Ebby',
            aboutContent: settingsData.about_content || 'Our story of passion for baking and commitment to quality.',
            aboutImageUrl: settingsData.about_image_url || ''
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to initial data if database fails
        console.log('Falling back to initial products');
        setProducts(initialProducts);
      }
    };

    fetchData();
    // Don't override serviceable pincodes with hardcoded values
    // They will be set from the database in fetchData()
  }, []);

  // Set up real-time subscription for product changes
  useEffect(() => {
    const channel = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        async (payload) => {
          console.log('Product change detected:', payload);
          // Refresh products when any change occurs
          await refreshProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addToCart = (product: Product, quantity: number) => {
    console.log('addToCart called with:', product.name, 'quantity:', quantity);
    if (quantity <= 0) return;
    setCart(prevCart => {
      console.log('Previous cart:', prevCart);
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        console.log('Updating existing item:', existingItem.name, 'new quantity:', existingItem.quantity + quantity);
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      console.log('Adding new item:', product.name, 'quantity:', quantity);
      return [...prevCart, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => prevCart.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const placeOrder = async (customerData: CustomerInfo, validationRules: (data: CustomerInfo) => ValidationErrors) => {
    console.log('🔍 placeOrder called with customerData:', customerData);
    console.log('🔍 Cart items:', cart);
    console.log('🔍 Total amount:', total);
    
    const errors = validationRules(customerData);
    if (Object.keys(errors).length > 0) {
      // In a real app, you'd set an error state here for the form to display
      console.error("Validation failed", errors);
      alert('Please fix the validation errors before placing the order.');
      return false;
    }

    try {
      // Generate order number
      const orderNumber = `EB${Date.now().toString().slice(-6)}`;
      
      // Create or update customer account
      console.log('Creating/updating customer account:', customerData);
      const customerAccount = await customerService.createOrUpdate({
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email,
        address: customerData.address,
        pincode: customerData.pincode
      });
      console.log('Customer account updated successfully:', customerAccount);
      
      // Prepare order data
      const orderData = {
        order_number: orderNumber,
        customer_name: customerData.name,
        customer_phone: customerData.phone,
        customer_email: customerData.email || undefined,
        customer_address: customerData.address,
        customer_pincode: customerData.pincode,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          weight: item.weight
        })),
        total: total,
        status: 'pending' as const,
        payment_status: 'pending' as const,
        order_date: new Date().toISOString().split('T')[0]
      };

      // Create order in database
      console.log('Creating order in database:', orderData);
      const createdOrder = await orderService.create(orderData);
      console.log('Order created successfully:', createdOrder);

      // Send email notification to admin
      try {
        const adminEmail = await emailService.getAdminEmail();
        if (adminEmail) {
          const emailData = {
            orderNumber: orderNumber,
            customerName: customerData.name,
            customerPhone: customerData.phone,
            customerEmail: customerData.email || 'Not provided',
            customerAddress: customerData.address,
            customerPincode: customerData.pincode,
            items: cart.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })),
            total: total,
            orderDate: new Date().toLocaleDateString('en-IN')
          };

          const emailResult = await emailService.sendNewOrderNotification(emailData, adminEmail);
          if (emailResult.success) {
            console.log('Email notification sent successfully');
          } else {
            console.warn('Failed to send email notification:', emailResult.error);
          }
        } else {
          console.warn('No admin email found for notifications');
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the order creation if email fails
      }

      // Store the total amount before clearing cart
      const finalTotal = total;
      
      // Update local state
      setCustomerInfo(customerData);
      setOrderNumber(orderNumber);
      setOrderTotal(finalTotal);
      setCurrentPage('confirmation');
      setCart([]);
      
      return true;
    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to place order: ${errorMessage}. Please try again.`);
      return false;
    }
  };
  
  const resetApp = () => {
      setCurrentPage('homepage');
      setCustomerInfo({ name: '', phone: '', email: '', address: '', pincode: '', addressType: 'Home', landmark: '' });
      setOrderNumber('');
      setOrderTotal(0);
  };

  const refreshProducts = async () => {
    try {
      console.log('Refreshing products...');
      const data = await productService.getActive();
      console.log('Fetched products:', data);
      const mappedProducts = data.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        weight: product.weight,
        image: product.image_url || '',
        description: product.description,
        isBestseller: product.is_bestseller,
        isNew: product.is_new,
        stock: product.stock || 0 // Assuming stock is available in the product object
      }));
      console.log('Mapped products:', mappedProducts);
      // Force a new array reference to ensure React detects the change
      setProducts([...mappedProducts]);
      setLastRefreshTime(new Date());
      
      // Also log the state update for debugging
      console.log('Products state updated with', mappedProducts.length, 'products');
    } catch (error) {
      console.error('Error refreshing products:', error);
      // Fallback to initial products if database fails
      console.log('Falling back to initial products due to error');
      setProducts(initialProducts);
    }
  };

  const refreshHomepageSettings = async () => {
    try {
      const settingsData = await homepageSettingsService.get();
      if (settingsData) {
        setHomepageSettings({
          brandName: settingsData.brand_name,
          heroImageUrl: settingsData.hero_image_url || '',
          tagline: settingsData.tagline,
          orderDeadlineText: settingsData.order_deadline_text,
          deliveryInfoText: settingsData.delivery_info_text,
          menuTitle: settingsData.menu_title || 'THIS WEEK\'S MENU',
          serviceablePincodes: settingsData.serviceable_pincodes ? settingsData.serviceable_pincodes.split(',').map(p => p.trim()) : ['110001', '110002', '110003', '110016', '110017', '110019', '110021', '110024', '110025', '110027', '110029', '110030', '122018'],
          aboutTitle: settingsData.about_title || 'About Ebby',
          aboutContent: settingsData.about_content || 'Our story of passion for baking and commitment to quality.',
          aboutImageUrl: settingsData.about_image_url || ''
        });
      }
    } catch (error) {
      console.error('Error refreshing homepage settings:', error);
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryCharges = subtotal >= 500 ? 0 : 40;
  const total = subtotal + deliveryCharges;

  const value = {
    currentPage, cart, customerInfo, orderNumber, orderTotal, products, serviceablePincodes: homepageSettings?.serviceablePincodes || [], homepageSettings, lastRefreshTime, subtotal, deliveryCharges, total, cartItemCount,
    setCurrentPage, addToCart, updateCartQuantity, removeFromCart, setCustomerInfo, placeOrder, resetApp, refreshProducts, refreshHomepageSettings
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

// --- src/hooks/useFormValidation.ts ---

const useFormValidation = (initialState: CustomerInfo, validationRules: (values: CustomerInfo) => ValidationErrors) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState<ValidationErrors>({});
  
    const handleChange = (id: keyof CustomerInfo, value: string) => {
      setValues(prev => ({ ...prev, [id]: value }));
    };
  
    const validate = (): boolean => {
      const newErrors = validationRules(values);
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    return { values, setValues, errors, handleChange, validate };
};

// --- src/components/pages/Homepage.tsx ---

const Homepage = () => {
  const { products, homepageSettings, cartItemCount, subtotal, total, setCurrentPage, updateCartQuantity, removeFromCart } = useAppContext();
  
  // Debug logging for products
  useEffect(() => {
    console.log('Homepage products updated:', products);
    console.log('Number of products:', products.length);
    if (products.length > 0) {
      console.log('First product:', products[0]);
    }
  }, [products]);
  const [pincode, setPincode] = useState("");
  const [pincodeValidation, setPincodeValidation] = useState<PincodeValidationResult | null>(null);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const { cart, addToCart: addToCartContext, updateCartQuantity: updateCartQuantityContext, removeFromCart: removeFromCartContext } = useAppContext();
  
  const handlePincodeValidationChange = useCallback((result: PincodeValidationResult) => {
    setPincodeValidation(result);
  }, []);

  const updateQuantity = (productId: number, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const currentCartItem = cart.find(item => item.id === productId);
    
    if (newQuantity <= 0) {
      // Remove from cart if quantity is 0 or less
      if (currentCartItem) {
        removeFromCartContext(productId);
      }
    } else if (currentCartItem) {
      // Update existing cart item
      updateCartQuantityContext(productId, newQuantity);
    } else {
      // Add new item to cart
      addToCartContext(product, newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
        <header className="bg-white/90 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Home className="h-6 w-6 text-orange-600" />
                <span className="text-xl font-bold text-orange-800">{homepageSettings?.brandName || 'Ebby\'s Breads'}</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex sm:hidden items-center space-x-2">
                  <PincodeInput
                    value={pincode}
                    onChange={setPincode}
                    onValidationChange={handlePincodeValidationChange}
                    placeholder="Pincode"
                    className="w-32"
                    showValidationMessage={false}
                  />
                </div>
                <div className="hidden sm:flex items-center space-x-2">
                  <PincodeInput
                    value={pincode}
                    onChange={setPincode}
                    onValidationChange={handlePincodeValidationChange}
                    placeholder="Enter pincode"
                    className="w-48"
                    showValidationMessage={false}
                  />
                </div>
                <div className="relative"><Button variant="ghost" size="sm" onClick={() => setShowMiniCart(!showMiniCart)} className="p-2 sm:p-1"><ShoppingCart className="h-5 w-5" />{cartItemCount > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-600 text-white">{cartItemCount}</Badge>}</Button></div>
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-2 sm:px-3">
                    <Settings className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
              </div>
            </div>
            {pincodeValidation && pincodeValidation.isValid && pincodeValidation.isServiceable && (
              <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded-md text-green-800 text-sm">
                ✅ {pincodeValidation.message}
              </div>
            )}
            {pincodeValidation && pincodeValidation.isValid && !pincodeValidation.isServiceable && (
              <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800 text-sm">
                ⚠️ {pincodeValidation.message}
              </div>
            )}
          </div>
        </header>

        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <img src={homepageSettings?.heroImageUrl || "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=500&fit=crop"} alt="Fresh sourdough bread" className="w-full h-96 object-cover"/>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                      {homepageSettings?.brandName?.split(' ')[0] || 'Ebby\'s'}<br />
                      <span className="text-orange-600">{homepageSettings?.brandName?.split(' ').slice(1).join(' ') || 'Breads'}</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                      {homepageSettings?.tagline || 'Fresh sourdough bread and artisanal treats. New menu every week, delivered fresh to your door.'}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="bg-orange-100 p-2 rounded-full">
                          <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-orange-800 uppercase tracking-wide">Order Deadline</p>
                          <p className="text-lg font-bold text-gray-800">{homepageSettings?.orderDeadlineText || 'Order by Sunday 11:59 PM for next week delivery'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <MapPin className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-800 uppercase tracking-wide">Delivery Info</p>
                          <p className="text-lg font-bold text-gray-800">{homepageSettings?.deliveryInfoText || 'Deliveries Wednesday onwards • Cash on Delivery'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">{homepageSettings?.menuTitle || 'THIS WEEK\'S MENU'}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {products.map(product => (
                <Card key={product.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                  <div className="relative overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                    {/* SOLD OUT Overlay */}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                          SOLD OUT
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex flex-col space-y-2">
                        {product.isBestseller && <Badge className="bg-orange-600 text-white rounded-full px-3 py-1 shadow-md">⭐ Bestseller</Badge>}
                        {product.isNew && <Badge className="bg-green-600 text-white rounded-full px-3 py-1 shadow-md">New</Badge>}
                    </div>
                  </div>
                  <CardContent>
                    <div className="text-center space-y-3 mb-6">
                      <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
                      <div className="h-12 flex items-center justify-center">
                        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-center space-x-4">
                        <p className="text-2xl font-bold text-orange-600">₹{product.price}</p>
                        <p className="text-gray-500 text-sm">({product.weight})</p>
                      </div>
                      {product.stock === 0 && (
                        <p className="text-red-600 text-sm font-medium">Out of Stock</p>
                      )}
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex items-center border border-orange-200 rounded-full h-10">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => updateQuantity(product.id, (cart.find(item => item.id === product.id)?.quantity || 0) - 1)} 
                          className="rounded-full w-10 h-10 p-0 flex items-center justify-center text-orange-600 hover:bg-orange-50" 
                          disabled={!pincodeValidation?.isServiceable || !cart.find(item => item.id === product.id) || (cart.find(item => item.id === product.id)?.quantity || 0) <= 0}
                        >
                          <Minus className="h-5 w-5" />
                        </Button>
                        <span className="px-4 py-2 text-center min-w-[3rem] flex items-center justify-center h-full font-medium text-gray-800">
                          {cart.find(item => item.id === product.id)?.quantity || 0}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => updateQuantity(product.id, (cart.find(item => item.id === product.id)?.quantity || 0) + 1)} 
                          className="rounded-full w-10 h-10 p-0 flex items-center justify-center text-orange-600 hover:bg-orange-50"
                          disabled={!pincodeValidation?.isServiceable || product.stock === 0}
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    {!pincodeValidation?.isServiceable && <p className="text-xs text-gray-500 text-center mt-2">Check delivery availability first</p>}
                    {product.stock === 0 && <p className="text-xs text-red-500 text-center mt-2">This item is currently out of stock</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-200 shadow-2xl z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2"><ShoppingCart className="h-5 w-5 text-orange-600" /><span className="font-semibold text-gray-800">{cartItemCount} items</span></div>
                  <div className="text-2xl font-bold text-orange-600">₹{subtotal}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setShowMiniCart(true)}>View Cart</Button>
                  <Button onClick={() => setCurrentPage('checkout')} className="px-8">Checkout</Button>
                </div>
              </div>
            </div>
          </div>
        )}



        {showMiniCart && cart.length > 0 && (
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowMiniCart(false)}>
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[70vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-gray-800">Your Cart</h3><Button variant="ghost" size="sm" onClick={() => setShowMiniCart(false)}><X className="h-4 w-4" /></Button></div>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1"><h4 className="font-medium text-gray-800 text-sm">{item.name}</h4><p className="text-gray-600 text-xs">₹{item.price} × {item.quantity}</p></div>
                      <div className="flex items-center space-x-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)} 
                          className="w-10 h-10 p-0 border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 rounded-full"
                        >
                          <Minus className="h-5 w-5" />
                        </Button>
                        <span className="text-base font-bold w-10 text-center text-gray-800">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)} 
                          className="w-10 h-10 p-0 border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 rounded-full"
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeFromCart(item.id)} 
                        className="w-10 h-10 p-0 border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 rounded-full"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4"><span className="text-lg font-bold text-gray-800">Total: ₹{total}</span></div>
                  <Button onClick={() => { setShowMiniCart(false); setCurrentPage('checkout'); }} className="w-full">Proceed to Checkout</Button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

// --- src/components/pages/CheckoutPage.tsx ---

const CheckoutPage = () => {
  const { cart, subtotal, deliveryCharges, total, setCurrentPage, updateCartQuantity, removeFromCart } = useAppContext();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <header className="bg-white border-b border-orange-200"><div className="container mx-auto px-4 py-4"><div className="flex items-center justify-between"><Button variant="ghost" size="sm" onClick={() => setCurrentPage('homepage')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Menu</Button><h1 className="text-xl font-bold text-gray-800">Review Your Order</h1><div className="w-20"></div></div></div></header>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1"><h3 className="font-medium text-gray-800">{item.name}</h3><p className="text-gray-600 text-sm">{item.weight}</p><p className="text-orange-600 font-medium">₹{item.price} × {item.quantity}</p></div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)} 
                          className="w-12 h-12 p-0 border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 rounded-full"
                        >
                          <Minus className="h-6 w-6" />
                        </Button>
                        <span className="font-bold w-12 text-center text-gray-800 text-xl">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)} 
                          className="w-12 h-12 p-0 border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 rounded-full"
                        >
                          <Plus className="h-6 w-6" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeFromCart(item.id)} 
                          className="w-12 h-12 p-0 ml-3 border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 rounded-full"
                        >
                          <Trash2 className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Order Total</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">₹{subtotal}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Delivery Charges</span><span className="font-medium">{deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}</span></div>
                  {subtotal < 500 && <p className="text-xs text-gray-500">Free delivery on orders above ₹500</p>}
                  <div className="border-t pt-3"><div className="flex justify-between text-lg font-bold text-gray-800"><span>Total Amount</span><span>₹{total}</span></div><p className="text-xs text-gray-500 mt-1">To be paid on delivery</p></div>
                </div>
                <Button onClick={() => setCurrentPage('account')} className="w-full mt-6 bg-orange-600 hover:bg-orange-700" size="lg">Proceed to Account Details<ArrowRight className="h-4 w-4 ml-2" /></Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- src/components/pages/AccountPage.tsx ---

const AccountPage = () => {
  const { total, setCurrentPage, placeOrder, customerInfo, serviceablePincodes, cart } = useAppContext();
  const [existingCustomerFound, setExistingCustomerFound] = useState(false);
  const [phoneNumberLocked, setPhoneNumberLocked] = useState(false);

  const validationRules = (values: CustomerInfo): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!values.name.trim()) errors.name = "Name is required";
    if (!values.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(values.phone)) errors.phone = "Enter a valid 10-digit phone number";
    if (!values.email.trim()) errors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Enter a valid email address";
    if (!values.address.trim()) errors.address = "Address is required";
    if (!values.pincode.trim()) errors.pincode = "Pincode is required";
    else if (!serviceablePincodes.includes(values.pincode)) errors.pincode = "Sorry, we don't deliver to this pincode";
    return errors;
  };

  const { values, errors, handleChange, validate, setValues } = useFormValidation(customerInfo, validationRules);

  // Reset phone number lock state when phone number changes
  useEffect(() => {
    console.log('🔍 useEffect: phone number changed to:', values.phone, 'length:', values.phone.length);
    if (values.phone.length !== 10) {
      console.log('🔍 Resetting phone lock state - not 10 digits');
      setPhoneNumberLocked(false);
      setExistingCustomerFound(false);
    }
  }, [values.phone]);

  // Function to check for existing customer and auto-fill form
  const checkExistingCustomer = async (phone: string) => {
    console.log('🔍 checkExistingCustomer called with phone:', phone, 'length:', phone.length);
    
    // Only check for existing customer if phone number is exactly 10 digits
    if (phone.length === 10) {
      try {
        console.log('🔍 Checking for existing customer with 10-digit phone');
        const existingCustomer = await customerService.getByPhone(phone);
        if (existingCustomer) {
          console.log('🔍 Existing customer found:', existingCustomer);
          // Auto-fill the form with existing customer data
          setValues({
            ...values,
            name: existingCustomer.name,
            email: existingCustomer.email || '',
            address: existingCustomer.address,
            pincode: existingCustomer.pincode
          });
          
          // Show success message and lock phone number
          setExistingCustomerFound(true);
          setPhoneNumberLocked(true);
          console.log('✅ Existing customer found and form auto-filled, phone locked');
          
          // Clear the success message after 5 seconds
          setTimeout(() => setExistingCustomerFound(false), 5000);
        } else {
          console.log('🔍 No existing customer found for this phone number');
          setExistingCustomerFound(false);
          setPhoneNumberLocked(false);
        }
      } catch (error) {
        console.error('❌ Error checking existing customer:', error);
        setExistingCustomerFound(false);
        setPhoneNumberLocked(false);
      }
    } else {
      // If phone number is not 10 digits, unlock it and clear existing customer status
      console.log('🔍 Phone number not 10 digits, unlocking and clearing customer status');
      setExistingCustomerFound(false);
      setPhoneNumberLocked(false);
    }
  };

  // Enhanced handleChange to include customer lookup
  const handleCustomerFieldChange = (field: keyof CustomerInfo, value: string) => {
    console.log('🔍 handleCustomerFieldChange called:', field, 'value:', value);
    handleChange(field, value);
    
    // If phone number is being entered, check for existing customer
    if (field === 'phone') {
      console.log('🔍 Phone field changed, calling checkExistingCustomer');
      checkExistingCustomer(value);
    }
  };

  const handlePlaceOrder = async () => {
    console.log('🔍 handlePlaceOrder called');
    console.log('🔍 Form values:', values);
    console.log('🔍 Cart items:', cart);
    console.log('🔍 Total amount:', total);
    console.log('🔍 Serviceable pincodes:', serviceablePincodes);
    
    // Check validation manually to see what's failing
    const validationErrors = validationRules(values);
    console.log('🔍 Validation errors:', validationErrors);
    
    if (validate()) {
      console.log('🔍 Validation passed, calling placeOrder');
      try {
        const result = await placeOrder(values, validationRules);
        console.log('🔍 placeOrder result:', result);
      } catch (error) {
        console.error('🔍 Error in handlePlaceOrder:', error);
      }
    } else {
      console.log('🔍 Validation failed');
      console.log('🔍 Current errors state:', errors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
        <header className="bg-white border-b border-orange-200"><div className="container mx-auto px-4 py-4"><div className="flex items-center justify-between"><Button variant="ghost" size="sm" onClick={() => setCurrentPage('checkout')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Cart</Button><h1 className="text-xl font-bold text-gray-800">Account Details</h1><div className="w-20"></div></div></div></header>
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">Create Your Account</CardTitle>
                      <p className="text-gray-600">We need your details for delivery and order updates</p>
                      {existingCustomerFound && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-green-700 text-sm">
                            ✅ Existing customer found! Your details have been auto-filled.
                          </p>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor="name">Full Name *</Label><Input id="name" placeholder="Enter your full name" value={values.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCustomerFieldChange('name', e.target.value)} className={errors.name ? 'border-red-500' : ''} />{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}</div>
                            <div>
                              <Label htmlFor="phone">Phone Number *</Label>
                              <Input 
                                id="phone" 
                                placeholder="10-digit mobile number" 
                                value={values.phone} 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCustomerFieldChange('phone', e.target.value)} 
                                maxLength={10} 
                                disabled={phoneNumberLocked}
                                className={`${errors.phone ? 'border-red-500' : ''} ${phoneNumberLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
                              />
                              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                              {phoneNumberLocked && <p className="text-blue-600 text-xs mt-1">🔒 Phone number cannot be changed for existing customers</p>}
                              {!phoneNumberLocked && values.phone.length > 0 && values.phone.length < 10 && (
                                <p className="text-orange-600 text-xs mt-1">📱 Please enter a complete 10-digit phone number</p>
                              )}
                            </div>
                        </div>
                        <div><Label htmlFor="email">Email Address *</Label><Input id="email" type="email" placeholder="your.email@example.com" value={values.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCustomerFieldChange('email', e.target.value)} className={errors.email ? 'border-red-500' : ''} />{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}</div>
                        <div><Label htmlFor="address">Complete Address *</Label><Input id="address" placeholder="House no, Street, Area, City" value={values.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCustomerFieldChange('address', e.target.value)} className={errors.address ? 'border-red-500' : ''} />{errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="pincode">Pincode *</Label>
                              <PincodeInput
                                value={values.pincode}
                                onChange={(value) => handleCustomerFieldChange('pincode', value)}
                                placeholder="110001"
                                className={errors.pincode ? 'border-red-500' : ''}
                              />
                              {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                            </div>
                            <div><Label htmlFor="addressType">Address Type</Label><Select value={values.addressType} onValueChange={(value) => handleCustomerFieldChange('addressType', value)}><SelectItem value="Home">Home</SelectItem><SelectItem value="Office">Office</SelectItem><SelectItem value="Other">Other</SelectItem></Select></div>
                        </div>
                        <Button onClick={handlePlaceOrder} className="w-full bg-orange-600 hover:bg-orange-700" size="lg">Place Order - ₹{total} (COD)<Check className="h-4 w-4 ml-2" /></Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
};


// --- src/components/pages/ConfirmationPage.tsx ---

const ConfirmationPage = () => {
  const { orderNumber, orderTotal, customerInfo, resetApp } = useAppContext();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50">
      <header className="bg-white border-b border-green-200"><div className="container mx-auto px-4 py-4"><div className="text-center"><h1 className="text-xl font-bold text-gray-800">Order Confirmed!</h1></div></div></header>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8"><div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"><Check className="h-8 w-8 text-green-600" /></div><h2 className="text-3xl font-bold text-gray-800 mb-2">Thank You!</h2><p className="text-gray-600">Your order has been placed successfully</p></div>
          <Card className="mb-6"><CardHeader><CardTitle>Order Details</CardTitle></CardHeader><CardContent><div className="space-y-3"><div className="flex justify-between"><span className="text-gray-600">Order Number</span><span className="font-bold text-orange-600">{orderNumber}</span></div><div className="flex justify-between"><span className="text-gray-600">Total Amount</span><span className="font-bold">₹{orderTotal}</span></div><div className="flex justify-between"><span className="text-gray-600">Payment Method</span><span className="font-medium">Cash on Delivery</span></div></div></CardContent></Card>
          <Card className="mb-6"><CardHeader><CardTitle>Delivery Information</CardTitle></CardHeader><CardContent><div className="space-y-3"><div><span className="text-gray-600 block">Delivery Address</span><span className="font-medium">{customerInfo.address}, {customerInfo.pincode}</span></div><div><span className="text-gray-600 block">Expected Delivery</span><span className="font-medium text-green-600">Wednesday - Friday</span></div></div></CardContent></Card>
          <Card className="mb-6"><CardHeader><CardTitle>Customer Support</CardTitle></CardHeader><CardContent><div className="space-y-4"><div className="flex items-center space-x-3"><Phone className="h-5 w-5 text-orange-600" /><div><span className="text-gray-600 block text-sm">Phone Support</span><span className="font-medium">+91 98765 43210</span></div></div><div className="flex items-center space-x-3"><Clock className="h-5 w-5 text-orange-600" /><div><span className="text-gray-600 block text-sm">Support Hours</span><span className="font-medium">Monday - Saturday: 9:00 AM - 7:00 PM</span></div></div><div className="flex items-center space-x-3"><Mail className="h-5 w-5 text-orange-600" /><div><span className="text-gray-600 block text-sm">Follow Us</span><span className="font-medium">@ebbysbreads</span></div></div><div className="pt-3 border-t border-gray-200"><p className="text-sm text-gray-600">Need help with your order? Contact us anytime during business hours. We're here to help!</p></div></div></CardContent></Card>
          <div className="text-center mt-8"><Button onClick={resetApp} variant="outline" className="px-8">Continue Shopping</Button></div>
        </div>
      </div>
    </div>
  );
};


// --- src/App.tsx ---

const PageRenderer = () => {
    const { currentPage } = useAppContext();
    
    switch (currentPage) {
        case 'checkout': return <CheckoutPage />;
        case 'account': return <AccountPage />;
        case 'confirmation': return <ConfirmationPage />;
        case 'admin': return <AdminDashboard />;
        case 'test': return <TestSupabase />;
        case 'storage': return <TestSupabase />;
        case 'pincode': return <TestPincode />;
        case 'pincode-simple': return <TestPincodeSimple />;
        default: return <Homepage />;
    }
};

export default function EbbysBakeryFlow() {
  return (
    <AppProvider>
      <PageRenderer />
    </AppProvider>
  );
}