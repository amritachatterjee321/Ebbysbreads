import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  Package,
  DollarSign,
  Scale,
  ImageIcon,
  FileText,
  Box,
  Star,
  Sparkles,
  CheckCircle,
  AlertCircle,
  SortAsc,
  SortDesc,
  GripVertical,
  Loader2,
  ShoppingCart,
  Settings,
  Home
} from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { productService, orderService, homepageSettingsService, fileService } from './services/database';
import type { Database } from './lib/supabase';

type Product = Database['public']['Tables']['products']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];
type HomepageSettings = Database['public']['Tables']['homepage_settings']['Row'];

interface ProductFormData {
  name: string;
  price: number;
  weight: string;
  description: string;
  stock: number;
  is_bestseller: boolean;
  is_new: boolean;
  is_active: boolean;
  sort_order?: number;
  imageFile?: File;
}

interface HomepageSettingsFormData {
  brand_name: string;
  hero_image_url: string;
  tagline: string;
  order_deadline_text: string;
  delivery_info_text: string;
  menu_title: string;
  serviceable_pincodes: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showHomepageSettingsModal, setShowHomepageSettingsModal] = useState(false);
  const [showHeroImageUploadModal, setShowHeroImageUploadModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    weight: '',
    description: '',
    stock: 0,
    is_bestseller: false,
    is_new: false,
    is_active: true
  });
  const [homepageSettingsFormData, setHomepageSettingsFormData] = useState<HomepageSettingsFormData>({
    brand_name: '',
    hero_image_url: '',
    tagline: '',
    order_deadline_text: '',
    delivery_info_text: '',
    menu_title: '',
    serviceable_pincodes: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(false);
  const [sortOrderColumnExists, setSortOrderColumnExists] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchHomepageSettings = async () => {
    try {
      const data = await homepageSettingsService.get();
      setHomepageSettings(data);
      if (data) {
        setHomepageSettingsFormData({
          brand_name: data.brand_name || '',
          hero_image_url: data.hero_image_url || '',
          tagline: data.tagline || '',
          order_deadline_text: data.order_deadline_text || '',
          delivery_info_text: data.delivery_info_text || '',
          menu_title: data.menu_title || '',
          serviceable_pincodes: data.serviceable_pincodes || ''
        });
      }
    } catch (error) {
      console.error('Error fetching homepage settings:', error);
    }
  };

  const fetchData = async () => {
    try {
    setLoading(true);
      await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchHomepageSettings()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
    setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'out_for_delivery': return 'Ready';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const goToHomepage = () => {
    navigate('/');
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(`Failed to update order status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const deleteProduct = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
    try {
      await productService.delete(productId);
        await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      }
    }
  };

  const toggleProductStatus = async (productId: number) => {
    try {
      await productService.toggleActive(productId);
      await fetchProducts();
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProductFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setProductFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProductFormData(prev => ({ ...prev, imageFile: undefined }));
    setImagePreview(null);
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductFormData({
        name: product.name,
        price: product.price,
        weight: product.weight,
        description: product.description,
        stock: product.stock,
        is_bestseller: product.is_bestseller,
        is_new: product.is_new,
        is_active: product.is_active,
        sort_order: product.sort_order
      });
      setImagePreview(product.image_url || null);
    } else {
      setEditingProduct(null);
      setProductFormData({
        name: '',
        price: 0,
        weight: '',
        description: '',
        stock: 0,
        is_bestseller: false,
        is_new: false,
        is_active: true
      });
      setImagePreview(null);
    }
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = editingProduct?.image_url || '';

      if (productFormData.imageFile) {
        const fileName = `products/${Date.now()}-${productFormData.imageFile.name}`;
        imageUrl = await fileService.uploadImage(productFormData.imageFile, fileName);
      }

      const productData = {
        name: productFormData.name.trim(),
        price: productFormData.price,
        weight: productFormData.weight.trim(),
        description: productFormData.description.trim(),
        stock: productFormData.stock,
        is_bestseller: productFormData.is_bestseller,
        is_new: productFormData.is_new,
        is_active: productFormData.is_active,
        image_url: imageUrl
      };

      if (editingProduct) {
        await productService.update(editingProduct.id, productData);
      } else {
        await productService.create(productData);
      }

      setShowProductModal(false);
      await fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleHeroImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setHeroImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleHeroImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setHeroImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeHeroImage = () => {
    setHeroImagePreview(null);
  };

  const handleRemoveHeroImage = async () => {
    if (!homepageSettings) return;
    
    try {
      const updatedSettings = {
        ...homepageSettings,
        hero_image_url: ''
      };
      
      await homepageSettingsService.update(homepageSettings.id, updatedSettings);
      await fetchHomepageSettings();
      alert('Hero image removed successfully!');
    } catch (error) {
      console.error('Error removing hero image:', error);
      alert('Error removing hero image. Please try again.');
    }
  };

  const openHomepageSettingsModal = () => {
    setShowHomepageSettingsModal(true);
    // Set the current hero image preview if it exists
    if (homepageSettings?.hero_image_url) {
      setHeroImagePreview(homepageSettings.hero_image_url);
    } else {
      setHeroImagePreview(null);
    }
  };

  const openHeroImageUploadModal = () => {
    setShowHeroImageUploadModal(true);
    // Set the current hero image preview if it exists
    if (homepageSettings?.hero_image_url) {
      setHeroImagePreview(homepageSettings.hero_image_url);
    } else {
      setHeroImagePreview(null);
    }
  };

  const handleHomepageSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      setUploading(true);
      
    try {
      let heroImageUrl = homepageSettings?.hero_image_url || '';
      
      // Handle hero image upload if there's a new image
      if (heroImagePreview && heroImagePreview !== homepageSettings?.hero_image_url) {
        try {
          // Create a file from the data URL if it's a new image
          const response = await fetch(heroImagePreview);
          const blob = await response.blob();
          const file = new File([blob], `hero-image-${Date.now()}.jpg`, { type: blob.type });
          
          const fileName = `homepage/hero-${Date.now()}-${file.name}`;
          heroImageUrl = await fileService.uploadImage(file, fileName);
          console.log('Hero image uploaded successfully:', heroImageUrl);
        } catch (uploadError) {
          console.error('Error uploading hero image:', uploadError);
          alert('Error uploading hero image. Please try again.');
          return;
        }
      }
      
      const settingsData = {
        brand_name: homepageSettingsFormData.brand_name.trim(),
        hero_image_url: heroImageUrl,
        tagline: homepageSettingsFormData.tagline.trim(),
        order_deadline_text: homepageSettingsFormData.order_deadline_text.trim(),
        delivery_info_text: homepageSettingsFormData.delivery_info_text.trim(),
        menu_title: homepageSettingsFormData.menu_title.trim(),
        serviceable_pincodes: homepageSettingsFormData.serviceable_pincodes.trim()
      };
      
      if (homepageSettings) {
        await homepageSettingsService.update(homepageSettings.id, settingsData);
      } else {
        await homepageSettingsService.create(settingsData);
      }
      
      setShowHomepageSettingsModal(false);
      setHeroImagePreview(null);
      await fetchHomepageSettings();
      alert('Homepage settings saved successfully!');
    } catch (error) {
      console.error('Error saving homepage settings:', error);
      alert('Error saving homepage settings. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleHeroImageUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homepageSettings || !heroImagePreview) return;

    setUploading(true);
    try {
      let heroImageUrl = '';

      // Handle hero image upload
      if (heroImagePreview && heroImagePreview !== homepageSettings.hero_image_url) {
        try {
          // Create a file from the data URL if it's a new image
          const response = await fetch(heroImagePreview);
          const blob = await response.blob();
          const file = new File([blob], `hero-image-${Date.now()}.jpg`, { type: blob.type });
          
          const fileName = `homepage/hero-${Date.now()}-${file.name}`;
          heroImageUrl = await fileService.uploadImage(file, fileName);
          console.log('Hero image uploaded successfully:', heroImageUrl);
        } catch (uploadError) {
          console.error('Error uploading hero image:', uploadError);
          alert('Error uploading hero image. Please try again.');
          return;
        }
      }

      // Update the homepage settings with the new hero image
      const updatedSettings = {
        ...homepageSettings,
        hero_image_url: heroImageUrl
      };

      await homepageSettingsService.update(homepageSettings.id, updatedSettings);
      setShowHeroImageUploadModal(false);
      setHeroImagePreview(null);
      await fetchHomepageSettings();
      alert('Hero image updated successfully!');
    } catch (error) {
      console.error('Error updating hero image:', error);
      alert('Error updating hero image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const saveNewOrder = async () => {
    setReorderLoading(true);
    try {
      const productIds = products.map(product => product.id);
      await productService.reorderProducts(productIds);
      await fetchProducts();
      setIsReordering(false);
      alert('Product order saved successfully!');
    } catch (error) {
      console.error('Error saving product order:', error);
      alert('Error saving product order. Please try again.');
    } finally {
      setReorderLoading(false);
    }
  };

  const cancelReordering = () => {
    setIsReordering(false);
    fetchProducts(); // Reset to original order
  };

  const SortableProduct = ({ product }: { product: Product }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: product.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm"
      >
        <div className="flex items-center space-x-4">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
          <img
            src={product.image_url || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-16 h-16 object-cover rounded"
          />
            <div>
            <h3 className="font-medium text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500">₹{product.price}</p>
            <p className="text-xs text-gray-400">Sort Order: {product.sort_order || 0}</p>
            </div>
          </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {product.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    );
  };

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
            </div>
          </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
              <button
                onClick={goToHomepage}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center transition-colors duration-200"
              >
                <Home className="h-4 w-4 mr-2" />
                View Homepage
              </button>
            </div>
          </div>
          </div>
        </div>
        
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="h-5 w-5 inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="h-5 w-5 inline mr-2" />
                Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ShoppingCart className="h-5 w-5 inline mr-2" />
                Orders
              </button>
              <button
                onClick={() => setActiveTab('homepage')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'homepage'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="h-5 w-5 inline mr-2" />
                Homepage Settings
              </button>
            </nav>
            </div>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'homepage' && <HomepageSettingsTab />}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={productFormData.name}
                    onChange={(e) => setProductFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
        </div>
                    <div>
                  <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                  <input
                    type="number"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                    </div>
                    <div>
                  <label className="block text-sm font-medium text-gray-700">Weight</label>
                  <input
                    type="text"
                    value={productFormData.weight}
                    onChange={(e) => setProductFormData(prev => ({ ...prev, weight: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                    </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={productFormData.description}
                    onChange={(e) => setProductFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    value={productFormData.stock}
                    onChange={(e) => setProductFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productFormData.is_bestseller}
                      onChange={(e) => setProductFormData(prev => ({ ...prev, is_bestseller: e.target.checked }))}
                      className="mr-2"
                    />
                    Best Seller
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productFormData.is_new}
                      onChange={(e) => setProductFormData(prev => ({ ...prev, is_new: e.target.checked }))}
                      className="mr-2"
                    />
                    New
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productFormData.is_active}
                      onChange={(e) => setProductFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="mr-2"
                    />
                    Active
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Image</label>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer"
                  >
                    {imagePreview ? (
                      <div className="relative">
                        <img src={(imagePreview ?? '') as string} alt="Preview" className="max-w-full h-auto" />
                    <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                          ✕
                    </button>
        </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="product-image"
                        />
                        <label htmlFor="product-image" className="cursor-pointer text-blue-600 hover:underline">
                          Click to upload or drag and drop an image here
                        </label>
      </div>
                    )}
    </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {editingProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Homepage Settings Modal */}
      {showHomepageSettingsModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Homepage Settings</h3>
              <form onSubmit={handleHomepageSettingsSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                  <input
                    type="text"
                    value={homepageSettingsFormData.brand_name ?? ''}
                    onChange={(e) => setHomepageSettingsFormData(prev => ({ ...prev, brand_name: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
      </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700">Tagline</label>
                  <textarea
                    value={homepageSettingsFormData.tagline ?? ''}
                    onChange={(e) => setHomepageSettingsFormData(prev => ({ ...prev, tagline: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows={3}
                    required
                  />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700">Order Deadline Text</label>
                  <input
                    type="text"
                    value={homepageSettingsFormData.order_deadline_text ?? ''}
                    onChange={(e) => setHomepageSettingsFormData(prev => ({ ...prev, order_deadline_text: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                  </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delivery Info Text</label>
                  <input
                    type="text"
                    value={homepageSettingsFormData.delivery_info_text ?? ''}
                    onChange={(e) => setHomepageSettingsFormData(prev => ({ ...prev, delivery_info_text: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                  </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Menu Section Title</label>
                  <input
                    type="text"
                    value={homepageSettingsFormData.menu_title ?? ''}
                    onChange={(e) => setHomepageSettingsFormData(prev => ({ ...prev, menu_title: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Serviceable Pincodes</label>
                  <textarea
                    value={homepageSettingsFormData.serviceable_pincodes ?? ''}
                    onChange={(e) => setHomepageSettingsFormData(prev => ({ ...prev, serviceable_pincodes: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows={3}
                    placeholder="Enter pincodes separated by commas (e.g., 110001, 110002, 110003)"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter pincodes separated by commas where you deliver</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hero Image</label>
                  <div
                    onDragOver={handleHeroImageDragOver}
                    onDrop={handleHeroImageDrop}
                    className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer"
                  >
                    {heroImagePreview ? (
                      <div className="relative">
                        <img src={(heroImagePreview ?? '') as string} alt="Preview" className="max-w-full h-auto" />
                  <button
                          type="button"
                          onClick={removeHeroImage}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                          ✕
                  </button>
      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          id="hero-image"
                          accept="image/*"
                          onChange={handleHeroImageUpload}
                          className="hidden"
                        />
                        <label htmlFor="hero-image" className="cursor-pointer text-blue-600 hover:underline">
                          Click to upload or drag and drop a hero image here
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowHomepageSettingsModal(false)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function OverviewTab() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900">Total Products</h3>
            <p className="text-3xl font-bold text-blue-600">{products.length}</p>
            <p className="text-sm text-blue-700">{products.filter(p => p.is_active).length} active</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-green-900">Total Orders</h3>
            <p className="text-3xl font-bold text-green-600">{orders.length}</p>
            <p className="text-sm text-green-700">{orders.filter(o => o.status === 'pending').length} pending</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-purple-900">Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">
              ₹{orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}
            </p>
            <p className="text-sm text-purple-700">Total earnings</p>
          </div>
        </div>
      </div>
    );
  }

  function ProductsTab() {
    return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          <div className="flex space-x-2">
            {!isReordering && (
              <button
                onClick={() => setIsReordering(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
              >
                <GripVertical className="h-4 w-4 mr-2" />
                Reorder Products
              </button>
            )}
            {isReordering && (
              <>
                <button
                  onClick={saveNewOrder}
                  disabled={reorderLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  {reorderLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Order
                </button>
                <button
                  onClick={cancelReordering}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </>
            )}
        <button
          onClick={() => openProductModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
          </div>
      </div>
      
        {isReordering ? (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800">
                <strong>Instructions:</strong> Drag and drop products to reorder them. The order will be saved when you click "Save Order".
              </p>
        </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={products.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {products.map((product) => (
                    <SortableProduct key={product.id} product={product} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
              <div key={product.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <img
                  src={product.image_url || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              <div className="p-4">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.description}</p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">₹{product.price}</p>
                  <p className="text-sm text-gray-500">Weight: {product.weight}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                  <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-1">
                      {product.is_bestseller && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Best Seller</span>
                      )}
                      {product.is_new && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">New</span>
                      )}
                  </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                  <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => openProductModal(product)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
                  >
                      <Edit className="h-4 w-4 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleProductStatus(product.id)}
                      className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 text-sm"
                    >
                      {product.is_active ? <EyeOff className="h-4 w-4 inline mr-1" /> : <Eye className="h-4 w-4 inline mr-1" />}
                    {product.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 text-sm"
                  >
                      <Trash2 className="h-4 w-4 inline mr-1" />
                      Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  }

  function OrdersTab() {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.order_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.items?.length || 0} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusDisplayName(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="out_for_delivery">Ready</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function HomepageSettingsTab() {
    return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Homepage Settings</h2>
        <button
          onClick={openHomepageSettingsModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
            <Settings className="h-4 w-4 mr-2" />
          Edit Settings
        </button>
      </div>
      
        {homepageSettings ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Settings</h3>
            <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                  <p className="mt-1 text-sm text-gray-900">{homepageSettings.brand_name}</p>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Tagline</label>
                  <p className="mt-1 text-sm text-gray-900">{homepageSettings.tagline}</p>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Menu Title</label>
                  <p className="mt-1 text-sm text-gray-900">{homepageSettings.menu_title}</p>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Order Deadline</label>
                  <p className="mt-1 text-sm text-gray-900">{homepageSettings.order_deadline_text}</p>
              </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delivery Info</label>
                  <p className="mt-1 text-sm text-gray-900">{homepageSettings.delivery_info_text}</p>
            </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Serviceable Pincodes</label>
                  <p className="mt-1 text-sm text-gray-900">{homepageSettings.serviceable_pincodes}</p>
          </div>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Image</h3>
            {homepageSettings.hero_image_url ? (
                <div className="space-y-4">
                <img 
                  src={homepageSettings.hero_image_url} 
                  alt="Hero" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                  <div className="flex space-x-2">
                    <button
                      onClick={openHeroImageUploadModal}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Change Image
                    </button>
                    <button
                      onClick={handleRemoveHeroImage}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
              </div>
            ) : (
                <div className="space-y-4">
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No hero image set</p>
                  </div>
                  <button
                    onClick={openHeroImageUploadModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                  >
                    Upload Hero Image
                  </button>
              </div>
            )}
          </div>
        </div>
      ) : (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Homepage Settings Found</h3>
            <p className="text-gray-500 mb-4">Click "Edit Settings" to create your first homepage configuration.</p>
            <button
              onClick={openHomepageSettingsModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create Settings
            </button>
        </div>
      )}
    </div>
  );
  }

  // Hero Image Upload Modal
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Upload Modal */}
      {showHeroImageUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Upload Hero Image</h3>
              <button
                onClick={() => {
                  setShowHeroImageUploadModal(false);
                  setHeroImagePreview(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleHeroImageUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
                <div
                  onDragOver={handleHeroImageDragOver}
                  onDrop={handleHeroImageDrop}
                  className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer"
                >
                  {heroImagePreview ? (
                    <div className="relative">
                      <img src={(heroImagePreview ?? '') as string} alt="Preview" className="max-w-full h-auto" />
              <button
                        type="button"
                        onClick={removeHeroImage}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        ✕
              </button>
        </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        id="hero-image-upload"
                        accept="image/*"
                        onChange={handleHeroImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="hero-image-upload" className="cursor-pointer text-blue-600 hover:underline">
                        Click to upload or drag and drop a hero image here
                      </label>
          </div>
        )}
                </div>
      </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowHeroImageUploadModal(false);
                    setHeroImagePreview(null);
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !heroImagePreview}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </form>
            </div>
                </div>
      )}

      {/* Main Dashboard Content */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              </div>
              <button
                onClick={goToHomepage}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center transition-colors duration-200"
              >
                <Home className="h-4 w-4 mr-2" />
                View Homepage
              </button>
                      </div>
                    </div>
                </div>
              </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="h-5 w-5 inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="h-5 w-5 inline mr-2" />
                Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ShoppingCart className="h-5 w-5 inline mr-2" />
                Orders
              </button>
              <button
                onClick={() => setActiveTab('homepage')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'homepage'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="h-5 w-5 inline mr-2" />
                Homepage Settings
              </button>
            </nav>
                </div>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'homepage' && <HomepageSettingsTab />}
              </div>
            </div>
          </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={productFormData.name}
                  onChange={(e) => setProductFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                <input
                  type="number"
                  value={productFormData.price}
                    onChange={(e) => setProductFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Weight</label>
                <input
                  type="text"
                  value={productFormData.weight}
                  onChange={(e) => setProductFormData(prev => ({ ...prev, weight: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={productFormData.description}
                  onChange={(e) => setProductFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows={3}
                    required
                />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  value={productFormData.stock}
                    onChange={(e) => setProductFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={productFormData.is_bestseller}
                  onChange={(e) => setProductFormData(prev => ({ ...prev, is_bestseller: e.target.checked }))}
                      className="mr-2"
                    />
                    Best Seller
                  </label>
                  <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={productFormData.is_new}
                  onChange={(e) => setProductFormData(prev => ({ ...prev, is_new: e.target.checked }))}
                      className="mr-2"
                    />
                    New
                  </label>
                  <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={productFormData.is_active}
                  onChange={(e) => setProductFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="mr-2"
                />
                    Active
                  </label>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Product Image</label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer"
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img src={(imagePreview ?? '') as string} alt="Preview" className="max-w-full h-auto" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                          id="product-image"
                      />
                      <label htmlFor="product-image" className="cursor-pointer text-blue-600 hover:underline">
                        Click to upload or drag and drop an image here
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                    {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}

      {/* Homepage Settings Modal */}
      {showHomepageSettingsModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Homepage Settings</h3>
              <form onSubmit={handleHomepageSettingsSubmit} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                <input
                  type="text"
                  value={homepageSettingsFormData.brand_name ?? ''}
                  onChange={(e) => setHomepageSettingsFormData(prev => ({ ...prev, brand_name: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Tagline</label>
                <textarea
                  value={homepageSettingsFormData.tagline ?? ''}
                  onChange={(e) => setHomepageSettingsFormData(prev => ({ ...prev, tagline: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows={3}
                  required
                />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Order Deadline Text</label>
                <input
                  type="text"
                  value={homepageSettingsFormData.order_deadline_text ?? ''}
                  onChange={(e) => setHomepageSettingsFormData(prev => ({ ...prev, order_deadline_text: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Delivery Info Text</label>
                <input
                  type="text"
                  value={homepageSettingsFormData.delivery_info_text ?? ''}
                  onChange={(e) => setHomepageSettingsFormData(prev => ({ ...prev, delivery_info_text: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Menu Section Title</label>
                  <input
                    type="text"
                    value={homepageSettingsFormData.menu_title ?? ''}
                    onChange={(e) => setHomepageSettingsFormData(prev => ({ ...prev, menu_title: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Serviceable Pincodes</label>
                  <textarea
                    value={homepageSettingsFormData.serviceable_pincodes ?? ''}
                    onChange={(e) => setHomepageSettingsFormData(prev => ({ ...prev, serviceable_pincodes: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows={3}
                    placeholder="Enter pincodes separated by commas (e.g., 110001, 110002, 110003)"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter pincodes separated by commas where you deliver</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hero Image</label>
                <div
                  onDragOver={handleHeroImageDragOver}
                  onDrop={handleHeroImageDrop}
                  className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer"
                >
                  {heroImagePreview ? (
                    <div className="relative">
                      <img src={(heroImagePreview ?? '') as string} alt="Preview" className="max-w-full h-auto" />
                      <button
                        type="button"
                        onClick={removeHeroImage}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        id="hero-image"
                        accept="image/*"
                        onChange={handleHeroImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="hero-image" className="cursor-pointer text-blue-600 hover:underline">
                        Click to upload or drag and drop a hero image here
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowHomepageSettingsModal(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Save Settings
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;