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
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          What Our Clients Say
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <TestimonialCardSimple
            key={testimonial.id}
            testimonial={testimonial}
          />
        ))}
      </div>
    </section>
  );
};

const TestimonialCardSimple = ({ testimonial }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full">
      <div>
        <span className="text-slate-900 opacity-20 text-4xl leading-none font-serif mb-2 block dark:text-blue-400">
          "
        </span>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed">
          {testimonial.quote}
        </p>
      </div>

      <div>
        <h3 className="text-slate-900 dark:text-white font-bold text-lg">
          {testimonial.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          {testimonial.position}
        </p>
      </div>
    </div>
  );
};

export default TestimonialsSimple;
