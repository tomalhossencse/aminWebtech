import React from 'react';
import { Link } from 'react-router';

const DashboardDemo = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Dashboard Ready!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your React dashboard with interactive charts is now available.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            View Dashboard
          </Link>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Features included:</p>
            <ul className="mt-2 space-y-1">
              <li>• Interactive Bar & Pie Charts</li>
              <li>• Dark/Light Mode Toggle</li>
              <li>• Responsive Design</li>
              <li>• Modern UI with Tailwind CSS</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDemo;