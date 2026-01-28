import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Globe, 
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '../../../hooks/useAxios';
import { useToast } from '../../../Context/ToastContext';

const ProjectsManagement = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const { success, error: showError, warning, info } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form state for add project modal
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    clientName: '',
    description: '',
    category: '',
    projectUrl: '',
    coverImageUrl: '',
    startDate: '',
    endDate: '',
    technologies: [],
    keyFeatures: [],
    galleryImages: [],
    displayOrder: 0,
    isFeatured: false,
    isActive: true,
    challenge: '',
    solution: '',
    result: ''
  });

  const [newTechnology, setNewTechnology] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newGalleryImage, setNewGalleryImage] = useState('');

  // Fetch projects
  const {
    data: projectsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['projects', { page: currentPage, search: searchTerm, status: statusFilter, category: categoryFilter }],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit: 10,
          ...(searchTerm && { search: searchTerm }),
          ...(statusFilter !== 'All Status' && { status: statusFilter }),
          ...(categoryFilter !== 'All Categories' && { category: categoryFilter })
        });
        
        const response = await axios.get(`/api/projects?${params}`);
        return response.data;
      } catch (err) {
        console.error('❌ Error fetching projects:', err);
        showError('Failed to load projects. Please check your connection.');
        throw err;
      }
    },
    keepPreviousData: true,
    retry: (failureCount, error) => {
      // Don't retry on 500 errors (server configuration issues)
      if (error.response?.status === 500) return false;
      return failureCount < 2;
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId) => {
      await axios.delete(`/api/projects/${projectId}`);
    },
    onSuccess: (data, projectId) => {
      queryClient.invalidateQueries(['projects']);
      setDeleteConfirm(null);
      const projectName = deleteConfirm?.title || 'Project';
      success(`${projectName} deleted successfully!`);
      console.log('✅ Project deleted successfully');
    },
    onError: (error, projectId) => {
      console.error('❌ Error deleting project:', error);
      const projectName = deleteConfirm?.title || 'project';
      
      if (error.response?.status === 404) {
        showError(`${projectName} not found. It may have already been deleted.`);
      } else if (error.response?.status === 403) {
        showError('You do not have permission to delete this project.');
      } else if (error.response?.status === 500) {
        showError('Server error. Please configure backend environment variables.');
      } else {
        showError(`Failed to delete ${projectName}. Please try again.`);
      }
    }
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData) => {
      const response = await axios.post('/api/projects', projectData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['projects']);
      setIsAddModalOpen(false);
      resetForm();
      success(`Project "${formData.title}" created successfully!`);
      console.log('✅ Project created successfully');
    },
    onError: (error) => {
      console.error('❌ Error creating project:', error);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.error || 'Invalid project data';
        showError(`Validation error: ${errorMessage}`);
      } else if (error.response?.status === 403) {
        showError('You do not have permission to create projects.');
      } else if (error.response?.status === 500) {
        showError('Server error. Please configure backend environment variables.');
      } else {
        showError('Failed to create project. Please try again.');
      }
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, projectData }) => {
      const response = await axios.put(`/api/projects/${id}`, projectData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['projects']);
      setIsEditModalOpen(false);
      setEditingProject(null);
      resetForm();
      success(`Project "${formData.title}" updated successfully!`);
      console.log('✅ Project updated successfully');
    },
    onError: (error) => {
      console.error('❌ Error updating project:', error);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.error || 'Invalid project data';
        showError(`Validation error: ${errorMessage}`);
      } else if (error.response?.status === 404) {
        showError('Project not found. It may have been deleted.');
      } else if (error.response?.status === 403) {
        showError('You do not have permission to update this project.');
      } else if (error.response?.status === 500) {
        showError('Server error. Please configure backend environment variables.');
      } else {
        showError('Failed to update project. Please try again.');
      }
    }
  });

  const projects = projectsData?.projects || [];
  const totalEntries = projectsData?.total || 0;
  const entriesPerPage = 10;
  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      'Inactive': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      'Archived': 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
    };
    return statusConfig[status] || statusConfig['Active'];
  };

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      'E-Commerce': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
      'Mobile App': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      'Web Development': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      'UI/UX Design': 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300',
      'SaaS': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300',
      'Portfolio': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
    };
    return categoryConfig[category] || categoryConfig['Web Development'];
  };

  const handleAction = (action, projectId) => {
    const project = projects.find(p => p._id === projectId);
    
    switch (action) {
      case 'add':
        setIsAddModalOpen(true);
        info('Fill in the project details to create a new project.');
        break;
      case 'view':
        setSelectedProject(project);
        setIsModalOpen(true);
        break;
      case 'edit':
        setEditingProject(project);
        populateFormWithProject(project);
        setIsEditModalOpen(true);
        info(`Editing project: ${project?.title || 'Unknown'}`);
        break;
      case 'delete':
        setDeleteConfirm(project);
        warning(`You are about to delete "${project?.title || 'this project'}". This action cannot be undone.`);
        break;
      case 'demo':
        if (project?.projectUrl) {
          window.open(project.projectUrl, '_blank');
          info(`Opening live demo for ${project.title}`);
        } else {
          showError('No demo URL available for this project.');
        }
        break;
      default:
        console.log(`${action} project with ID: ${projectId}`);
    }
  };

  // Form handlers
  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      clientName: '',
      description: '',
      category: '',
      projectUrl: '',
      coverImageUrl: '',
      startDate: '',
      endDate: '',
      technologies: [],
      keyFeatures: [],
      galleryImages: [],
      displayOrder: 0,
      isFeatured: false,
      isActive: true,
      challenge: '',
      solution: '',
      result: ''
    });
    setNewTechnology('');
    setNewFeature('');
    setNewGalleryImage('');
    
    info('Form has been reset.');
  };

  const populateFormWithProject = (project) => {
    if (!project) return;
    
    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      clientName: project.clientName || '',
      description: project.description || '',
      category: project.category || '',
      projectUrl: project.projectUrl || '',
      coverImageUrl: project.coverImageUrl || '',
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      endDate: project.endDate ? project.endDate.split('T')[0] : '',
      technologies: project.technologies || [],
      keyFeatures: project.keyFeatures || [],
      galleryImages: project.galleryImages || [],
      displayOrder: project.displayOrder || 0,
      isFeatured: project.isFeatured || false,
      isActive: project.isActive !== undefined ? project.isActive : true,
      challenge: project.challenge || '',
      solution: project.solution || '',
      result: project.result || ''
    });
    setNewTechnology('');
    setNewFeature('');
    setNewGalleryImage('');
    
    success(`Project "${project.title}" loaded for editing.`);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, { name: newTechnology.trim() }]
      }));
      setNewTechnology('');
      success(`Added technology: ${newTechnology.trim()}`);
    } else {
      showError('Please enter a technology name.');
    }
  };

  const removeTechnology = (index) => {
    const techName = formData.technologies[index]?.name;
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
    if (techName) {
      info(`Removed technology: ${techName}`);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        keyFeatures: [...prev.keyFeatures, { name: newFeature.trim() }]
      }));
      setNewFeature('');
      success(`Added feature: ${newFeature.trim()}`);
    } else {
      showError('Please enter a feature description.');
    }
  };

  const removeFeature = (index) => {
    const featureName = formData.keyFeatures[index]?.name;
    setFormData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index)
    }));
    if (featureName) {
      info(`Removed feature: ${featureName}`);
    }
  };

  const addGalleryImage = () => {
    if (newGalleryImage.trim()) {
      if (isValidUrl(newGalleryImage.trim())) {
        setFormData(prev => ({
          ...prev,
          galleryImages: [...prev.galleryImages, newGalleryImage.trim()]
        }));
        setNewGalleryImage('');
        success('Gallery image added successfully!');
      } else {
        showError('Please enter a valid image URL.');
      }
    } else {
      showError('Please enter an image URL.');
    }
  };

  const removeGalleryImage = (index) => {
    const imageUrl = formData.galleryImages[index];
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
    info('Gallery image removed.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation with toast feedback
    if (!formData.title || !formData.clientName || !formData.description || !formData.category) {
      showError('Please fill in all required fields (Title, Client Name, Description, and Category).');
      return;
    }

    // Additional validation
    if (formData.title.length < 3) {
      showError('Project title must be at least 3 characters long.');
      return;
    }

    if (formData.description.length < 10) {
      showError('Project description must be at least 10 characters long.');
      return;
    }

    if (formData.projectUrl && !isValidUrl(formData.projectUrl)) {
      showError('Please enter a valid project URL.');
      return;
    }

    if (formData.coverImageUrl && !isValidUrl(formData.coverImageUrl)) {
      showError('Please enter a valid cover image URL.');
      return;
    }
    
    if (editingProject) {
      // Update existing project
      info(`Updating project "${formData.title}"...`);
      updateProjectMutation.mutate({ 
        id: editingProject._id, 
        projectData: formData 
      });
    } else {
      // Create new project
      info(`Creating project "${formData.title}"...`);
      createProjectMutation.mutate(formData);
    }
  };

  // Helper function to validate URLs
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      info(`Deleting project "${deleteConfirm.title}"...`);
      deleteProjectMutation.mutate(deleteConfirm._id);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5" />
            <span>Failed to load projects. Please try again.</span>
          </div>
          <button
            onClick={() => {
              info('Retrying to load projects...');
              refetch();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your portfolio projects</p>
        </div>
        <div>
          <button
            onClick={() => handleAction('add', null)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add New Project
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-colors"
            placeholder="Search projects..."
          />
        </div>
        
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2.5 pl-4 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Archived</option>
          </select>
        </div>
        
        <div className="w-full md:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full py-2.5 pl-4 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer"
          >
            <option>All Categories</option>
            <option>E-Commerce</option>
            <option>Mobile App</option>
            <option>Web Development</option>
            <option>UI/UX Design</option>
            <option>SaaS</option>
            <option>Portfolio</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading projects...</span>
          </div>
        </div>
      )}

      {/* Projects Table */}
      {!isLoading && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No projects found. Create your first project!
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{project.title}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                            {project.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{project.slug}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-gray-200">{project.clientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadge(project.category)}`}>
                          {project.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(project.isActive ? 'Active' : 'Inactive')}`}>
                          {project.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          {formatDate(project.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleAction('view', project._id)}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 hover:scale-110"
                            title="View"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleAction('edit', project._id)}
                            className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 p-1 rounded-md hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all duration-200 hover:scale-110"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleAction('delete', project._id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 hover:scale-110"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          {project.projectUrl && (
                            <button
                              onClick={() => handleAction('demo', project._id)}
                              className="text-emerald-500 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 p-1 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-200 hover:scale-110"
                              title="Live Demo"
                            >
                              <Globe className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalEntries > entriesPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium">{startEntry}</span> to <span className="font-medium">{endEntry}</span> of <span className="font-medium">{totalEntries}</span> results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={endEntry >= totalEntries}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="modal modal-open" style={{ zIndex: 1000 }}>
          <div className="modal-box w-11/12 max-w-4xl h-[95vh] max-h-[95vh] p-0 overflow-hidden rounded-lg shadow-2xl border border-base-300/50 backdrop-blur-sm">
            {/* Scrollable Content Container */}
            <div className="overflow-y-auto h-full scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>

              {/* Professional Header with Gradient */}
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-base-300/50 px-8 py-6 flex justify-between items-center backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="material-icons text-primary text-2xl">work</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-base-content">Add New Project</h3>
                    <p className="text-sm text-base-content/60 mt-1">
                      Create a new portfolio project showcase
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="btn btn-sm btn-circle btn-ghost hover:bg-error/10 hover:text-error transition-all duration-200 text-base-content/70"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Professional Form Content */}
              <div className="p-8 bg-gradient-to-b from-base-100 to-base-200/30">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-info/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-info text-lg">info</span>
                        </div>
                        <h4 className="text-lg font-semibold text-base-content">Basic Information</h4>
                      </div>

                      {/* Project Title and Slug */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">title</span>
                              Project Title <span className="text-error">*</span>
                            </span>
                          </label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                            placeholder="E-Commerce Platform"
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">link</span>
                              Slug
                            </span>
                          </label>
                          <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => handleInputChange('slug', e.target.value)}
                            className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                            placeholder="e-commerce-platform"
                          />
                          <label className="label">
                            <span className="label-text-alt text-base-content/60 flex items-center gap-1">
                              <span className="material-icons text-xs">auto_awesome</span>
                              Auto-generated from title if left empty
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Client Name */}
                      <div className="form-control mb-6">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">business</span>
                            Client Name <span className="text-error">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          value={formData.clientName}
                          onChange={(e) => handleInputChange('clientName', e.target.value)}
                          className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                          placeholder="Client Company"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">description</span>
                            Description <span className="text-error">*</span>
                          </span>
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          rows={4}
                          className="textarea textarea-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 resize-none"
                          placeholder="Project description..."
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category and Project URL Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-warning text-lg">category</span>
                        </div>
                        <h4 className="text-lg font-semibold text-base-content">Category & Links</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">folder</span>
                              Category <span className="text-error">*</span>
                            </span>
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className="select select-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                            required
                          >
                            <option value="">Select Category</option>
                            <option value="E-Commerce">E-Commerce</option>
                            <option value="Mobile App">Mobile App</option>
                            <option value="Web Development">Web Development</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="SaaS">SaaS</option>
                            <option value="Portfolio">Portfolio</option>
                          </select>
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">link</span>
                              Project URL
                            </span>
                          </label>
                          <input
                            type="url"
                            value={formData.projectUrl}
                            onChange={(e) => handleInputChange('projectUrl', e.target.value)}
                            className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>

                      {/* Cover Image URL */}
                      <div className="form-control mt-6">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">image</span>
                            Cover Image URL
                          </span>
                        </label>
                        <input
                          type="url"
                          value={formData.coverImageUrl}
                          onChange={(e) => handleInputChange('coverImageUrl', e.target.value)}
                          className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                          placeholder="https://example.com/cover-image.jpg"
                        />
                        <label className="label">
                          <span className="label-text-alt text-base-content/60">This image will be used as project thumbnail</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Dates Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-success text-lg">schedule</span>
                        </div>
                        <h4 className="text-lg font-semibold text-base-content">Project Timeline</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">event</span>
                              Start Date
                            </span>
                          </label>
                          <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                            className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">event_available</span>
                              End Date
                            </span>
                          </label>
                          <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                            className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technologies Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-accent text-lg">code</span>
                        </div>
                        <h4 className="text-lg font-semibold text-base-content">Technologies Used</h4>
                      </div>

                      <div className="form-control">
                        <div className="flex gap-2 mb-4">
                          <input
                            type="text"
                            value={newTechnology}
                            onChange={(e) => setNewTechnology(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                            className="input input-bordered flex-1 text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                            placeholder="Add technology (e.g., React, Node.js)"
                          />
                          <button
                            type="button"
                            onClick={addTechnology}
                            className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                          >
                            <span className="material-icons text-sm mr-1">add</span>
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="badge badge-primary badge-lg gap-2 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              {tech.name}
                              <button
                                type="button"
                                onClick={() => removeTechnology(index)}
                                className="btn btn-xs btn-circle btn-ghost hover:btn-error"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Features Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-secondary text-lg">star</span>
                        </div>
                        <h4 className="text-lg font-semibold text-base-content">Key Features</h4>
                      </div>

                      <div className="form-control">
                        <div className="flex gap-2 mb-4">
                          <input
                            type="text"
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                            className="input input-bordered flex-1 text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                            placeholder="Add key feature"
                          />
                          <button
                            type="button"
                            onClick={addFeature}
                            className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                          >
                            <span className="material-icons text-sm mr-1">add</span>
                            Add
                          </button>
                        </div>
                        <div className="space-y-2">
                          {formData.keyFeatures.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg border border-base-300/30"
                            >
                              <span className="text-sm text-base-content">{feature.name}</span>
                              <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="btn btn-xs btn-circle btn-ghost hover:btn-error"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gallery Images Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-neutral/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-neutral text-lg">photo_library</span>
                        </div>
                        <h4 className="text-lg font-semibold text-base-content">Gallery Images</h4>
                      </div>

                      <div className="form-control">
                        <div className="flex gap-2 mb-4">
                          <input
                            type="url"
                            value={newGalleryImage}
                            onChange={(e) => setNewGalleryImage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryImage())}
                            className="input input-bordered flex-1 text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                            placeholder="Image URL"
                          />
                          <button
                            type="button"
                            onClick={addGalleryImage}
                            className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                          >
                            <span className="material-icons text-sm mr-1">add</span>
                            Add
                          </button>
                        </div>
                        <div className="space-y-2">
                          {formData.galleryImages.map((image, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg border border-base-300/30"
                            >
                              <span className="text-sm text-base-content truncate flex-1 mr-2">{image}</span>
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(index)}
                                className="btn btn-xs btn-circle btn-ghost hover:btn-error"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settings Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-info/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-info text-lg">settings</span>
                        </div>
                        <h4 className="text-lg font-semibold text-base-content">Project Settings</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">sort</span>
                              Display Order
                            </span>
                          </label>
                          <input
                            type="number"
                            value={formData.displayOrder}
                            onChange={(e) => handleInputChange('displayOrder', parseInt(e.target.value) || 0)}
                            className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                            min="0"
                            placeholder="0"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label cursor-pointer justify-start gap-4">
                            <input
                              type="checkbox"
                              checked={formData.isFeatured}
                              onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                              className="checkbox checkbox-primary checkbox-lg"
                            />
                            <div className="flex items-center gap-2">
                              <span className="material-icons text-primary">star</span>
                              <span className="label-text font-medium text-base-content">Featured Project</span>
                            </div>
                          </label>
                        </div>
                        <div className="form-control">
                          <label className="label cursor-pointer justify-start gap-4">
                            <input
                              type="checkbox"
                              checked={formData.isActive}
                              onChange={(e) => handleInputChange('isActive', e.target.checked)}
                              className="checkbox checkbox-success checkbox-lg"
                            />
                            <div className="flex items-center gap-2">
                              <span className="material-icons text-success">check_circle</span>
                              <span className="label-text font-medium text-base-content">Active</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Details Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-warning text-lg">article</span>
                        </div>
                        <h4 className="text-lg font-semibold text-base-content">Project Details</h4>
                      </div>

                      <div className="space-y-6">
                        {/* The Challenge */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">help</span>
                              The Challenge
                            </span>
                          </label>
                          <textarea
                            value={formData.challenge}
                            onChange={(e) => handleInputChange('challenge', e.target.value)}
                            rows={4}
                            className="textarea textarea-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 resize-none"
                            placeholder="What challenges did the client face?"
                          />
                        </div>

                        {/* Our Solution */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">lightbulb</span>
                              Our Solution
                            </span>
                          </label>
                          <textarea
                            value={formData.solution}
                            onChange={(e) => handleInputChange('solution', e.target.value)}
                            rows={4}
                            className="textarea textarea-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 resize-none"
                            placeholder="How did we solve the challenges?"
                          />
                        </div>

                        {/* The Result */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">trending_up</span>
                              The Result
                            </span>
                          </label>
                          <textarea
                            value={formData.result}
                            onChange={(e) => handleInputChange('result', e.target.value)}
                            rows={4}
                            className="textarea textarea-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 resize-none"
                            placeholder="What were the outcomes and results?"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Professional Footer with Gradient */}
              <div className="px-8 py-6 bg-gradient-to-r from-base-200/80 to-base-300/50 border-t border-base-300/50 flex justify-between items-center backdrop-blur-sm">
                <div className="text-sm text-base-content/60">
                  <span className="material-icons text-sm mr-1">info</span>
                  All fields marked with * are required
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      resetForm();
                    }}
                    disabled={createProjectMutation.isPending}
                    className="btn btn-outline btn-neutral hover:btn-neutral transition-all duration-200 hover:scale-105 w-full sm:w-auto order-2 sm:order-1"
                  >
                    <span className="material-icons text-sm mr-2">close</span>
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={createProjectMutation.isPending}
                    className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-2"
                  >
                    {createProjectMutation.isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        <span className="hidden sm:inline">Creating...</span>
                        <span className="sm:hidden">Creating...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-icons text-sm">add_circle</span>
                        <span className="hidden sm:inline">Create Project</span>
                        <span className="sm:hidden">Create</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Modal backdrop */}
          <form method="dialog" className="modal-backdrop bg-black/50 backdrop-blur-sm">
            <button onClick={() => {
              setIsAddModalOpen(false);
              resetForm();
            }}>close</button>
          </form>
        </div>
      )}
      {/* Edit Project Modal - Similar structure to Add Modal */}
      {isEditModalOpen && editingProject && (
        <div className="modal modal-open" style={{ zIndex: 1000 }}>
          <div className="modal-box w-11/12 max-w-4xl h-[95vh] max-h-[95vh] p-0 overflow-hidden rounded-lg shadow-2xl border border-base-300/50 backdrop-blur-sm">
            <div className="overflow-y-auto h-full scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-base-300/50 px-8 py-6 flex justify-between items-center backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="material-icons text-primary text-2xl">edit</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-base-content">Edit Project</h3>
                    <p className="text-sm text-base-content/60 mt-1">Update project information and settings</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingProject(null);
                    resetForm();
                  }}
                  className="btn btn-sm btn-circle btn-ghost hover:bg-error/10 hover:text-error transition-all duration-200 text-base-content/70"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 bg-gradient-to-b from-base-100 to-base-200/30">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Same form structure as Add Modal but with edit context */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-info/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-info text-lg">info</span>
                        </div>
                        <h4 className="text-lg font-semibold text-base-content">Basic Information</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">title</span>
                              Project Title <span className="text-error">*</span>
                            </span>
                          </label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                            placeholder="E-Commerce Platform"
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">link</span>
                              Slug
                            </span>
                          </label>
                          <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => handleInputChange('slug', e.target.value)}
                            className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                            placeholder="e-commerce-platform"
                          />
                        </div>
                      </div>

                      <div className="form-control mb-6">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">business</span>
                            Client Name <span className="text-error">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          value={formData.clientName}
                          onChange={(e) => handleInputChange('clientName', e.target.value)}
                          className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                          placeholder="Client Company"
                          required
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">description</span>
                            Description <span className="text-error">*</span>
                          </span>
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          rows={4}
                          className="textarea textarea-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 resize-none"
                          placeholder="Project description..."
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content">Category *</span>
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className="select select-bordered w-full text-base-content bg-base-100"
                            required
                          >
                            <option value="">Select Category</option>
                            <option value="E-Commerce">E-Commerce</option>
                            <option value="Mobile App">Mobile App</option>
                            <option value="Web Development">Web Development</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="SaaS">SaaS</option>
                            <option value="Portfolio">Portfolio</option>
                          </select>
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content">Project URL</span>
                          </label>
                          <input
                            type="url"
                            value={formData.projectUrl}
                            onChange={(e) => handleInputChange('projectUrl', e.target.value)}
                            className="input input-bordered w-full text-base-content bg-base-100"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="px-8 py-6 bg-gradient-to-r from-base-200/80 to-base-300/50 border-t border-base-300/50 flex justify-between items-center backdrop-blur-sm">
                <div className="text-sm text-base-content/60">
                  <span className="material-icons text-sm mr-1">info</span>
                  All fields marked with * are required
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingProject(null);
                      resetForm();
                    }}
                    disabled={updateProjectMutation.isPending}
                    className="btn btn-outline btn-neutral hover:btn-neutral transition-all duration-200 hover:scale-105 w-full sm:w-auto order-2 sm:order-1"
                  >
                    <span className="material-icons text-sm mr-2">close</span>
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={updateProjectMutation.isPending}
                    className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-2"
                  >
                    {updateProjectMutation.isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        <span className="hidden sm:inline">Updating...</span>
                        <span className="sm:hidden">Updating...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-icons text-sm">update</span>
                        <span className="hidden sm:inline">Update Project</span>
                        <span className="sm:hidden">Update</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop bg-black/50 backdrop-blur-sm">
            <button onClick={() => {
              setIsEditModalOpen(false);
              setEditingProject(null);
              resetForm();
            }}>close</button>
          </form>
        </div>
      )}

      {/* Project Details Modal */}
      {isModalOpen && selectedProject && (
        <div className="modal modal-open" style={{ zIndex: 1000 }}>
          <div className="modal-box w-11/12 max-w-2xl max-h-[90vh] p-0 overflow-hidden rounded-lg shadow-2xl border border-base-300/50 backdrop-blur-sm">
            <div className="overflow-y-auto h-full scrollbar-hide">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-base-300/50 px-8 py-6 flex justify-between items-center backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="material-icons text-primary text-2xl">visibility</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-base-content">Project Details</h3>
                    <p className="text-sm text-base-content/60 mt-1">View project information</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="btn btn-sm btn-circle btn-ghost hover:bg-error/10 hover:text-error transition-all duration-200 text-base-content/70"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 bg-gradient-to-b from-base-100 to-base-200/30 space-y-6">
                <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                  <div className="card-body p-6">
                    <h3 className="text-lg font-semibold text-base-content mb-4">{selectedProject.title}</h3>
                    <p className="text-base-content/70 mb-6">{selectedProject.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-base-content/60">Slug</label>
                        <p className="text-base-content">{selectedProject.slug}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/60">Client</label>
                        <p className="text-base-content">{selectedProject.clientName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/60">Category</label>
                        <span className={`badge badge-lg ${getCategoryBadge(selectedProject.category)}`}>
                          {selectedProject.category}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/60">Status</label>
                        <span className={`badge badge-lg ${getStatusBadge(selectedProject.isActive ? 'Active' : 'Inactive')}`}>
                          {selectedProject.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/60">Created Date</label>
                        <p className="text-base-content">{formatDate(selectedProject.createdAt)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/60">Live Demo</label>
                        <p className="text-base-content">
                          {selectedProject.projectUrl ? 'Available' : 'Not Available'}
                        </p>
                      </div>
                    </div>

                    {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                      <div className="mt-6">
                        <label className="text-sm font-medium text-base-content/60 mb-2 block">Technologies</label>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.technologies.map((tech, index) => (
                            <span key={index} className="badge badge-primary badge-lg">
                              {tech.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProject.keyFeatures && selectedProject.keyFeatures.length > 0 && (
                      <div className="mt-6">
                        <label className="text-sm font-medium text-base-content/60 mb-2 block">Key Features</label>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedProject.keyFeatures.map((feature, index) => (
                            <li key={index} className="text-sm text-base-content/70">
                              {feature.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex gap-3 pt-6 border-t border-base-300/50">
                      {selectedProject.projectUrl && (
                        <button
                          onClick={() => handleAction('demo', selectedProject._id)}
                          className="btn btn-success shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          View Demo
                        </button>
                      )}
                      <button
                        onClick={() => handleAction('delete', selectedProject._id)}
                        className="btn btn-error shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop bg-black/50 backdrop-blur-sm">
            <button onClick={closeModal}>close</button>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal modal-open" style={{ zIndex: 1000 }}>
          <div className="modal-box max-w-md p-0 overflow-hidden rounded-lg shadow-2xl border border-base-300/50 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-error/10 via-error/5 to-transparent border-b border-base-300/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-error/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-error" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-base-content">Delete Project</h3>
                  <p className="text-sm text-base-content/60">This action cannot be undone</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-b from-base-100 to-base-200/30">
              <p className="text-base-content/80 mb-6">
                Are you sure you want to delete "<span className="font-semibold">{deleteConfirm.title}</span>"? 
                This will permanently remove the project and all associated data.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleteProjectMutation.isPending}
                  className="btn btn-outline btn-neutral hover:btn-neutral transition-all duration-200 hover:scale-105"
                >
                  <span className="material-icons text-sm mr-2">close</span>
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteProjectMutation.isPending}
                  className="btn btn-error shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50"
                >
                  {deleteProjectMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Project
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop bg-black/50 backdrop-blur-sm">
            <button onClick={() => setDeleteConfirm(null)}>close</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProjectsManagement;