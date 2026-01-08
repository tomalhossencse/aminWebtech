import React from "react";
import ProjectsSection from "../Components/ProjectsSection";
import WorkingProcessSection from "../Components/WorkingProcessSection";
import WorkingProcessEnhanced from "../Components/WorkingProcessEnhanced";
import TechnologiesCarousel from "../../../components/TechnologiesCarousel";
import TestimonialsSimple from "../Components/TestimonialsSimple";
const Projects = () => {
  return (
    <div>
      <ProjectsSection />
      <WorkingProcessSection />
      {/* <WorkingProcessEnhanced/> */}
      <TechnologiesCarousel />
      <TestimonialsSimple />
    </div>
  );
};

export default Projects;
