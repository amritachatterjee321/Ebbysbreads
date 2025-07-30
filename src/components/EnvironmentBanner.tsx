import React from 'react';
import { getEnvironmentName, isDevelopment, isStaging, isTest } from '../lib/environment';

const EnvironmentBanner: React.FC = () => {
  const envName = getEnvironmentName();
  
  // Debug logging
  console.log('EnvironmentBanner Debug:', {
    envName,
    isDevelopment: isDevelopment(),
    isStaging: isStaging(),
    isTest: isTest(),
    shouldShow: !(isDevelopment() && !isStaging() && !isTest())
  });
  
  // Don't show banner in production
  if (isDevelopment() && !isStaging() && !isTest()) {
    console.log('EnvironmentBanner: Not showing (development mode)');
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

  console.log('EnvironmentBanner: Showing banner for', envName);

  return (
    <div className={`${getBannerStyle()} px-4 py-2 text-center text-sm font-medium`}>
      <span className="mr-2">{getIcon()}</span>
      {envName} Environment - This is not production data
    </div>
  );
};

export default EnvironmentBanner; 