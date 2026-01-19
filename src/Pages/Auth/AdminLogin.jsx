  import { useState, useEffect } from 'react';
import useLogin from '../../hooks/useLogin';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const loginMutation = useLogin();

  // Dark mode management
  useEffect(() => {
    // Check local storage or system preference on load
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("🚀 Form submitted with:", { username: formData.username, password: "***" });
    
    try {
      console.log("📤 Calling login mutation...");
      await loginMutation.mutateAsync({
        username: formData.username,
        password: formData.password
      });
      console.log("✅ Login mutation completed successfully");
      // Navigation is handled in the mutation's onSuccess
    } catch (error) {
      console.error('❌ Login failed in handleSubmit:', error);
      // You can add toast notification here
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 '>
         <div className="min-h-screen transition-all duration-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-slate-100/25 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>

      {/* Theme Toggle Button */}
      <div className="absolute top-8 right-8 z-50">
        <button
          onClick={toggleTheme}
          className={`group relative w-14 h-14 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 ${
            isDark 
              ? 'bg-white/10 border-white/20 hover:bg-white/20 shadow-2xl' 
              : 'bg-white/90 border-slate-200/50 hover:bg-white shadow-2xl hover:shadow-blue-500/25'
          }`}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          <div className="relative">
            {isDark ? (
              <span className="material-icons-outlined text-yellow-400 text-2xl group-hover:rotate-180 transition-transform duration-500">light_mode</span>
            ) : (
              <span className="material-icons-outlined text-slate-700 text-2xl group-hover:rotate-180 transition-transform duration-500">dark_mode</span>
            )}
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Logo - Top Left */}
      <div className="absolute top-8 left-8 z-50">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl">
          <div className="relative">
            <div className="w-10 h-10 border-2 border-primary rounded-xl flex items-center justify-center relative shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-700 dark:to-slate-800 transition-colors duration-300">
              <img src="/logo.png" className="w-6 h-6 object-contain" alt="AminWebTech Logo" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse"></div>
            </div>
          </div>
          <div className="text-left">
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
              Amin<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">WebTech</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Digital Excellence</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="relative animate-fade-in-up delay-200">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-75 animate-pulse"></div>
            
            {/* Main Card */}
            <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-6 transition-all duration-300 hover:shadow-blue-500/25 dark:hover:shadow-purple-500/25">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-3 animate-bounce-in">
                  <span className="material-icons-outlined text-white text-xl">admin_panel_settings</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-1">
                  Admin Portal
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Secure access to administrative controls</p>
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-3"></div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 transition-colors duration-300" htmlFor="username">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-slate-600 flex items-center justify-center group-focus-within:bg-blue-100 dark:group-focus-within:bg-slate-500 transition-all duration-300">
                        <span className="material-icons-outlined text-blue-600 dark:text-blue-400 text-base group-focus-within:text-blue-700 dark:group-focus-within:text-blue-300 transition-colors duration-300">person</span>
                      </div>
                    </div>
                    <input
                      className="block w-full pl-14 pr-4 py-3 border-2 border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 backdrop-blur-sm"
                      id="username"
                      name="username"
                      placeholder="admin"
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                {/* Password Field */}
                <div className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300" htmlFor="password">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300 hover:underline"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-slate-600 flex items-center justify-center group-focus-within:bg-purple-100 dark:group-focus-within:bg-slate-500 transition-all duration-300">
                        <span className="material-icons-outlined text-purple-600 dark:text-purple-400 text-base group-focus-within:text-purple-700 dark:group-focus-within:text-purple-300 transition-colors duration-300">lock</span>
                      </div>
                    </div>
                    <input
                      className="block w-full pl-14 pr-12 py-3 border-2 border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 backdrop-blur-sm"
                      id="password"
                      name="password"
                      placeholder="Enter your secure password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer z-10" onClick={togglePasswordVisibility}>
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-600 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-500 transition-all duration-300">
                        <span className="material-icons-outlined text-slate-500 dark:text-slate-400 text-base hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-300">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <input
                      className="h-4 w-4 text-blue-600 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-blue-500 cursor-pointer bg-white dark:bg-slate-700 transition-colors duration-300"
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    <label className="ml-2 block text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors duration-300" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300 hover:underline" href="#">
                      Forgot password?
                    </a>
                  </div>
                </div>
                
                {/* Login Button */}
                <button
                  className="group relative w-full flex justify-center items-center gap-2 py-3 px-6 border border-transparent rounded-2xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] overflow-hidden mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loginMutation.isPending}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {loginMutation.isPending ? (
                    <span className="loading loading-spinner loading-sm relative z-10"></span>
                  ) : (
                    <span className="material-icons-outlined text-lg relative z-10">login</span>
                  )}
                  <span className="relative z-10">
                    {loginMutation.isPending ? 'Signing in...' : 'Sign in to Dashboard'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>

                {/* Error Message */}
                {loginMutation.error && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="material-icons-outlined text-red-500 text-sm">error</span>
                      <p className="text-sm text-red-700 dark:text-red-400">
                        {loginMutation.error.message}
                      </p>
                    </div>
                  </div>
                )}
              </form>
              
              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  By signing in, you agree to our{' '}
                  <a className="text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline font-medium" href="#">Terms of Service</a> and{' '}
                  <a className="text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline font-medium" href="#">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <footer className="mt-6 text-center animate-fade-in-up delay-400">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                © 2026 AminWebTech • Admin Console • Secure Access
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
    </div>
 
  );
};

export default AdminLogin;