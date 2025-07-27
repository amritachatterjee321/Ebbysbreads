import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import { productService } from './services/database';

const TestStorage = () => {
  const [status, setStatus] = useState('Ready to test storage...');
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  const testDatabase = async () => {
    try {
      setStatus('Testing Supabase database connection...');
      setError(null);
      setDebugInfo([]);
      
      addDebugInfo('Starting database test...');
      
      // Test 1: Check if Supabase client is configured
      addDebugInfo('Checking Supabase client configuration...');
      if (!supabase) {
        throw new Error('Supabase client is not configured');
      }
      
      // Test 2: Fetch all products
      addDebugInfo('Fetching all products...');
      const allProducts = await productService.getAll();
      addDebugInfo(`Found ${allProducts.length} total products`);
      
      // Test 3: Fetch active products
      addDebugInfo('Fetching active products...');
      const activeProducts = await productService.getActive();
      addDebugInfo(`Found ${activeProducts.length} active products`);
      
      if (activeProducts.length > 0) {
        addDebugInfo(`First active product: ${activeProducts[0].name} (ID: ${activeProducts[0].id})`);
      }
      
      setStatus('✅ Database connection working!');
      setError(null);
      
    } catch (err: any) {
      setStatus('❌ Database test failed');
      setError(err.message);
      addDebugInfo(`Error: ${err.message}`);
      console.error('Database test error:', err);
    }
  };

  const testProductUpdate = async () => {
    try {
      setStatus('Testing product update...');
      setError(null);
      setDebugInfo([]);
      
      addDebugInfo('Starting product update test...');
      
      // Get first active product
      const activeProducts = await productService.getActive();
      if (activeProducts.length === 0) {
        throw new Error('No active products found to test update');
      }
      
      const testProduct = activeProducts[0];
      addDebugInfo(`Testing update on product: ${testProduct.name} (ID: ${testProduct.id})`);
      
      // Update the product description
      const originalDescription = testProduct.description;
      const newDescription = `Test update - ${new Date().toLocaleTimeString()}`;
      
      addDebugInfo(`Original description: ${originalDescription}`);
      addDebugInfo(`New description: ${newDescription}`);
      
      const updatedProduct = await productService.update(testProduct.id, {
        description: newDescription
      });
      
      addDebugInfo(`Product updated successfully: ${updatedProduct.description}`);
      
      // Verify the update by fetching again
      const verifyProduct = await productService.getById(testProduct.id);
      addDebugInfo(`Verification - fetched description: ${verifyProduct?.description}`);
      
      // Revert the change
      await productService.update(testProduct.id, {
        description: originalDescription
      });
      addDebugInfo('Reverted description back to original');
      
      setStatus('✅ Product update test successful!');
      setError(null);
      
    } catch (err: any) {
      setStatus('❌ Product update test failed');
      setError(err.message);
      addDebugInfo(`Error: ${err.message}`);
      console.error('Product update test error:', err);
    }
  };

  const testStorage = async () => {
    try {
      setStatus('Testing Supabase storage connection...');
      setError(null);
      setDebugInfo([]);
      
      addDebugInfo('Starting storage test...');
      
      // Test 1: Check if Supabase client is configured
      addDebugInfo('Checking Supabase client configuration...');
      if (!supabase) {
        throw new Error('Supabase client is not configured');
      }
      
      // Test 2: List all buckets
      addDebugInfo('Listing all storage buckets...');
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        addDebugInfo(`Bucket list error: ${bucketError.message}`);
        throw new Error(`Bucket list error: ${bucketError.message}`);
      }
      
      addDebugInfo(`Found ${buckets?.length || 0} buckets`);
      if (buckets) {
        buckets.forEach(bucket => {
          addDebugInfo(`- Bucket: ${bucket.name} (public: ${bucket.public})`);
        });
      }
      
      // Test 3: Check for product-images bucket
      const productImagesBucket = buckets?.find(bucket => bucket.name === 'product-images');
      if (!productImagesBucket) {
        addDebugInfo('product-images bucket not found');
        throw new Error('product-images bucket not found. Please create it in Supabase dashboard.');
      }
      
      addDebugInfo('product-images bucket found!');
      setStatus('✅ Storage bucket found! Testing upload...');
      
      // Test 4: Test file upload
      addDebugInfo('Testing file upload...');
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const fileName = `test-${Date.now()}.txt`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, testFile);
        
      if (uploadError) {
        addDebugInfo(`Upload error: ${uploadError.message}`);
        throw new Error(`Upload error: ${uploadError.message}`);
      }
      
      addDebugInfo('File upload successful!');
      setStatus('✅ Upload successful! Testing public URL...');
      
      // Test 5: Test public URL generation
      addDebugInfo('Testing public URL generation...');
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
        
      if (urlData.publicUrl) {
        addDebugInfo(`Public URL generated: ${urlData.publicUrl}`);
        setStatus('✅ Storage is working perfectly!');
        setError(null);
      } else {
        addDebugInfo('Could not generate public URL');
        throw new Error('Could not get public URL');
      }
      
      // Test 6: Clean up test file
      addDebugInfo('Cleaning up test file...');
      await supabase.storage
        .from('product-images')
        .remove([fileName]);
      addDebugInfo('Test file cleaned up successfully');
      
    } catch (err: any) {
      setStatus('❌ Storage test failed');
      setError(err.message);
      addDebugInfo(`Error: ${err.message}`);
      console.error('Storage test error:', err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Supabase Database & Storage Test</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p className="font-medium">Status: {status}</p>
        {error && (
          <div className="mt-2 p-3 bg-red-100 border border-red-300 rounded">
            <p className="text-red-800 font-medium">Error:</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>
      
      <div className="flex space-x-4 mb-4">
        <button
          onClick={testDatabase}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Test Database Connection
        </button>
        <button
          onClick={testProductUpdate}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Test Product Update
        </button>
        <button
          onClick={testStorage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Test Storage Connection
        </button>
      </div>
      
      {debugInfo.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
          <h3 className="font-medium mb-2">Debug Information:</h3>
          <div className="text-sm text-gray-700 max-h-60 overflow-y-auto">
            {debugInfo.map((info, index) => (
              <div key={index} className="mb-1 font-mono">{info}</div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-600">
        <p className="font-medium">This test will:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Check if product-images bucket exists</li>
          <li>Test file upload functionality</li>
          <li>Test public URL generation</li>
          <li>Clean up test files</li>
        </ul>
      </div>
      
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-800 font-medium">If the test fails:</p>
        <ol className="list-decimal list-inside mt-2 text-sm text-yellow-700 space-y-1">
          <li>Create 'product-images' bucket in Supabase Storage</li>
          <li>Set bucket to public</li>
          <li>Add storage policies for upload and view</li>
          <li>Check your .env file has correct Supabase credentials</li>
        </ol>
      </div>
    </div>
  );
};

export default TestStorage; 