import React, { useState, useEffect } from "react";

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show scroll-to-top button when user scrolls down 300px
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMessengerClick = () => {
    window.open("https://m.me/aminwebtech", "_blank");
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/8801719928948", "_blank");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      {/* Messenger Button */}
      <div className="tooltip tooltip-left" data-tip="Chat on Messenger">
        <button
          onClick={handleMessengerClick}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-[#5668F5] to-[#4656d4] border-none text-white shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:scale-110 transition-all duration-300 animate-pulse hover:animate-bounce flex items-center justify-center group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
          <i className="fab fa-facebook-messenger text-2xl relative z-10 group-hover:text-white transition-colors duration-300"></i>
        </button>
      </div>

      {/* WhatsApp Button */}
      <div className="tooltip tooltip-left" data-tip="Chat on WhatsApp">
        <button
          onClick={handleWhatsAppClick}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-[#25D366] to-[#20bd5a] border-none text-white shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:scale-110 transition-all duration-300 animate-pulse hover:animate-bounce flex items-center justify-center group relative overflow-hidden ring-2 ring-green-100 dark:ring-green-900/30 hover:ring-4 hover:ring-green-200 dark:hover:ring-green-800/50"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
          <i className="fab fa-whatsapp text-2xl relative z-10 group-hover:text-white transition-colors duration-300"></i>
        </button>
      </div>

      {/* Scroll to Top Button - Only show when scrolled */}
      {showScrollTop && (
        <div className="tooltip tooltip-left" data-tip="Scroll to top">
          <button
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-focus border-none text-white shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:scale-110 transition-all duration-300 animate-pulse hover:animate-bounce flex items-center justify-center group relative overflow-hidden animate-fade-in"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
            <span className="material-icons-outlined text-2xl relative z-10 group-hover:text-white transition-colors duration-300">
              keyboard_arrow_up
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingButtons;
