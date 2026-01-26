import React from 'react';
import { X } from 'lucide-react';

const ResponsiveModal = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle,
  children, 
  size = 'md', // sm, md, lg, xl, full
  showCloseButton = true,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer
}) => {
  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-full sm:w-11/12 md:w-8/12 lg:w-6/12 xl:w-4/12 max-w-md';
      case 'md':
        return 'w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12 max-w-2xl';
      case 'lg':
        return 'w-full sm:w-11/12 md:w-10/12 lg:w-8/12 max-w-4xl';
      case 'xl':
        return 'w-full sm:w-11/12 md:w-10/12 max-w-6xl';
      case 'full':
        return 'w-full h-full max-w-none max-h-none m-0 rounded-none';
      default:
        return 'w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12 max-w-2xl';
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className={`
          ${getSizeClasses()} 
          ${size === 'full' ? 'h-full' : 'h-[95vh] max-h-[95vh]'} 
          bg-white dark:bg-slate-800 
          rounded-lg shadow-2xl 
          border border-gray-200 dark:border-gray-700 
          flex flex-col 
          overflow-hidden
          mx-2 sm:mx-4
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={`
            flex items-center justify-between 
            p-4 sm:p-6 
            border-b border-gray-200 dark:border-gray-700 
            bg-gray-50 dark:bg-slate-700/50
            ${headerClassName}
          `}>
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={`
          flex-1 overflow-y-auto 
          p-4 sm:p-6 
          ${bodyClassName}
        `}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`
            p-4 sm:p-6 
            border-t border-gray-200 dark:border-gray-700 
            bg-gray-50 dark:bg-slate-700/50
            ${footerClassName}
          `}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsiveModal;