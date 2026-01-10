import { useState, useEffect, useRef } from 'react';
import useProjectsAPI from '../../../hooks/useProjectsAPI';

const FeaturedProjectsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const sectionRef = useRef(null);
  
  const { getProjects, loading, error } = useProjectsAPI();

  // Fetch featured projects from API
  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await getProjects({ 
          limit: 4, // Get 4 projects for featured section
          status: 'Published' // Only show published projects
        });
        
        if (response && response.projects) {
          // Transform API data to match component structure
          const transformedProjects = response.projects.map((project, index) => ({
            id: project._id || project.id,
            title: project.title,
            description: project.description || 'No description available',
            category: project.category || 'Web Development',
            company: project.clientName || project.client || 'Client Project',
            technologies: project.technologies?.map(tech => 
              typeof tech === 'string' ? tech : tech.name
            ) || ['HTML', 'CSS', 'JavaScript'],
            gradient: project.gradient || getGradientByIndex(index),
            letter: project.title?.charAt(0).toUpperCase() || 'P',
            categoryColor: getCategoryColor(project.category),
            image: project.image || project.featuredImage,
            projectUrl: project.projectUrl,
            year: project.year || new Date(project.createdAt || Date.now()).getFullYear()
          }));
          
          setProjects(transformedProjects);
        }
      } catch (err) {
        console.error('Failed to fetch featured projects:', err);
        // Keep fallback projects if API fails
        setProjects(getFallbackProjects());
      }
    };

    fetchFeaturedProjects();
  }, [getProjects]);

  // Helper function to get gradient by index
  const getGradientByIndex = (index) => {
    const gradients = [
      'from-blue-400 to-purple-700',
      'from-purple-400 to-pink-600',
      'from-green-400 to-blue-600',
      'from-orange-400 to-red-600',
      'from-indigo-400 to-purple-600',
      'from-pink-400 to-rose-600'
    ];
    return gradients[index % gradients.length];
  };

  // Helper function to get category color
  const getCategoryColor = (category) => {
    const categoryColors = {
      'E-Commerce': 'bg-blue-500/20 text-blue-300 border-blue-400/20',
      'Mobile App': 'bg-violet-500/20 text-violet-300 border-violet-400/20',
      'Web Development': 'bg-green-500/20 text-green-300 border-green-400/20',
      'UI/UX Design': 'bg-pink-500/20 text-pink-300 border-pink-400/20',
      'Backend': 'bg-orange-500/20 text-orange-300 border-orange-400/20',
      'Full Stack': 'bg-purple-500/20 text-purple-300 border-purple-400/20'
    };
    return categoryColors[category] || 'bg-gray-500/20 text-gray-300 border-gray-400/20';
  };

  // Fallback projects in case API fails
  const getFallbackProjects = () => [
    {
      id: 1,
      title: 'Ahbab Art Store',
      description: 'Ahbab.com.bd is a vibrant online shop for art supplies, crafted to help artists, students, and creative enthusiasts easily browse and...',
      category: 'E-Commerce',
      company: 'Ahbab Art Store',
      technologies: ['HTML5, CSS3', 'JavaScript', 'PHP / StoreX CMS'],
      gradient: 'from-blue-400 to-purple-700',
      letter: 'A',
      categoryColor: 'bg-blue-500/20 text-blue-300 border-blue-400/20'
    },
    {
      id: 2,
      title: 'Healthcare App',
      description: 'Patient management and appointment scheduling application designed to streamline hospital operations and improve patient experience.',
      category: 'Mobile App',
      company: 'MediCare Solutions',
      technologies: ['React Native', 'Firebase', 'Redux'],
      gradient: 'from-blue-400 to-violet-600',
      letter: 'H',
      categoryColor: 'bg-violet-500/20 text-violet-300 border-violet-400/20'
    }
  ];

  const features = [
    {
      icon: 'bolt',
      text: 'Industry-leading expertise',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      icon: 'verified_user',
      text: '100% satisfaction guarantee',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: 'auto_awesome',
      text: 'Innovative solutions',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-base-100 relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-purple-200/20 dark:bg-purple-900/20 blur-3xl rounded-full opacity-50"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-200/20 dark:bg-blue-900/20 blur-3xl rounded-full opacity-30"></div>

      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
        {/* Left Column - Main Content */}
        <div className={`space-y-6 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Badge */}
          <div className="badge badge-lg px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-transform duration-300 cursor-default gap-2">
            <span className="material-icons text-sm">emoji_events</span>
            <span className="text-sm font-semibold tracking-wide">Our Portfolio</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-base-content">
            Featured{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600">
              Projects
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg text-base-content/70 max-w-xl leading-relaxed">
            Discover our latest work that showcases innovation, creativity, and technical excellence.
          </p>

          {/* CTA Button */}
          <div className="pt-2">
            <button className="group btn btn-outline btn-lg border-2 hover:bg-base-content hover:text-base-100 transition-all duration-300">
              View All Projects
              <svg 
                className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  d="M7 17L17 7M17 7H7M17 7V17" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column - Why Choose Us Card */}
        <div className={`flex justify-start lg:justify-end transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="group relative w-full max-w-md">
            {/* Animated Background Gradient */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            
            <div className="relative card bg-base-100 shadow-2xl border border-base-300/50 rounded-3xl overflow-hidden backdrop-blur-sm">
              {/* Multiple Background Blur Effects */}
              <div className="absolute -z-10 top-0 right-0 w-32 h-32 bg-purple-200 dark:bg-purple-900/40 blur-3xl rounded-full opacity-50 animate-float"></div>
              <div className="absolute -z-10 bottom-0 left-0 w-24 h-24 bg-pink-200 dark:bg-pink-900/30 blur-2xl rounded-full opacity-40 animate-float-delayed"></div>
              
              <div className="card-body p-8 lg:p-10 relative">
                {/* Decorative Corner Element */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-2xl rotate-12 group-hover:rotate-45 transition-transform duration-500"></div>
                
                <h3 className="card-title text-2xl font-bold text-base-content mb-6 relative">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Why Choose Us?
                  </span>
                  <div className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </h3>
                
                <ul className="space-y-6">
                  {features.map((feature, index) => (
                    <li 
                      key={index}
                      className={`flex items-start group/item transition-all duration-500 delay-${400 + index * 100} hover:transform hover:translate-x-2 ${
                        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-2xl ${feature.bgColor} flex items-center justify-center mt-1 shadow-lg group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-300`}>
                        <span className={`material-icons ${feature.iconColor} text-sm group-hover/item:scale-110 transition-transform duration-300`}>
                          {feature.icon}
                        </span>
                      </div>
                      <span className="ml-4 text-base-content/80 font-medium group-hover/item:text-base-content transition-colors duration-300">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Floating Particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-ping"></div>
                <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-pink-400/40 rounded-full animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {[1, 2].map((index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-72 rounded-t-3xl"></div>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-b-3xl">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="text-red-500 mb-4">
            <span className="material-icons text-6xl">error_outline</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Failed to load projects
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mb-4">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-outline"
          >
            Try Again
          </button>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <span className="material-icons text-6xl">work_off</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No projects found
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            No featured projects are available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project, index) => (
          <div
            key={project.id}
            className={`group relative transition-all duration-700 hover:scale-[1.02] h-full ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
            style={{
              transitionDelay: `${600 + index * 200}ms`
            }}
          >
            {/* Animated Border Gradient */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            
            {/* Main Card */}
            <div className="relative card bg-base-100 shadow-2xl border border-base-300/50 rounded-3xl overflow-hidden backdrop-blur-sm hover:shadow-purple-500/20 transition-all duration-500 h-full flex flex-col">
              {/* Project Header with Enhanced Gradient */}
              <div className={`h-72 w-full bg-gradient-to-br ${project.gradient} relative flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-700`}>
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white/20 rounded-2xl rotate-12 animate-spin-slow"></div>
                  <div className="absolute bottom-4 right-4 w-12 h-12 border border-white/30 rounded-full animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-3xl rotate-45 animate-float"></div>
                </div>

                {/* Large Letter Background with Animation */}
                <span className="text-9xl font-bold text-white opacity-20 select-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10">
                  {project.letter}
                </span>
                
                {/* Category Badge with Enhanced Styling */}
                <div className="absolute bottom-6 left-6 z-20">
                  <div className={`badge ${project.categoryColor} backdrop-blur-md border-2 text-sm font-bold px-4 py-2 shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    <span className="material-icons text-xs mr-1">category</span>
                    {project.category}
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-6 right-6 w-3 h-3 bg-white/30 rounded-full animate-ping"></div>
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse delay-500"></div>

                {/* Enhanced Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Project Content with Enhanced Styling */}
              <div className="card-body p-8 flex flex-col flex-grow relative min-h-0">
                {/* Decorative Corner */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-xl rotate-12 group-hover:rotate-45 transition-transform duration-500"></div>

                <h3 className="card-title text-2xl font-bold text-base-content mb-4 group-hover:text-purple-600 transition-colors duration-300 relative">
                  {project.title}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-500"></div>
                </h3>
                
                <p className="text-base-content/70 text-sm leading-relaxed mb-6 flex-grow group-hover:text-base-content/80 transition-colors duration-300 line-clamp-3">
                  {project.description}
                </p>

                {/* Enhanced Technology Tags */}
                <div className="flex flex-wrap gap-3 mb-6 min-h-[2rem]">
                  {project.technologies.map((tech, techIndex) => (
                    <div 
                      key={techIndex} 
                      className="badge badge-ghost text-xs font-medium px-3 py-2 rounded-xl border border-base-300 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 hover:scale-105"
                    >
                      {tech}
                    </div>
                  ))}
                </div>

                {/* Enhanced Footer */}
                <div className="card-actions justify-between items-center mt-auto pt-6 border-t border-base-300/50 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-base-content group-hover:text-purple-600 transition-colors duration-300">
                      {project.company}
                    </span>
                    {project.year && (
                      <span className="text-xs text-base-content/50">
                        • {project.year}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-sm bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 text-green-600 dark:text-green-400 border-2 border-green-200 dark:border-green-800 hover:from-green-600 hover:to-blue-600 hover:text-white hover:border-transparent hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                        title="View Live Project"
                      >
                        <span className="material-icons text-sm">launch</span>
                      </a>
                    )}
                    
                    <button className="btn btn-circle btn-md bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800 hover:from-blue-600 hover:to-purple-600 hover:text-white hover:border-transparent hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:animate-bounce">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path 
                          d="M14 5l7 7m0 0l-7 7m7-7H3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Floating Particles */}
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-pink-400/40 rounded-full animate-pulse delay-1000 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Floating Action Button */}
      <div className={`flex justify-center mt-20 transition-all duration-1000 delay-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="relative group">
          {/* Animated Background */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          
          <button className="relative btn btn-lg bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white border-none shadow-2xl hover:shadow-purple-500/50 hover:-translate-y-2 hover:scale-105 transition-all duration-300 group rounded-2xl px-8 py-4">
            <span className="material-icons text-xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
              rocket_launch
            </span>
            <span className="font-bold text-lg">Explore All Projects</span>
            
            {/* Floating particles around button */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;