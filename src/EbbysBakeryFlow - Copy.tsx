import React, { useState, useEffect, createContext, useContext } from 'react';
import { Home, ShoppingCart, Plus, Minus, Search, Instagram, Phone, Clock, MapPin, X, Check, Truck, ArrowRight, ArrowLeft } from 'lucide-react';

// --- src/types/index.ts ---

type Product = {
  id: number;
  name: string;
  price: number;
  weight: string;
  image: string;
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
    { id: 1, name: "100% Wholewheat Sourdough", price: 250, weight: "500g", image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop", isBestseller: true, description: "Our signature whole wheat sourdough with a perfect crust and soft interior." },
    { id: 2, name: "Multiseed Sourdough", price: 280, weight: "500g", image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&h=300&fit=crop", description: "Packed with sunflower seeds, pumpkin seeds, and sesame for extra nutrition." },
    { id: 3, name: "Artisan Baguette", price: 180, weight: "300g", image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop", description: "Traditional French baguette with crispy crust and airy crumb." },
    { id: 4, name: "Sourdough Focaccia", price: 320, weight: "400g", image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop", description: "Italian-style focaccia with herbs and olive oil, soft and flavorful." },
    { id: 5, name: "Rye Sesame Crackers", price: 180, weight: "200g", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop", isNew: true, description: "Crispy rye crackers topped with sesame seeds, perfect for cheese platters." },
    { id: 6, name: "Cinnamon Swirl Bread", price: 320, weight: "450g", image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=300&fit=crop", description: "Sweet sourdough bread with cinnamon swirl, perfect for breakfast toast." }
];
const initialServiceablePincodes: string[] = ["110001", "110002", "110003", "110016", "110017", "110019", "110021", "110024", "110025", "110027", "110029", "110030", "122018"];


// --- src/context/AppContext.tsx ---

type AppContextType = {
  currentPage: string;
  cart: CartItem[];
  customerInfo: CustomerInfo;
  orderNumber: string;
  products: Product[];
  serviceablePincodes: string[];
  subtotal: number;
  deliveryCharges: number;
  total: number;
  cartItemCount: number;
  setCurrentPage: (page: string) => void;
  addToCart: (product: Product, quantity: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  placeOrder: (customerData: CustomerInfo, validationRules: (data: CustomerInfo) => ValidationErrors) => boolean;
  resetApp: () => void;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [serviceablePincodes, setServiceablePincodes] = useState<string[]>([]);

  // Simulate fetching data on mount
  useEffect(() => {
    setProducts(initialProducts);
    setServiceablePincodes(initialServiceablePincodes);
  }, []);

  const addToCart = (product: Product, quantity: number) => {
    if (quantity <= 0) return;
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
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

  const placeOrder = (customerData: CustomerInfo, validationRules: (data: CustomerInfo) => ValidationErrors) => {
    const errors = validationRules(customerData);
    if (Object.keys(errors).length > 0) {
      // In a real app, you'd set an error state here for the form to display
      console.error("Validation failed", errors);
      return false;
    }
    setCustomerInfo(customerData);
    setOrderNumber(`EB${Date.now().toString().slice(-6)}`);
    setCurrentPage('confirmation');
    setCart([]);
    return true;
  };
  
  const resetApp = () => {
      setCurrentPage('homepage');
      setCustomerInfo({ name: '', phone: '', email: '', address: '', pincode: '', addressType: 'Home', landmark: '' });
      setOrderNumber('');
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryCharges = subtotal >= 500 ? 0 : 40;
  const total = subtotal + deliveryCharges;

  const value = {
    currentPage, cart, customerInfo, orderNumber, products, serviceablePincodes, subtotal, deliveryCharges, total, cartItemCount,
    setCurrentPage, addToCart, updateCartQuantity, removeFromCart, setCustomerInfo, placeOrder, resetApp
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
  const { products, serviceablePincodes, addToCart, cartItemCount, subtotal, setCurrentPage, updateCartQuantity, removeFromCart } = useAppContext();
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState("idle"); // "idle", "checking", "serviceable", "not-serviceable"
  const [showMiniCart, setShowMiniCart] = useState(false);
  const { cart } = useAppContext();
  
  const checkDelivery = () => {
    if (!pincode) return;
    setPincodeStatus("checking");
    setTimeout(() => {
      if (serviceablePincodes.includes(pincode)) {
        setPincodeStatus("serviceable");
      } else {
        setPincodeStatus("not-serviceable");
      }
    }, 1000);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    setQuantities(prev => ({ ...prev, [product.id]: 0 }));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setQuantities(prev => ({ ...prev, [productId]: Math.max(0, quantity) }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
        <header className="bg-white/90 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Home className="h-6 w-6 text-orange-600" />
                <span className="text-xl font-bold text-orange-800">Ebby's Breads</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2">
                  <Input placeholder="Enter pincode" value={pincode} onChange={(e) => { setPincode(e.target.value); setPincodeStatus("idle"); }} className="w-32 text-sm" maxLength={6} />
                  <Button variant="ghost" size="sm" onClick={checkDelivery} disabled={pincodeStatus === "checking"}>
                    {pincodeStatus === "checking" ? <div className="animate-spin h-4 w-4 border-2 border-orange-600 border-t-transparent rounded-full" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="relative"><Button variant="ghost" size="sm" onClick={() => setShowMiniCart(!showMiniCart)}><ShoppingCart className="h-5 w-5" />{cartItemCount > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-600 text-white">{cartItemCount}</Badge>}</Button></div>
              </div>
            </div>
            {pincodeStatus === "serviceable" && <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded-md text-green-800 text-sm">✅ Great! We deliver to {pincode}. Orders placed by Sunday 11:59 PM will be delivered from Wednesday.</div>}
            {pincodeStatus === "not-serviceable" && <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-md text-red-800 text-sm">❌ Sorry, we don't deliver to {pincode} yet. We're expanding soon!</div>}
          </div>
        </header>

        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4"><div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"><div className="relative"><div className="relative overflow-hidden rounded-2xl shadow-2xl"><img src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=500&fit=crop" alt="Fresh sourdough bread" className="w-full h-96 object-cover"/></div></div><div className="space-y-8"><div className="space-y-4"><h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">Ebby's<br /><span className="text-orange-600">Breads</span></h1><p className="text-xl text-gray-600 leading-relaxed">Fresh sourdough bread and artisanal treats. New menu every week, delivered fresh to your door.</p></div><div className="space-y-3"><div className="flex items-center space-x-3 text-gray-700"><Clock className="h-5 w-5 text-orange-600" /><span className="font-medium">Order by Sunday 11:59 PM for next week delivery</span></div><div className="flex items-center space-x-3 text-gray-700"><MapPin className="h-5 w-5 text-orange-600" /><span className="font-medium">Deliveries Wednesday onwards • Cash on Delivery</span></div></div></div></div></div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16"><h2 className="text-4xl font-bold text-gray-800 mb-4">THIS WEEK'S MENU</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <Card key={product.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                  <div className="relative overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 left-3 flex flex-col space-y-2">
                        {product.isBestseller && <Badge className="bg-orange-600 text-white rounded-full px-3 py-1 shadow-md">⭐ Bestseller</Badge>}
                        {product.isNew && <Badge className="bg-green-600 text-white rounded-full px-3 py-1 shadow-md">New</Badge>}
                    </div>
                  </div>
                  <CardContent>
                    <div className="text-center space-y-3 mb-6">
                      <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
                      <p className="text-gray-600 text-sm">{product.description}</p>
                      <div className="flex items-center justify-center space-x-4"><p className="text-2xl font-bold text-orange-600">₹{product.price}</p><p className="text-gray-500 text-sm">({product.weight})</p></div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-orange-200 rounded-full">
                        <Button variant="ghost" size="sm" onClick={() => updateQuantity(product.id, (quantities[product.id] || 0) - 1)} className="rounded-full w-8 h-8 p-0" disabled={!quantities[product.id] || quantities[product.id] <= 0}><Minus className="h-3 w-3" /></Button>
                        <span className="px-4 py-2 text-center min-w-[3rem]">{quantities[product.id] || 0}</span>
                        <Button variant="ghost" size="sm" onClick={() => updateQuantity(product.id, (quantities[product.id] || 0) + 1)} className="rounded-full w-8 h-8 p-0"><Plus className="h-3 w-3" /></Button>
                      </div>
                      <Button onClick={() => handleAddToCart(product, quantities[product.id] || 1)} className="flex-1 rounded-full shadow-md hover:shadow-lg transition-all duration-200" disabled={pincodeStatus !== "serviceable"}>Add to Cart</Button>
                    </div>
                    {pincodeStatus !== "serviceable" && <p className="text-xs text-gray-500 text-center mt-2">Check delivery availability first</p>}
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
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-6 h-6 p-0"><Minus className="h-3 w-3" /></Button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <Button variant="ghost" size="sm" onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-6 h-6 p-0"><Plus className="h-3 w-3" /></Button>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 w-6 h-6 p-0"><X className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4"><span className="text-lg font-bold text-gray-800">Total: ₹{subtotal}</span></div>
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
                        <Button variant="ghost" size="sm" onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-8 h-8 p-0"><Minus className="h-4 w-4" /></Button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <Button variant="ghost" size="sm" onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-8 h-8 p-0"><Plus className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 w-8 h-8 p-0 ml-2"><X className="h-4 w-4" /></Button>
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
  const { total, setCurrentPage, placeOrder, customerInfo, serviceablePincodes } = useAppContext();

  const validationRules = (values: CustomerInfo): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!values.name.trim()) errors.name = "Name is required";
    if (!values.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(values.phone)) errors.phone = "Enter a valid 10-digit phone number";
    if (!values.address.trim()) errors.address = "Address is required";
    if (!values.pincode.trim()) errors.pincode = "Pincode is required";
    else if (!serviceablePincodes.includes(values.pincode)) errors.pincode = "Sorry, we don't deliver to this pincode";
    return errors;
  };

  const { values, setValues, errors, handleChange, validate } = useFormValidation(customerInfo, validationRules);

  const handlePlaceOrder = () => {
    if (validate()) {
      placeOrder(values, validationRules);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
        <header className="bg-white border-b border-orange-200"><div className="container mx-auto px-4 py-4"><div className="flex items-center justify-between"><Button variant="ghost" size="sm" onClick={() => setCurrentPage('checkout')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Cart</Button><h1 className="text-xl font-bold text-gray-800">Account Details</h1><div className="w-20"></div></div></div></header>
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader><CardTitle className="text-2xl">Create Your Account</CardTitle><p className="text-gray-600">We need your details for delivery and order updates</p></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor="name">Full Name *</Label><Input id="name" placeholder="Enter your full name" value={values.name} onChange={e => handleChange('name', e.target.value)} className={errors.name ? 'border-red-500' : ''} />{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}</div>
                            <div><Label htmlFor="phone">Phone Number *</Label><Input id="phone" placeholder="10-digit mobile number" value={values.phone} onChange={e => handleChange('phone', e.target.value)} maxLength={10} className={errors.phone ? 'border-red-500' : ''} />{errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}</div>
                        </div>
                        <div><Label htmlFor="address">Complete Address *</Label><Input id="address" placeholder="House no, Street, Area, City" value={values.address} onChange={e => handleChange('address', e.target.value)} className={errors.address ? 'border-red-500' : ''} />{errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor="pincode">Pincode *</Label><Input id="pincode" placeholder="110001" value={values.pincode} onChange={e => handleChange('pincode', e.target.value)} maxLength={6} className={errors.pincode ? 'border-red-500' : ''} />{errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}</div>
                            <div><Label htmlFor="addressType">Address Type</Label><Select value={values.addressType} onValueChange={(value) => handleChange('addressType', value)}><SelectItem value="Home">Home</SelectItem><SelectItem value="Office">Office</SelectItem><SelectItem value="Other">Other</SelectItem></Select></div>
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
  const { orderNumber, total, customerInfo, resetApp } = useAppContext();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50">
      <header className="bg-white border-b border-green-200"><div className="container mx-auto px-4 py-4"><div className="text-center"><h1 className="text-xl font-bold text-gray-800">Order Confirmed!</h1></div></div></header>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8"><div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"><Check className="h-8 w-8 text-green-600" /></div><h2 className="text-3xl font-bold text-gray-800 mb-2">Thank You!</h2><p className="text-gray-600">Your order has been placed successfully</p></div>
          <Card className="mb-6"><CardHeader><CardTitle>Order Details</CardTitle></CardHeader><CardContent><div className="space-y-3"><div className="flex justify-between"><span className="text-gray-600">Order Number</span><span className="font-bold text-orange-600">{orderNumber}</span></div><div className="flex justify-between"><span className="text-gray-600">Total Amount</span><span className="font-bold">₹{total}</span></div><div className="flex justify-between"><span className="text-gray-600">Payment Method</span><span className="font-medium">Cash on Delivery</span></div></div></CardContent></Card>
          <Card className="mb-6"><CardHeader><CardTitle>Delivery Information</CardTitle></CardHeader><CardContent><div className="space-y-3"><div><span className="text-gray-600 block">Delivery Address</span><span className="font-medium">{customerInfo.address}, {customerInfo.pincode}</span></div><div><span className="text-gray-600 block">Expected Delivery</span><span className="font-medium text-green-600">Wednesday - Friday</span></div></div></CardContent></Card>
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