import React, { useState, useEffect, useRef } from 'react';

const WorkingProcessEnhanced = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);

  const processSteps = [
    {
      id: 1,
      step: '01',
      title: 'Requirement Analysis',
      description: 'We understand your business needs and gather complete requirements.',
      icon: 'search',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 2,
      step: '02',
      title: 'UI/UX Design',
      description: 'We design clean, modern and user-friendly interfaces.',
      icon: 'palette',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      id: 3,
      step: '03',
      title: 'Development',
      description: 'Our developers build scalable and secure solutions.',
      icon: 'code',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 4,
      step: '04',
      title: 'Testing & Launch',
      description: 'We test thoroughly and launch with full support.',
      icon: 'rocket_launch',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.dataset.index);
            setVisibleCards(prev => [...new Set([...prev, cardIndex])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = sectionRef.current?.querySelectorAll('[data-index]');
    cards?.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 dark:bg-blue-800/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-200/20 dark:bg-purple-800/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span className="material-icons-round text-sm">timeline</span>
            How We Work
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-display mb-4">
            Our Working Process
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We follow a systematic approach to deliver exceptional results for every project
          </p>
        </div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <ProcessCardEnhanced 
              key={step.id} 
              step={step} 
              index={index}
              isVisible={visibleCards.includes(index)}
            />
          ))}
        </div>

        {/* Process Flow Indicators (Desktop) */}
        <div className="hidden lg:flex justify-center items-center mt-12 space-x-8">
          {processSteps.map((_, index) => (
            <React.Fragment key={index}>
              <div className={`w-3 h-3 rounded-full transition-colors duration-500 ${
                visibleCards.includes(index) ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}></div>
              {index < processSteps.length - 1 && (
                <div className={`h-0.5 w-16 transition-colors duration-500 delay-${(index + 1) * 200} ${
                  visibleCards.includes(index + 1) ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessCardEnhanced = ({ step, index, isVisible }) => {
  return (
    <div 
      data-index={index}
      className={`group bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-xl dark:hover:bg-gray-750 transition-all duration-500 transform ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Icon and Step Number */}
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-xl ${step.bgColor} group-hover:scale-110 transition-transform duration-300`}>
          <span className={`material-icons-round ${step.color} text-3xl`}>
            {step.icon}
          </span>
        </div>
        <span className="text-3xl font-bold text-gray-200 dark:text-gray-600 select-none group-hover:text-primary/30 transition-colors duration-300">
          {step.step}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-1000 delay-${index * 200} ${
            isVisible ? 'w-full' : 'w-0'
          }`}
        ></div>
      </div>

      {/* Title and Description */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors duration-300">
        {step.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
        {step.description}
      </p>

      {/* Hover Effect Arrow */}
      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="material-icons-round text-primary text-sm">arrow_forward</span>
      </div>
    </div>
  );
};

export default WorkingProcessEnhanced;