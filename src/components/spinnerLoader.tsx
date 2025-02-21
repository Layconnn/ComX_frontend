import React from 'react';

interface SpinnerLoaderProps {
  className?: string;
}

const SpinnerLoader: React.FC<SpinnerLoaderProps> = ({ className = '' }) => {
  return (
    <div
      className={`
        inline-block 
        rounded-full 
        animate-spin 
        border-[#D71E0E] 
        border-b-transparent 
        w-4 h-4 border-2 
        md:w-5 md:h-5 md:border-4 
        ${className}
      `}
    ></div>
  );
};

export default SpinnerLoader;
