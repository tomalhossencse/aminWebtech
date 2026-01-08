import { useState, useEffect } from 'react';

const BlogHeader = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTyping, setIsTyping] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const dynamicWords = ['Insights', 'Tutorials', 'Guides', 'Tips', 'Stories'];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setIsTyping(e.target.value.length > 0);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % dynamicWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header 
      className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 pt-20 pb-32 px-4 sm:px-6 lg:px-8 text-center shadow-2xl overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dynamic Mouse-Following Gradient */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-pink-400/30 to-cyan-400/30 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-20 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Enhanced Floating Particles */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-bounce ${
              i % 3 === 0 ? 'w-3 h-3 bg-white/30' : 
              i % 3 === 1 ? 'w-2 h-2 bg-yellow-300/40' : 
              'w-1 h-1 bg-pink-300/50'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}

        {/* Animated Lines */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
              style={{
                top: `${20 + i * 10}%`,
                left: '0%',
                right: '0%',
                animationDelay: `${i * 0.5}s`,
                animationDuration: '4s'
              }}
            />
          ))}
        </div>

        {/* Enhanced Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: 'float 20s ease-in-out infinite'
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Enhanced Badge with Animation */}
        <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8 shadow-lg hover:bg-white/15 transition-all duration-500 hover:scale-105 group">
          <span className="material-icons text-lg animate-pulse group-hover:animate-spin transition-all duration-500">auto_stories</span>
          <span className="font-semibold tracking-wide">Knowledge Hub</span>
          <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full animate-pulse"></div>
        </div>

        {/* Enhanced Main Title with Dynamic Text */}
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight animate-fade-in-up">
          <span className="text-white">Our </span>
          <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
            Blog
          </span>
        </h1>
        
        {/* Dynamic Subtitle */}
        <div className="text-blue-100 text-xl md:text-2xl mb-4 font-light max-w-2xl mx-auto leading-relaxed">
          <span>Latest </span>
          <span className="inline-block min-w-[120px] text-left">
            <span 
              key={currentWordIndex}
              className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent font-semibold animate-fade-in-up"
            >
              {dynamicWords[currentWordIndex]}
            </span>
          </span>
          <span>, tutorials, and news from our team of experts</span>
        </div>

        {/* Typing Indicator */}
        <div className="flex justify-center items-center gap-2 mb-12">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <span className="text-blue-200 text-sm font-medium">Discover amazing content</span>
        </div>
        
        {/* Ultra Enhanced Search Bar */}
        <div className="relative max-w-2xl mx-auto group">
          {/* Animated Border Glow */}
          <div className={`absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl blur-lg transition-all duration-500 ${
            isSearchFocused ? 'opacity-60 scale-105' : 'opacity-0 group-hover:opacity-30'
          }`}></div>
          
          {/* Pulsing Ring Effect */}
          <div className={`absolute inset-0 rounded-2xl border-2 border-white/30 transition-all duration-500 ${
            isSearchFocused ? 'animate-ping' : ''
          }`}></div>
          
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden hover:bg-white/15 transition-all duration-500">
            {/* Search Icon with Animation */}
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <span className={`material-icons transition-all duration-500 ${
                isSearchFocused ? 'text-blue-400 scale-110 animate-pulse' : 
                isTyping ? 'text-green-400' : 'text-gray-400'
              }`}>
                {isTyping ? 'search' : 'search'}
              </span>
            </div>
            
            {/* Enhanced Input */}
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="block w-full pl-16 pr-20 py-5 bg-transparent text-white placeholder-blue-200 focus:outline-none focus:ring-0 text-lg font-medium transition-all duration-300"
              placeholder="Search articles, tutorials, guides..."
            />
            
            {/* Enhanced Search Button */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl transition-all duration-500 shadow-lg hover:shadow-2xl group/btn ${
                isSearchFocused ? 'scale-110 from-blue-400 to-purple-400' : 'hover:scale-105 hover:from-blue-600 hover:to-purple-600'
              }`}>
                <span className="material-icons text-lg group-hover/btn:rotate-12 transition-transform duration-300">
                  {isTyping ? 'send' : 'arrow_forward'}
                </span>
              </button>
            </div>

            {/* Search Suggestions Indicator */}
            {isTyping && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 bg-white/60 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Quick Stats with Animations */}
        <div className="flex justify-center items-center gap-8 mt-16 text-white/80">
          <div className="text-center group cursor-pointer">
            <div className="text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text group-hover:text-transparent">
              50+
            </div>
            <div className="text-sm font-medium tracking-wide">Articles</div>
            <div className="w-8 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
          
          <div className="text-center group cursor-pointer">
            <div className="text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text group-hover:text-transparent">
              10k+
            </div>
            <div className="text-sm font-medium tracking-wide">Readers</div>
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
          
          <div className="text-center group cursor-pointer">
            <div className="text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text group-hover:text-transparent flex items-center justify-center gap-1">
              5
              <span className="material-icons text-yellow-400 text-lg animate-pulse">star</span>
            </div>
            <div className="text-sm font-medium tracking-wide">Rating</div>
            <div className="w-8 h-0.5 bg-gradient-to-r from-pink-400 to-red-400 mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-xs font-medium tracking-wide">Scroll to explore</span>
            <span className="material-icons text-lg animate-pulse">keyboard_arrow_down</span>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg className="relative block w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity="0.25" 
            fill="currentColor" 
            className="text-gray-50 dark:text-slate-900"
          />
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity="0.5" 
            fill="currentColor" 
            className="text-gray-50 dark:text-slate-900"
          />
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            fill="currentColor" 
            className="text-gray-50 dark:text-slate-900"
          />
        </svg>
      </div>
    </header>
  );
};

export default BlogHeader;