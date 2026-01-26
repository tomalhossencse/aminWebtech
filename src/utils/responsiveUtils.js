// Responsive utility classes and patterns for consistent mobile-first design

export const responsiveClasses = {
  // Container and spacing utilities
  container: {
    padding: 'px-4 sm:px-6 lg:px-8',
    maxWidth: 'max-w-7xl mx-auto',
    section: 'py-8 sm:py-12 lg:py-16',
  },

  // Typography responsive classes
  typography: {
    h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold',
    h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold',
    h3: 'text-lg sm:text-xl md:text-2xl font-semibold',
    h4: 'text-base sm:text-lg md:text-xl font-semibold',
    body: 'text-sm sm:text-base',
    small: 'text-xs sm:text-sm',
  },

  // Grid and layout utilities
  grid: {
    responsive: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    blog: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    projects: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    stats: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  },

  // Button and interactive element utilities
  button: {
    primary: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-lg min-h-[44px]',
    secondary: 'px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg min-h-[44px]',
    icon: 'w-10 h-10 sm:w-12 sm:h-12 min-h-[44px] min-w-[44px] flex items-center justify-center',
  },

  // Card and component utilities
  card: {
    base: 'bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 dark:border-gray-700',
    padding: 'p-4 sm:p-6',
    hover: 'hover:shadow-md transition-shadow duration-300',
  },

  // Form utilities
  form: {
    input: 'w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border',
    label: 'block text-sm sm:text-base font-medium mb-2',
    group: 'space-y-3 sm:space-y-4',
  },

  // Modal and overlay utilities
  modal: {
    overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50',
    container: 'fixed inset-4 sm:inset-8 md:inset-16 lg:inset-24 xl:inset-32 z-50',
    content: 'bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-2xl max-h-full overflow-auto',
    padding: 'p-4 sm:p-6 lg:p-8',
  },

  // Navigation utilities
  nav: {
    mobile: 'block sm:hidden',
    desktop: 'hidden sm:block',
    item: 'px-3 sm:px-4 py-2 text-sm sm:text-base font-medium min-h-[44px] flex items-center',
  },

  // Spacing utilities
  spacing: {
    section: 'py-8 sm:py-12 lg:py-16',
    component: 'mb-6 sm:mb-8 lg:mb-12',
    element: 'mb-3 sm:mb-4 lg:mb-6',
    gap: 'gap-3 sm:gap-4 lg:gap-6',
  },
};

// Responsive breakpoint utilities
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Touch target utilities for mobile accessibility
export const touchTargets = {
  minimum: 'min-h-[44px] min-w-[44px]',
  button: 'min-h-[44px] px-4 py-2',
  icon: 'min-h-[44px] min-w-[44px] flex items-center justify-center',
  link: 'min-h-[44px] flex items-center',
};

// Mobile-first responsive patterns
export const patterns = {
  // Hide on mobile, show on larger screens
  hideOnMobile: 'hidden sm:block',
  
  // Show on mobile, hide on larger screens
  showOnMobile: 'block sm:hidden',
  
  // Stack on mobile, side-by-side on larger screens
  stackToRow: 'flex flex-col sm:flex-row',
  
  // Full width on mobile, constrained on larger screens
  mobileFullWidth: 'w-full sm:w-auto',
  
  // Center on mobile, left-align on larger screens
  centerToLeft: 'text-center sm:text-left',
  
  // Responsive image
  responsiveImage: 'w-full h-auto object-cover',
  
  // Responsive video
  responsiveVideo: 'w-full aspect-video',
};

// Utility functions for responsive design
export const utils = {
  // Get responsive class based on screen size
  getResponsiveClass: (base, sm, md, lg, xl) => {
    let classes = base;
    if (sm) classes += ` sm:${sm}`;
    if (md) classes += ` md:${md}`;
    if (lg) classes += ` lg:${lg}`;
    if (xl) classes += ` xl:${xl}`;
    return classes;
  },

  // Combine multiple responsive utility classes
  combineClasses: (...classes) => {
    return classes.filter(Boolean).join(' ');
  },

  // Generate responsive grid classes
  generateGrid: (cols = { base: 1, sm: 2, md: 3, lg: 4 }) => {
    return `grid grid-cols-${cols.base} sm:grid-cols-${cols.sm} md:grid-cols-${cols.md} lg:grid-cols-${cols.lg}`;
  },

  // Generate responsive spacing classes
  generateSpacing: (type = 'p', sizes = { base: 4, sm: 6, lg: 8 }) => {
    return `${type}-${sizes.base} sm:${type}-${sizes.sm} lg:${type}-${sizes.lg}`;
  },
};

// Common responsive component patterns
export const components = {
  // Responsive hero section
  hero: {
    container: utils.combineClasses(
      responsiveClasses.container.padding,
      responsiveClasses.container.maxWidth,
      'py-12 sm:py-16 lg:py-20'
    ),
    title: responsiveClasses.typography.h1,
    subtitle: utils.combineClasses(
      responsiveClasses.typography.body,
      'text-gray-600 dark:text-gray-300 mt-4 sm:mt-6'
    ),
  },

  // Responsive card grid
  cardGrid: {
    container: utils.combineClasses(
      responsiveClasses.grid.responsive,
      responsiveClasses.spacing.gap
    ),
    card: utils.combineClasses(
      responsiveClasses.card.base,
      responsiveClasses.card.padding,
      responsiveClasses.card.hover
    ),
  },

  // Responsive form
  form: {
    container: 'max-w-md sm:max-w-lg mx-auto',
    group: responsiveClasses.form.group,
    input: utils.combineClasses(
      responsiveClasses.form.input,
      'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500'
    ),
    button: utils.combineClasses(
      responsiveClasses.button.primary,
      'bg-blue-600 text-white hover:bg-blue-700 transition-colors'
    ),
  },

  // Responsive navigation
  navigation: {
    container: utils.combineClasses(
      responsiveClasses.container.padding,
      'flex items-center justify-between h-16 sm:h-20'
    ),
    menu: 'flex items-center space-x-4 sm:space-x-6',
    item: responsiveClasses.nav.item,
  },
};

export default {
  responsiveClasses,
  breakpoints,
  touchTargets,
  patterns,
  utils,
  components,
};