import React from 'react';
import { Calendar, User, FileText } from 'lucide-react';

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      user: 'Super Admin',
      action: 'Logged in: User logged in',
      timestamp: '30 minutes ago',
      date: '06/01/2026, 10:35:14',
      ip: '122.152.51.53',
      type: 'login',
      icon: User
    },
    {
      id: 2,
      user: 'Super Admin',
      action: 'Logged in: User logged in',
      timestamp: 'about 20 hours ago',
      date: '05/01/2026, 15:08:13',
      ip: '122.152.51.53',
      type: 'login',
      icon: User
    },
    {
      id: 3,
      user: 'Super Admin',
      action: 'Logged in: User logged in',
      timestamp: '1 day ago',
      date: '04/01/2026, 21:10:54',
      ip: '37.111.211.80',
      type: 'login',
      icon: User
    },
    {
      id: 4,
      user: 'Super Admin',
      action: 'Logged in: User logged in',
      timestamp: '1 day ago',
      date: '04/01/2026, 19:53:00',
      ip: '113.11.61.102',
      type: 'login',
      icon: User
    },
    {
      id: 5,
      user: 'Super Admin',
      action: 'Performed an action: Updated contact #3 status to read',
      timestamp: '1 day ago',
      date: '04/01/2026, 18:28:06',
      ip: '122.152.51.53',
      type: 'action',
      icon: FileText
    },
    {
      id: 6,
      user: 'Super Admin',
      action: 'Logged in: User logged in',
      timestamp: '1 day ago',
      date: '04/01/2026, 18:20:10',
      ip: '122.152.51.53',
      type: 'login',
      icon: User
    }
  ];

  const getIconBgColor = (type) => {
    return type === 'action' 
      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activities</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Latest actions performed in the system</p>
        </div>
        <button className="px-3 py-1.5 text-sm font-medium text-red-500 border border-red-200 dark:border-red-900/50 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          Clear
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {activities.map((activity, index) => (
            <li key={activity.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIconBgColor(activity.type)}`}>
                  <activity.icon className="w-5 h-5" />
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
                    <div className="flex items-center gap-1">
                      <span>IP: {activity.ip}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentActivities;