import React from 'react';

const BlogFilter = ({ activeFilter, onFilterChange, postCount }) => {
  const filters = [
    { id: 'all', label: 'All Posts', count: postCount, icon: 'grid_view', color: 'from-blue-500 to-cyan-500' },
    { id: 'mobile', label: 'Mobile Development', count: 3, icon: 'smartphone', color: 'from-green-500 to-emerald-500' },
    { id: 'web', label: 'Web Development', count: 5, icon: 'language', color: 'from-purple-500 to-pink-500' },
    { id: 'design', label: 'UI/UX Design', count: 2, icon: 'palette', color: 'from-orange-500 to-red-500' },
    { id: 'backend', label: 'Backend', count: 4, icon: 'dns', color: 'from-indigo-500 to-blue-500' }
  ];

  return (
    <div className="mb-12 mt-16">
      {/* Filter Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="material-icons text-2xl text-gray-600 dark:text-gray-400">tune</span>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter by Category</h3>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-4">
        {filters.map((filter, index) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`group relative inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
              activeFilter === filter.id
                ? `bg-gradient-to-r ${filter.color} text-white shadow-lg`
                : 'bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Glow Effect for Active Filter */}
            {activeFilter === filter.id && (
              <div className={`absolute -inset-1 bg-gradient-to-r ${filter.color} rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
            )}
            
            <div className="relative flex items-center gap-3">
              {/* Icon */}
              <span className={`material-icons text-lg transition-transform duration-300 group-hover:scale-110 ${
                activeFilter === filter.id ? 'text-white' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {filter.icon}
              </span>
              
              {/* Label */}
              <span className="font-medium">{filter.label}</span>
              
              {/* Count Badge */}
              <span className={`inline-flex items-center justify-center min-w-[24px] h-6 text-xs font-bold rounded-full transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
              }`}>
                {filter.count}
              </span>
            </div>

            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-white/20 transform scale-0 group-active:scale-100 transition-transform duration-200 rounded-2xl"></div>
            </div>
          </button>
        ))}
      </div>

      {/* Active Filter Info */}
      {activeFilter !== 'all' && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <span className="material-icons text-lg">filter_alt</span>
            <span className="text-sm font-medium">
              Showing {filters.find(f => f.id === activeFilter)?.count} posts in "{filters.find(f => f.id === activeFilter)?.label}"
            </span>
            <button 
              onClick={() => onFilterChange('all')}
              className="ml-auto text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
            >
              Clear Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogFilter;