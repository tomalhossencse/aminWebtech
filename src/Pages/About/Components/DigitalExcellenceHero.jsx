import { useState, useEffect } from "react";

const DigitalExcellenceHero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')`,
        }}
      ></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] animate-float opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px] animate-float-delayed opacity-60"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-500/15 rounded-full blur-[80px] animate-pulse opacity-50"></div>
        <div className="absolute bottom-[30%] left-[20%] w-[25%] h-[25%] bg-indigo-500/15 rounded-full blur-[60px] animate-bounce-slow opacity-40"></div>
      </div>

      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none bg-pattern-plus"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD04RAjiVf7trKG5VS9W2B_vcz49IOOiWZXt8KpwEkXBn0CFw3uvG2btcLNult-z2X1qiRz_JVja-Zuycz1wRbbYeHqH893gUeJCH6MxhJggb0t-K08aLVgVugen9kbjJfE6QDgxE0YgTbJkn2eERLwRYGEpJVsJjTuhJmjE8jixtlazHy95FUqU9i3VWxNb-McvP9qA5loQXFkkvV607YiijBvONdBQXCYvZvqKnN3pjkj4yKOSLk2yFdZHy0iYZvwR9pSU7fc86Q')`,
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center h-full py-20">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6 max-w-5xl animate-fade-in-up">
          Ready to Transform <br className="hidden md:block" />
          <span className="text-yellow-400 animate-gradient-x bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Your Digital Presence?
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-blue-100 max-w-3xl mb-10 font-medium animate-fade-in-up delay-200">
          Let's collaborate to bring your vision to life with our expert team
          and proven methodologies.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto animate-fade-in-up delay-400">
          <button className="btn btn-lg bg-white text-primary font-bold hover:bg-gray-50 hover:scale-105 border-none shadow-lg min-w-[180px] transition-all duration-300 hover:shadow-xl">
            <i className="fas fa-rocket mr-2"></i>
            Start a Project
          </button>
          <button className="btn btn-lg btn-outline text-white font-bold border-2 border-white/30 hover:bg-white/10 hover:border-white/50 hover:scale-105 min-w-[180px] transition-all duration-300">
            <i className="fas fa-eye mr-2"></i>
            View Our Services
          </button>
        </div>

        {/* Trust Badge */}
        <div className="flex items-center gap-2 text-white/90 text-sm font-medium animate-fade-in-up delay-600 hover:text-white transition-colors duration-300">
          <i className="fas fa-shield-alt text-lg animate-pulse-slow"></i>
          <span>Trusted by 50+ leading companies worldwide</span>
        </div>
      </div>
    </section>
  );
};

export default DigitalExcellenceHero;
