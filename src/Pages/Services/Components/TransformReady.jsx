import React, { useEffect, useRef, useState } from "react";

const TransformReady = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
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
      className="pb-16 px-6 md:px-8 max-w-7xl mx-auto bg-base-100"
    >
      <div
        className={`text-center mt-12 transition-all duration-1000 delay-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="card bg-gradient-to-r from-primary to-secondary shadow-2xl">
          <div className="card-body text-center py-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Let's discuss your project and create a custom solution that
              exceeds your expectations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-lg bg-white text-primary hover:bg-gray-50 border-none shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <i className="fas fa-rocket mr-2"></i>
                Get Started
              </button>
              <button className="btn btn-lg btn-outline text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                <i className="fas fa-phone mr-2"></i>
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformReady;
