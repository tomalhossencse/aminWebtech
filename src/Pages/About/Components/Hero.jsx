import React from "react";
import StatsCard from "./StatsCard";

const Hero = () => {
  const statsData = [
    {
      icon: "emoji_events",
      bgColor: "bg-yellow-400",
      number: "5+",
      label: "Years Experience",
    },
    {
      icon: "groups",
      bgColor: "bg-blue-500",
      number: "50+",
      label: "Happy Clients",
    },
    {
      icon: "rocket_launch",
      bgColor: "bg-purple-500",
      number: "150+",
      label: "Projects Completed",
    },
    {
      icon: "handshake",
      bgColor: "bg-green-500",
      number: "24/7",
      label: "Support",
    },
  ];

  return (
    <main className="flex-grow relative grid-bg">
      {/* Background Blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blob mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blob mix-blend-multiply dark:mix-blend-screen"></div>

      <section className="hero min-h-screen relative z-10">
        <div className="hero-content text-center max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-full">
            {/* Badge */}
            <div className="badge badge-primary badge-lg mb-8 px-6 py-4 text-white font-semibold shadow-glow">
              Since 2018
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 pb-2">
              About AminWebTech
            </h1>

            {/* Description */}
            <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-20">
              We are a team of passionate{" "}
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                developers
              </span>
              ,{" "}
              <span className="text-purple-600 dark:text-purple-400 font-semibold">
                designers
              </span>
              , and{" "}
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                strategists
              </span>{" "}
              dedicated to delivering exceptional digital solutions.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2  lg:grid-cols-4 gap-6 w-full">
              {statsData.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;
