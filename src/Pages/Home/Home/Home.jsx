import HeroSlider from "../Components/HeroSlider";
import StatsSection from "../Components/StatsSection";
import ServicesSection from "../Components/ServicesSection";
import FeaturedGallery from "../Components/FeaturedGallery";
import FeaturedProjectsSection from "../Components/FeaturedProjectsSection";
import TestimonialsSection from "../Components/TestimonialsSection";
import CollaborativeHeroSection from "../Components/CollaborativeHeroSection";
const Home = () => {
  return (
    <div>
      <HeroSlider />
      <StatsSection />
      <ServicesSection />
      <FeaturedGallery />
      <FeaturedProjectsSection />
      <TestimonialsSection />
      <CollaborativeHeroSection />
    </div>
  );
};

export default Home;
