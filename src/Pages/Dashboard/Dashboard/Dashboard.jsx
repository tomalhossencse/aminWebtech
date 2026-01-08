import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router';
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
  Home
} from 'lucide-react';

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const sidebarItems = [
    { icon: DashboardIcon, label: 'Dashboard', active: true, path: '/dashboard' },
    { icon: FolderOpen, label: 'Services', active: false, path: '/dashboard/services' },
    { icon: BarChart3, label: 'Analytics', active: false, path: '/dashboard/analytics' },
    { icon: FileText, label: 'Projects', active: false, path: '/dashboard/projects' },
    { icon: FileText, label: 'Blog', active: false, path: '/dashboard/blog' },
    { icon: Users, label: 'Team', active: false, path: '/dashboard/team' },
    { icon: MessageSquare, label: 'Testimonials', active: false, path: '/dashboard/testimonials' },
    { icon: Mail, label: 'Contacts', active: false, path: '/dashboard/contacts' },
    { icon: Image, label: 'Media', active: false, path: '/dashboard/media' },
    { icon: Settings, label: 'Settings', active: false, path: '/dashboard/settings' }
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {/* Sidebar */}
        <aside className={`w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 ${isSidebarOpen ? 'block' : 'hidden'} md:flex flex-col z-20 shadow-sm`}>
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-blue-500">Admin Panel</h1>
            <Link
              to="/"
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Go to Home"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4 space-y-1">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 border-r-3 border-blue-600'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 z-10 shadow-sm">
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-600 dark:text-gray-300 focus:outline-none"
              >
                <Menu className="w-6 h-6" />
              </button>
              <span className="ml-4 font-bold text-blue-500">Admin Panel</span>
              <Link
                to="/"
                className="ml-auto p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Go to Home"
              >
                <Home className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="flex ml-auto items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">Super Admin</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
              </div>
              
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                S
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-slate-900 p-3">
            <Outlet context={{ isDarkMode }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;