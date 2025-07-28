import { useState } from 'react';
import { PincodeInput } from './components/PincodeInput';
import { PincodeValidationResult } from './services/pincode';
import { pincodeService } from './services/pincode';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const TestPincode = () => {
  const [pincode, setPincode] = useState('');
  const [validationResult, setValidationResult] = useState<PincodeValidationResult | null>(null);
  const [serviceablePincodes, setServiceablePincodes] = useState<string[]>([]);

  const handleValidationChange = (result: PincodeValidationResult) => {
    setValidationResult(result);
  };

  const loadServiceablePincodes = async () => {
    try {
      const pincodes = await pincodeService.getServiceablePincodes();
      setServiceablePincodes(pincodes);
    } catch (error) {
      console.error('Error loading serviceable pincodes:', error);
    }
  };

  const testPincode = async (testPincode: string) => {
    try {
      const result = await pincodeService.validatePincode(testPincode);
      setPincode(testPincode);
      setValidationResult(result);
    } catch (error) {
      console.error('Error testing pincode:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Pincode Validation Test</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Pincode Input */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Test Pincode Input</h2>
              <PincodeInput
                value={pincode}
                onChange={setPincode}
                onValidationChange={handleValidationChange}
                placeholder="Enter pincode to test"
                className="w-full"
              />
              
              {validationResult && (
                <div className={`p-4 rounded-lg border ${
                  validationResult.isValid && validationResult.isServiceable 
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : validationResult.isValid && !validationResult.isServiceable
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <h3 className="font-semibold mb-2">Validation Result:</h3>
                  <p><strong>Valid Format:</strong> {validationResult.isValid ? '✅ Yes' : '❌ No'}</p>
                  <p><strong>Serviceable:</strong> {validationResult.isServiceable ? '✅ Yes' : '❌ No'}</p>
                  <p><strong>Message:</strong> {validationResult.message}</p>
                </div>
              )}
            </div>

            {/* Quick Test Buttons */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Quick Tests</h2>
              
              <div className="space-y-2">
                <button
                  onClick={() => testPincode('110001')}
                  className="w-full p-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
                >
                  Test: 110001 (Delhi - Likely Serviceable)
                </button>
                
                <button
                  onClick={() => testPincode('400001')}
                  className="w-full p-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
                >
                  Test: 400001 (Mumbai - Likely Serviceable)
                </button>
                
                <button
                  onClick={() => testPincode('700001')}
                  className="w-full p-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
                >
                  Test: 700001 (Kolkata - Likely Serviceable)
                </button>
                
                <button
                  onClick={() => testPincode('999999')}
                  className="w-full p-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                >
                  Test: 999999 (Invalid - Should fail)
                </button>
                
                <button
                  onClick={() => testPincode('12345')}
                  className="w-full p-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                >
                  Test: 12345 (Too short - Should fail)
                </button>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={loadServiceablePincodes}
                  className="w-full p-3 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors"
                >
                  Load Serviceable Pincodes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Serviceable Pincodes Display */}
        {serviceablePincodes.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Serviceable Pincodes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {serviceablePincodes.map((pincode, index) => (
                <div
                  key={index}
                  className="p-2 bg-green-100 text-green-800 rounded text-center text-sm font-mono"
                >
                  {pincode}
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-sm mt-4">
              Total: {serviceablePincodes.length} serviceable pincodes
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">How to Test</h3>
          <ul className="text-blue-700 space-y-2 text-sm">
            <li>• Enter a 6-digit pincode in the input field above</li>
            <li>• The validation will run automatically after 500ms of no typing</li>
            <li>• Click the search icon to manually trigger validation</li>
            <li>• Use the quick test buttons to try different scenarios</li>
            <li>• Check the "Serviceable Pincodes" section to see configured areas</li>
            <li>• Configure serviceable pincodes in the admin panel under Homepage Settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestPincode; 