import React from 'react';

const TeamMemberCard = ({ member, isCurrentSlide, index, isVisible }) => {
  const { name, position, initial, description, color, shadowColor } = member;

  return (
    <div
      className={`card snap-center shrink-0 bg-card-light dark:bg-card-dark border border-gray-100 dark:border-gray-700 text-center transition-all duration-700 flex flex-col items-center relative overflow-hidden group ${
        isCurrentSlide
          ? 'w-[340px] shadow-2xl shadow-purple-500/20 dark:shadow-none transform scale-110 opacity-100 z-20 border-purple-200 dark:border-purple-800'
          : 'w-[300px] shadow-lg opacity-70 hover:opacity-90 hover:scale-105 z-10'
      } ${isVisible ? `animate-fade-in-up delay-${index * 100}` : 'opacity-0 translate-y-10'}`}
      style={{
        animationDelay: `${index * 200}ms`
      }}
    >
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      {/* Floating Particles Effect */}
      {isCurrentSlide && (
        <>
          <div className="absolute top-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-float opacity-60"></div>
          <div className="absolute top-8 right-6 w-1 h-1 bg-pink-400 rounded-full animate-float-delayed opacity-40"></div>
          <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-float-slow opacity-50"></div>
        </>
      )}

      <div className="card-body p-8 items-center relative z-10">
        {/* Enhanced Avatar/Initial */}
        <div className="relative mb-6 group-hover:scale-110 transition-transform duration-500">
          <div
            className={`rounded-full border-2 flex items-center justify-center font-bold text-secondary mb-0 bg-secondary/5 relative overflow-hidden ${
              isCurrentSlide
                ? 'w-32 h-32 text-5xl border-secondary shadow-2xl animate-pulse-slow'
                : 'w-28 h-28 text-4xl border-secondary/30 group-hover:border-secondary/60'
            }`}
          >
            {/* Animated Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
            
            {/* Initial Letter */}
            <span className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
              {initial}
            </span>
            
            {/* Rotating Border Effect */}
            {isCurrentSlide && (
              <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-spin-slow opacity-30"></div>
            )}
          </div>
          
          {/* Glow Effect */}
          {isCurrentSlide && (
            <div className={`absolute inset-0 rounded-full ${shadowColor} blur-xl opacity-30 animate-pulse`}></div>
          )}
        </div>

        {/* Enhanced Name with Typing Animation */}
        <h3
          className={`font-bold mb-2 text-gray-800 dark:text-white transition-all duration-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 ${
            isCurrentSlide ? 'text-2xl' : 'text-xl'
          }`}
        >
          <span className={isCurrentSlide ? 'animate-type-writer' : ''}>
            {name}
          </span>
        </h3>

        {/* Enhanced Position */}
        <div className="relative mb-4">
          <p className="text-secondary dark:text-indigo-400 font-semibold text-sm transition-all duration-300 group-hover:scale-105">
            {position}
          </p>
          {isCurrentSlide && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 animate-expand-width"></div>
          )}
        </div>

        {/* Enhanced Description with Reveal Animation */}
        <div className="relative overflow-hidden">
          <p className={`text-sm text-muted-light dark:text-muted-dark leading-relaxed transition-all duration-500 ${
            isCurrentSlide ? 'animate-fade-in-up' : ''
          }`}>
            {description}
          </p>
        </div>

        {/* Skill Tags (only for active cards) */}
        {isCurrentSlide && (
          <div className="flex flex-wrap gap-2 mt-4 animate-fade-in-up delay-300">
            {getSkillTags(position).map((skill, idx) => (
              <span
                key={idx}
                className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${color} text-white font-medium shadow-sm animate-bounce-in`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Interactive Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>

      {/* Card Border Glow Effect */}
      {isCurrentSlide && (
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-20 animate-pulse"></div>
      )}
    </div>
  );
};

// Helper function to get skill tags based on position
const getSkillTags = (position) => {
  const skillMap = {
    "Frontend Developer": ["React", "TypeScript", "CSS"],
    "Chief Technology Officer": ["Leadership", "Architecture", "Strategy"],
    "Lead UI/UX Designer": ["Figma", "Design Systems", "User Research"],
    "Senior Full Stack Developer": ["Node.js", "React", "AWS"]
  };
  return skillMap[position] || ["Tech", "Innovation", "Excellence"];
};

export default TeamMemberCard;