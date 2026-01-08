import React, { useState } from "react";
import AddServiceModal from "./AddServiceModal";

const ServicesHeroSection = () => {
  const [activeFilter, setActiveFilter] = useState("All Services");
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filterButtons = [
    { label: "All Services", icon: "grid_view" },
    { label: "Web Development", icon: "code" },
    { label: "UI/UX Design", icon: "palette" },
    { label: "Mobile Apps", icon: "smartphone" },
    { label: "Graphics Design", icon: "brush" },
    { label: "Digital Marketing", icon: "trending_up" },
    { label: "Backend Services", icon: "dns" },
    { label: "Cloud Solutions", icon: "cloud" },
    { label: "Security", icon: "security" },
  ];

  const services = [
    {
      id: 1,
      title: "Web Development",
      description:
        "We build fast, secure, and visually stunning websites that convert visitors into customers.",
      icon: "language",
      gradient: "from-blue-500 to-indigo-600",
      features: 4,
      isBestValue: true,
    },
    {
      id: 2,
      title: "App Development",
      description:
        "We create powerful mobile apps that deliver seamless user experiences.",
      icon: "smartphone",
      gradient: "from-indigo-500 to-purple-600",
      features: 4,
      isBestValue: false,
    },
    {
      id: 3,
      title: "Software Development",
      description:
        "Custom software solutions designed to automate and grow your business.",
      icon: "code",
      gradient: "from-purple-500 to-pink-600",
      features: 4,
      isBestValue: false,
    },
    {
      id: 4,
      title: "Graphics Design",
      description:
        "Creative visual designs that capture your brand essence and engage your audience effectively.",
      icon: "palette",
      gradient: "from-pink-500 to-rose-600",
      features: 5,
      isBestValue: false,
    },
    {
      id: 5,
      title: "Digital Marketing",
      description:
        "Strategic marketing campaigns that boost your online presence and drive real results.",
      icon: "trending_up",
      gradient: "from-green-500 to-emerald-600",
      features: 6,
      isBestValue: false,
    },
    {
      id: 6,
      title: "Cloud Solutions",
      description:
        "Scalable cloud infrastructure and services to modernize your business operations.",
      icon: "cloud",
      gradient: "from-cyan-500 to-blue-600",
      features: 4,
      isBestValue: false,
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-200/30 dark:bg-purple-900/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-blue-200/30 dark:bg-blue-900/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium mb-6">
          <span className="material-icons-round text-sm">rocket_launch</span>
          Our Premium Services
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
          Solutions That Drive{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Growth
          </span>
        </h2>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400 mb-8">
          We deliver cutting-edge digital solutions tailored to your business
          needs, helping you stay ahead in today's competitive market.
        </p>

        {/* Add New Service Button */}
        <div className="mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="material-icons-round text-sm">add</span>
            Add New Service
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {filterButtons.map((button) => (
            <button
              key={button.label}
              onClick={() => setActiveFilter(button.label)}
              className={`flex items-center gap-2 px-5 py-2.5 border rounded-full font-medium transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                activeFilter === button.label
                  ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-200"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              <span className="material-icons-round text-blue-500 text-base">
                {button.icon}
              </span>
              {button.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      {/* Add Service Modal */}
      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

const ServiceCard = ({ service }) => {
  return (
    <div className="relative group bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300">
      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-full opacity-80 group-hover:opacity-100 transition-opacity"></div>

      {/* Best Value Badge */}
      {service.isBestValue && (
        <div className="absolute top-6 right-6 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
          <span className="material-icons-round text-sm">diamond</span>
          Best Value
        </div>
      )}

      {/* Icon */}
      <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center mb-6 shadow-inner">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center shadow-lg text-white`}
        >
          <span className="material-icons-round text-3xl">{service.icon}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {service.title}
      </h3>

      {/* Divider */}
      <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-4"></div>

      {/* Description */}
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
        {service.description}
      </p>

      {/* Features Count */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl py-3 mb-8">
        <span className="block text-lg font-bold text-slate-900 dark:text-white">
          {service.features}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Features
        </span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-2.5 px-4 rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-shadow flex items-center justify-center gap-1 text-sm">
          View Details{" "}
          <span className="material-icons-round text-sm">open_in_new</span>
        </button>
        <button className="bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-300 font-medium py-2.5 px-4 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors text-sm">
          Get Quote
        </button>
      </div>
    </div>
  );
};

export default ServicesHeroSection;
