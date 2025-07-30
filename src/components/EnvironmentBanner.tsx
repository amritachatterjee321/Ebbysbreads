import React from 'react';
import { getEnvironmentName, isDevelopment, isStaging, isTest } from '../lib/environment';

const EnvironmentBanner: React.FC = () => {
  const envName = getEnvironmentName();
  
  // Don't show banner in production
  if (isDevelopment() && !isStaging() && !isTest()) {
    return null;
  }

  const getBannerStyle = () => {
    if (isStaging()) {
      return 'bg-yellow-500 text-yellow-900';
    }
    if (isTest()) {
      return 'bg-red-500 text-white';
    }
    return 'bg-gray-500 text-white';
  };

  const getIcon = () => {
    if (isStaging()) return '🚧';
    if (isTest()) return '🧪';
    return '⚙️';
  };

  return (
    <div className={`${getBannerStyle()} px-4 py-2 text-center text-sm font-medium`}>
      <span className="mr-2">{getIcon()}</span>
      {envName} Environment - This is not production data
    </div>
  );
};

export default EnvironmentBanner; 