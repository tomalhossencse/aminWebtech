import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import useServicesAPI from "../../../hooks/useServicesAPI";
import AddServiceModal from "../../../components/AddServiceModal";
import TestModal from "../../../components/TestModal";

const ServicesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const sectionRef = useRef(null);

  // Fetch services from API
  const { getActiveServices, loading: isLoading, error } = useServicesAPI();
  const services = getActiveServices();

  // Helper function to get service colors based on icon
  const getServiceColors = (icon) => {
    const colorMap = {
      language: {
        color: "bg-blue-500",
        shadowColor: "shadow-blue-500/20",
        hoverColor: "hover:shadow-blue-500/30",
      },
      smartphone: {
        color: "bg-purple-500",
        shadowColor: "shadow-purple-500/20",
        hoverColor: "hover:shadow-purple-500/30",
      },
      code: {
        color: "bg-green-500",
        shadowColor: "shadow-green-500/20",
        hoverColor: "hover:shadow-green-500/30",
      },
      brush: {
        color: "bg-pink-500",
        shadowColor: "shadow-pink-500/20",
        hoverColor: "hover:shadow-pink-500/30",
      },
      campaign: {
        color: "bg-orange-500",
        shadowColor: "shadow-orange-500/20",
        hoverColor: "hover:shadow-orange-500/30",
      },
      cloud: {
        color: "bg-cyan-500",
        shadowColor: "shadow-cyan-500/20",
        hoverColor: "hover:shadow-cyan-500/30",
      },
      security: {
        color: "bg-red-500",
        shadowColor: "shadow-red-500/20",
        hoverColor: "hover:shadow-red-500/30",
      },
      analytics: {
        color: "bg-indigo-500",
        shadowColor: "shadow-indigo-500/20",
        hoverColor: "hover:shadow-indigo-500/30",
      },
      shopping_cart: {
        color: "bg-emerald-500",
        shadowColor: "shadow-emerald-500/20",
        hoverColor: "hover:shadow-emerald-500/30",
      },
    };
    return (
      colorMap[icon] || {
        color: "bg-gray-500",
        shadowColor: "shadow-gray-500/20",
        hoverColor: "hover:shadow-gray-500/30",
      }
    );
  };

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
      className="py-20 px-6 md:px-8 max-w-7xl mx-auto bg-base-100"
    >
      {/* Section Header */}
      <div
        className={`flex flex-col items-center text-center mb-6
           transition-all duration-1000 ${
             isVisible
               ? "opacity-100 translate-y-0"
               : "opacity-0 translate-y-10"
           }`}
      >
        {/* Badge */}
        <div className="badge badge-lg bg-primary/10 text-primary border-primary/20 px-5 py-3 mb-6 gap-2">
          <i className="material-icons-outlined text-sm">auto_awesome</i>
          <span className="font-semibold tracking-wide">What We Offer</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Our{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient-x">
            Digital Solutions
          </span>
        </h1>

        {/* Description */}
        <p className="text-base-content/70 text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
          We deliver innovative digital solutions that drive growth and
          transform businesses
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-lg border border-base-300 animate-pulse"
            >
              <div className="card-body p-8">
                <div className="w-16 h-16 bg-gray-300 rounded-2xl mb-6"></div>
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="space-y-2 mb-8">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
          ))
        ) : error ? (
          // Error state
          <div className="col-span-full text-center py-12">
            <div className="text-error text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-error mb-2">
              Failed to load services
            </h3>
            <p className="text-base-content/70">{error.message}</p>
          </div>
        ) : services.length === 0 ? (
          // Empty state
          <div className="col-span-full text-center py-12">
            <div className="text-base-content/50 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-base-content mb-2">
              No services available
            </h3>
            <p className="text-base-content/70">
              Add your first service to get started
            </p>
          </div>
        ) : (
          // Services list
          services.map((service, index) => {
            const colors = getServiceColors(service.icon);
            return (
              <div
                key={service._id}
                className={`group transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: `${200 + index * 100}ms`,
                }}
              >
                <div className="card bg-base-100 shadow-lg hover:shadow-2xl border border-base-300 dark:border-base-content/10 transition-all duration-500 hover:-translate-y-2 h-full group">
                  <div className="card-body p-8 flex flex-col h-full">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 ${colors.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${colors.shadowColor} group-hover:scale-110 group-hover:${colors.hoverColor} transition-all duration-500`}
                    >
                      <i className="material-icons-outlined text-white text-3xl">
                        {service.icon}
                      </i>
                    </div>

                    {/* Title */}
                    <h3 className="card-title text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-base-content/70 mb-8 leading-relaxed flex-grow">
                      {service.shortDescription || service.description}
                    </p>

                    {/* Features count if available */}
                    {service.features && (
                      <div className="flex items-center gap-2 mb-4">
                        <i className="material-icons-outlined text-primary text-sm">
                          star
                        </i>
                        <span className="text-sm text-base-content/70">
                          {service.features} feature
                          {service.features !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}

                    {/* Learn More Link */}
                    <div className="card-actions justify-start mt-auto">
                      <Link
                        to={`/services/${service.slug || service.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:gap-3 transition-all duration-300 group/link"
                      >
                        Learn More
                        <i className="material-icons-outlined text-xl group-hover/link:translate-x-1 transition-transform duration-300">
                          arrow_right_alt
                        </i>
                      </Link>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Test Modal */}
      <TestModal
        isOpen={isTestModalOpen}
        onClose={() => {
          console.log("Closing test modal...");
          setIsTestModalOpen(false);
        }}
      />

      {/* Add Service Modal */}
      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => {
          console.log("Closing modal...");
          setIsModalOpen(false);
        }}
      />
    </section>
  );
};

export default ServicesSection;
