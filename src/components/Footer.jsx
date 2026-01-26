import { useState, useEffect, useRef } from "react";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

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

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const services = [
    "Web Development",
    "App Development",
    "Software Development",
    "Graphics Design",
    "Digital Marketing",
  ];

  const quickLinks = [
    "Home",
    "About Us",
    "Our Projects",
    "Blog",
    "Contact",
    "Privacy Policy",
    "Terms of Service",
  ];

  const socialLinks = [
    { icon: "fab fa-facebook-f", href: "#", label: "Facebook" },
    { icon: "fab fa-twitter", href: "#", label: "Twitter" },
    { icon: "fab fa-linkedin-in", href: "#", label: "LinkedIn" },
    { icon: "fab fa-github", href: "#", label: "GitHub" },
    { icon: "fab fa-instagram", href: "#", label: "Instagram" },
    { icon: "fab fa-youtube", href: "#", label: "YouTube" },
  ];

  return (
    <footer
      ref={footerRef}
      className="max-w-7xl mx-auto px-6 md:px-0  border-t border-base-300 pt-16 pb-8 transition-colors duration-300"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          {/* Company Info */}
          <div
            className={`space-y-6 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 border-2 border-cyan-400 rounded-lg flex items-center justify-center relative shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                <img src="/logo.png" className="p-1" alt="" />
              </div>
              <span className="text-2xl font-bold">
                Amin<span className="text-primary">WebTech</span>
              </span>
            </div>

            <p className="text-base-content/70 leading-relaxed text-sm">
              We build modern web, mobile, and digital solutions that help
              brands grow and succeed online.
            </p>

            <div className="flex space-x-2">
              {socialLinks.map((social, index) => (
                <div
                  key={social.label}
                  className={`transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-5"
                  }`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <a
                    href={social.href}
                    className="btn btn-circle btn-sm bg-base-200 hover:bg-primary hover:text-primary-content border-none transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <i className={`${social.icon} text-sm`}></i>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-lg font-bold mb-6">Our Services</h3>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <li
                  key={service}
                  className={`transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-5"
                  }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <a className="text-base-content/70 hover:text-primary transition-colors text-sm flex items-center group cursor-pointer">
                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 mr-0 group-hover:mr-2 h-0.5 bg-primary"></span>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li
                  key={link}
                  className={`transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-5"
                  }`}
                  style={{ transitionDelay: `${600 + index * 80}ms` }}
                >
                  <a className="text-base-content/70 hover:text-primary transition-colors text-sm cursor-pointer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div
            className={`transition-all duration-1000 delay-600 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-6">
              <li
                className={`flex items-start transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-5"
                }`}
                style={{ transitionDelay: "800ms" }}
              >
                <div className="mt-1 mr-3 flex-shrink-0">
                  <i className="fas fa-map-marker-alt text-primary"></i>
                </div>
                <span className="text-base-content/70 text-sm leading-relaxed">
                  House- 03 (3rd Floor), Road- 02, Block- C, Section- 6<br />
                  Dhaka 1207, Bangladesh
                </span>
              </li>

              <li
                className={`flex items-center transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-5"
                }`}
                style={{ transitionDelay: "900ms" }}
              >
                <div className="mr-3 flex-shrink-0">
                  <i className="fas fa-phone-alt text-primary"></i>
                </div>
                <a
                  className="text-base-content/70 hover:text-primary transition-colors text-sm"
                  href="tel:+8801886928948"
                >
                  +880 1886-928948
                </a>
              </li>

              <li
                className={`flex items-center transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-5"
                }`}
                style={{ transitionDelay: "1000ms" }}
              >
                <div className="mr-3 flex-shrink-0">
                  <i className="fas fa-envelope text-primary"></i>
                </div>
                <a
                  className="text-base-content/70 hover:text-primary transition-colors text-sm"
                  href="mailto:aminwebtech@gmail.com"
                >
                  aminwebtech@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div
          className={`divider transition-all duration-1000 delay-800 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        <div
          className={`pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-base-content/70 transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <p className="mb-4 md:mb-0 text-center md:text-left">
            © 2026 AminWebTech. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a className="hover:text-primary transition-colors cursor-pointer">
              Privacy Policy
            </a>
            <a className="hover:text-primary transition-colors cursor-pointer">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
