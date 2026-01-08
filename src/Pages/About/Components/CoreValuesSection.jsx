import { useState, useEffect, useRef } from "react";
import ValueCard from "./ValueCard";

const CoreValuesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const values = [
    {
      id: 1,
      icon: "track_changes",
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, delivering high-quality solutions that exceed expectations.",
      gradient: "from-amber-400 to-orange-500",
      shadowColor: "shadow-orange-500/30",
    },
    {
      id: 2,
      icon: "groups",
      title: "Collaboration",
      description:
        "We believe in working closely with our clients to understand their needs and achieve shared success.",
      gradient: "from-cyan-400 to-blue-500",
      shadowColor: "shadow-blue-500/30",
    },
    {
      id: 3,
      icon: "visibility",
      title: "Transparency",
      description:
        "We maintain open communication and transparency throughout the project lifecycle.",
      gradient: "from-emerald-400 to-green-500",
      shadowColor: "shadow-green-500/30",
    },
    {
      id: 4,
      icon: "rocket_launch",
      title: "Innovation",
      description:
        "We constantly explore new technologies and methodologies to provide cutting-edge solutions.",
      gradient: "from-pink-400 to-rose-500",
      shadowColor: "shadow-pink-500/30",
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="flex-grow py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-gray-100 transition-colors duration-300"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-[100px] opacity-60 animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 dark:bg-purple-900/20 rounded-full blur-[100px] opacity-60 animate-float-delayed"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 md:mb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className={`badge badge-lg px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-none shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 cursor-default mb-8 gap-2 ${isVisible ? 'animate-bounce-in' : ''}`}>
            <span className="material-icons-round text-sm">favorite</span>
            <span className="text-sm font-semibold tracking-wide">
              Our Principles
            </span>
          </div>

          {/* Main Heading */}
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Core Values That <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x">
              Drive Us
            </span>
          </h1>

          {/* Description */}
          <p className={`text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            These principles guide our decisions and define our company culture
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={value.id}
              className={`transition-all duration-1000 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${600 + index * 150}ms`
              }}
            >
              <ValueCard {...value} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;