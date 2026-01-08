import React, { useState, useRef, useEffect } from "react";
import TeamMemberCard from "./TeamMemberCard";

const DreamTeamSection = () => {
  const [currentSlide, setCurrentSlide] = useState(1); // Start with middle card active
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);

  const teamMembers = [
    {
      id: 1,
      name: "Saif Uddin",
      position: "Frontend Developer",
      initial: "S",
      description:
        "Crafting responsive and interactive user interfaces with modern web technologies and cutting-edge frameworks.",
      isActive: false,
      color: "from-blue-500 to-cyan-500",
      shadowColor: "shadow-blue-500/30",
    },
    {
      id: 2,
      name: "Aminul Islam",
      position: "Chief Technology Officer",
      initial: "A",
      description:
        "10+ years experience in software architecture and team leadership, driving innovation and excellence.",
      isActive: true,
      color: "from-purple-500 to-pink-500",
      shadowColor: "shadow-purple-500/30",
    },
    {
      id: 3,
      name: "Fatima Rahman",
      position: "Lead UI/UX Designer",
      initial: "F",
      description:
        "Specialized in user-centered design and design systems, creating beautiful and intuitive experiences.",
      isActive: true,
      color: "from-emerald-500 to-teal-500",
      shadowColor: "shadow-emerald-500/30",
    },
    {
      id: 4,
      name: "Rahim Ali",
      position: "Senior Full Stack Developer",
      initial: "R",
      description:
        "Expert in React, Node.js and scalable cloud infrastructure solutions with modern DevOps practices.",
      isActive: false,
      color: "from-orange-500 to-red-500",
      shadowColor: "shadow-orange-500/30",
    },
  ];

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % teamMembers.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [teamMembers.length]);

  const scrollLeft = () => {
    const newSlide =
      currentSlide === 0 ? teamMembers.length - 1 : currentSlide - 1;
    setCurrentSlide(newSlide);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: newSlide * 340,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    const newSlide = (currentSlide + 1) % teamMembers.length;
    setCurrentSlide(newSlide);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: newSlide * 340,
        behavior: "smooth",
      });
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: index * 340,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-background-light dark:bg-background-dark">
      <div
        ref={sectionRef}
        className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full relative z-10  transition-all duration-700"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl animate-bounce"></div>
        </div>

        {/* Section Header with Staggered Animations */}
        <div
          className={`text-center mb-20 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Animated Badge */}
          <div
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white font-semibold border-none shadow-2xl mb-8 cursor-default gap-2 transform transition-all duration-700 hover:scale-110 hover:rotate-1 hover:shadow-purple-500/50 ${
              isVisible ? "animate-bounce" : ""
            }`}
          >
            <span className="material-icons text-lg animate-spin-slow">
              groups
            </span>
            <span className="tracking-wide">Meet The Team</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
          </div>

          {/* Animated Main Heading */}
          <h2
            className={`text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-text-light dark:text-white transform transition-all duration-1000 delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            The{" "}
            <span className="relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 animate-gradient-x">
                Dream Team
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 animate-scale-x origin-left"></div>
            </span>
          </h2>

          {/* Animated Description */}
          <p
            className={`text-xl text-muted-light dark:text-muted-dark max-w-3xl mx-auto leading-relaxed transform transition-all duration-1000 delay-400 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            Passionate experts dedicated to delivering outstanding results and
            pushing the boundaries of innovation
          </p>
        </div>

        {/* Enhanced Team Carousel */}
        <div
          className={`relative w-full transform transition-all duration-1000 delay-600 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Enhanced Left Navigation Button */}
          <button
            onClick={scrollLeft}
            className="btn btn-circle absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-2xl border-2 border-purple-200 dark:border-purple-800 group hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:scale-110"
          >
            <span className="material-icons group-hover:-translate-x-1 transition-all duration-300 group-hover:text-purple-600">
              chevron_left
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </button>

          {/* Enhanced Team Members Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto no-scrollbar py-12 px-6 justify-start lg:justify-center items-stretch snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {teamMembers.map((member, index) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                isCurrentSlide={currentSlide === index}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* Enhanced Right Navigation Button */}
          <button
            onClick={scrollRight}
            className="btn btn-circle absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-2xl border-2 border-purple-200 dark:border-purple-800 group hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:scale-110"
          >
            <span className="material-icons group-hover:translate-x-1 transition-all duration-300 group-hover:text-purple-600">
              chevron_right
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Enhanced Pagination Dots */}
        <div
          className={`flex justify-center gap-3 mt-12 transform transition-all duration-1000 delay-800 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {teamMembers.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`relative w-4 h-4 rounded-full transition-all duration-500 transform hover:scale-125 ${
                currentSlide === index
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50 scale-110"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-purple-400 dark:hover:bg-purple-500"
              }`}
            >
              {currentSlide === index && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-ping opacity-75"></div>
              )}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="flex justify-center mt-8">
          <div className="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-4000 ease-linear"
              style={{
                width: `${((currentSlide + 1) / teamMembers.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DreamTeamSection;
