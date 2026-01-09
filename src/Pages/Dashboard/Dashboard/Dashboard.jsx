import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router';
import useLogout from '../../../hooks/useLogout';
import {
  Menu,
  LayoutDashboard as DashboardIcon,
  FolderOpen,
  BarChart3,
  FileText,
  Users,
  MessageSquare,
  Mail,
  Image,
  Settings,
  LogOut,
  Home,
  X,
  Sun,
  Moon,
  Bell,
  Search,
  ChevronDown,
  User
} from 'lucide-react';

const Dashboard = () => {
  const { handleLogout } = useLogout();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();

  const sidebarItems = [
    { 
      icon: DashboardIcon, 
      label: 'Dashboard', 
      path: '/dashboard',
      badge: null,
      description: 'Overview & Analytics'
    },
    { 
      icon: FolderOpen, 
      label: 'Services', 
      path: '/dashboard/services',
      badge: null,
      description: 'Manage Services'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      path: '/dashboard/analytics',
      badge: 'New',
      description: 'Performance Metrics'
    },
    { 
      icon: FileText, 
      label: 'Projects', 
      path: '/dashboard/projects',
      badge: null,
      description: 'Portfolio Management'
    },
    { 
      icon: FileText, 
      label: 'Blog', 
      path: '/dashboard/blog',
      badge: null,
      description: 'Content Management'
    },
    { 
      icon: Users, 
      label: 'Team', 
      path: '/dashboard/team',
      badge: null,
      description: 'Team Members'
    },
    { 
      icon: MessageSquare, 
      label: 'Testimonials', 
      path: '/dashboard/testimonials',
      badge: null,
      description: 'Client Reviews'
    },
    { 
      icon: Mail, 
      label: 'Contacts', 
      path: '/dashboard/contacts',
      badge: '3',
      description: 'Messages & Inquiries'
    },
    { 
      icon: Image, 
      label: 'Media', 
      path: '/dashboard/media',
      badge: null,
      description: 'File Management'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/dashboard/settings',
      badge: null,
      description: 'System Configuration'
    }
  ];

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Close sidebar with Escape key on mobile
      if (event.key === 'Escape' && isSidebarOpen && window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && window.innerWidth < 768) {
        const sidebar = document.getElementById('dashboard-sidebar');
        const toggleButton = document.querySelector('[data-sidebar-toggle]');
        if (sidebar && !sidebar.contains(event.target) && !toggleButton?.contains(event.target)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  // Close sidebar on route change (mobile) and handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false); // Reset mobile sidebar state on desktop
      }
    };

    const handleRouteChange = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleRouteChange(); // Close on route change

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [location.pathname]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const getCurrentPageTitle = () => {
    const currentItem = sidebarItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Dashboard';
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <aside 
          id="dashboard-sidebar"
          className={`
            fixed md:relative top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 
            border-r border-gray-200 dark:border-gray-700 flex-col z-40 shadow-lg md:shadow-sm
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 md:flex
          `}
        >
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-blue-500">Admin Panel</h1>
            <div className="flex items-center space-x-2">
              <Link
                to="/"
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Go to Home"
              >
                <Home className="w-5 h-5" />
              </Link>
              <button
                onClick={closeSidebar}
                className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Close Sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4 space-y-1">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => window.innerWidth < 768 && closeSidebar()}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 border-r-3 border-blue-600'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-6 z-10 shadow-sm">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                data-sidebar-toggle
                className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors mr-3"
                title="Toggle Sidebar"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="md:hidden">
                <span className="font-bold text-blue-500">Admin Panel</span>
              </div>
              <div className="hidden md:block">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {getCurrentPageTitle()}
                </h2>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link
                to="/"
                className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Go to Home"
              >
                <Home className="w-5 h-5" />
              </Link>
              
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">Super Admin</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
              </div>
              
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 font-bold shadow-sm text-sm md:text-base">
                S
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-slate-900 p-3 md:p-6">
            <Outlet context={{ isDarkMode }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;