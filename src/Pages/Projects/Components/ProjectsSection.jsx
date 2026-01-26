import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../../hooks/useAxios';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Eye, 
  Calendar, 
  User, 
  Code, 
  Star,
  Clock,
  ArrowRight,
  Loader2
} from 'lucide-react';

const ProjectsSection = () => {
  const axios = useAxios();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Projects');

  // Fetch projects from API
  const {
    data: projectsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['public-projects'],
    queryFn: async () => {
      const response = await axios.get('/projects?limit=50'); // Get more projects for public display
      return response.data;
    }
  });

  // Transform API data to match component expectations
  const projects = (projectsData?.projects || []).map(project => ({
    id: project._id,
    title: project.title,
    description: project.description,
    category: project.category,
    client: project.clientName,
    year: project.year || new Date(project.createdAt).getFullYear().toString(),
    technologies: project.technologies?.map(tech => tech.name) || [],
    keyFeatures: project.keyFeatures?.map(feature => feature.name) || [],
    gradient: project.gradient || 'from-blue-500 to-indigo-600',
    letter: project.letter || project.title.charAt(0).toUpperCase(),
    hasLiveDemo: !!project.projectUrl,
    demoUrl: project.projectUrl || null,
    detailsUrl: '#',
    isFeatured: project.isFeatured || false,
    isActive: project.isActive,
    startDate: project.startDate,
    endDate: project.endDate,
    challenge: project.challenge,
    solution: project.solution,
    result: project.result
  }));

  // Define filter buttons after projects are available
  const filterButtons = [
    { label: 'All Projects', icon: Filter, count: projects.length },
    { label: 'Web Development', icon: Code, count: projects.filter(p => p.category === 'Web Development').length },
    { label: 'Mobile App', icon: 'smartphone', count: projects.filter(p => p.category === 'Mobile App').length },
    { label: 'E-Commerce', icon: 'shopping_cart', count: projects.filter(p => p.category === 'E-Commerce').length },
    { label: 'UI/UX Design', icon: 'palette', count: projects.filter(p => p.category === 'UI/UX Design').length },
    { label: 'SaaS', icon: 'trending_up', count: projects.filter(p => p.category === 'SaaS').length }
  ];

  // Filter projects based on search term and active filter
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.client.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = activeFilter === 'All Projects' || project.category === activeFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter, projects]);

  // Loading state
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Our Projects</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our successful projects and see how we help businesses grow.
          </p>
        </div>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600 dark:text-gray-400">Loading amazing projects...</span>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Our Projects</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our successful projects and see how we help businesses grow.
          </p>
        </div>
        <div className="text-center py-20">
          <div className="text-red-500 mb-4">
            <span className="material-icons-outlined text-6xl">error_outline</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to load projects</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10 lg:mb-12">
        <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Portfolio Showcase
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent px-2">
          Our Projects
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
          Discover our portfolio of successful projects that have helped businesses transform their digital presence and achieve remarkable growth.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            {projects.filter(p => p.isActive).length} Active Projects
          </div>
          <div className="flex items-center">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 mr-2" />
            {projects.filter(p => p.isFeatured).length} Featured
          </div>
          <div className="flex items-center">
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            {projects.filter(p => p.hasLiveDemo).length} Live Demos
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 sm:pl-12 pr-10 sm:pr-4 py-3 sm:py-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all outline-none text-sm sm:text-base lg:text-lg"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 text-lg sm:text-xl"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 lg:mb-12 px-2">
        {filterButtons.map((button) => {
          const IconComponent = typeof button.icon === 'string' ? 
            () => <span className="material-icons-outlined text-base sm:text-lg">{button.icon}</span> : 
            button.icon;
          
          return (
            <button
              key={button.label}
              onClick={() => setActiveFilter(button.label)}
              className={`inline-flex items-center px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm lg:text-base ${
                activeFilter === button.label
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{button.label}</span>
              <span className="sm:hidden">{button.label.split(' ')[0]}</span>
              <span className={`ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold ${
                activeFilter === button.label
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {button.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Projects Stats */}
      <div className="text-center mb-6 sm:mb-8 px-2">
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Showing <span className="font-semibold text-blue-600">{filteredProjects.length}</span> of <span className="font-semibold">{projects.length}</span> projects
          {searchTerm && (
            <span className="block sm:inline"> matching "<span className="font-semibold text-blue-600">{searchTerm}</span>"</span>
          )}
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-2">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 sm:py-16">
            <div className="text-gray-400 dark:text-gray-500 mb-4 sm:mb-6">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">No projects found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base px-4">
              We couldn't find any projects matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('All Projects');
              }}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const projectDuration = () => {
    if (!project.startDate || !project.endDate) return null;
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    return months > 0 ? `${months} month${months > 1 ? 's' : ''}` : `${diffDays} days`;
  };

  return (
    <div 
      className={`bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 flex flex-col group h-full ${
        index % 2 === 0 ? 'animate-fade-in-up' : 'animate-fade-in-up'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Project Header with Gradient */}
      <div className={`h-32 sm:h-40 lg:h-48 bg-gradient-to-br ${project.gradient} relative flex items-center justify-center overflow-hidden`}>
        {/* Featured Badge */}
        {project.isFeatured && (
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 sm:px-3 py-1 rounded-full flex items-center">
            <Star className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
            <span className="hidden sm:inline">Featured</span>
            <span className="sm:hidden">★</span>
          </div>
        )}
        
        {/* Category Badge */}
        <span className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full border border-white/30">
          <span className="hidden sm:inline">{project.category}</span>
          <span className="sm:hidden">{project.category.split(' ')[0]}</span>
        </span>
        
        {/* Project Letter/Logo */}
        <div className="relative">
          <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg transition-transform duration-300 ${
            isHovered ? 'scale-110 rotate-3' : ''
          }`}>
            {project.letter}
          </h2>
          
          {/* Animated Background Elements */}
          <div className={`absolute inset-0 bg-white/10 rounded-full transition-all duration-500 ${
            isHovered ? 'scale-150 opacity-100' : 'scale-100 opacity-0'
          }`}></div>
        </div>

        {/* Status Indicator */}
        <div className={`absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
          project.isActive ? 'bg-green-400' : 'bg-gray-400'
        } shadow-lg`}></div>
      </div>

      {/* Project Content */}
      <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
        {/* Title and Description */}
        <div className="mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {project.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Project Meta Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-blue-500 flex-shrink-0" />
            <span className="truncate">{project.client}</span>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-green-500 flex-shrink-0" />
            <span>{project.year}</span>
          </div>
          {projectDuration() && (
            <div className="flex items-center text-gray-500 dark:text-gray-400 col-span-1 sm:col-span-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-purple-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Duration: {projectDuration()}</span>
            </div>
          )}
        </div>

        {/* Technologies */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center mb-2">
            <Code className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-indigo-500" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Technologies</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, window.innerWidth < 640 ? 3 : 4).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > (window.innerWidth < 640 ? 3 : 4) && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-md font-medium">
                +{project.technologies.length - (window.innerWidth < 640 ? 3 : 4)} more
              </span>
            )}
          </div>
        </div>

        {/* Key Features Preview */}
        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Features</div>
            <div className="space-y-1">
              {project.keyFeatures.slice(0, 2).map((feature, index) => (
                <div key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                  <span className="line-clamp-1">{feature}</span>
                </div>
              ))}
              {project.keyFeatures.length > 2 && (
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  +{project.keyFeatures.length - 2} more features
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-center sm:justify-start text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors group py-2 sm:py-0"
            >
              <Eye className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
              View Details
              <ArrowRight className={`w-3 h-3 ml-1 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
            </button>
            
            {project.hasLiveDemo && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Live Demo</span>
                <span className="sm:hidden">Demo</span>
              </a>
            )}
          </div>
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="space-y-3 text-sm">
              {project.challenge && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">Challenge</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{project.challenge}</p>
                </div>
              )}
              {project.solution && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">Solution</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{project.solution}</p>
                </div>
              )}
              {project.result && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">Result</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{project.result}</p>
                </div>
              )}
              
              {/* Project Timeline */}
              {project.startDate && project.endDate && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Project Timeline</h4>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-2">
                    <span>Started: {formatDate(project.startDate)}</span>
                    <div className="hidden sm:flex flex-1 mx-3 h-px bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <span>Completed: {formatDate(project.endDate)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsSection;

// Add these styles to your global CSS or Tailwind config
const styles = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;