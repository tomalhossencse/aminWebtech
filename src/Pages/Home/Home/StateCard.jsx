export const StatCard = ({ icon, bgColor, number, label }) => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-gray-700 flex flex-col items-center">
      <div
        className={`w-16 h-16 ${bgColor} rounded-xl mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
      >
        <span className="material-icons-outlined text-white text-3xl">
          {icon}
        </span>
      </div>
      <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {number}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 font-medium">{label}</p>
    </div>
  );
};
