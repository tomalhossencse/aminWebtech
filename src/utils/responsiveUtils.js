// Responsive utility classes and patterns for consistent design across the application

// Standard responsive grid patterns
export const gridClasses = {
  // Single column on mobile, responsive columns on larger screens
  cols1: 'grid-cols-1',
  cols2: 'grid-cols-1 sm:grid-cols-2',
  cols3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  cols4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  cols6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  
  // Dashboard specific grids
  dashboardStats: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6',
  dashboardCards: 'grid-cols-1 lg:grid-cols-2',
  dashboardCharts: 'grid-cols-1 xl:grid-cols-3',
  
  // Blog and content grids
  blogGrid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  projectGrid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  serviceGrid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  
  // Form grids
  formGrid2: 'grid-cols-1 md:grid-cols-2',
  formGrid3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  formGrid4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

// Standard responsive spacing patterns
export const spacingClasses = {
  // Padding
  padding: 'p-3 sm:p-4 lg:p-6',
  paddingX: 'px-3 sm:px-4 lg:px-6',
  paddingY: 'py-3 sm:py-4 lg:py-6',
  paddingLarge: 'p-4 sm:p-6 lg:p-8',
  
  // Margins
  margin: 'm-3 sm:m-4 lg:m-6',
  marginX: 'mx-3 sm:mx-4 lg:mx-6',
  marginY: 'my-3 sm:my-4 lg:my-6',
  marginBottom: 'mb-3 sm:mb-4 lg:mb-6',
  marginTop: 'mt-3 sm:mt-4 lg:mt-6',
  
  // Gaps
  gap: 'gap-3 sm:gap-4 lg:gap-6',
  gapX: 'gap-x-3 sm:gap-x-4 lg:gap-x-6',
  gapY: 'gap-y-3 sm:gap-y-4 lg:gap-y-6',
  gapSmall: 'gap-2 sm:gap-3 lg:gap-4',
  gapLarge: 'gap-4 sm:gap-6 lg:gap-8',
};

// Standard responsive typography patterns
export const textClasses = {
  // Headings
  h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
  h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl',
  h3: 'text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl',
  h4: 'text-base sm:text-lg md:text-xl lg:text-2xl',
  h5: 'text-sm sm:text-base md:text-lg lg:text-xl',
  h6: 'text-xs sm:text-sm md:text-base lg:text-lg',
  
  // Body text
  body: 'text-sm sm:text-base',
  bodyLarge: 'text-base sm:text-lg',
  bodySmall: 'text-xs sm:text-sm',
  
  // Labels and captions
  label: 'text-xs sm:text-sm',
  caption: 'text-xs',
  
  // Hero text
  heroTitle: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
  heroSubtitle: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
};

// Standard responsive component patterns
export const componentClasses = {
  // Buttons
  button: 'px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base',
  buttonLarge: 'px-4 py-2.5 sm:px-6 sm:py-3 text-base sm:text-lg',
  buttonSmall: 'px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm',
  
  // Input fields
  input: 'p-2 sm:p-3 text-sm sm:text-base',
  inputLarge: 'p-3 sm:p-4 text-base sm:text-lg',
  
  // Cards
  card: 'p-4 sm:p-6 lg:p-8',
  cardSmall: 'p-3 sm:p-4 lg:p-6',
  cardCompact: 'p-2 sm:p-3 lg:p-4',
  
  // Icons
  icon: 'w-4 h-4 sm:w-5 sm:h-5',
  iconLarge: 'w-6 h-6 sm:w-8 sm:h-8',
  iconSmall: 'w-3 h-3 sm:w-4 sm:h-4',
  
  // Avatars
  avatar: 'w-8 h-8 sm:w-10 sm:h-10',
  avatarLarge: 'w-12 h-12 sm:w-16 sm:h-16',
  avatarSmall: 'w-6 h-6 sm:w-8 sm:h-8',
};

// Modal size configurations
export const modalSizes = {
  sm: 'w-full sm:w-11/12 md:w-8/12 lg:w-6/12 xl:w-4/12 max-w-md',
  md: 'w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12 max-w-2xl',
  lg: 'w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 max-w-4xl',
  xl: 'w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-10/12 max-w-6xl',
  full: 'w-full h-full max-w-none max-h-none m-0 rounded-none',
};

// Responsive breakpoint utilities
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Utility functions
export const getResponsiveValue = (values, currentWidth) => {
  if (currentWidth >= breakpoints['2xl'] && values['2xl']) return values['2xl'];
  if (currentWidth >= breakpoints.xl && values.xl) return values.xl;
  if (currentWidth >= breakpoints.lg && values.lg) return values.lg;
  if (currentWidth >= breakpoints.md && values.md) return values.md;
  if (currentWidth >= breakpoints.sm && values.sm) return values.sm;
  return values.base || values.default;
};

// Touch target sizes for mobile accessibility
export const touchTargets = {
  minimum: 'min-h-[44px] min-w-[44px]', // iOS minimum
  recommended: 'min-h-[48px] min-w-[48px]', // Material Design
  comfortable: 'min-h-[56px] min-w-[56px]', // Comfortable touch
};

// Container max-widths
export const containerClasses = {
  sm: 'max-w-screen-sm mx-auto px-4',
  md: 'max-w-screen-md mx-auto px-4 sm:px-6',
  lg: 'max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8',
  xl: 'max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8',
  '2xl': 'max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8',
  full: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
};

// Responsive image classes
export const imageClasses = {
  hero: 'h-48 sm:h-64 md:h-80 lg:h-96',
  card: 'h-32 sm:h-40 md:h-48',
  thumbnail: 'h-16 w-16 sm:h-20 sm:w-20',
  avatar: 'h-8 w-8 sm:h-10 sm:w-10',
  logo: 'h-6 w-auto sm:h-8',
};

// Responsive table classes
export const tableClasses = {
  container: 'overflow-x-auto',
  table: 'min-w-full divide-y divide-gray-200 dark:divide-gray-700',
  th: 'px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
  td: 'px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100',
  mobileCard: 'block sm:hidden bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-4',
};

// Responsive navigation classes
export const navClasses = {
  desktop: 'hidden lg:flex',
  mobile: 'lg:hidden',
  mobileMenu: 'absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg lg:hidden',
  mobileMenuItem: 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
};

// Form responsive patterns
export const formClasses = {
  section: 'space-y-4 sm:space-y-6',
  fieldGroup: 'grid grid-cols-1 gap-4 sm:gap-6',
  fieldGroupDouble: 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6',
  fieldGroupTriple: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
  label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2',
  input: 'block w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base',
  textarea: 'block w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base resize-none',
  select: 'block w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base',
  checkbox: 'h-4 w-4 sm:h-5 sm:w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded',
  radio: 'h-4 w-4 sm:h-5 sm:w-5 text-blue-600 focus:ring-blue-500 border-gray-300',
};

export default {
  gridClasses,
  spacingClasses,
  textClasses,
  componentClasses,
  modalSizes,
  breakpoints,
  getResponsiveValue,
  touchTargets,
  containerClasses,
  imageClasses,
  tableClasses,
  navClasses,
  formClasses,
};