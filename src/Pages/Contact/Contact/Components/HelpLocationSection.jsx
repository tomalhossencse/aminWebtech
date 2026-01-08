import { useState, useEffect, useRef, useCallback } from "react";

const HelpLocationSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHelpHovered, setIsHelpHovered] = useState(false);
  const [isLocationHovered, setIsLocationHovered] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCallButtonPressed, setIsCallButtonPressed] = useState(false);
  const [isMapButtonPressed, setIsMapButtonPressed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [supportAgents] = useState([
    { name: "Sarah", status: "online", avatar: "👩‍💼", responseTime: "< 1 min" },
    { name: "Mike", status: "online", avatar: "👨‍💻", responseTime: "< 2 min" },
    { name: "Lisa", status: "busy", avatar: "👩‍🔧", responseTime: "< 5 min" },
  ]);
  const [weatherData] = useState({
    temp: "28°C",
    condition: "Sunny",
    humidity: "65%",
  });
  const [officeHours, setOfficeHours] = useState({
    isOpen: true,
    nextChange: "18:00",
  });
  const helpSectionRef = useRef(null);
  const locationSectionRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());

      // Check office hours
      const hour = new Date().getHours();
      setOfficeHours({
        isOpen: hour >= 9 && hour < 18,
        nextChange:
          hour < 9 ? "09:00" : hour >= 18 ? "09:00 (tomorrow)" : "18:00",
      });
    }, 1000);

    // Add welcome notification
    setTimeout(() => {
      addNotification("Welcome! Our team is ready to help you.", "success");
    }, 1500);

    return () => clearInterval(timeInterval);
  }, []);

  const addNotification = useCallback((message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const createRipple = useCallback((e, section) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size,
      section,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 1000);
  }, []);

  const handleCallClick = useCallback(
    (e) => {
      e.preventDefault();
      setIsCallButtonPressed(true);
      createRipple(e, "help");

      // Add haptic feedback simulation
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      addNotification("Connecting you to our support team...", "info");

      setTimeout(() => {
        setIsCallButtonPressed(false);
        window.open("tel:+8801886928948");
        addNotification("Call initiated successfully!", "success");
      }, 800);
    },
    [createRipple, addNotification]
  );

  const handleMapClick = useCallback(
    (e) => {
      e.preventDefault();
      setIsMapButtonPressed(true);
      createRipple(e, "location");

      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      addNotification("Opening map location...", "info");

      setTimeout(() => {
        setIsMapButtonPressed(false);
        window.open("https://maps.google.com/?q=Dhaka,Bangladesh", "_blank");
        addNotification("Map opened in new tab!", "success");
      }, 800);
    },
    [createRipple, addNotification]
  );

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-6 py-3 rounded-xl shadow-lg backdrop-blur-md border transform transition-all duration-500 animate-slide-in-right ${
              notification.type === "success"
                ? "bg-green-500/90 border-green-400 text-white"
                : notification.type === "error"
                ? "bg-red-500/90 border-red-400 text-white"
                : "bg-blue-500/90 border-blue-400 text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-icons-round text-sm">
                {notification.type === "success"
                  ? "check_circle"
                  : notification.type === "error"
                  ? "error"
                  : "info"}
              </span>
              <span className="text-sm font-medium">
                {notification.message}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Ripple Effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-40"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        >
          <div className="w-full h-full bg-white/30 rounded-full animate-ripple"></div>
        </div>
      ))}

      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Dynamic Floating Orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-40 h-40 bg-orange-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-teal-400/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-36 h-36 bg-rose-400/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Animated Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-particle-drift"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Enhanced Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              animation: "float 20s ease-in-out infinite",
            }}
          ></div>
        </div>
      </div>

      <div
        className={`max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Ultra-Enhanced Help Section */}
        <div
          ref={helpSectionRef}
          className="lg:col-span-5 relative bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-[2rem] p-6 text-white overflow-hidden shadow-2xl flex flex-col justify-center min-h-[350px] group cursor-pointer transform transition-all duration-700 hover:scale-105 hover:shadow-glow-blue"
          onMouseEnter={() => setIsHelpHovered(true)}
          onMouseLeave={() => setIsHelpHovered(false)}
          onMouseMove={handleMouseMove}
          style={{
            borderRadius: "2rem 0.5rem 2rem 0.5rem",
          }}
        >
          {/* Dynamic Background Effect */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent transition-all duration-700"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.25) 0%, rgba(16, 185, 129, 0.1) 30%, transparent 70%)`,
              opacity: isHelpHovered ? 1 : 0,
              borderRadius: "2rem 0.5rem 2rem 0.5rem",
            }}
          ></div>

          {/* Animated Mesh Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-emerald-400/20 to-teal-400/20 animate-background-shift"></div>
          </div>

          {/* Enhanced Decorative Elements */}
          <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 pointer-events-none">
            <div className="relative flex items-center justify-center w-60 h-60">
              {/* Multi-layer Pulsing Rings */}
              <div
                className={`absolute w-full h-full bg-white/8 rounded-full transition-all duration-1000 ${
                  isHelpHovered
                    ? "scale-125 opacity-25"
                    : "scale-100 opacity-10"
                }`}
              ></div>
              <div
                className={`absolute w-44 h-44 bg-white/15 rounded-full transition-all duration-800 ${
                  isHelpHovered
                    ? "scale-120 opacity-35"
                    : "scale-100 opacity-20"
                }`}
              ></div>
              <div
                className={`absolute w-28 h-28 bg-white/25 rounded-full transition-all duration-600 ${
                  isHelpHovered
                    ? "scale-115 opacity-45"
                    : "scale-100 opacity-30"
                }`}
              ></div>

              {/* Ultra-Enhanced Central Icon */}
              <div
                className={`absolute w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
                  isHelpHovered
                    ? "scale-115 rotate-12 shadow-glow-blue"
                    : "scale-100 rotate-0"
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center relative overflow-hidden animate-gradient-border">
                  {/* Enhanced Animated Dots */}
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce shadow-lg"></div>
                    <div
                      className="w-2 h-2 bg-white rounded-full animate-bounce shadow-lg"
                      style={{ animationDelay: "0.15s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-white rounded-full animate-bounce shadow-lg"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                  </div>

                  {/* Enhanced Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer"></div>
                </div>
              </div>

              {/* Enhanced Floating Particles */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute rounded-full animate-float ${
                    i % 3 === 0
                      ? "w-2 h-2 bg-white/50"
                      : i % 3 === 1
                      ? "w-1.5 h-1.5 bg-emerald-300/60"
                      : "w-1 h-1 bg-teal-300/70"
                  }`}
                  style={{
                    left: `${30 + Math.cos((i * 45 * Math.PI) / 180) * 70}px`,
                    top: `${30 + Math.sin((i * 45 * Math.PI) / 180) * 70}px`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: `${4 + Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="relative z-10">
            <div
              className={`transition-all duration-700 ${
                isHelpHovered ? "transform -translate-y-3" : ""
              }`}
            >
              {/* Live Status Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">
                  Live Support Available
                </span>
                <span className="text-xs opacity-75">
                  {formatTime(currentTime)}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black mb-3 bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent leading-tight">
                Need Immediate Help?
              </h2>
              <p className="text-emerald-100 mb-4 max-w-[90%] text-base leading-relaxed font-medium">
                Our expert team is ready to assist you 24/7 with any questions
                or concerns.
              </p>

              {/* Support Agents Preview */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex -space-x-1.5">
                  {supportAgents.slice(0, 3).map((agent, index) => (
                    <div
                      key={agent.name}
                      className={`w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/50 flex items-center justify-center text-sm transition-all duration-300 hover:scale-110 ${
                        agent.status === "online" ? "animate-pulse" : ""
                      }`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {agent.avatar}
                    </div>
                  ))}
                </div>
                <div className="text-blue-100">
                  <p className="text-xs font-semibold">
                    {supportAgents.filter((a) => a.status === "online").length}{" "}
                    agents online
                  </p>
                  <p className="text-xs opacity-75">Avg response: &lt; 1 min</p>
                </div>
              </div>

              {/* Ultra-Enhanced Button */}
              <button
                onClick={handleCallClick}
                disabled={isCallButtonPressed}
                className={`bg-white text-emerald-600 font-black py-3 px-6 rounded-2xl inline-flex items-center transition-all duration-500 shadow-2xl group/btn transform relative overflow-hidden ${
                  isCallButtonPressed
                    ? "scale-95 bg-emerald-50"
                    : "hover:bg-emerald-50 hover:-translate-y-2 hover:scale-110 hover:shadow-glow-blue"
                }`}
                style={{
                  borderRadius: "1rem 0.25rem 1rem 0.25rem",
                }}
              >
                {/* Multi-layer Button Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/60 to-transparent -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-xl scale-0 group-hover/btn:scale-100 transition-transform duration-300"></div>

                <span
                  className={`material-icons-round mr-2 transform transition-all duration-500 text-lg ${
                    isCallButtonPressed
                      ? "rotate-180 scale-110"
                      : "group-hover/btn:rotate-12 group-hover/btn:scale-110"
                  }`}
                >
                  {isCallButtonPressed ? "phone_in_talk" : "call"}
                </span>
                <span className="relative z-10 text-base">
                  {isCallButtonPressed ? "Connecting..." : "Call Now"}
                </span>

                {/* Button Pulse Effect */}
                <div className="absolute inset-0 rounded-xl bg-emerald-600/30 scale-0 group-hover/btn:scale-100 transition-transform duration-500"></div>
              </button>
            </div>

            {/* Enhanced Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-blue-100">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold">Status</span>
                </div>
                <p className="text-xs opacity-90">
                  {officeHours.isOpen ? "Online Now" : "Offline"}
                </p>
                <p className="text-xs opacity-75">
                  Next: {officeHours.nextChange}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-icons-round text-xs">schedule</span>
                  <span className="text-xs font-bold">Support</span>
                </div>
                <p className="text-xs opacity-90">24/7 Available</p>
                <p className="text-xs opacity-75">Always here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ultra-Enhanced Location Section */}
        <div
          ref={locationSectionRef}
          className="lg:col-span-7 flex flex-col overflow-hidden shadow-2xl min-h-[350px] group transform transition-all duration-700 hover:scale-105 hover:shadow-glow-purple"
          onMouseEnter={() => setIsLocationHovered(true)}
          onMouseLeave={() => setIsLocationHovered(false)}
          style={{
            borderRadius: "0.5rem 2rem 0.5rem 2rem",
          }}
        >
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 text-white p-4 flex items-center justify-between z-20 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-red-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="flex items-center space-x-3 relative z-10">
              <div
                className={`transition-all duration-500 ${
                  isLocationHovered ? "scale-110 rotate-12" : "scale-100"
                }`}
              >
                <span className="material-icons-round text-white text-3xl animate-pulse">
                  location_on
                </span>
              </div>

              <div>
                <h3 className="font-black text-xl leading-tight mb-1">
                  Our Location
                </h3>
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="material-icons-round text-sm">place</span>
                  <span className="font-medium text-sm">Dhaka, Bangladesh</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2"></div>
                </div>
              </div>
            </div>

            {/* Live Info Panel */}
            <div className="relative z-10 text-right">
              <div className="bg-white/10 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/20">
                <p className="text-xs font-bold text-green-300">LIVE</p>
                <p className="text-xs opacity-75">{formatTime(currentTime)}</p>
              </div>
            </div>

            {/* Enhanced Decorative Elements */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full bg-gradient-to-t from-blue-400 to-purple-400 animate-pulse ${
                      i % 2 === 0 ? "h-6" : "h-4"
                    }`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Ultra-Enhanced Map Area */}
          <div className="flex-grow bg-gradient-to-br from-orange-400 via-red-500 via-pink-500 to-rose-600 relative flex items-center justify-center p-6 overflow-hidden">
            {/* Dynamic Background Pattern */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <svg
                height="100%"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    height="40"
                    id="grid"
                    patternUnits="userSpaceOnUse"
                    width="40"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="white"
                      strokeWidth="1"
                    ></path>
                  </pattern>
                  <pattern
                    height="80"
                    id="dots"
                    patternUnits="userSpaceOnUse"
                    width="80"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="2"
                      fill="white"
                      opacity="0.3"
                    ></circle>
                  </pattern>
                </defs>
                <rect fill="url(#grid)" height="100%" width="100%"></rect>
                <rect fill="url(#dots)" height="100%" width="100%"></rect>
              </svg>
            </div>

            {/* Enhanced Floating Map Elements */}
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full animate-float ${
                  i % 4 === 0
                    ? "w-6 h-6 bg-white/25"
                    : i % 4 === 1
                    ? "w-4 h-4 bg-orange-300/30"
                    : i % 4 === 2
                    ? "w-3 h-3 bg-red-300/35"
                    : "w-2 h-2 bg-rose-300/40"
                }`}
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${15 + Math.random() * 70}%`,
                  animationDelay: `${i * 0.7}s`,
                  animationDuration: `${5 + Math.random() * 3}s`,
                }}
              />
            ))}

            {/* Weather Info */}
            <div className="absolute top-3 left-3 bg-white/15 backdrop-blur-md rounded-lg p-2 border border-white/25">
              <div className="flex items-center gap-2 text-white text-xs">
                <span className="material-icons-round text-base">wb_sunny</span>
                <div>
                  <p className="font-bold">{weatherData.temp}</p>
                  <p className="text-xs opacity-75">{weatherData.condition}</p>
                </div>
              </div>
            </div>

            {/* Ultra-Enhanced Central Glass Panel */}
            <div
              className={`bg-white/15 backdrop-blur-2xl p-6 max-w-xs w-full text-center shadow-2xl relative z-10 border border-white/30 transition-all duration-700 ${
                isLocationHovered
                  ? "scale-110 bg-white/20 shadow-glow-purple"
                  : "scale-100"
              }`}
              style={{
                borderRadius: "1.5rem 0.5rem 1.5rem 0.5rem",
              }}
            >
              <div className="flex flex-col items-center">
                {/* Ultra-Enhanced Location Icon */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-70 rounded-full w-12 h-12 mx-auto animate-pulse"></div>
                  <div
                    className="absolute inset-0 bg-red-400 blur-xl opacity-50 rounded-full w-8 h-8 mx-auto animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>

                  <div
                    className={`relative z-10 transition-all duration-700 ${
                      isLocationHovered ? "scale-125 rotate-12" : "scale-100"
                    }`}
                  >
                    <span
                      className="material-icons-round text-orange-100 text-4xl drop-shadow-2xl animate-bounce"
                      style={{
                        textShadow:
                          "0 6px 12px rgba(0,0,0,0.6), 0 0 20px rgba(251, 146, 60, 0.5)",
                        animationDuration: "3s",
                      }}
                    >
                      location_on
                    </span>
                  </div>

                  {/* Multi-layer Ripple Effects */}
                  <div className="absolute inset-0 rounded-full border-2 border-orange-300/60 animate-ping"></div>
                  <div
                    className="absolute inset-0 rounded-full border border-red-300/40 animate-ping"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>

                <h4 className="text-white font-black text-lg mb-3 leading-relaxed text-glow-white">
                  We're located in the heart of Dhaka
                </h4>

                <p className="text-orange-100 text-sm mb-4 opacity-95 font-medium leading-relaxed">
                  Visit us at our modern office space in the business district.
                </p>

                {/* Location Details */}
                <div className="grid grid-cols-2 gap-2 mb-6 w-full">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20">
                    <span className="material-icons-round text-green-400 text-sm mb-1 block">
                      access_time
                    </span>
                    <p className="text-xs font-bold text-white">Open 24/7</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20">
                    <span className="material-icons-round text-blue-400 text-sm mb-1 block">
                      directions_car
                    </span>
                    <p className="text-xs font-bold text-white">Free Parking</p>
                  </div>
                </div>

                {/* Ultra-Enhanced Button */}
                <button
                  onClick={handleMapClick}
                  disabled={isMapButtonPressed}
                  className={`bg-white text-orange-600 font-black py-3 px-6 inline-flex items-center transition-all duration-500 shadow-2xl group/map transform relative overflow-hidden ${
                    isMapButtonPressed
                      ? "scale-95 bg-orange-50"
                      : "hover:bg-orange-50 hover:-translate-y-2 hover:scale-110 hover:shadow-glow-purple"
                  }`}
                  style={{
                    borderRadius: "1rem 0.25rem 1rem 0.25rem",
                  }}
                >
                  {/* Multi-layer Button Effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-100/60 to-transparent -skew-x-12 translate-x-[-100%] group-hover/map:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-xl scale-0 group-hover/map:scale-100 transition-transform duration-300"></div>

                  <span
                    className={`material-icons-round mr-2 transform transition-all duration-500 text-lg ${
                      isMapButtonPressed
                        ? "rotate-180 scale-110"
                        : "group-hover/map:rotate-12 group-hover/map:scale-110"
                    }`}
                  >
                    {isMapButtonPressed ? "explore" : "map"}
                  </span>
                  <span className="relative z-10 text-base">
                    {isMapButtonPressed ? "Opening..." : "View on Map"}
                  </span>
                </button>

                {/* Enhanced Additional Info */}
                <div className="mt-4 flex items-center justify-center gap-4 text-orange-100 text-xs">
                  <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-lg px-2 py-1 border border-white/20">
                    <span className="material-icons-round text-xs text-green-400">
                      wifi
                    </span>
                    <span className="font-medium">WiFi</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-lg px-2 py-1 border border-white/20">
                    <span className="material-icons-round text-xs text-blue-400">
                      local_cafe
                    </span>
                    <span className="font-medium">Coffee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Corner Decorations */}
            <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-white/40 rounded-tl-lg animate-pulse"></div>
            <div
              className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-white/40 rounded-tr-lg animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-white/40 rounded-bl-lg animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-white/40 rounded-br-lg animate-pulse"
              style={{ animationDelay: "1.5s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpLocationSection;
