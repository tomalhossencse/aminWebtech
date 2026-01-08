import React, { useState } from 'react';
import TechnologiesSection from '../Pages/Projects/Components/TechnologiesSection';
import TechnologiesCarousel from './TechnologiesCarousel';

// Example usage component showing both versions
const TechnologiesExample = () => {
  const [activeVersion, setActiveVersion] = useState('slide');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Version Selector */}
      <div className="flex justify-center py-8">
        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
          <button
            onClick={() => setActiveVersion('slide')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeVersion === 'slide'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-500'
            }`}
          >
            Slide Version
          </button>
          <button
            onClick={() => setActiveVersion('carousel')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeVersion === 'carousel'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-500'
            }`}
          >
            Carousel Version
          </button>
        </div>
      </div>

      {/* Render Selected Version */}
      {activeVersion === 'slide' ? <TechnologiesSection /> : <TechnologiesCarousel />}
    </div>
  );
};

export default TechnologiesExample;