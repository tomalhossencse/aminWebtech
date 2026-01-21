import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useVisitorDetails } from '../../../hooks/useAnalytics';
import { 
  ArrowLeft, 
  Globe, 
  Monitor, 
  Smartphone, 
  MapPin, 
  Clock, 
  Eye, 
  ExternalLink,
  Shield,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Activity,
  User,
  Settings
} from 'lucide-react';

const VisitorDetailPage = () => {
  const { visitorId } = useParams();
  const navigate = useNavigate();
  const [isBlocking, setIsBlocking] = useState(false);

  // Fetch visitor details using the hook
  const {
    data: visitor,
    isLoading: loading,
    error,
    refetch
  } = useVisitorDetails(visitorId);

  // Mock visitor data fallback for development
  const mockVisitor = {
    id: visitorId,
    sessionId: '13a35d02-151f-46cd-b210-882c1f1a1286',
    ip: '17.246.23.140',
    country: 'United States',
    city: 'Cupertino',
    region: 'California',
    countryCode: 'US',
    device: 'Desktop',
    browser: 'Safari',
    browserVersion: '17.2',
    os: 'macOS',
    osVersion: '14.2',
    screenResolution: '1920x1080',
    language: 'en-US',
    timezone: 'America/Los_Angeles',
    referrer: 'Direct',
    landingPage: '/',
    exitPage: '/cookie-policy',
    visitTime: '08:06 AM',
    duration: '0s',
    pages: 1,
    status: 'New Visitor',
    isBlocked: false,
    firstVisit: new Date('2024-01-21T08:06:00'),
    lastActivity: new Date('2024-01-21T08:06:00'),
    totalSessions: 1,
    totalPageViews: 1,
    avgSessionDuration: '0s',
    bounceRate: 100,
    pageHistory: [
      {
        id: 1,
        url: '/cookie-policy',
        title: 'Cookie Policy',
        timestamp: '08:06 AM',
        timeOnPage: '0s',
        isExit: true
      }
    ],
    technicalInfo: {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
      viewport: '1920x1080',
      colorDepth: '24-bit',
      cookiesEnabled: true,
      javaEnabled: false,
      plugins: ['PDF Viewer', 'Chrome PDF Plugin'],
      connectionType: 'wifi'
    }
  };

  // Use actual data if available, otherwise fall back to mock data
  const visitorData = visitor || mockVisitor;

  const handleBlockVisitor = async () => {
    try {
      setIsBlocking(true);
      // Implement block visitor functionality
      console.log('Block visitor:', visitorId);
      // You can add API call here to block the visitor
      // await axios.post(`/analytics/visitor/${visitorId}/block`);
      
      // Refetch data after blocking
      await refetch();
    } catch (error) {
      console.error('Error blocking visitor:', error);
    } finally {
      setIsBlocking(false);
    }
  };

  const handleExportData = () => {
    // Implement export functionality
    const dataToExport = {
      visitorId: visitorData.id,
      sessionId: visitorData.sessionId,
      ip: visitorData.ip,
      location: {
        country: visitorData.country,
        city: visitorData.city,
        region: visitorData.region
      },
      device: {
        type: visitorData.device,
        browser: visitorData.browser,
        os: visitorData.os
      },
      session: {
        landingPage: visitorData.landingPage,
        exitPage: visitorData.exitPage,
        duration: visitorData.duration,
        pages: visitorData.pages
      },
      pageHistory: visitorData.pageHistory
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-${visitorId}-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Export visitor data:', visitorId);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !visitorData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Visitor Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {error || 'The visitor you are looking for could not be found.'}
          </p>
          <button
            onClick={() => navigate('/dashboard/analytics')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Analytics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/analytics')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Visitor Journey
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Session ID: {visitorData.sessionId}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleBlockVisitor}
            disabled={isBlocking}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              visitorData.isBlocked
                ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            {isBlocking ? 'Processing...' : (visitorData.isBlocked ? 'Unblock Visitor' : 'Block Visitor')}
          </button>
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visitor Profile */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Visitor Profile
                  </h2>
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {visitorData.ip}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {visitorData.pages}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Pages
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {visitorData.duration}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Duration
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      visitorData.status === 'New Visitor' 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {visitorData.status === 'New Visitor' ? 'New' : 'Returning'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Status
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                      Direct
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Referrer
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page Visit History */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Page Visit History
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Timeline of pages visited during this session
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full">
                  {visitorData.pageHistory.length} pages
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-full">
                  {visitorData.duration} total
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {visitorData.pageHistory.map((page, index) => (
                <div
                  key={page.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {page.url}
                      </h4>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                      {page.isExit && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium rounded">
                          Exit Page
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {page.title}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {page.timestamp}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {page.timeOnPage}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Data captured by analytics system. All times are in local timezone.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Session started at {visitorData.visitTime}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Location Details */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Location Details
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Geographic information
            </p>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Country</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {visitorData.country}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">City</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {visitorData.city}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Region</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {visitorData.region}
                </span>
              </div>
            </div>
          </div>

          {/* Device Information */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Device Information
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Technical specifications
            </p>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Device Type</span>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {visitorData.device}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Browser</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                  {visitorData.browser}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Operating System</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {visitorData.os}
                </span>
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Session Details
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Visit information
            </p>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Landing Page</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {visitorData.landingPage}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Exit Page</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {visitorData.exitPage}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Visit Time</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {visitorData.visitTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorDetailPage;