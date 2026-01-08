import React, { useState, useEffect } from "react";

const TestimonialsSection = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  const testimonials = [
    {
      id: 1,
      quote:
        "They delivered our project on time with excellent quality. The attention to detail and professionalism exceeded our expectations.",
      name: "Ahmed Rahman",
      position: "E-Commerce Business",
      company: "ShopBD",
      rating: 5,
      avatar: "AR",
    },
    {
      id: 2,
      quote:
        "Professional team, great communication and support. They understood our vision and brought it to life perfectly.",
      name: "Sarah Khan",
      position: "Startup Founder",
      company: "TechStart",
      rating: 5,
      avatar: "SK",
    },
    {
      id: 3,
      quote:
        "Outstanding service and very skilled developers. The project was completed ahead of schedule with amazing results.",
      name: "John Smith",
      position: "Marketing Agency",
      company: "Digital Pro",
      rating: 5,
      avatar: "JS",
    },
    {
      id: 4,
      quote:
        "Incredible work ethic and technical expertise. They transformed our ideas into a beautiful, functional website.",
      name: "Maria Garcia",
      position: "Restaurant Owner",
      company: "Bella Vista",
      rating: 5,
      avatar: "MG",
    },
    {
      id: 5,
      quote:
        "Best development team we've worked with. Their innovative solutions helped us scale our business significantly.",
      name: "David Chen",
      position: "Tech CEO",
      company: "InnovateLab",
      rating: 5,
      avatar: "DC",
    },
    {
      id: 6,
      quote:
        "Exceptional quality and customer service. They went above and beyond to ensure our complete satisfaction.",
      name: "Lisa Johnson",
      position: "Non-Profit Director",
      company: "Hope Foundation",
      rating: 5,
      avatar: "LJ",
    },
  ];

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.dataset.index);
            setVisibleCards((prev) => [...new Set([...prev, cardIndex])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = document.querySelectorAll("[data-testimonial-index]");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium mb-4">
          <span className="material-icons text-sm">star</span>
          Client Reviews
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
          What Our Clients Say
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Don't just take our word for it. Here's what our satisfied clients
          have to say about our work.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            index={index}
            isVisible={visibleCards.includes(index)}
            isHovered={hoveredCard === testimonial.id}
            onHover={() => setHoveredCard(testimonial.id)}
            onLeave={() => setHoveredCard(null)}
          />
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div className="space-y-2">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            50+
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Happy Clients
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            100+
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Projects Completed
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            5.0
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Average Rating
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            24/7
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Support Available
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({
  testimonial,
  index,
  isVisible,
  isHovered,
  onHover,
  onLeave,
}) => {
  return (
    <div
      data-testimonial-index={index}
      className={`bg-white dark:bg-slate-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between h-full transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${isHovered ? "scale-105" : ""}`}
      style={{ transitionDelay: `${index * 150}ms` }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Quote Section */}
      <div className="flex-1">
        {/* Quote Mark */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-blue-500 opacity-30 text-4xl leading-none font-serif">
            "
          </span>
          <div className="flex space-x-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <span key={i} className="material-icons text-yellow-400 text-lg">
                star
              </span>
            ))}
          </div>
        </div>

        {/* Quote Text */}
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">
          {testimonial.quote}
        </p>
      </div>

      {/* Author Section */}
      <div className="flex items-center space-x-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        {/* Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {testimonial.avatar}
        </div>

        {/* Author Info */}
        <div className="flex-1">
          <h3 className="text-slate-900 dark:text-white font-bold text-lg">
            {testimonial.name}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {testimonial.position}
          </p>
          <p className="text-blue-600 dark:text-blue-400 text-xs font-medium">
            {testimonial.company}
          </p>
        </div>

        {/* Verified Badge */}
        <div className="flex items-center space-x-1 text-green-500">
          <span className="material-icons text-sm">verified</span>
          <span className="text-xs font-medium">Verified</span>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      ></div>
    </div>
  );
};

export default TestimonialsSection;
