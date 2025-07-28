import { useState, useCallback } from 'react';
import { PincodeInput } from './components/PincodeInput';
import { PincodeValidationResult } from './services/pincode';

const TestPincodeSimple = () => {
  const [pincode, setPincode] = useState('');
  const [validationResult, setValidationResult] = useState<PincodeValidationResult | null>(null);

  // Use useCallback to prevent infinite loops
  const handleValidationChange = useCallback((result: PincodeValidationResult) => {
    console.log('Validation result received:', result);
    setValidationResult(result);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Simple Pincode Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <label className="block text-sm font-medium mb-2">Enter Pincode:</label>
          <PincodeInput
            value={pincode}
            onChange={setPincode}
            onValidationChange={handleValidationChange}
            placeholder="Enter pincode"
            className="mb-4"
          />
          
          {validationResult && (
            <div className={`p-3 rounded border ${
              validationResult.isValid && validationResult.isServiceable 
                ? 'bg-green-50 border-green-200 text-green-800'
                : validationResult.isValid && !validationResult.isServiceable
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <p><strong>Valid:</strong> {validationResult.isValid ? 'Yes' : 'No'}</p>
              <p><strong>Serviceable:</strong> {validationResult.isServiceable ? 'Yes' : 'No'}</p>
              <p><strong>Message:</strong> {validationResult.message}</p>
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Current pincode: {pincode || 'None'}</p>
            <p>Validation state: {validationResult ? 'Complete' : 'Pending'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPincodeSimple; 