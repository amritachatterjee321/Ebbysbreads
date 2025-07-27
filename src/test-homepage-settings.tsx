import React, { useState, useEffect } from 'react';
import { homepageSettingsService } from './services/database';

const TestHomepageSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing database connection...');
      const data = await homepageSettingsService.get();
      console.log('Database response:', data);
      setSettings(data);
      
      if (data) {
        alert(`✅ Database connected successfully!\n\nFound settings for: ${data.brand_name}\nMenu title: ${data.menu_title}\nTagline: ${data.tagline}`);
      } else {
        alert('⚠️ Database connected but no settings found');
      }
    } catch (err) {
      console.error('Database connection error:', err);
      setError(err.message);
      alert(`❌ Database connection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkTableExists = async () => {
    try {
      const exists = await homepageSettingsService.checkTableExists();
      alert(`Table exists: ${exists}`);
    } catch (err) {
      alert(`Error checking table: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Database Connection</h2>
          
          <div className="space-y-4">
            <button
              onClick={testConnection}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Database Connection'}
            </button>
            
            <button
              onClick={checkTableExists}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
            >
              Check if Table Exists
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 font-medium">Error:</p>
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {settings && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Basic Info</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Brand Name:</span>
                    <p className="font-medium">{settings.brand_name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Menu Title:</span>
                    <p className="font-medium">{settings.menu_title}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Tagline:</span>
                    <p className="text-sm">{settings.tagline}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Delivery Info</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Order Deadline:</span>
                    <p className="text-sm">{settings.order_deadline_text}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Delivery Info:</span>
                    <p className="text-sm">{settings.delivery_info_text}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Serviceable Pincodes:</span>
                    <p className="text-sm">{settings.serviceable_pincodes}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {settings.hero_image_url && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">Hero Image</h3>
                <img 
                  src={settings.hero_image_url} 
                  alt="Hero" 
                  className="w-full max-w-md h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestHomepageSettings; 