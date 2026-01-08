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
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-display">
            Our Working Process
          </h2>
        </div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <ProcessCard key={step.id} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessCard = ({ step, index }) => {
  return (
    <div className="group bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-100 dark:border-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-lg dark:hover:bg-gray-750 transition-all duration-300">
      {/* Icon and Step Number */}
      <div className="flex justify-between items-start mb-6">
        <div className="p-0">
          <span className="material-icons-round text-primary text-5xl transform group-hover:scale-110 transition-transform duration-300">
            {step.icon}
          </span>
        </div>
        <span className="text-3xl font-bold text-gray-200 dark:text-gray-600 select-none">
          {step.step}
        </span>
      </div>

      {/* Title and Description */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        {step.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
        {step.description}
      </p>
    </div>
  );
};

export default WorkingProcessSection;