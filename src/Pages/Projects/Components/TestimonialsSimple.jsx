import React from "react";

const TestimonialsSimple = () => {
  const testimonials = [
    {
      id: 1,
      quote: "They delivered our project on time with excellent quality.",
      name: "Ahmed Rahman",
      position: "E-Commerce Business",
    },
    {
      id: 2,
      quote: "Professional team, great communication and support.",
      name: "Sarah Khan",
      position: "Startup Founder",
    },
    {
      id: 3,
      quote: "Outstanding service and very skilled developers.",
      name: "John Smith",
      position: "Marketing Agency",
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-8 sm:mb-10 lg:mb-12">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 text-green-600 dark:text-green-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          <span className="material-icons-outlined text-sm">star</span>
          Client Reviews
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          What Our Clients Say
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-4">
          Don't just take our word for it - hear from our satisfied clients
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCardSimple
            key={testimonial.id}
            testimonial={testimonial}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

const TestimonialCardSimple = ({ testimonial, index }) => {
  return (
    <div 
      className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full group"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div>
        <span className="text-slate-900 opacity-20 text-3xl sm:text-4xl leading-none font-serif mb-2 block dark:text-blue-400 group-hover:opacity-30 transition-opacity">
          "
        </span>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed">
          {testimonial.quote}
        </p>
      </div>

      <div className="flex items-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base mr-3 sm:mr-4 flex-shrink-0">
          {testimonial.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h3 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base lg:text-lg truncate">
            {testimonial.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium truncate">
            {testimonial.position}
          </p>
        </div>
      </div>

      {/* Rating Stars */}
      <div className="flex items-center mt-3 sm:mt-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-sm sm:text-base">★</span>
        ))}
        <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm ml-2">5.0</span>
      </div>
    </div>
  );
};

export default TestimonialsSimple;
