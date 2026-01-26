import React, { useState, useEffect } from "react";

const TechnologiesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const technologies = [
    {
      id: 1,
      name: "React",
      icon: "fa-brands fa-react",
      color: "#61DAFB",
      description: "Modern UI Library",
    },
    {
      id: 2,
      name: "Node.js",
      icon: "fa-brands fa-node-js",
      color: "#339933",
      description: "Backend Runtime",
    },
    {
      id: 3,
      name: "PHP",
      icon: "fa-brands fa-php",
      color: "#777BB4",
      description: "Server-side Language",
    },
    {
      id: 4,
      name: "Laravel",
      icon: "fa-brands fa-laravel",
      color: "#FF2D20",
      description: "PHP Framework",
    },
    {
      id: 5,
      name: "MySQL",
      icon: "fa-solid fa-database",
      color: "#4479A1",
      description: "Relational Database",
    },
    {
      id: 6,
      name: "MongoDB",
      icon: "fa-solid fa-leaf",
      color: "#47A248",
      description: "NoSQL Database",
    },
    {
      id: 7,
      name: "Flutter",
      icon: "fa-solid fa-mobile-screen-button",
      color: "#02569B",
      description: "Mobile Framework",
    },
    {
      id: 8,
      name: "Vue.js",
      icon: "fa-brands fa-vuejs",
      color: "#4FC08D",
      description: "Progressive Framework",
    },
    {
      id: 9,
      name: "Python",
      icon: "fa-brands fa-python",
      color: "#3776AB",
      description: "Versatile Language",
    },
    {
      id: 10,
      name: "Docker",
      icon: "fa-brands fa-docker",
      color: "#2496ED",
      description: "Containerization",
    },
    {
      id: 11,
      name: "AWS",
      icon: "fa-brands fa-aws",
      color: "#FF9900",
      description: "Cloud Platform",
    },
    {
      id: 12,
      name: "Git",
      icon: "fa-brands fa-git-alt",
      color: "#F05032",
      description: "Version Control",
    },
    {
      id: 13,
      name: "JavaScript",
      icon: "fa-brands fa-js-square",
      color: "#F7DF1E",
      description: "Programming Language",
    },
    {
      id: 14,
      name: "TypeScript",
      icon: "fa-brands fa-js-square",
      color: "#3178C6",
      description: "Typed JavaScript",
    },
  ];

  // Continuous rotation
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % technologies.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, [isHovered, technologies.length]);

  // Get visible technologies (7 at a time in a circular manner)
  const getVisibleTechnologies = () => {
    const visibleCount = 7;
    const visible = [];

    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % technologies.length;
      visible.push({
        ...technologies[index],
        position: i,
        isCenter: i === Math.floor(visibleCount / 2), // Center item (index 3)
      });
    }

    return visible;
  };

  return (
    <section className="w-full max-w-7xl mx-auto py-8 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10 lg:mb-12">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          <i className="fas fa-code text-sm"></i>
          Our Tech Stack
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
          Technologies We Use
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
          Continuously evolving with the latest technologies to deliver
          exceptional results
        </p>
      </div>

      {/* Rotating Carousel */}
      <div
        className="relative overflow-hidden py-4 sm:py-6 lg:py-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex justify-center items-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6">
          {getVisibleTechnologies().map((tech) => (
            <TechCardCarousel
              key={`${tech.id}-${tech.position}`}
              tech={tech}
              isCenter={tech.isCenter}
              position={tech.position}
            />
          ))}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 lg:w-20 bg-gradient-to-r from-gray-50 dark:from-slate-900 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 lg:w-20 bg-gradient-to-l from-gray-50 dark:from-slate-900 to-transparent pointer-events-none"></div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mt-4 sm:mt-6 lg:mt-8">
        <div className="flex items-center space-x-1">
          {technologies.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-6 sm:w-8 bg-blue-500"
                  : "w-1.5 sm:w-2 bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Manual Controls */}
      <div className="flex justify-center items-center mt-4 sm:mt-6 space-x-3 sm:space-x-4">
        <button
          onClick={() =>
            setCurrentIndex(
              (prev) => (prev - 1 + technologies.length) % technologies.length
            )
          }
          className="p-2 sm:p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          <i className="fas fa-chevron-left text-sm"></i>
        </button>

        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 min-w-[80px] sm:min-w-[100px] text-center">
          {currentIndex + 1} of {technologies.length}
        </span>

        <button
          onClick={() =>
            setCurrentIndex((prev) => (prev + 1) % technologies.length)
          }
          className="p-2 sm:p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          <i className="fas fa-chevron-right text-sm"></i>
        </button>
      </div>
    </section>
  );
};

const TechCardCarousel = ({ tech, isCenter, position }) => {
  // Calculate scale and opacity based on position
  const getTransform = () => {
    const distance = Math.abs(position - 3); // Distance from center (position 3)
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 1024;
    
    let scale, opacity, translateY;
    
    if (isMobile) {
      scale = isCenter ? 1.1 : Math.max(0.8, 1 - distance * 0.1);
      opacity = isCenter ? 1 : Math.max(0.5, 1 - distance * 0.15);
      translateY = isCenter ? -5 : distance * 2;
    } else if (isTablet) {
      scale = isCenter ? 1.15 : Math.max(0.75, 1 - distance * 0.12);
      opacity = isCenter ? 1 : Math.max(0.45, 1 - distance * 0.18);
      translateY = isCenter ? -8 : distance * 4;
    } else {
      scale = isCenter ? 1.2 : Math.max(0.7, 1 - distance * 0.15);
      opacity = isCenter ? 1 : Math.max(0.4, 1 - distance * 0.2);
      translateY = isCenter ? -10 : distance * 5;
    }

    return { scale, opacity, translateY };
  };

  const { scale, opacity, translateY } = getTransform();

  return (
    <div
      className={`flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 lg:p-6 bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-lg transition-all duration-500 cursor-default min-w-[60px] sm:min-w-[80px] md:min-w-[100px] lg:min-w-[120px] ${
        isCenter ? "ring-1 sm:ring-2 ring-blue-500 ring-opacity-50" : ""
      }`}
      style={{
        transform: `scale(${scale}) translateY(${translateY}px)`,
        opacity,
        zIndex: isCenter ? 10 : 1,
      }}
    >
      {/* Icon */}
      <div
        className={`mb-1 sm:mb-2 md:mb-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl transition-all duration-300 ${
          isCenter ? "animate-pulse" : ""
        }`}
        style={{ color: tech.color }}
      >
        <i className={tech.icon}></i>
      </div>

      {/* Technology Name */}
      <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-xs sm:text-sm md:text-base text-center leading-tight">
        {tech.name}
      </h3>

      {/* Description (only show for center item on larger screens) */}
      {isCenter && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1 opacity-0 animate-fade-in hidden sm:block">
          {tech.description}
        </p>
      )}

      {/* Glow effect for center item */}
      {isCenter && (
        <div
          className="absolute inset-0 rounded-lg sm:rounded-xl opacity-10 sm:opacity-20 blur-xl"
          style={{ backgroundColor: tech.color }}
        ></div>
      )}
    </div>
  );
};

export default TechnologiesCarousel;
