import { useState, useEffect, useRef } from "react";

const TestimonialsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particlePositions, setParticlePositions] = useState([]);
  const sectionRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "CTO",
      company: "Global Tech",
      companyUrl: "#",
      quote:
        "Professional team with great attention to detail. They delivered beyond our expectations with innovative solutions that transformed our business.",
      rating: 5,
      avatar: "SJ",
      color: "from-blue-500 to-cyan-500",
      isActive: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "CEO",
      company: "StartupX",
      companyUrl: "#",
      quote:
        "Exceptional service and innovative solutions. They exceeded our expectations in every way and helped us scale rapidly.",
      rating: 5,
      avatar: "MC",
      color: "from-purple-500 to-pink-500",
      isActive: false,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      position: "Product Manager",
      company: "TechCorp",
      companyUrl: "#",
      quote:
        "Outstanding collaboration and delivery. The team understood our vision perfectly and brought it to life with precision.",
      rating: 5,
      avatar: "ER",
      color: "from-green-500 to-emerald-500",
      isActive: false,
    },
    {
      id: 4,
      name: "Ahmed Hassan",
      position: "Founder",
      company: "InnovateHub",
      companyUrl: "#",
      quote:
        "Incredible technical expertise and creativity. They turned our complex requirements into elegant, user-friendly solutions.",
      rating: 5,
      avatar: "AH",
      color: "from-orange-500 to-red-500",
      isActive: false,
    },
    {
      id: 5,
      name: "Lisa Wang",
      position: "Director",
      company: "FutureTech",
      companyUrl: "#",
      quote:
        "Best development team we have worked with. Their attention to detail and commitment to quality is unmatched.",
      rating: 5,
      avatar: "LW",
      color: "from-indigo-500 to-purple-500",
      isActive: false,
    },
    {
      id: 6,
      name: "David Kumar",
      position: "VP Engineering",
      company: "CloudSoft",
      companyUrl: "#",
      quote:
        "Exceptional quality and customer service. They went above and beyond to ensure our complete satisfaction.",
      rating: 5,
      avatar: "DK",
      color: "from-teal-500 to-cyan-500",
      isActive: false,
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Initialize floating particles
  useEffect(() => {
    const particles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticlePositions(particles);
  }, []);

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      return () => section.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

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

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`material-icons text-xl ${
          index < rating
            ? "text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      >
        star
      </span>
    ));
  };

  const activeTestimonial = testimonials[currentTestimonial];

  return (
    <section
      ref={sectionRef}
      className="py-20 px-6 sm:px-6 lg:px-8 min-h-screen flex flex-col items-center justify-center bg-base-100 relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-orange-100/40 dark:bg-orange-900/10 blur-[100px] rounded-full translate-x-1/4 -translate-y-1/4 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-blue-100/40 dark:bg-blue-900/10 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4 animate-float-delayed"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl">
        {/* Section Header */}
        <div
          className={`text-center mb-16 max-w-3xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Badge */}
          <div className="badge badge-lg px-5 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none shadow-lg shadow-yellow-500/30 transform hover:scale-105 transition-transform duration-300 cursor-default mb-6 gap-2">
            <span className="material-icons-outlined text-sm">star_border</span>
            <span className="text-sm font-semibold tracking-wide">
              Client Testimonials
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-base-content mb-4 leading-tight">
            Trusted by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">
              Industry Leaders
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-base-content/70 font-light">
            See what our clients have to say about working with us
          </p>
        </div>

        {/* Testimonial Card Container */}
        <div
          className={`w-full flex justify-center lg:justify-start lg:pl-[15%] relative mb-16 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Main Testimonial Card */}
          <div className="group relative max-w-lg w-full">
            {/* Animated Background Gradient */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

            <div className="relative card bg-base-100 shadow-2xl border border-base-300/50 rounded-3xl overflow-hidden backdrop-blur-sm hover:-translate-y-2 transition-all duration-500">
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 dark:bg-yellow-900/20 rounded-bl-[3rem] z-0"></div>

              {/* Quote Mark */}
              <span className="absolute top-4 right-6 text-yellow-400 dark:text-yellow-500 text-6xl font-serif leading-none z-10 opacity-80 group-hover:scale-110 transition-transform duration-300">
                ❝
              </span>

              <div className="card-body p-8 relative z-10">
                {/* User Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-yellow-400 p-1 flex items-center justify-center group-hover:border-orange-500 transition-colors duration-300">
                      <div className="w-full h-full rounded-full bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/30 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-all duration-300">
                        <span className="material-icons-outlined text-3xl">
                          person
                        </span>
                      </div>
                    </div>
                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-base-content leading-tight group-hover:text-orange-600 transition-colors duration-300">
                      {activeTestimonial.name}
                    </h3>
                    <p className="text-base-content/70 text-sm font-medium">
                      {activeTestimonial.position}
                    </p>
                    <a
                      href={activeTestimonial.companyUrl}
                      className="text-blue-600 dark:text-blue-400 text-sm hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                    >
                      {activeTestimonial.company}
                    </a>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <blockquote className="text-base-content/80 italic text-lg leading-relaxed mb-8 group-hover:text-base-content transition-colors duration-300">
                  "{activeTestimonial.quote}"
                </blockquote>

                {/* Star Rating */}
                <div className="flex text-yellow-400 gap-1 group-hover:scale-105 transition-transform duration-300">
                  {renderStars(activeTestimonial.rating)}
                </div>

                {/* Floating Particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-orange-400/40 rounded-full animate-pulse delay-1000 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>

          {/* Background Card (Decorative) */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 opacity-20 dark:opacity-10 scale-90 pointer-events-none select-none">
            <div className="bg-base-100 rounded-3xl p-8 shadow-xl w-96 h-80 border border-base-300/30"></div>
          </div>
        </div>

        {/* Testimonial Indicators */}
        <div
          className={`flex justify-center gap-3 mb-12 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial
                  ? "bg-orange-500 w-8"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-orange-300 dark:hover:bg-orange-700"
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 items-center justify-center transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <button className="btn btn-outline btn-lg border-2 hover:bg-base-content hover:text-base-100 transition-all duration-300 hover:scale-105">
            <span className="material-icons-outlined text-xl">
              auto_stories
            </span>
            Read More Stories
          </button>

          <button className="btn btn-lg bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-none shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 hover:scale-105 transition-all duration-300 group">
            <span className="material-icons-outlined text-xl group-hover:rotate-12 transition-transform duration-300">
              rate_review
            </span>
            Share Your Experience
          </button>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
