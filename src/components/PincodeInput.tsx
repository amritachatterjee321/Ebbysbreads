import React, { useState, useEffect, useRef } from 'react';
import { Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { pincodeService, PincodeValidationResult } from '../services/pincode';

interface PincodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (result: PincodeValidationResult) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showValidationMessage?: boolean;
}

export const PincodeInput: React.FC<PincodeInputProps> = ({
  value,
  onChange,
  onValidationChange,
  placeholder = "Enter pincode",
  className = "",
  disabled = false,
  showValidationMessage = true
}) => {
  const [validationResult, setValidationResult] = useState<PincodeValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Use ref to store the callback to avoid dependency issues
  const callbackRef = useRef(onValidationChange);
  callbackRef.current = onValidationChange;

  // Debounced validation - only depends on value
  useEffect(() => {
    if (!value || value.length === 0) {
      setValidationResult(null);
      setIsValidating(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      if (value.length === 6) {
        setIsValidating(true);
        try {
          const result = await pincodeService.validatePincode(value);
          setValidationResult(result);
          // Call callback using ref to avoid dependency issues
          if (callbackRef.current) {
            callbackRef.current(result);
          }
        } catch (error) {
          console.error('Error validating pincode:', error);
          setValidationResult({
            isValid: false,
            message: 'Error validating pincode',
            isServiceable: false
          });
        } finally {
          setIsValidating(false);
        }
      } else if (value.length > 0) {
        // Basic format validation for partial input
        setIsValidating(false);
        const isValidFormat = /^[1-9][0-9]*$/.test(value);
        const partialResult = {
          isValid: isValidFormat,
          message: isValidFormat ? 'Continue entering pincode' : 'Please enter only numbers',
          isServiceable: false
        };
        setValidationResult(partialResult);
        // Call callback using ref to avoid dependency issues
        if (callbackRef.current) {
          callbackRef.current(partialResult);
        }
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [value]); // Only depend on value

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 6);
    onChange(newValue);
    setHasInteracted(true);
  };

  const handleSearchClick = async () => {
    if (value.length === 6) {
      setIsValidating(true);
      try {
        const result = await pincodeService.validatePincode(value);
        setValidationResult(result);
        if (callbackRef.current) {
          callbackRef.current(result);
        }
      } catch (error) {
        console.error('Error validating pincode:', error);
      } finally {
        setIsValidating(false);
      }
    }
  };

  const getBorderColor = () => {
    if (!hasInteracted) return 'border-orange-200';
    if (isValidating) return 'border-orange-400';
    if (!validationResult) return 'border-orange-200';
    if (validationResult.isValid && validationResult.isServiceable) return 'border-green-500';
    if (validationResult.isValid && !validationResult.isServiceable) return 'border-yellow-500';
    return 'border-red-500';
  };

  const getIcon = () => {
    if (isValidating) {
      return <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />;
    }
    if (!validationResult) {
      return <Search className="h-5 w-5 text-orange-500 cursor-pointer" onClick={handleSearchClick} />;
    }
    if (validationResult.isValid && validationResult.isServiceable) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (validationResult.isValid && !validationResult.isServiceable) {
      return <XCircle className="h-5 w-5 text-yellow-500" />;
    }
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`relative flex items-center border-2 rounded-md bg-white ${getBorderColor()} transition-colors duration-200`}>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 px-3 py-2 text-sm bg-transparent outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
          maxLength={6}
        />
        <div className="absolute right-3 flex items-center">
          {getIcon()}
        </div>
      </div>
      
      {showValidationMessage && validationResult && hasInteracted && (
        <div className={`mt-1 text-xs ${
          validationResult.isValid && validationResult.isServiceable 
            ? 'text-green-600' 
            : validationResult.isValid && !validationResult.isServiceable
            ? 'text-yellow-600'
            : 'text-red-600'
        }`}>
          {validationResult.message}
        </div>
      )}
    </div>
  );
}; 