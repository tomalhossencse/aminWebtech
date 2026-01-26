import { useState, useEffect, useRef } from "react";

const CollaborativeHeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    {
      value: "24/7",
      label: "Support",
      icon: "support_agent",
    },
    {
      value: "30-Day",
      label: "Money Back",
      icon: "verified_user",
    },
    {
      value: "100%",
      label: "Satisfaction",
      icon: "thumb_up",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      },
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

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center px-6 md:px-0 justify-center overflow-hidden"
    >
      {/* Enhanced Background Layers */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-500"></div>

      {/* Secondary Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-transparent via-purple-50/50 to-pink-50/30 dark:from-transparent dark:via-purple-900/30 dark:to-pink-900/20 transition-all duration-500"></div>

      {/* Animated Gradient Mesh */}
      <div className="absolute inset-0 z-0 opacity-60 dark:opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/20 via-purple-500/15 to-pink-500/20 dark:from-blue-500/30 dark:via-purple-600/25 dark:to-pink-600/30 animate-gradient-x"></div>
      </div>

      {/* Hero Pattern Background */}
      <div
        className="absolute inset-0 z-0 opacity-10 dark:opacity-20 bg-cover bg-center mix-blend-overlay pointer-events-none transition-opacity duration-500"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')",
        }}
      ></div>

      {/* Enhanced Light Mode Floating Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Primary Blobs */}
        <div className="absolute top-[-15%] left-[-15%] w-[500px] h-[500px] bg-gradient-to-br from-blue-300/40 via-indigo-400/30 to-purple-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-float blob-animated"></div>
        <div className="absolute top-[-10%] right-[-15%] w-[450px] h-[450px] bg-gradient-to-br from-purple-300/40 via-pink-400/30 to-rose-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed blob-animated"></div>
        <div className="absolute bottom-[-20%] left-[15%] w-[400px] h-[400px] bg-gradient-to-br from-cyan-300/40 via-blue-400/30 to-indigo-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow blob-animated"></div>

        {/* Secondary Accent Blobs */}
        <div className="absolute top-[20%] right-[20%] w-[200px] h-[200px] bg-gradient-to-br from-yellow-300/30 to-orange-400/30 rounded-full mix-blend-multiply filter blur-2xl animate-pulse opacity-60"></div>
        <div className="absolute bottom-[30%] right-[10%] w-[150px] h-[150px] bg-gradient-to-br from-emerald-300/30 to-teal-400/30 rounded-full mix-blend-multiply filter blur-2xl animate-float opacity-50"></div>

        {/* Dark Mode Enhancements */}
        <div className="dark:block hidden">
          <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full filter blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-[20%] right-[15%] w-[250px] h-[250px] bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full filter blur-3xl animate-float"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center py-20 lg:py-32">
        {/* Ready to Begin Badge */}
        <div
          className={`mb-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <button className="group btn btn-outline btn-sm rounded-full border-2 bg-white/20 dark:bg-black/20 backdrop-blur-md hover:bg-white/30 dark:hover:bg-black/30 border-white/30 dark:border-white/20 hover:border-white/50 dark:hover:border-white/30 transition-all duration-300 gap-2 shadow-lg hover:shadow-xl">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-md">
              <span className="material-icons-round text-[14px]">
                play_arrow
              </span>
            </div>
            <span className="text-gray-700 dark:text-white font-medium">
              Ready to Begin?
            </span>
          </button>
        </div>

        {/* Main Heading */}
        <div
          className={`max-w-4xl mb-6 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            <span className="block text-base-content mb-2 group-hover:scale-105 transition-transform duration-300">
              Let's Build Something
            </span>
            <span className="block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:text-yellow-400 mr-4 hover:scale-110 transition-transform duration-300 inline-block">
                Amazing
              </span>
              <span className="text-base-content hover:scale-105 transition-transform duration-300 inline-block">
                Together
              </span>
            </span>
          </h1>
        </div>

        {/* Description */}
        <div
          className={`max-w-2xl mb-10 transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-lg md:text-xl text-base-content/70 dark:text-gray-200 leading-relaxed">
            Join hundreds of successful companies that trust us with their
            digital transformation
          </p>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16 transition-all duration-1000 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <button className="btn btn-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white border-none shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-2 hover:scale-105 transition-all duration-300 group">
            <span className="font-semibold">Start Your Project</span>
            <span className="material-icons-round text-xl group-hover:translate-x-1 transition-transform duration-300">
              arrow_forward
            </span>
          </button>

          <button className="btn btn-lg btn-outline border-2 bg-white/10 dark:bg-black/10 backdrop-blur-md hover:bg-white/20 dark:hover:bg-black/20 border-white/40 dark:border-white/30 hover:border-white/60 dark:hover:border-white/50 transition-all duration-300 group shadow-lg hover:shadow-xl">
            <span className="font-semibold text-gray-700 dark:text-white">
              View Our Work
            </span>
            <span className="material-icons-round text-xl group-hover:rotate-45 transition-transform duration-300 text-gray-700 dark:text-white">
              north_east
            </span>
          </button>
        </div>

        {/* Divider */}
        <div
          className={`w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-white/30 mb-12 transition-all duration-1000 delay-800 ${
            isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          }`}
        ></div>

        {/* Stats Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 w-full max-w-3xl text-center transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group flex flex-col items-center hover:scale-110 transition-all duration-300 cursor-default ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: `${1200 + index * 150}ms`,
              }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-indigo-600 flex items-center justify-center mb-3 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <span className="material-icons-round text-white text-xl">
                  {stat.icon}
                </span>
              </div>

              {/* Value */}
              <span className="text-3xl font-bold text-gray-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                {stat.value}
              </span>

              {/* Label */}
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-300">
                {stat.label}
              </span>

              {/* Hover Effect Indicator */}
              <div className="w-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-indigo-600 group-hover:w-full transition-all duration-300 mt-2 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-blue-400/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 right-10 w-3 h-3 bg-purple-400/50 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-indigo-400/40 rounded-full animate-bounce delay-500"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-400/40 rounded-full animate-ping delay-700"></div>
      </div>

      {/* Enhanced Glass Panel Effects */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 dark:bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-white/10 rotate-12 animate-float opacity-30 shadow-lg"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-white/5 dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-white/10 -rotate-12 animate-float-delayed opacity-20 shadow-md"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-white/10 rotate-45 animate-float-slow opacity-25"></div>
      </div>
    </section>
  );
};

export default CollaborativeHeroSection;
