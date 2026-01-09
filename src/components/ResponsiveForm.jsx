import React from 'react';

// Responsive Form Container
export const ResponsiveForm = ({ children, onSubmit, className = '' }) => (
  <form 
    onSubmit={onSubmit} 
    className={`space-y-4 sm:space-y-6 ${className}`}
  >
    {children}
  </form>
);

// Responsive Form Section
export const FormSection = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
    {title && (
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 sm:gap-3">
          {icon && (
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          )}
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h4>
        </div>
      </div>
    )}
    <div className="p-4 sm:p-6">
      {children}
    </div>
  </div>
);

// Responsive Form Grid
export const FormGrid = ({ children, cols = 1, className = '' }) => {
  const getGridClasses = () => {
    switch (cols) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2';
    }
  };

  return (
    <div className={`grid ${getGridClasses()} gap-4 sm:gap-6 ${className}`}>
      {children}
    </div>
  );
};

// Responsive Form Field
export const FormField = ({ 
  label, 
  required = false, 
  error, 
  help, 
  icon,
  children, 
  className = '' 
}) => (
  <div className={`form-control ${className}`}>
    {label && (
      <label className="label">
        <span className="label-text font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          {icon && <span className="text-blue-500">{icon}</span>}
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      </label>
    )}
    {children}
    {error && (
      <label className="label">
        <span className="label-text-alt text-red-500 text-xs sm:text-sm flex items-center gap-1">
          <span className="material-icons text-xs">error</span>
          {error}
        </span>
      </label>
    )}
    {help && !error && (
      <label className="label">
        <span className="label-text-alt text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
          {help}
        </span>
      </label>
    )}
  </div>
);

// Responsive Input
export const ResponsiveInput = ({ 
  type = 'text', 
  placeholder, 
  error, 
  className = '',
  ...props 
}) => (
  <input
    type={type}
    placeholder={placeholder}
    className={`
      input input-bordered w-full 
      text-sm sm:text-base
      bg-white dark:bg-slate-700 
      text-gray-900 dark:text-white
      border-gray-300 dark:border-gray-600
      focus:border-blue-500 dark:focus:border-blue-400
      focus:ring-2 focus:ring-blue-500/20
      transition-all duration-200
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
      ${className}
    `}
    {...props}
  />
);

// Responsive Textarea
export const ResponsiveTextarea = ({ 
  placeholder, 
  rows = 3, 
  error, 
  className = '',
  ...props 
}) => (
  <textarea
    placeholder={placeholder}
    rows={rows}
    className={`
      textarea textarea-bordered w-full resize-none
      text-sm sm:text-base
      bg-white dark:bg-slate-700 
      text-gray-900 dark:text-white
      border-gray-300 dark:border-gray-600
      focus:border-blue-500 dark:focus:border-blue-400
      focus:ring-2 focus:ring-blue-500/20
      transition-all duration-200
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
      ${className}
    `}
    {...props}
  />
);

// Responsive Select
export const ResponsiveSelect = ({ 
  options = [], 
  placeholder = 'Select an option', 
  error, 
  className = '',
  ...props 
}) => (
  <select
    className={`
      select select-bordered w-full
      text-sm sm:text-base
      bg-white dark:bg-slate-700 
      text-gray-900 dark:text-white
      border-gray-300 dark:border-gray-600
      focus:border-blue-500 dark:focus:border-blue-400
      focus:ring-2 focus:ring-blue-500/20
      transition-all duration-200
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
      ${className}
    `}
    {...props}
  >
    <option value="">{placeholder}</option>
    {options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

// Responsive Button Group
export const ButtonGroup = ({ children, className = '' }) => (
  <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${className}`}>
    {children}
  </div>
);

// Responsive Button
export const ResponsiveButton = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  icon,
  children, 
  className = '',
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'outline':
        return 'btn-outline';
      case 'ghost':
        return 'btn-ghost';
      case 'error':
        return 'btn-error';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'btn-sm text-xs sm:text-sm';
      case 'md':
        return 'text-sm sm:text-base';
      case 'lg':
        return 'btn-lg text-base sm:text-lg';
      default:
        return 'text-sm sm:text-base';
    }
  };

  return (
    <button
      className={`
        btn ${getVariantClasses()} ${getSizeClasses()}
        ${fullWidth ? 'w-full' : 'w-full sm:w-auto'}
        transition-all duration-200 hover:scale-105
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={loading}
      {...props}
    >
      {loading && <span className="loading loading-spinner loading-sm mr-2"></span>}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default {
  ResponsiveForm,
  FormSection,
  FormGrid,
  FormField,
  ResponsiveInput,
  ResponsiveTextarea,
  ResponsiveSelect,
  ButtonGroup,
  ResponsiveButton
};