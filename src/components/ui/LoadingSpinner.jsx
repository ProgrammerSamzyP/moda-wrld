import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`${sizeClasses[size]} border-2 border-gray-200 border-t-black rounded-full animate-spin`}
      />
      {text && <p className="mt-4 text-gray-500">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;