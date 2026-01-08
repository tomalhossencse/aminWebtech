import { useState, useEffect, useRef } from 'react';

const FeaturedGallery = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef(null);

  const galleryItems = [
    {
      id: 1,
      title: 'Website Development',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80',
      gradient: 'from-blue-900 via-blue-800 to-slate-900',
      overlay: 'bg-blue-900/30'
    },
    {
      id: 2,
      title: 'Web Hosting Services',
      subtitle: 'We Are Providing Web Hosting For...',
      description: 'Multiple Web Hosting Service. We Provide Domain...',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2034&q=80',
      gradient: 'from-blue-900 to-slate-900',
      hasCallout: true
    },
    {
      id: 3,
      title: 'Graphics Design Services',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2064&q=80',
      gradient: 'from-indigo-600 via-purple-600 to-blue-600',
      isGraphics: true
    },
    {
      id: 4,
      title: 'Mobile App Development',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: 'from-green-600 via-emerald-600 to-teal-600',
      overlay: 'bg-green-900/30'
    },
    {
      id: 5,
      title: 'Digital Marketing Solutions',
      subtitle: 'Boost Your Online Presence',
      description: 'Strategic marketing campaigns that drive results...',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80',
      gradient: 'from-orange-600 to-red-600',
      hasCallout: true,
      calloutColor: 'bg-orange-400'
    },
    {
      id: 6,
      title: 'E-Commerce Solutions',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      gradient: 'from-purple-600 via-pink-600 to-red-600',
      overlay: 'bg-purple-900/30'
    },
    {
      id: 7,
      title: 'Cloud Infrastructure',
      subtitle: 'Scalable Cloud Solutions',
      description: 'Modern cloud infrastructure for growing businesses...',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
      gradient: 'from-cyan-600 to-blue-600',
      hasCallout: true,
      calloutColor: 'bg-cyan-400'
    },
    {
      id: 8,
      title: 'AI & Machine Learning',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: 'from-violet-600 via-purple-600 to-indigo-600',
      overlay: 'bg-violet-900/30'
    },
    {
      id: 9,
      title: 'Cybersecurity Solutions',
      subtitle: 'Protect Your Digital Assets',
      description: 'Advanced security solutions for modern businesses...',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: 'from-red-600 to-pink-600',
      hasCallout: true,
      calloutColor: 'bg-red-400'
    },
    {
      id: 10,
      title: 'Data Analytics & BI',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: 'from-emerald-600 via-green-600 to-lime-600',
      overlay: 'bg-emerald-900/30'
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(galleryItems.length / 3));
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [galleryItems.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
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
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-base-100"
    >
      {/* Section Header */}
      <div className={`text-center mb-12 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center justify-center gap-2 mb-4">
          <i className="material-icons-outlined text-blue-500 text-3xl">auto_awesome</i>
          Featured{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Gallery
          </span>
        </h2>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          A glimpse of our professional and industrial-grade digital work
        </p>
      </div>

     {/* Gallery Slider */}
      <div className="relative mb-16 overflow-hidden">
        <div 
          className="flex transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            width: '100%' // CHANGE 1: Set to 100% instead of manual calculation
          }}
        >
          {Array.from({ length: Math.ceil(galleryItems.length / 3) }).map((_, slideIndex) => (
            <div 
              key={slideIndex}
              className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
              // CHANGE 2: Remove the style={{ width: ... }} line from here
            >
              {galleryItems.slice(slideIndex * 3, slideIndex * 3 + 3).map((item, index) => (
                <div
                  key={item.id}
                  // ... rest of your code remains exactly the same
                  className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-1000 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    transitionDelay: `${200 + index * 150}ms`
                  }}
                >
                  <div className="w-full h-64 relative overflow-hidden">
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} flex items-center justify-center overflow-hidden`}>
                      {/* Background Image */}
                      <img 
                        alt={item.title}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                          item.hasCallout ? 'opacity-80 mix-blend-overlay' : 'opacity-90'
                        } ${item.isGraphics ? 'mix-blend-overlay opacity-60' : ''}`}
                        src={item.image}
                      />
                      
                      {/* Overlay */}
                      {item.overlay && (
                        <div className={`absolute inset-0 ${item.overlay}`}></div>
                      )}

                      {/* Content */}
                      {item.hasCallout ? (
                        // Callout Banner
                        <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-10 w-[120%] h-48 ${item.calloutColor || 'bg-yellow-400'} rounded-l-full shadow-lg flex flex-col justify-center pl-12 pr-24 rotate-[-3deg] group-hover:rotate-[-1deg] transition-transform duration-500`}>
                          <h3 className="text-slate-900 font-extrabold text-xl md:text-2xl leading-tight">
                            {item.subtitle}
                          </h3>
                          <p className="text-slate-800 text-xs mt-2 font-medium">
                            {item.description}
                          </p>
                        </div>
                      ) : item.isGraphics ? (
                        // Graphics Design Content
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                          <h3 className="text-white text-3xl font-black uppercase text-center drop-shadow-lg tracking-tight leading-none z-10 relative">
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 opacity-50 block text-5xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full select-none">
                              GRAPHICS
                            </span>
                            <span className="relative">
                              Graphics<br />Design<br />Services
                            </span>
                          </h3>
                          <div className="absolute w-32 h-32 border-4 border-white/20 rounded-full blur-sm animate-pulse"></div>
                        </div>
                      ) : (
                        // Standard Content
                        <div className="absolute bottom-6 left-6 right-6">
                          <h3 className="text-white font-bold text-2xl uppercase tracking-wider drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                            {item.title.split(' ').map((word, i) => (
                              <span key={i}>
                                {word}
                                {i === 0 && <br />}
                                {i > 0 && i < item.title.split(' ').length - 1 && ' '}
                              </span>
                            ))}
                          </h3>
                        </div>
                      )}
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Button */}
      <div className={`flex justify-center transition-all duration-1000 delay-800 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <button className="btn btn-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 group">
          <i className="material-icons-outlined text-xl group-hover:rotate-12 transition-transform duration-300">
            rocket_launch
          </i>
          Explore All Services
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
    </section>
  );
};

export default FeaturedGallery;