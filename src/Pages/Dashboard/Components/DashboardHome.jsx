import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Code,
  GitBranch,
  Rss,
  Users,
  Star,
  Mail,
  TrendingUp,
  Activity,
  Eye,
  Calendar
} from 'lucide-react';
import RecentActivities from './RecentActivities';
import RecentContacts from './RecentContacts';
import useDashboardAPI from '../../../hooks/useDashboardAPI';

const DashboardHome = () => {
  const { isDarkMode } = useOutletContext();
  const [isChartsReady, setIsChartsReady] = useState(false);
  
  // Get dashboard data from API
  const { dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboardAPI();

  // Ensure charts render properly
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChartsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Extract data from API response
  const { stats, contentData, pieData } = dashboardData || {};

  // Create stats array for display
  const statsArray = stats ? [
    {
      title: 'Total Services',
      value: stats.services?.total?.toString() || '0',
      change: stats.services?.change || 'Stable',
      changeType: stats.services?.changeType || 'stable',
      icon: Code,
      color: 'bg-blue-500',
      progress: stats.services?.progress || 0
    },
    {
      title: 'Active Projects',
      value: stats.projects?.total?.toString() || '0',
      change: stats.projects?.change || 'Stable',
      changeType: stats.projects?.changeType || 'stable',
      icon: GitBranch,
      color: 'bg-green-500',
      progress: stats.projects?.progress || 0
    },
    {
      title: 'Blog Posts',
      value: stats.blogs?.total?.toString() || '0',
      change: stats.blogs?.change || 'None',
      changeType: stats.blogs?.changeType || 'stable',
      icon: Rss,
      color: 'bg-yellow-500',
      progress: stats.blogs?.progress || 0
    },
    {
      title: 'Team Members',
      value: stats.teamMembers?.total?.toString() || '0',
      change: stats.teamMembers?.change || 'Stable',
      changeType: stats.teamMembers?.changeType || 'stable',
      icon: Users,
      color: 'bg-purple-500',
      progress: stats.teamMembers?.progress || 0
    },
    {
      title: 'Testimonials',
      value: stats.testimonials?.total?.toString() || '0',
      change: stats.testimonials?.change || 'Stable',
      changeType: stats.testimonials?.changeType || 'stable',
      icon: Star,
      color: 'bg-pink-500',
      progress: stats.testimonials?.progress || 0
    },
    {
      title: 'New Contacts',
      value: stats.contacts?.new?.toString() || '0',
      change: stats.contacts?.change || 'Stable',
      changeType: stats.contacts?.changeType || 'stable',
      icon: Mail,
      color: 'bg-indigo-500',
      progress: stats.contacts?.progress || 0
    }
  ] : [];

  const getChangeColor = (type) => {
    switch (type) {
      case 'increase': return 'text-green-600 dark:text-green-400';
      case 'decrease': return 'text-red-600 dark:text-red-400';
      case 'new': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'increase': return <TrendingUp className="w-3 h-3" />;
      case 'decrease': return <TrendingUp className="w-3 h-3 rotate-180" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your site.</p>
        
        {/* Loading indicator */}
        {dashboardLoading && (
          <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
            Loading dashboard data...
          </div>
        )}
        
        {/* Error indicator */}
        {dashboardError && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-400">
            Using cached data - {dashboardError}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 mb-6">
        {statsArray.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                <div 
                  className={`${stat.color} h-1.5 rounded-full transition-all duration-500`}
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.progress}% completed</p>
                <div className={`flex items-center text-xs ${getChangeColor(stat.changeType)}`}>
                  {getChangeIcon(stat.changeType)}
                  <span className="ml-1">{stat.change}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        {/* Bar Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Content Overview</h3>
          <div className="w-full h-80 min-h-[320px]">
            {isChartsReady && contentData ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={320}>
                <BarChart data={contentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: isDarkMode ? '#f3f4f6' : '#111827'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading chart...</div>
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Services Status</h3>
          
          <div className="flex justify-center space-x-4 mb-6">
            <span className="flex items-center text-xs text-gray-600 dark:text-gray-300">
              <span className="w-3 h-3 bg-emerald-500 mr-2 rounded-sm"></span>
              Active
            </span>
            <span className="flex items-center text-xs text-gray-600 dark:text-gray-300">
              <span className="w-3 h-3 bg-red-500 mr-2 rounded-sm"></span>
              Inactive
            </span>
          </div>
          
          <div className="w-48 h-48 min-w-[192px] min-h-[192px]">
            {isChartsReady && pieData ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={192} minHeight={192}>
                <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: isDarkMode ? '#f3f4f6' : '#111827'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading chart...</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities and Contacts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities />
        <RecentContacts />
      </div>
    </div>
  );
};

export default DashboardHome;