import React, { useState, useEffect } from 'react';

const TechnologiesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const technologies = [
    {
      id: 1,
      name: 'React',
      icon: 'fa-brands fa-react',
      color: '#61DAFB',
      description: 'Modern UI Library'
    },
    {
      id: 2,
      name: 'Node.js',
      icon: 'fa-brands fa-node-js',
      color: '#339933',
      description: 'Backend Runtime'
    },
    {
      id: 3,
      name: 'PHP',
      icon: 'fa-brands fa-php',
      color: '#777BB4',
      description: 'Server-side Language'
    },
    {
      id: 4,
      name: 'Laravel',
      icon: 'fa-brands fa-laravel',
      color: '#FF2D20',
      description: 'PHP Framework'
    },
    {
      id: 5,
      name: 'MySQL',
      icon: 'fa-solid fa-database',
      color: '#4479A1',
      description: 'Relational Database'
    },
    {
      id: 6,
      name: 'MongoDB',
      icon: 'fa-solid fa-leaf',
      color: '#47A248',
      description: 'NoSQL Database'
    },
    {
      id: 7,
      name: 'Flutter',
      icon: 'fa-solid fa-mobile-screen-button',
      color: '#02569B',
      description: 'Mobile Framework'
    },
    {
      id: 8,
      name: 'Vue.js',
      icon: 'fa-brands fa-vuejs',
      color: '#4FC08D',
      description: 'Progressive Framework'
    },
    {
      id: 9,
      name: 'Python',
      icon: 'fa-brands fa-python',
      color: '#3776AB',
      description: 'Versatile Language'
    },
    {
      id: 10,
      name: 'Docker',
      icon: 'fa-brands fa-docker',
      color: '#2496ED',
      description: 'Containerization'
    },
    {
      id: 11,
      name: 'AWS',
      icon: 'fa-brands fa-aws',
      color: '#FF9900',
      description: 'Cloud Platform'
    },
    {
      id: 12,
      name: 'Git',
      icon: 'fa-brands fa-git-alt',
      color: '#F05032',
      description: 'Version Control'
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(technologies.length / 7));
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, technologies.length]);

  // Get visible technologies for current slide
  const getVisibleTechnologies = () => {
    const itemsPerSlide = 7;
    const startIndex = currentSlide * itemsPerSlide;
    return technologies.slice(startIndex, startIndex + itemsPerSlide);
  };

  const totalSlides = Math.ceil(technologies.length / 7);

  return (
    <section className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium mb-4">
          <i className="fas fa-code"></i>
          Our Tech Stack
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Technologies We Use
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          We leverage cutting-edge technologies to build robust, scalable, and modern solutions
        </p>
      </div>

      {/* Technologies Grid with Slide Animation */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                {technologies
                  .slice(slideIndex * 7, slideIndex * 7 + 7)
                  .map((tech, index) => (
                    <TechCard 
                      key={tech.id} 
                      tech={tech} 
                      index={index}
                      isVisible={slideIndex === currentSlide}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center items-center mt-8 space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 5000);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-blue-500 w-8' 
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
          />
        ))}
      </div>

      {/* Auto-play Control */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          <i className={`fas ${isAutoPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          {isAutoPlaying ? 'Pause' : 'Play'} Auto-slide
        </button>
      </div>
    </section>
  );
};

const TechCard = ({ tech, index, isVisible }) => {
  return (
    <div 
      className={`group flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 cursor-default ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-70 translate-y-4'
      }`}
      style={{ 
        transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
        animationDelay: `${index * 100}ms`
      }}
    >
      {/* Icon with Pulse Animation */}
      <div 
        className="mb-3 text-4xl group-hover:scale-125 transition-all duration-300 relative"
        style={{ color: tech.color }}
      >
        <i className={tech.icon}></i>
        <div 
          className="absolute inset-0 rounded-full opacity-20 group-hover:animate-ping"
          style={{ backgroundColor: tech.color }}
        ></div>
      </div>

      {/* Technology Name */}
      <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-sm md:text-base mb-1 text-center">
        {tech.name}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {tech.description}
      </p>

      {/* Hover Effect Border */}
      <div 
        className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-current opacity-0 group-hover:opacity-30 transition-all duration-300"
        style={{ borderColor: tech.color }}
      ></div>
    </div>
  );
};

export default TechnologiesSection;