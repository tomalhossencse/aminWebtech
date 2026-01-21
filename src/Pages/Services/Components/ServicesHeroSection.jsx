import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useServicesAPI from '../../../hooks/useServicesAPI';
import {
  Globe,
  Smartphone,
  Code,
  Brush,
  Megaphone,
  Cloud,
  Shield,
  Database,
  Palette,
  TrendingUp,
  Layers,
  Zap,
  ExternalLink
} from 'lucide-react';

const ServicesHeroSection = () => {
  const [activeFilter, setActiveFilter] = useState('All Services');
  const { services, loading: isLoading, error, getActiveServices } = useServicesAPI();
  const activeServices = getActiveServices();

  // Icon mapping for services
  const getIconComponent = (iconName) => {
    const iconMap = {
      Globe: Globe,
      Smartphone: Smartphone,
      Code: Code,
      Brush: Brush,
      Megaphone: Megaphone,
      Cloud: Cloud,
      Shield: Shield,
      Database: Database,
      Palette: Palette,
      TrendingUp: TrendingUp,
      Layers: Layers,
      Zap: Zap,
      // Lowercase versions for compatibility
      globe: Globe,
      smartphone: Smartphone,
      code: Code,
      brush: Brush,
      megaphone: Megaphone,
      cloud: Cloud,
      shield: Shield,
      database: Database,
      palette: Palette,
      trending_up: TrendingUp,
      layers: Layers,
      zap: Zap,
      // Material icons mapping
      language: Globe,
      shopping_cart: Layers,
      campaign: Megaphone,
      security: Shield,
      dns: Database,
    };
    return iconMap[iconName] || Code;
  };

  // Generate gradient based on service name
  const getServiceGradient = (serviceName) => {
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-indigo-500 to-purple-600',
      'from-purple-500 to-pink-600',
      'from-pink-500 to-rose-600',
      'from-green-500 to-emerald-600',
      'from-cyan-500 to-blue-600',
      'from-orange-500 to-red-600',
      'from-teal-500 to-cyan-600',
    ];
    
    // Use service name hash to consistently assign gradient
    const hash = serviceName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return gradients[Math.abs(hash) % gradients.length];
  };

  // Transform backend services to match component structure
  const transformedServices = useMemo(() => {
    return activeServices.map((service, index) => ({
      id: service._id,
      title: service.name,
      description: service.shortDescription || service.description,
      icon: service.icon,
      gradient: getServiceGradient(service.name),
      features: service.features || 4,
      isBestValue: service.featured === "Yes" && index === 0, // First featured service gets best value badge
      category: service.category || 'General',
      displayOrder: service.displayOrder || index,
    }));
  }, [activeServices]);

  // Generate filter buttons based on available services
  const filterButtons = useMemo(() => {
    const categories = ['All Services'];
    const categoryIcons = {
      'All Services': 'grid_view',
      'Web Development': 'code',
      'UI/UX Design': 'palette',
      'Mobile Apps': 'smartphone',
      'Graphics Design': 'brush',
      'Digital Marketing': 'trending_up',
      'Backend Services': 'dns',
      'Cloud Solutions': 'cloud',
      'Security': 'security',
      'E-commerce': 'shopping_cart',
      'General': 'layers'
    };

    // Extract unique categories from services
    transformedServices.forEach(service => {
      if (service.category && !categories.includes(service.category)) {
        categories.push(service.category);
      }
    });

    return categories.map(category => ({
      label: category,
      icon: categoryIcons[category] || 'layers'
    }));
  }, [transformedServices]);

  // Filter services based on active filter
  const filteredServices = useMemo(() => {
    if (activeFilter === 'All Services') {
      return transformedServices.sort((a, b) => a.displayOrder - b.displayOrder);
    }
    return transformedServices
      .filter(service => service.category === activeFilter)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [transformedServices, activeFilter]);

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-6"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-80 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-3xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Failed to Load Services
            </h3>
            <p className="text-red-600 dark:text-red-300">
              We're having trouble loading our services. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

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
          Solutions That Drive{' '}
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Growth
          </span>
        </h2>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400 mb-12">
          We deliver cutting-edge digital solutions tailored to your business needs, helping you stay ahead in
          today's competitive market.
        </p>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {filterButtons.map((button) => (
            <button
              key={button.label}
              onClick={() => setActiveFilter(button.label)}
              className={`flex items-center gap-2 px-5 py-2.5 border rounded-full font-medium transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                activeFilter === button.label
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-200'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span className="material-icons-round text-blue-500 text-base">{button.icon}</span>
              {button.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} getIconComponent={getIconComponent} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <span className="material-icons-round text-6xl">search_off</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No Services Found
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                {activeFilter === 'All Services' 
                  ? 'No services are currently available.' 
                  : `No services found in "${activeFilter}" category.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ service, getIconComponent }) => {
  const IconComponent = getIconComponent(service.icon);
  
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
        <div className={`w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center shadow-lg text-white`}>
          <IconComponent className="w-6 h-6" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{service.title}</h3>
      
      {/* Divider */}
      <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-4"></div>
      
      {/* Description */}
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed line-clamp-3">
        {service.description}
      </p>

      {/* Features Count */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl py-3 mb-8">
        <span className="block text-lg font-bold text-slate-900 dark:text-white">{service.features}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Features</span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to={`/services/${service.slug || service.title.toLowerCase().replace(/\s+/g, '-')}`}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-2.5 px-4 rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-shadow flex items-center justify-center gap-1 text-sm"
        >
          View Details <ExternalLink className="w-4 h-4" />
        </Link>
        <button className="bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-300 font-medium py-2.5 px-4 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors text-sm">
          Get Quote
        </button>
      </div>
    </div>
  );
};

export default ServicesHeroSection;