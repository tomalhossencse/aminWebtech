import { useState, useEffect } from "react";
import { Link } from "react-router";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      badge: "Digital Solutions",
      title: "Digital Transformation",
      subtitle: "Partner",
      description:
        "We help businesses grow faster with scalable software, modern apps, and powerful digital experiences tailored to your goals.",
      primaryBtn: "Start Your Journey",
      secondaryBtn: "Watch Demo",
      background: "from-blue-600 via-indigo-700 to-slate-900",
      darkBackground: "from-slate-900 via-blue-900 to-indigo-900",
      pattern: "https://www.transparenttextures.com/patterns/cubes.png",
    },
    {
      id: 2,
      badge: "Web Development",
      title: "Modern Web",
      subtitle: "Solutions",
      description:
        "Build responsive, fast, and scalable web applications using cutting-edge technologies and best practices for optimal performance.",
      primaryBtn: "View Projects",
      secondaryBtn: "Learn More",
      background: "from-purple-600 via-pink-600 to-red-600",
      darkBackground: "from-gray-900 via-purple-900 to-pink-900",
      pattern: "https://www.transparenttextures.com/patterns/hexellence.png",
    },
    {
      id: 3,
      badge: "Mobile Apps",
      title: "Cross-Platform",
      subtitle: "Applications",
      description:
        "Create powerful mobile experiences that work seamlessly across iOS and Android platforms with native performance.",
      primaryBtn: "Get Started",
      secondaryBtn: "See Demo",
      background: "from-emerald-600 via-teal-600 to-cyan-600",
      darkBackground: "from-gray-900 via-emerald-900 to-teal-900",
      pattern:
        "https://www.transparenttextures.com/patterns/diamond-upholstery.png",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1500 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            {/* Light mode gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${slide.background} opacity-90 dark:opacity-0 dark:hidden transition-all duration-1500 ease-in-out`}
            ></div>

            {/* Dark mode gradient */}
            <div
              className={`absolute inset-0 hidden dark:block bg-gradient-to-br ${slide.darkBackground} transition-all duration-1500 ease-in-out`}
            ></div>

            {/* Pattern overlay */}
            <div
              className="absolute inset-0 opacity-10 mix-blend-overlay"
              style={{
                backgroundImage: `url('${slide.pattern}')`,
                backgroundSize: "200px 200px",
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Animated background blobs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float pointer-events-none"></div>
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse-slow pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex justify-between items-center text-white">
        {/* Navigation arrows */}
        {/* <div className="hidden md:flex items-center gap-4 ml-auto">
          <button
            onClick={prevSlide}
            className="btn btn-circle btn-ghost text-white hover:bg-white/10 hover:scale-110 transition-all duration-400 ease-out"
            aria-label="Previous slide"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            onClick={nextSlide}
            className="btn btn-circle btn-ghost text-white hover:bg-white/10 hover:scale-110 transition-all duration-400 ease-out"
            aria-label="Next slide"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div> */}
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-6 sm:px-12 lg:px-12 py-20">
        <div className="max-w-4xl w-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`transition-all duration-1500 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-full absolute inset-0"
              }`}
            >
              {/* Badge */}
              <div
                className={`mb-6 transition-all duration-1600 delay-300 ease-out ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-95"
                }`}
              >
                <span className="badge badge-lg bg-white/10 border border-white/20 backdrop-blur-sm text-blue-100 font-semibold tracking-wider uppercase">
                  {slide.badge}
                </span>
              </div>

              {/* Title */}
              <h1
                className={`text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight transition-all duration-1600 delay-500 ease-out ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-12 scale-95"
                }`}
              >
                {slide.title} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white animate-gradient-x">
                  {slide.subtitle}
                </span>
              </h1>

              {/* Description */}
              <p
                className={`text-lg sm:text-xl text-blue-100/90 mb-10 max-w-2xl leading-relaxed font-light transition-all duration-1600 delay-700 ease-out ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-95"
                }`}
              >
                {slide.description}
              </p>

              {/* Action Buttons */}
              <div
                className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center transition-all duration-1600 delay-900 ease-out ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-95"
                }`}
              >
                <Link
                  to={"/contact"}
                  className="btn btn-lg bg-white text-blue-700 hover:bg-blue-50 font-semibold border-none shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-400 ease-out group"
                >
                  {slide.primaryBtn}
                  <i className="fas fa-arrow-right text-sm group-hover:translate-x-2 transition-transform duration-300 ease-out"></i>
                </Link>

                <button className="btn btn-lg btn-outline text-white border-white/30 hover:bg-white/10 font-medium backdrop-blur-sm transition-all duration-400 ease-out group hover:scale-105">
                  <i className="fas fa-play text-lg group-hover:scale-110 transition-transform duration-300 ease-out"></i>
                  {slide.secondaryBtn}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Slide Indicators */}
      <div className="relative z-10 w-full flex justify-center pb-12 gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ease-out hover:scale-125 ${
              index === currentSlide
                ? "w-8 bg-white shadow-lg"
                : "w-2 bg-white/40 hover:bg-white/60 hover:w-4"
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10">
        <div
          className="h-full bg-gradient-to-r from-white via-blue-200 to-white transition-all duration-500 ease-linear shadow-lg"
          style={{
            width: isAutoPlaying ? "100%" : "0%",
            animation: isAutoPlaying ? "progress 5s linear infinite" : "none",
          }}
        />
      </div>

      <style>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;
