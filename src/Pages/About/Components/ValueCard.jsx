import { useState } from 'react';

const ValueCard = ({ icon, title, description, gradient, shadowColor }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="card bg-card-light dark:bg-card-dark shadow-soft dark:shadow-none border border-transparent dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 h-full group cursor-pointer overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      <div className="card-body items-center text-center p-8 relative z-10">
        {/* Icon Container */}
        <div className="mb-6 relative">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg ${shadowColor} transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500`}>
            <span className={`material-icons-round text-4xl transition-transform duration-300 ${isHovered ? 'animate-pulse' : ''}`}>
              {icon}
            </span>
          </div>
          
          {/* Floating particles effect */}
          <div className={`absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r ${gradient} rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300`}></div>
          <div className={`absolute -bottom-2 -left-2 w-2 h-2 bg-gradient-to-r ${gradient} rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300 delay-100`}></div>
        </div>

        {/* Title */}
        <h3 className="card-title text-2xl font-bold text-gray-900 dark:text-white mb-4 justify-center group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm md:text-base group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ValueCard;