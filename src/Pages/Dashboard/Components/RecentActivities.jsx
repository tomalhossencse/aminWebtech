import React, { useState } from 'react';
import { Calendar, User, FileText, Trash2 } from 'lucide-react';
import useActivitiesAPI from '../../../hooks/useActivitiesAPI';
import { useToast } from '../../../Context/ToastContext';
import ConfirmDialog from '../../../components/ConfirmDialog';

// Loading skeleton for activities
const ActivitySkeleton = () => (
  <li className="p-5 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="flex gap-4">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    </div>
  </li>
);

const RecentActivities = () => {
  const { activities, loading, clearActivities } = useActivitiesAPI();
  const { success, error } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const getIconBgColor = (type) => {
    return type === 'action' 
      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400';
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'User':
        return User;
      case 'FileText':
        return FileText;
      default:
        return FileText;
    }
  };

  const handleClearActivities = async () => {
    setShowConfirmDialog(true);
  };

  const confirmClearActivities = async () => {
    try {
      setIsClearing(true);
      setShowConfirmDialog(false);
      
      await clearActivities();
      success('All activities have been cleared successfully');
    } catch (err) {
      console.error('Failed to clear activities:', err);
      error('Failed to clear activities. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  const cancelClearActivities = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activities</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 dark:border-blue-400 mr-2"></div>
                Loading activities...
              </span>
            ) : (
              'Latest actions performed in the system'
            )}
          </p>
        </div>
        <button 
          onClick={handleClearActivities}
          disabled={loading || isClearing || activities.length === 0}
          className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 dark:border-red-900/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          {isClearing ? 'Clearing...' : 'Clear All'}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: 4 }).map((_, index) => (
              <ActivitySkeleton key={index} />
            ))}
          </ul>
        ) : activities.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {activities.map((activity, index) => {
              const IconComponent = getIconComponent(activity.icon);
              return (
                <li key={activity.id || index} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIconBgColor(activity.type)}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{activity.user}</h3>
                        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2">
                          {activity.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{activity.action}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{activity.date}</span>
                        </div>
                        {activity.ip && activity.ip !== 'N/A' && (
                          <div className="flex items-center gap-1">
                            <span>IP: {activity.ip}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
            <FileText className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">No recent activities</p>
            <p className="text-xs mt-1">Activities will appear here when actions are performed</p>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={cancelClearActivities}
        onConfirm={confirmClearActivities}
        title="Clear All Activities"
        message="Are you sure you want to clear all recent activities? This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default RecentActivities;