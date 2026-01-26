import { useState } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const StatsSection = () => {
  const [hasAnimated, setHasAnimated] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.2,
    rootMargin: "50px",
    triggerOnce: true, // Only trigger once
    onChange: (inView) => {
      if (inView && !hasAnimated) {
        setHasAnimated(true);
      }
    },
  });

  const stats = [
    {
      id: "projects",
      icon: "emoji_events",
      number: 250,
      suffix: "+",
      label: "Projects Completed",
      color: "text-yellow-500 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      duration: 2.5,
    },
    {
      id: "clients",
      icon: "groups",
      number: 120,
      suffix: "+",
      label: "Happy Clients",
      color: "text-green-500 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      duration: 2.2,
    },
    {
      id: "experts",
      icon: "auto_awesome",
      number: 25,
      suffix: "+",
      label: "Team Experts",
      color: "text-purple-500 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      duration: 1.8,
    },
    {
      id: "experience",
      icon: "bar_chart",
      number: 8,
      suffix: "+",
      label: "Years Experience",
      color: "text-blue-500 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      duration: 1.5,
    },
  ];

  return (
    <section
      ref={ref}
      className="relative w-full px-6 py-12 md:py-20 lg:py-24 bg-base-100 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Light mode background */}
        <div className="block dark:hidden w-full h-full bg-gradient-to-br from-base-200 to-base-300 opacity-50"></div>

        {/* Dark mode background */}
        <div
          className="hidden dark:block w-full h-full opacity-30 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80')`,
          }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-base-100/80 dark:bg-base-100/20"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Delivering excellence through years of dedication and expertise
            across the globe.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={`group relative transition-all duration-1000 ${
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: `${300 + index * 150}ms`,
              }}
            >
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl dark:bg-base-200/10 dark:backdrop-blur-md dark:border dark:border-base-content/10 transition-all duration-500 hover:-translate-y-2 group">
                <div className="card-body items-center text-center p-8 lg:p-10">
                  {/* Icon */}
                  <div
                    className={`flex items-center justify-center w-16 h-16 mb-6 rounded-full ${stat.bgColor} shadow-inner group-hover:scale-110 transition-all duration-500`}
                  >
                    <i className={`material-icons text-3xl ${stat.color}`}>
                      {stat.icon}
                    </i>
                  </div>

                  {/* Number with CountUp */}
                  <h3 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                    <span className="tabular-nums">
                      {inView && hasAnimated ? (
                        <CountUp
                          start={0}
                          end={stat.number}
                          duration={stat.duration}
                          delay={index * 0.2}
                          useEasing={true}
                          separator=","
                        />
                      ) : (
                        0
                      )}
                    </span>
                    <span className={stat.color}>{stat.suffix}</span>
                  </h3>

                  {/* Label */}
                  <p className="text-sm font-medium uppercase tracking-wider text-base-content/60">
                    {stat.label}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Visual Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
    </section>
  );
};

export default StatsSection;
