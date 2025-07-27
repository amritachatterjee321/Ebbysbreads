import React, { useState, useEffect } from 'react';
import { homepageSettingsService } from './services/database';
import { Home, Edit, Save, Loader2, CheckCircle } from 'lucide-react';
import type { Database } from './lib/supabase';

type HomepageSettings = Database['public']['Tables']['homepage_settings']['Row'];

const SimpleHomepageSettings = () => {
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    brand_name: '',
    hero_image_url: '',
    tagline: '',
    order_deadline_text: '',
    delivery_info_text: '',
    menu_title: '',
    serviceable_pincodes: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await homepageSettingsService.get();
      setSettings(data);
      if (data) {
        setFormData({
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
      console.error('Error fetching settings:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error loading settings: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      console.log('Starting save process...');
      
      // Trim whitespace and validate
      const cleanedData = {
        brand_name: formData.brand_name.trim(),
        hero_image_url: formData.hero_image_url.trim(),
        tagline: formData.tagline.trim(),
        order_deadline_text: formData.order_deadline_text.trim(),
        delivery_info_text: formData.delivery_info_text.trim(),
        menu_title: formData.menu_title.trim(),
        serviceable_pincodes: formData.serviceable_pincodes.trim()
      };

      console.log('Cleaned data:', cleanedData);

      // Validate required fields
      if (!cleanedData.brand_name || !cleanedData.tagline) {
        alert('Brand name and tagline are required');
        return;
      }

      if (settings) {
        console.log('Updating existing settings with ID:', settings.id);
        // Update existing settings
        const updatedSettings = await homepageSettingsService.update(settings.id, cleanedData);
        console.log('Settings updated successfully:', updatedSettings);
      } else {
        console.log('Creating new settings');
        // Create new settings
        const newSettings = await homepageSettingsService.create(cleanedData);
        console.log('Settings created successfully:', newSettings);
      }

      alert('✅ Settings saved successfully!');
      setEditing(false);
      await fetchSettings(); // Refresh the data
    } catch (error) {
      console.error('Error saving settings:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`❌ Error saving settings: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading homepage settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Homepage Settings</h1>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              {editing ? 'Cancel Edit' : 'Edit Settings'}
            </button>
          </div>
        </div>

        {/* Settings Form/Display */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Homepage Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    value={formData.brand_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand_name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Menu Section Title
                  </label>
                  <input
                    type="text"
                    value={formData.menu_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, menu_title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline *
                  </label>
                  <textarea
                    value={formData.tagline}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Deadline Text
                  </label>
                  <input
                    type="text"
                    value={formData.order_deadline_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, order_deadline_text: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Info Text
                  </label>
                  <input
                    type="text"
                    value={formData.delivery_info_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, delivery_info_text: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.hero_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, hero_image_url: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serviceable Pincodes
                  </label>
                  <textarea
                    value={formData.serviceable_pincodes}
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceable_pincodes: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="110001, 110002, 110003"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter pincodes separated by commas</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Settings
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Settings</h2>
              
              {settings ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Brand Name</label>
                      <p className="text-lg font-semibold text-gray-900">{settings.brand_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Menu Title</label>
                      <p className="text-gray-700">{settings.menu_title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tagline</label>
                      <p className="text-gray-700">{settings.tagline}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Order Deadline</label>
                      <p className="text-gray-700">{settings.order_deadline_text}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Delivery Info</label>
                      <p className="text-gray-700">{settings.delivery_info_text}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Serviceable Pincodes</label>
                      <p className="text-gray-700">{settings.serviceable_pincodes}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Hero Image</label>
                    {settings.hero_image_url ? (
                      <div className="mt-2">
                        <img 
                          src={settings.hero_image_url} 
                          alt="Hero" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="mt-2 w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">No hero image set</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No homepage settings found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleHomepageSettings; 