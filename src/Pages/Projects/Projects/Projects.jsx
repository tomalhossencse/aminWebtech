import React from "react";
import ProjectsSection from "../Components/ProjectsSection";
import WorkingProcessSection from "../Components/WorkingProcessSection";
import TechnologiesCarousel from "../../../components/TechnologiesCarousel";
import TestimonialsSimple from "../Components/TestimonialsSimple";

const Projects = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Hero Section with responsive spacing */}
      <div className="pt-4 sm:pt-6 lg:pt-8">
        <ProjectsSection />
      </div>
      
      {/* Working Process Section with responsive spacing */}
      <div className="py-4 sm:py-6 lg:py-8">
        <WorkingProcessSection />
      </div>
      
      {/* Technologies Carousel with responsive spacing */}
      <div className="py-4 sm:py-6 lg:py-8">
        <TechnologiesCarousel />
      </div>
      
      {/* Testimonials Section with responsive spacing */}
      <div className="py-4 sm:py-6 lg:py-8 pb-8 sm:pb-12 lg:pb-16">
        <TestimonialsSimple />
      </div>
    </div>
  );
};

export default Projects;
