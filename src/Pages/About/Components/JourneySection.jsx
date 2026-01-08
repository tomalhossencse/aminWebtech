import React, { useState, useEffect } from "react";

const JourneySection = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const features = [
    {
      icon: "security",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      iconColor: "text-primary",
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee",
    },
    {
      icon: "language",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      title: "Global Reach",
      description: "Serving clients across 20+ countries worldwide",
    },
    {
      icon: "trending_up",
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
      iconColor: "text-purple-600 dark:text-purple-400",
      title: "Growth Focused",
      description: "Solutions designed to scale with your business",
    },
    {
      icon: "lightbulb",
      iconBg: "bg-amber-100 dark:bg-amber-900/40",
      iconColor: "text-amber-600 dark:text-amber-400",
      title: "Future Ready",
      description: "Adopting latest technologies for tomorrow's challenges",
    },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans antialiased min-h-screen flex flex-col items-center justify-center transition-colors duration-300">
      {/* Main Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-primary px-3 py-1 rounded-full text-sm font-semibold">
              <span className="material-icons text-base">favorite</span>
              <span>Our Journey</span>
            </div>

            {/* Main Heading */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Building Digital Dreams <br />
                <span className="text-primary">Since 2018</span>
              </h1>
            </div>

            {/* Description */}
            <div className="space-y-6 text-subtext-light dark:text-subtext-dark leading-relaxed text-lg">
              <p>
                Founded in 2018, AminWebTech began as a small team of passionate
                developers with a vision to transform businesses through
                technology. What started as a humble beginning has now grown
                into a full-fledged digital agency serving clients across the
                globe.
              </p>
              <p>
                Our journey has been marked by continuous learning, innovation,
                and a relentless pursuit of excellence. We've evolved from basic
                web development to offering comprehensive digital solutions
                including mobile apps, e-commerce platforms, and cutting-edge
                VR/AR experiences.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative w-full h-full min-h-[400px] lg:min-h-[600px] flex items-center justify-center animate-bounce-slow">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2.5rem] transform rotate-1 shadow-2xl opacity-90 dark:opacity-80"></div>
            <div className="relative z-10 w-[90%] h-[90%] flex items-center justify-center overflow-hidden">
              <img
                alt="Digital development illustration showing a programmer working on a laptop with holographic screens"
                className="w-full h-auto object-contain rounded-2xl drop-shadow-2xl mix-blend-normal"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG4ItSZJXmjyaROlGccYxacPiZWEtOrcDojNXgOtapeO9zg9ZFv0BOshULRktwGM81eaFRcYpkIdN4bJjAFau9oBdGHkU6mOgCGVumjqOxauuolwaHtXXW4HIJHgg9dMwF93DzEZaGYc6v5TKgNHgG1Sinngw-VHLYT9r1I77_qOCpN7SSslYYs2mjgVnqxFlmnwlnGCwz7lXqsGlQAFfglogmtHs6_g5eUkFf-6d4-kK11JO6L1ZQcdCkY6krD65LG1I-xIYziaQ"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent pointer-events-none rounded-2xl"></div>
            </div>
            <div className="absolute top-10 left-10 w-8 h-8 bg-white/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-400/30 rounded-full blur-2xl"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, iconBg, iconColor, title, description }) => {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-xl bg-card-light dark:bg-card-dark hover:shadow-soft transition-shadow duration-300">
      <div className="flex-shrink-0">
        <div
          className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center ${iconColor}`}
        >
          <span className="material-icons text-2xl">{icon}</span>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white text-base">
          {title}
        </h3>
        <p className="text-sm text-subtext-light dark:text-subtext-dark mt-1">
          {description}
        </p>
      </div>
    </div>
  );
};

export default JourneySection;
