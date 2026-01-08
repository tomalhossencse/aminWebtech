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
  Mail
} from 'lucide-react';
import RecentActivities from './RecentActivities';
import RecentContacts from './RecentContacts';

const DashboardHome = () => {
  const { isDarkMode } = useOutletContext();
  const [isChartsReady, setIsChartsReady] = useState(false);

  // Ensure charts render properly
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChartsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Chart data
  const contentData = [
    { name: 'Services', value: 5, color: '#3b82f6' },
    { name: 'Projects', value: 2, color: '#10b981' },
    { name: 'Blog Posts', value: 1, color: '#f59e0b' },
    { name: 'Team', value: 4, color: '#8b5cf6' },
    { name: 'Testimonials', value: 1, color: '#ef4444' },
    { name: 'Media', value: 4, color: '#6366f1' }
  ];

  const pieData = [
    { name: 'Active', value: 90, color: '#10b981' },
    { name: 'Inactive', value: 10, color: '#ef4444' }
  ];

  const stats = [
    {
      title: 'Total Services',
      value: '5',
      icon: Code,
      color: 'bg-blue-500',
      shadowColor: 'shadow-blue-500/30',
      progress: 100
    },
    {
      title: 'Active Projects',
      value: '2',
      icon: GitBranch,
      color: 'bg-emerald-500',
      shadowColor: 'shadow-emerald-500/30',
      progress: 100
    },
    {
      title: 'Blog Posts',
      value: '1',
      icon: Rss,
      color: 'bg-amber-500',
      shadowColor: 'shadow-amber-500/30',
      progress: 100
    },
    {
      title: 'Team Members',
      value: '4',
      icon: Users,
      color: 'bg-purple-500',
      shadowColor: 'shadow-purple-500/30',
      progress: 100
    },
    {
      title: 'Testimonials',
      value: '1',
      icon: Star,
      color: 'bg-red-500',
      shadowColor: 'shadow-red-500/30',
      progress: 100
    },
    {
      title: 'New Contacts',
      value: '0',
      icon: Mail,
      color: 'bg-indigo-500',
      shadowColor: 'shadow-indigo-500/30',
      progress: 0
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your site.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`h-10 w-10 rounded ${stat.color} flex items-center justify-center text-white shadow-lg ${stat.shadowColor}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                <div 
                  className={`${stat.color.replace('bg-', 'bg-')} h-1.5 rounded-full transition-all duration-500`}
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.progress}% completed</p>
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
            {isChartsReady ? (
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
            {isChartsReady ? (
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