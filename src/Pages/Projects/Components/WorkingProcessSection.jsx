import React from 'react';

const WorkingProcessSection = () => {
  const processSteps = [
    {
      id: 1,
      step: '01',
      title: 'Requirement Analysis',
      description: 'We understand your business needs and gather complete requirements.',
      icon: 'search'
    },
    {
      id: 2,
      step: '02',
      title: 'UI/UX Design',
      description: 'We design clean, modern and user-friendly interfaces.',
      icon: 'palette'
    },
    {
      id: 3,
      step: '03',
      title: 'Development',
      description: 'Our developers build scalable and secure solutions.',
      icon: 'code'
    },
    {
      id: 4,
      step: '04',
      title: 'Testing & Launch',
      description: 'We test thoroughly and launch with full support.',
      icon: 'rocket_launch'
    }
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-600 dark:text-purple-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <span className="material-icons-outlined text-sm">settings</span>
            Our Process
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white font-display">
            Our Working Process
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-4">
            From concept to completion, we follow a proven methodology to deliver exceptional results
          </p>
        </div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {processSteps.map((step, index) => (
            <ProcessCard key={step.id} step={step} index={index} />
          ))}
        </div>

        {/* Process Flow Connector (Desktop Only) */}
        <div className="hidden lg:flex justify-center mt-8">
          <div className="flex items-center space-x-8">
            {processSteps.slice(0, -1).map((_, index) => (
              <div key={index} className="flex items-center">
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full mx-2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProcessCard = ({ step, index }) => {
  return (
    <div 
      className="group bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-lg dark:hover:bg-gray-750 transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Icon and Step Number */}
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div className="p-0">
          <span className="material-icons-round text-primary text-3xl sm:text-4xl lg:text-5xl transform group-hover:scale-110 transition-transform duration-300">
            {step.icon}
          </span>
        </div>
        <span className="text-2xl sm:text-3xl font-bold text-gray-200 dark:text-gray-600 select-none">
          {step.step}
        </span>
      </div>

      {/* Title and Description */}
      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {step.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-xs sm:text-sm lg:text-base">
        {step.description}
      </p>

      {/* Progress Indicator */}
      <div className="mt-4 sm:mt-6">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-1000 group-hover:w-full"
            style={{ width: `${(index + 1) * 25}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WorkingProcessSection;