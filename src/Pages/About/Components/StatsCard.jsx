import React from "react";

const StatsCard = ({ icon, bgColor, number, label }) => {
  return (
    <div className="card bg-card-light dark:bg-card-dark shadow-soft hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-gray-700">
      <div className="card-body items-center text-center p-8">
        <div
          className={`w-16 h-16 ${bgColor} rounded-xl mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
        >
          <span className="material-icons-outlined text-white text-3xl">
            {icon}
          </span>
        </div>
        <div className="stat-value text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {number}
        </div>
        <div className="stat-desc text-gray-500 dark:text-gray-400 font-medium">
          {label}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
