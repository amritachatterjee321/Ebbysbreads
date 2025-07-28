import { useState } from 'react';
import { homepageSettingsService } from './services/database';
import { Loader2, Save, CheckCircle, AlertCircle } from 'lucide-react';
import type { Database } from './lib/supabase';

type HomepageSettings = Database['public']['Tables']['homepage_settings']['Row'];

const TestHomepageSettings = () => {
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await homepageSettingsService.get();
      setSettings(data);
      setMessage('Settings fetched successfully');
      setMessageType('success');
    } catch (err: unknown) {
      console.error('Error fetching settings:', err);
      setMessage(err instanceof Error ? err.message : 'Unknown error occurred');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    try {
      setSaving(true);
      await homepageSettingsService.update(settings.id, {
        brand_name: settings.brand_name,
        hero_image_url: settings.hero_image_url,
        tagline: settings.tagline,
        order_deadline_text: settings.order_deadline_text,
        delivery_info_text: settings.delivery_info_text,
        menu_title: settings.menu_title ?? undefined,
        serviceable_pincodes: settings.serviceable_pincodes
      });
      setMessage('Settings saved successfully');
      setMessageType('success');
    } catch (err: unknown) {
      console.error('Error saving settings:', err);
      setMessage(err instanceof Error ? err.message : 'Unknown error occurred');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Test Homepage Settings</h1>
      
      <div className="space-y-4">
        <button
          onClick={fetchSettings}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Fetch Settings'}
        </button>

        {message && (
          <div className={`p-4 rounded-md ${
            messageType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex items-center">
              {messageType === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              {message}
            </div>
          </div>
        )}

        {settings && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Current Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                <input
                  type="text"
                  value={settings.brand_name}
                  onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Menu Title</label>
                <input
                  type="text"
                  value={settings.menu_title || ''}
                  onChange={(e) => setSettings({ ...settings, menu_title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Order Deadline Text</label>
                <input
                  type="text"
                  value={settings.order_deadline_text}
                  onChange={(e) => setSettings({ ...settings, order_deadline_text: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Delivery Info Text</label>
                <input
                  type="text"
                  value={settings.delivery_info_text}
                  onChange={(e) => setSettings({ ...settings, delivery_info_text: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Serviceable Pincodes</label>
                <input
                  type="text"
                  value={settings.serviceable_pincodes}
                  onChange={(e) => setSettings({ ...settings, serviceable_pincodes: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Hero Image URL</label>
                <input
                  type="text"
                  value={settings.hero_image_url || ''}
                  onChange={(e) => setSettings({ ...settings, hero_image_url: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
                {settings.hero_image_url && (
                  <img
                    src={settings.hero_image_url}
                    alt="Hero"
                    className="mt-2 max-w-xs h-auto rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={saveSettings}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestHomepageSettings; 