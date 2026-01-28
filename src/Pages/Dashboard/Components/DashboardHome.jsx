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
  Activity
} from 'lucide-react';
import { memo, useMemo } from 'react';
import RecentActivities from './RecentActivities';
import RecentContacts from './RecentContacts';
import useDashboardAPI from '../../../hooks/useDashboardAPI';

// Memoized loading skeleton components for better performance
const StatCardSkeleton = memo(() => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 h-40 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
    <div className="space-y-2">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5"></div>
      <div className="flex justify-between">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
      </div>
    </div>
  </div>
));

const ChartSkeleton = memo(({ className = "" }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 animate-pulse ${className}`}>
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6"></div>
    <div className="w-full h-80 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
      <div className="text-gray-400 dark:text-gray-500">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full mb-2 mx-auto"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
      </div>
    </div>
  </div>
));

const PieChartSkeleton = memo(() => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 flex flex-col items-center animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-6"></div>
    
    <div className="flex justify-center space-x-4 mb-6">
      <div className="flex items-center">
        <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 mr-2 rounded-sm"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 mr-2 rounded-sm"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-14"></div>
      </div>
    </div>
    
    <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
    </div>
  </div>
));

// Memoized stat card component
const StatCard = memo(({ stat, getChangeColor, getChangeIcon }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-40 transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
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
));

const DashboardHome = () => {
  const { isDarkMode } = useOutletContext();
  
  // Get dashboard data from API with optimized caching
  const { dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboardAPI();

  // Memoize helper functions to prevent re-creation on every render
  const getChangeColor = useMemo(() => (type) => {
    switch (type) {
      case 'increase': return 'text-green-600 dark:text-green-400';
      case 'decrease': return 'text-red-600 dark:text-red-400';
      case 'new': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  }, []);

  const getChangeIcon = useMemo(() => (type) => {
    switch (type) {
      case 'increase': return <TrendingUp className="w-3 h-3" />;
      case 'decrease': return <TrendingUp className="w-3 h-3 rotate-180" />;
      default: return <Activity className="w-3 h-3" />;
    }
  }, []);

  // Memoize stats array to prevent recalculation
  const statsArray = useMemo(() => {
    if (!dashboardData?.stats) return [];
    
    const { stats } = dashboardData;
    return [
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
    ];
  }, [dashboardData?.stats]);

  // Memoize chart data
  const { contentData, pieData } = useMemo(() => ({
    contentData: dashboardData?.contentData || [],
    pieData: dashboardData?.pieData || []
  }), [dashboardData]);

  // Memoize skeleton array
  const skeletonArray = useMemo(() => Array.from({ length: 6 }, (_, index) => index), []);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4 overflow-hidden">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your site.</p>
        
        {/* Loading indicator */}
        {dashboardLoading && (
          <div className="mt-2 flex items-center text-sm text-blue-600 dark:text-blue-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400 mr-2"></div>
            Loading dashboard data...
          </div>
        )}
        
        {/* Error indicator */}
        {dashboardError && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-400">
            ⚠️ Backend connection issue - Please configure environment variables
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 mb-6">
        {dashboardLoading ? (
          // Show skeleton cards while loading
          skeletonArray.map((index) => (
            <StatCardSkeleton key={index} />
          ))
        ) : (
          // Show actual data when loaded
          statsArray.map((stat, index) => (
            <StatCard 
              key={index} 
              stat={stat} 
              getChangeColor={getChangeColor} 
              getChangeIcon={getChangeIcon} 
            />
          ))
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8 overflow-hidden">
        {/* Bar Chart */}
        {dashboardLoading ? (
          <ChartSkeleton className="xl:col-span-2" />
        ) : (
          <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Content Overview</h3>
            <div className="w-full h-80 min-h-[320px] min-w-[300px] overflow-hidden">
              {contentData && contentData.length > 0 ? (
                <div className="w-full h-full min-w-[300px] min-h-[320px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={320}>
                    <BarChart 
                      data={contentData} 
                      margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#6b7280"
                        fontSize={12}
                        tick={{ fontSize: 12 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tick={{ fontSize: 12 }}
                        width={40}
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
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-2">📊</div>
                    <div className="text-sm">No data available</div>
                    <div className="text-xs mt-1">Configure backend environment variables</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pie Chart */}
        {dashboardLoading ? (
          <PieChartSkeleton />
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 flex flex-col items-center overflow-hidden">
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
            
            <div className="w-full max-w-[200px] h-48 min-w-[200px] min-h-[192px] flex justify-center items-center overflow-hidden">
              {pieData && pieData.length > 0 ? (
                <div className="w-full h-full min-w-[200px] min-h-[192px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={192}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
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
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-2">📈</div>
                    <div className="text-sm">No data available</div>
                    <div className="text-xs mt-1">Configure backend environment variables</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recent Activities and Contacts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities />
        <RecentContacts />
      </div>
    </div>
  );
};

export default memo(DashboardHome);