import React, { useState } from 'react';
import { supabase } from './lib/supabase';

const TestStorage = () => {
  const [status, setStatus] = useState('Testing storage...');
  const [error, setError] = useState<string | null>(null);

  const testStorage = async () => {
    try {
      setStatus('Testing Supabase storage connection...');
      
      // Test 1: Check if bucket exists
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        throw new Error(`Bucket list error: ${bucketError.message}`);
      }
      
      const productImagesBucket = buckets?.find(bucket => bucket.name === 'product-images');
      
      if (!productImagesBucket) {
        throw new Error('product-images bucket not found. Please create it in Supabase dashboard.');
      }
      
      setStatus('✅ Storage bucket found! Testing upload...');
      
      // Test 2: Try to upload a small test file
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const fileName = `test-${Date.now()}.txt`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, testFile);
      
      if (uploadError) {
        throw new Error(`Upload error: ${uploadError.message}`);
      }
      
      setStatus('✅ Upload successful! Testing public URL...');
      
      // Test 3: Get public URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      if (urlData.publicUrl) {
        setStatus('✅ Storage is working perfectly!');
        setError(null);
      } else {
        throw new Error('Could not get public URL');
      }
      
      // Clean up test file
      await supabase.storage
        .from('product-images')
        .remove([fileName]);
        
    } catch (err: any) {
      setStatus('❌ Storage test failed');
      setError(err.message);
      console.error('Storage test error:', err);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Supabase Storage Test</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p className="font-medium">Status: {status}</p>
        {error && (
          <div className="mt-2 p-3 bg-red-100 border border-red-300 rounded">
            <p className="text-red-800 font-medium">Error:</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>
      
      <button
        onClick={testStorage}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Test Storage Connection
      </button>
      
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