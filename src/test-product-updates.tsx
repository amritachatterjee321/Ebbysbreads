import { useState, useEffect } from 'react';
import { productService } from './services/database';
import type { Database } from './lib/supabase';

type Product = Database['public']['Tables']['products']['Row'];

const TestProductUpdates = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      addResult('Fetching products from database...');
      const data = await productService.getAll();
      setProducts(data);
      addResult(`Found ${data.length} products`);
      if (data.length > 0) {
        setSelectedProduct(data[0]);
        addResult(`Selected product: ${data[0].name} (ID: ${data[0].id})`);
      }
    } catch (error) {
      addResult(`Error fetching products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testProductUpdate = async () => {
    if (!selectedProduct) {
      addResult('No product selected for testing');
      return;
    }

    try {
      setLoading(true);
      addResult(`Testing update for product: ${selectedProduct.name}`);
      
      // Test 1: Update product name
      const originalName = selectedProduct.name;
      const testName = `Test Update ${Date.now()}`;
      
      addResult(`Updating product name from "${originalName}" to "${testName}"`);
      const updatedProduct = await productService.update(selectedProduct.id, {
        name: testName
      });
      
      addResult(`✅ Product updated successfully. New name: ${updatedProduct.name}`);
      
      // Test 2: Verify the update by fetching the product again
      addResult('Verifying update by fetching product again...');
      const fetchedProduct = await productService.getById(selectedProduct.id);
      
      if (fetchedProduct && fetchedProduct.name === testName) {
        addResult('✅ Verification successful - product name was saved correctly');
      } else {
        addResult('❌ Verification failed - product name was not saved correctly');
      }
      
      // Test 3: Revert the change
      addResult(`Reverting product name back to "${originalName}"`);
      const revertedProduct = await productService.update(selectedProduct.id, {
        name: originalName
      });
      
      addResult(`✅ Product reverted successfully. Name: ${revertedProduct.name}`);
      
      // Test 4: Update multiple fields
      addResult('Testing multiple field updates...');
      const multiUpdate = await productService.update(selectedProduct.id, {
        price: selectedProduct.price + 1,
        description: `Updated description ${Date.now()}`,
        is_bestseller: !selectedProduct.is_bestseller
      });
      
      addResult(`✅ Multiple fields updated successfully:`);
      addResult(`   - Price: ${selectedProduct.price} → ${multiUpdate.price}`);
      addResult(`   - Description: ${multiUpdate.description.substring(0, 50)}...`);
      addResult(`   - Best seller: ${selectedProduct.is_bestseller} → ${multiUpdate.is_bestseller}`);
      
      // Test 5: Verify all changes
      addResult('Verifying all changes...');
      const finalProduct = await productService.getById(selectedProduct.id);
      
      if (finalProduct) {
        addResult('✅ All updates verified successfully');
        setSelectedProduct(finalProduct);
      } else {
        addResult('❌ Failed to verify final product state');
      }
      
    } catch (error) {
      addResult(`❌ Error during product update test: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testProductToggle = async () => {
    if (!selectedProduct) {
      addResult('No product selected for testing');
      return;
    }

    try {
      setLoading(true);
      addResult(`Testing product toggle for: ${selectedProduct.name}`);
      
      const originalStatus = selectedProduct.is_active;
      addResult(`Current status: ${originalStatus ? 'Active' : 'Inactive'}`);
      
      const toggledProduct = await productService.toggleActive(selectedProduct.id);
      addResult(`✅ Product toggled successfully. New status: ${toggledProduct.is_active ? 'Active' : 'Inactive'}`);
      
      // Verify the toggle
      const verifiedProduct = await productService.getById(selectedProduct.id);
      if (verifiedProduct && verifiedProduct.is_active !== originalStatus) {
        addResult('✅ Toggle verification successful');
        setSelectedProduct(verifiedProduct);
      } else {
        addResult('❌ Toggle verification failed');
      }
      
    } catch (error) {
      addResult(`❌ Error during product toggle test: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Product Update Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Test Controls</h2>
            
            <div className="space-y-3">
              <button
                onClick={fetchProducts}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh Products'}
              </button>
              
              <button
                onClick={testProductUpdate}
                disabled={loading || !selectedProduct}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Test Product Update
              </button>
              
              <button
                onClick={testProductToggle}
                disabled={loading || !selectedProduct}
                className="w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
              >
                Test Product Toggle
              </button>
              
              <button
                onClick={clearResults}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Clear Results
              </button>
            </div>
          </div>
          
          {/* Product Selection */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">Select Product</h3>
            <select
              value={selectedProduct?.id || ''}
              onChange={(e) => {
                const product = products.find(p => p.id === parseInt(e.target.value));
                setSelectedProduct(product || null);
              }}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select a product...</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} (ID: {product.id})
                </option>
              ))}
            </select>
            
            {selectedProduct && (
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <h4 className="font-semibold">Selected Product:</h4>
                <p><strong>Name:</strong> {selectedProduct.name}</p>
                <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
                <p><strong>Status:</strong> {selectedProduct.is_active ? 'Active' : 'Inactive'}</p>
                <p><strong>Best Seller:</strong> {selectedProduct.is_bestseller ? 'Yes' : 'No'}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Results */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Test Results</h2>
          <div className="h-96 overflow-y-auto bg-gray-50 p-3 rounded">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No test results yet. Run a test to see results here.</p>
            ) : (
              <div className="space-y-1">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestProductUpdates; 