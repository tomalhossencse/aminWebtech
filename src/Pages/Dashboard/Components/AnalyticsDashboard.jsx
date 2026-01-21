import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useOutletContext } from "react-router";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Calendar,
  ChevronDown,
  Users,
  Eye,
  TrendingUp,
  Mouse,
  Globe,
  Monitor,
  Smartphone,
  MapPin,
  ArrowRight,
  Download,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  useAnalyticsOverview,
  useVisitorDistribution,
  useRecentVisitors,
  useTopPages,
} from "../../../hooks/useAnalytics";

const AnalyticsDashboard = () => {
  const { isDarkMode } = useOutletContext();
  const [timeRange, setTimeRange] = useState("7d");
  const [timeRangeLabel, setTimeRangeLabel] = useState("Last 7 days");
  const [isChartsReady, setIsChartsReady] = useState(false);
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch analytics data using custom hooks
  const {
    data: overviewData,
    isLoading: overviewLoading,
    error: overviewError,
    refetch: refetchOverview,
  } = useAnalyticsOverview(timeRange);

  const {
    data: visitorDistribution,
    isLoading: distributionLoading,
    error: distributionError,
    refetch: refetchDistribution,
  } = useVisitorDistribution(timeRange);

  const {
    data: recentVisitors,
    isLoading: visitorsLoading,
    error: visitorsError,
    refetch: refetchVisitors,
  } = useRecentVisitors(10);

  const {
    data: topPages,
    isLoading: pagesLoading,
    error: pagesError,
    refetch: refetchPages,
  } = useTopPages(timeRange, 10);

  // Time range options
  const timeRangeOptions = [
    { value: "1d", label: "Last 24 hours" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
  ];

  // Handle time range change with useCallback to prevent unnecessary re-renders
  const handleTimeRangeChange = useCallback(async (value, label) => {
    setTimeRange(value);
    setTimeRangeLabel(label);
    setShowTimeRangeDropdown(false);
    setIsRefreshing(true);
    
    try {
      // Auto-refetch data when time range changes
      await Promise.all([
        refetchOverview(),
        refetchDistribution(),
        refetchPages()
      ]);
      
      console.log(`✅ Data refreshed for time range: ${label}`);
    } catch (error) {
      console.error('❌ Error refreshing data after time range change:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchOverview, refetchDistribution, refetchPages]);

  // Memoize loading and error states
  const isLoading = useMemo(() => 
    overviewLoading || distributionLoading || visitorsLoading || pagesLoading || isRefreshing,
    [overviewLoading, distributionLoading, visitorsLoading, pagesLoading, isRefreshing]
  );
  
  const hasError = useMemo(() => 
    overviewError || distributionError || visitorsError || pagesError,
    [overviewError, distributionError, visitorsError, pagesError]
  );

  // Enhanced memoized refetch function with loading state management
  const handleRefreshAll = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      // Trigger all refetch functions simultaneously
      await Promise.all([
        refetchOverview(),
        refetchDistribution(),
        refetchVisitors(),
        refetchPages()
      ]);
      
      console.log('✅ All analytics data refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing analytics data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchOverview, refetchDistribution, refetchVisitors, refetchPages]);

  // Auto-refetch effect when timeRange changes
  useEffect(() => {
    // Skip initial render to avoid double fetch
    if (timeRange !== "7d") {
      console.log(`🔄 Time range changed to: ${timeRange}, triggering data refresh...`);
    }
  }, [timeRange]);

  // Auto-refetch recent visitors periodically (they don't depend on timeRange)
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isRefreshing && !visitorsLoading) {
        refetchVisitors();
        console.log('🔄 Auto-refreshing recent visitors...');
      }
    }, 30000); // Refetch every 30 seconds

    return () => clearInterval(intervalId);
  }, [refetchVisitors, isRefreshing, visitorsLoading]);

  // Auto-refetch overview data periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isRefreshing && !overviewLoading) {
        refetchOverview();
        console.log('🔄 Auto-refreshing overview data...');
      }
    }, 60000); // Refetch every minute

    return () => clearInterval(intervalId);
  }, [refetchOverview, isRefreshing, overviewLoading]);

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTimeRangeDropdown(false);
      }
    };

    if (showTimeRangeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showTimeRangeDropdown]);

  // Debug logging with proper cleanup
  useEffect(() => {
    if (overviewData) {
      console.log('📊 Dashboard received overview data:', overviewData);
    }
  }, [overviewData]);

  useEffect(() => {
    if (overviewError) {
      console.error('❌ Dashboard overview error:', overviewError);
    }
  }, [overviewError]);

  // Optimized chart rendering with proper cleanup
  useEffect(() => {
    let timeoutId;
    
    if (visitorDistribution) {
      setIsChartsReady(false);
      timeoutId = setTimeout(() => {
        setIsChartsReady(true);
      }, 300);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [visitorDistribution]);

  // Optimized resize handler with debouncing
  useEffect(() => {
    let resizeTimeoutId;
    
    const handleResize = () => {
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
      }
      
      setIsChartsReady(false);
      resizeTimeoutId = setTimeout(() => {
        setIsChartsReady(true);
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
      }
    };
  }, []);

  // Memoized analytics stats to prevent unnecessary recalculations
  const analyticsStats = useMemo(() => {
    if (!overviewData) {
      return [
        {
          title: "Total Visitors",
          value: "0",
          icon: Users,
          color: "bg-blue-500",
          shadowColor: "shadow-blue-500/30",
          progress: 0,
        },
        {
          title: "New Visitors",
          value: "0",
          icon: Eye,
          color: "bg-green-500",
          shadowColor: "shadow-green-500/30",
          progress: 0,
        },
        {
          title: "Active Now",
          value: "0",
          icon: TrendingUp,
          color: "bg-purple-500",
          shadowColor: "shadow-purple-500/30",
          progress: 0,
        },
        {
          title: "Bounce Rate",
          value: "0%",
          icon: Mouse,
          color: "bg-emerald-500",
          shadowColor: "shadow-emerald-500/30",
          progress: 0,
        },
      ];
    }

    return [
      {
        title: "Total Visitors",
        value: overviewData.totalVisitors?.toString() || "0",
        icon: Users,
        color: "bg-blue-500",
        shadowColor: "shadow-blue-500/30",
        progress: Math.min((overviewData.totalVisitors / 100) * 100, 100),
      },
      {
        title: "New Visitors",
        value: overviewData.newVisitors?.toString() || "0",
        icon: Eye,
        color: "bg-green-500",
        shadowColor: "shadow-green-500/30",
        progress: Math.min((overviewData.newVisitors / overviewData.totalVisitors) * 100, 100) || 0,
      },
      {
        title: "Active Now",
        value: overviewData.activeNow?.toString() || "0",
        icon: TrendingUp,
        color: "bg-purple-500",
        shadowColor: "shadow-purple-500/30",
        progress: Math.min((overviewData.activeNow / 10) * 100, 100),
      },
      {
        title: "Bounce Rate",
        value: overviewData.bounceRate || "0%",
        icon: Mouse,
        color: "bg-emerald-500",
        shadowColor: "shadow-emerald-500/30",
        progress: parseFloat(overviewData.bounceRate?.replace('%', '')) || 0,
      },
    ];
  }, [overviewData]);

  // Memoized formatted recent visitors
  const formattedRecentVisitors = useMemo(() => {
    return recentVisitors?.map(visitor => ({
      ...visitor,
      deviceIcon: visitor.device === 'Mobile' || visitor.device === 'Tablet' ? Smartphone : Monitor,
      deviceColor: visitor.device === 'Mobile' || visitor.device === 'Tablet' ? "text-green-500" : "text-blue-500",
    })) || [];
  }, [recentVisitors]);

  // Memoized custom tooltip component
  const CustomTooltip = useCallback(({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 text-white text-xs rounded px-3 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <span>{data.flag}</span>
            <span>
              {data.name}: {data.value} visitors ({data.percentage}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  }, []);

  // Memoized label renderer
  const renderCustomizedLabel = useCallback(({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Analytics Dashboard
            {isLoading && (
              <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
            )}
            {isRefreshing && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-500 font-medium">Refreshing...</span>
              </div>
            )}
            {hasError ? (
              <WifiOff className="w-6 h-6 text-red-500" />
            ) : (
              <Wifi className="w-6 h-6 text-green-500" />
            )}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Real-time insights and visitor analytics for your website
            {isRefreshing && (
              <span className="ml-2 text-blue-500 text-xs">• Updating data...</span>
            )}
          </p>
          {hasError && (
            <p className="text-red-500 text-sm mt-1">
              Failed to load some data. Please check your connection.
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshAll}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || isRefreshing}
            aria-label="Refresh all analytics data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading || isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh All'}</span>
          </button>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
              className="flex items-center space-x-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              aria-label="Select time range"
              aria-expanded={showTimeRangeDropdown}
              aria-haspopup="listbox"
              disabled={isRefreshing}
            >
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-200">
                {isRefreshing ? 'Updating...' : timeRangeLabel}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            
            {showTimeRangeDropdown && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
                role="listbox"
                aria-label="Time range options"
              >
                {timeRangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleTimeRangeChange(option.value, option.label)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      timeRange === option.value 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                    role="option"
                    aria-selected={timeRange === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {analyticsStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-3 ${stat.color} rounded-lg text-white shadow-lg ${stat.shadowColor}`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-3">
              <div
                className={`${stat.color} h-1.5 rounded-full transition-all duration-500`}
                style={{ width: `${stat.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stat.progress}% completed
            </p>
          </div>
        ))}
      </div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        {/* Visitor Distribution Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col relative overflow-hidden min-h-[600px]">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-50 to-yellow-50 dark:from-green-900/10 dark:to-yellow-900/10 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Visitor Distribution
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Top countries by visitors
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                Live
              </div>
              <button className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-200 hover:scale-105">
                <Globe className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-grow flex items-center justify-center relative mb-6 min-h-[320px]">
            <div className="w-full max-w-sm h-80 relative">
              {visitorDistribution && visitorDistribution.length > 0 ? (
                <div className="w-full h-full min-w-[300px] min-h-[320px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={320}>
                    <PieChart>
                      <Pie
                        data={visitorDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        innerRadius={50}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={500}
                        animationDuration={800}
                      >
                        {visitorDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{
                          fontSize: "12px",
                          color: isDarkMode ? "#9CA3AF" : "#4B5563",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    {distributionLoading ? (
                      <div className="animate-pulse text-gray-500 dark:text-gray-400">
                        Loading chart...
                      </div>
                    ) : distributionError ? (
                      <div className="text-red-500 text-sm">
                        Failed to load chart data
                      </div>
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400">
                        No visitor data available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Country Statistics */}
          <div className="space-y-3 relative z-10">
            {visitorDistribution && visitorDistribution.length > 0 ? (
              visitorDistribution.map((country, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: country.color }}
                      ></div>
                      <span className="text-lg">{country.flag}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {country.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {country.value} visitors
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {country.percentage}%
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {distributionLoading ? "Loading countries..." : "No visitor data available"}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 relative z-10">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total countries
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {visitorDistribution?.length || 0}
            </span>
          </div>
        </div>

        {/* Recent Visitors Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Recent Visitors
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Last 24 hours activity
              </p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
              {formattedRecentVisitors.length} recent
            </span>
          </div>

          <div className="overflow-x-auto -mx-6 px-6 mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 uppercase tracking-wider">
                  <th className="py-3 px-4 first:pl-0">IP Address</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Device</th>
                  <th className="py-3 px-4">Browser</th>
                  <th className="py-3 px-4 text-center">Pages</th>
                  <th className="py-3 px-4 text-right first:pr-0">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                {visitorsLoading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500 dark:text-gray-400">
                      Loading visitors...
                    </td>
                  </tr>
                ) : visitorsError ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-red-500">
                      Failed to load visitors data
                    </td>
                  </tr>
                ) : formattedRecentVisitors.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500 dark:text-gray-400">
                      No recent visitors
                    </td>
                  </tr>
                ) : (
                  formattedRecentVisitors.map((visitor) => (
                    <tr
                      key={visitor.id}
                      className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-4 px-4 first:pl-0 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {visitor.ip}
                      </td>
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                        <div className="flex flex-col">
                          <span className="font-medium">{visitor.country}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {visitor.city}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <visitor.deviceIcon
                            className={`w-4 h-4 ${visitor.deviceColor}`}
                          />
                          {visitor.device}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded">
                          {visitor.browser}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-gray-700 dark:text-gray-300">
                        <div className="flex items-center justify-center gap-1">
                          <Eye className="w-4 h-4 text-gray-400" />
                          {visitor.pages}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right first:pr-0">
                        <button className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-auto pt-4 text-center border-t border-gray-100 dark:border-gray-700">
            <button className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium text-sm flex items-center justify-center gap-1 mx-auto">
              View all visitors
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Performing Pages */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Top Performing Pages
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Most viewed pages by visitors
            </p>
          </div>
          <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                <th className="py-4 px-4 pl-0">Page URL</th>
                <th className="py-4 px-4 text-center">Views</th>
                <th className="py-4 px-4 text-center">Visitors</th>
                <th className="py-4 px-4 text-center">Avg Time</th>
                <th className="py-4 px-4 pr-0 text-center">Bounce Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {pagesLoading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    Loading pages data...
                  </td>
                </tr>
              ) : pagesError ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-red-500">
                    Failed to load pages data
                  </td>
                </tr>
              ) : !topPages || topPages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No page data available
                  </td>
                </tr>
              ) : (
                topPages.map((page) => (
                  <tr
                    key={page.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-5 px-4 pl-0">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${page.color}`}
                        ></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {page.url}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {page.path}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-md">
                        {page.views}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-center text-gray-700 dark:text-gray-300 text-sm font-medium">
                      {page.visitors}
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-md">
                        {page.avgTime}
                      </span>
                    </td>
                    <td className="py-5 px-4 pr-0 text-center">
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                        {page.bounceRate}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
