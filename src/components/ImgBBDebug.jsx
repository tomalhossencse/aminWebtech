import React from 'react';
import imgbbService from '../services/imgbbService';

const ImgBBDebug = () => {
  const status = imgbbService.getStatus();
  const envKey = import.meta.env.VITE_IMGBB_API_KEY;

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border">
      <h3 className="text-lg font-bold mb-3">ImgBB Debug Information</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Environment Variable:</strong> 
          <span className="ml-2 font-mono">
            {envKey ? `${envKey.substring(0, 8)}...` : 'Not set'}
          </span>
        </div>
        
        <div>
          <strong>Service Status:</strong>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            status.configured 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {status.configured ? 'Configured' : 'Not Configured'}
          </span>
        </div>
        
        <div>
          <strong>API Key (Service):</strong>
          <span className="ml-2 font-mono">{status.apiKey}</span>
        </div>
        
        <div>
          <strong>Environment:</strong>
          <span className="ml-2">{import.meta.env.MODE}</span>
        </div>
        
        <div>
          <strong>Node Environment:</strong>
          <span className="ml-2">{import.meta.env.NODE_ENV || 'Not set'}</span>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Note:</strong> If you're seeing this on the deployed site and the API key shows "Not set" or "your-imgbb-api-key-here", 
          you need to configure the environment variables in your Netlify dashboard.
        </p>
      </div>
    </div>
  );
};

export default ImgBBDebug;