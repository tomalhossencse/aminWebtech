import React from "react";

const FloatingButtons = () => {
  const handleMessengerClick = () => {
    window.open("https://m.me/your-page", "_blank");
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/your-number", "_blank");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
      {/* Messenger Button */}
      <div className="tooltip tooltip-left" data-tip="Chat on Messenger">
        <button
          onClick={handleMessengerClick}
          className="btn btn-circle btn-lg bg-[#5668F5] hover:bg-[#4656d4] border-none text-white shadow-lg hover:-translate-y-1 transition-all duration-200"
        >
          <i className="fab fa-facebook-messenger text-2xl"></i>
        </button>
      </div>

      {/* WhatsApp Button */}
      <div className="tooltip tooltip-left" data-tip="Chat on WhatsApp">
        <button
          onClick={handleWhatsAppClick}
          className="btn btn-circle btn-lg bg-[#25D366] hover:bg-[#20bd5a] border-none text-white shadow-lg hover:-translate-y-1 transition-all duration-200 ring-4 ring-green-100 dark:ring-green-900/30"
        >
          <i className="fab fa-whatsapp text-3xl"></i>
        </button>
      </div>

      {/* Scroll to Top Button */}
      <div className="tooltip tooltip-left" data-tip="Scroll to top">
        <button
          onClick={scrollToTop}
          className="btn btn-circle btn-lg btn-primary shadow-lg hover:-translate-y-1 transition-all duration-200"
        >
          <span className="material-icons-outlined text-xl">
            keyboard_arrow_up
          </span>
        </button>
      </div>
    </div>
  );
};

export default FloatingButtons;
