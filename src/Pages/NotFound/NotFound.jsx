import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto py-8">
        {/* 404 Number with Parallax Effect */}
        <div 
          className="relative mb-4"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <h1 className="text-[120px] md:text-[160px] font-black leading-none select-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 drop-shadow-2xl animate-gradient">
              404
            </span>
          </h1>
          
          {/* Glitch Effect Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <span className="text-[120px] md:text-[160px] font-black text-red-500 animate-glitch">
              404
            </span>
          </div>
        </div>

        {/* Error Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-full shadow-2xl">
              <i className="material-icons-outlined text-white text-4xl animate-bounce">
                explore_off
              </i>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 animate-fade-in">
          Page Not Found
        </h2>
        
        <p className="text-base md:text-lg text-blue-200 mb-5 max-w-2xl mx-auto animate-fade-in-delay px-4">
          Oops! The page you're looking for seems to have wandered off. 
          Don't worry, we'll help you find your way back.
        </p>

        {/* Countdown Timer */}
        <div className="mb-5 animate-fade-in-delay-2">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <i className="material-icons-outlined text-blue-300 animate-spin-slow text-lg">
              schedule
            </i>
            <span className="text-white text-sm">
              Redirecting in{' '}
              <span className="font-bold text-blue-300 text-lg">{countdown}</span>s
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-in-delay-3 mb-5">
          <Link
            to="/"
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2 text-sm">
              <i className="material-icons-outlined text-lg group-hover:-translate-x-1 transition-transform duration-300">
                home
              </i>
              Back to Home
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="group px-6 py-3 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border-2 border-white/20 hover:bg-white/20 hover:border-white/40 hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-2 text-sm">
              <i className="material-icons-outlined text-lg group-hover:-translate-x-1 transition-transform duration-300">
                arrow_back
              </i>
              Go Back
            </span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="animate-fade-in-delay-4">
          <p className="text-blue-300 mb-3 text-xs uppercase tracking-wider font-semibold">
            Quick Links
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { name: 'Home', path: '/', icon: 'home' },
              { name: 'Projects', path: '/projects', icon: 'work' },
              { name: 'Services', path: '/services', icon: 'design_services' },
              { name: 'Blog', path: '/blog', icon: 'article' },
              { name: 'Contact', path: '/contact', icon: 'mail' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="group flex items-center gap-1.5 px-3 py-1.5 bg-white/5 backdrop-blur-sm text-blue-200 rounded-lg border border-white/10 hover:bg-white/10 hover:border-blue-400/50 hover:text-white transition-all duration-300"
              >
                <i className="material-icons-outlined text-sm group-hover:scale-110 transition-transform duration-300">
                  {link.icon}
                </i>
                <span className="text-xs font-medium">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
          }
          75% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes glitch {
          0%, 100% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-glitch {
          animation: glitch 0.3s infinite;
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fadeIn 0.8s ease-out 0.4s both;
        }

        .animate-fade-in-delay-3 {
          animation: fadeIn 0.8s ease-out 0.6s both;
        }

        .animate-fade-in-delay-4 {
          animation: fadeIn 0.8s ease-out 0.8s both;
        }

        .animate-fade-in-delay-5 {
          animation: fadeIn 0.8s ease-out 1s both;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
