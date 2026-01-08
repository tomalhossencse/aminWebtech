import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ServicesHeroSection from "./components/ServicesHeroSection";
import TestimonialsSection from "./components/TestimonialsSection";

const App = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on load
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  useEffect(() => {
    // Handle keyboard shortcut for theme toggle
    const handleKeyDown = (e) => {
      if (e.key === "d") {
        toggleTheme();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-sans transition-colors duration-300 relative overflow-x-hidden min-h-screen flex flex-col">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <Hero />
      <ServicesHeroSection />
      <ProjectsSection />
      <WorkingProcessSection />
      <TechnologiesSection />
      <TestimonialsSection />
      <FloatingButtons />
    </div>
  );
};

export default App;
