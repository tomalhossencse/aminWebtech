import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star,
  Building,
  ChevronDown,
  Calendar,
  X,
  User,
  MessageSquare
} from 'lucide-react';
import useTestimonialsAPI from '../../../hooks/useTestimonialsAPI';
import { useToast } from '../../../Context/ToastContext';
import ConfirmDialog from '../../../components/ConfirmDialog';

const TestimonialsManagement = () => {
  const { 
    testimonials, 
    loading, 
    error, 
    createTestimonial, 
    updateTestimonial, 
    deleteTestimonial,
    createTestimonialMutation,
    updateTestimonialMutation,
    deleteTestimonialMutation
  } = useTestimonialsAPI();
  
  const { success, error: showError, warning, info } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Testimonials');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, testimonialId: null, testimonialName: '' });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    position: '',
    testimonial: '',
    rating: 5,
    displayOrder: 0,
    featured: false,
    active: true
  });

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.testimonial.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'All Testimonials' || 
                         (filterType === 'Featured' && testimonial.featured) ||
                         (filterType === 'Recent' && new Date(testimonial.date || testimonial.createdAt) > new Date(Date.now() - 7*24*60*60*1000));
    
    return matchesSearch && matchesFilter;
  });

  // Generate avatar initials
  const getAvatarInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300',
      'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300',
      'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300',
      'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300',
      'bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleAction = (action, testimonialId) => {
    console.log(`${action} testimonial with ID: ${testimonialId}`);
    
    switch (action) {
      case 'add':
        setIsAddModalOpen(true);
        resetForm();
        break;
      case 'edit':
        const testimonial = testimonials.find(t => t._id === testimonialId);
        if (testimonial) {
          setFormData({
            name: testimonial.name,
            company: testimonial.company || '',
            position: testimonial.position || '',
            testimonial: testimonial.testimonial,
            rating: testimonial.rating,
            displayOrder: testimonial.displayOrder || 0,
            featured: testimonial.featured || false,
            active: testimonial.active !== undefined ? testimonial.active : true
          });
          setEditingTestimonial(testimonial);
          setIsEditModalOpen(true);
          info('Testimonial loaded for editing');
        }
        break;
      case 'delete':
        const testimonialToDelete = testimonials.find(t => t._id === testimonialId);
        if (testimonialToDelete) {
          setDeleteConfirm({
            isOpen: true,
            testimonialId: testimonialId,
            testimonialName: testimonialToDelete.name
          });
        }
        break;
      default:
        break;
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      position: '',
      testimonial: '',
      rating: 5,
      displayOrder: 0,
      featured: false,
      active: true
    });
    setEditingTestimonial(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingTestimonial) {
        // Update existing testimonial
        info('Updating testimonial...');
        await updateTestimonial(editingTestimonial._id, formData);
        setIsEditModalOpen(false);
        success('Testimonial updated successfully!');
      } else {
        // Create new testimonial
        info('Creating testimonial...');
        await createTestimonial(formData);
        setIsAddModalOpen(false);
        success('Testimonial created successfully!');
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      showError(`Failed to ${editingTestimonial ? 'update' : 'create'} testimonial. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.testimonialId) return;

    try {
      info('Deleting testimonial...');
      await deleteTestimonial(deleteConfirm.testimonialId);
      success('Testimonial deleted successfully!');
      setDeleteConfirm({ isOpen: false, testimonialId: null, testimonialName: '' });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      showError('Failed to delete testimonial. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderStarRating = (currentRating, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-6 h-6 cursor-pointer transition-colors ${
          index < currentRating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
        }`}
        onClick={interactive ? () => handleRatingChange(index + 1) : undefined}
      />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage client testimonials and reviews</p>
        </div>
        <button
          onClick={() => handleAction('add', null)}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Plus className="w-5 h-5" />
          )}
          Add Testimonial
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-colors"
              placeholder="Search testimonials..."
            />
          </div>
          
          <div className="w-full md:w-48 relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full py-2.5 pl-4 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer appearance-none"
            >
              <option>All Testimonials</option>
              <option>Featured</option>
              <option>Recent</option>
              <option>Archived</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 min-h-[400px]">
        {loading && testimonials.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading testimonials...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTestimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className={`relative rounded-xl p-6 transition-all duration-200 hover:shadow-lg group ${
                  testimonial.featured
                    ? 'bg-blue-50 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-600'
                    : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Action Buttons */}
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleAction('edit', testimonial._id)}
                    disabled={loading}
                    className="p-2 text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all duration-200 disabled:opacity-50"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction('delete', testimonial._id)}
                    disabled={loading}
                    className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-semibold text-sm ${getAvatarColor(testimonial.name)}`}>
                    {getAvatarInitials(testimonial.name)}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-1">
                      {testimonial.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-1.5">
                      <Building className="w-4 h-4" />
                      <span>{testimonial.company}</span>
                      {testimonial.position && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span>{testimonial.position}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Text */}
                <div className="mb-6">
                  <p className="text-gray-700 dark:text-gray-300 italic font-medium leading-relaxed">
                    "{testimonial.testimonial}"
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center">
                    {testimonial.featured && (
                      <div className="flex items-center gap-1.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <Calendar className="w-3 h-3" />
                    {formatDate(testimonial.date || testimonial.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTestimonials.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No testimonials found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              {searchTerm || filterType !== 'All Testimonials' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start by adding your first testimonial to showcase client feedback.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Testimonial Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="modal modal-open" style={{ zIndex: 1000 }}>
          <div className="modal-box w-full sm:w-11/12 md:w-10/12 lg:w-8/12 max-w-4xl h-[95vh] max-h-[95vh] p-0 overflow-hidden rounded-lg shadow-2xl border border-base-300/50 backdrop-blur-sm mx-2 sm:mx-4">
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
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-base-300/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 backdrop-blur-sm">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="material-icons text-primary text-xl sm:text-2xl">
                      star
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-base-content">
                      {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                    </h3>
                    <p className="text-xs sm:text-sm text-base-content/60 mt-1">
                      {editingTestimonial ? 'Update client testimonial information' : 'Create a new client testimonial'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                  className="btn btn-sm btn-circle btn-ghost hover:bg-error/10 hover:text-error transition-all duration-200 text-base-content/70 self-end sm:self-auto"
                >
                  <span className="material-icons text-lg sm:text-xl">close</span>
                </button>
              </div>

              {/* Professional Form Content */}
              <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-base-100 to-base-200/30">
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  
                  {/* Client Information Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-4 sm:p-6">
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-info/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-info text-sm sm:text-lg">
                            person
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-base-content">
                          Client Information
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">
                                account_circle
                              </span>
                              Client Name <span className="text-error">*</span>
                            </span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                            placeholder="John Doe"
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">
                                business
                              </span>
                              Company
                            </span>
                          </label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                            placeholder="Company Name"
                          />
                        </div>

                        <div className="form-control lg:col-span-2">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">
                                work
                              </span>
                              Position
                            </span>
                          </label>
                          <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                            className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                            placeholder="CEO, Manager, etc."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Content Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-4 sm:p-6">
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-success/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-success text-sm sm:text-lg">
                            format_quote
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-base-content">
                          Testimonial Content
                        </h4>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">
                              message
                            </span>
                            Testimonial Text <span className="text-error">*</span>
                          </span>
                        </label>
                        <textarea
                          name="testimonial"
                          value={formData.testimonial}
                          onChange={handleInputChange}
                          required
                          className="textarea textarea-bordered h-32 resize-none text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                          placeholder="What did the client say about your service?"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating & Display Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-4 sm:p-6">
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-warning text-sm sm:text-lg">
                            star_rate
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-base-content">
                          Rating & Display Settings
                        </h4>
                      </div>

                      <div className="space-y-6">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">
                                star
                              </span>
                              Rating <span className="text-error">*</span>
                            </span>
                          </label>
                          <div className="flex items-center gap-4">
                            <div className="flex gap-1">
                              {renderStarRating(formData.rating, true)}
                            </div>
                            <div className="badge badge-primary badge-lg">
                              {formData.rating}/5
                            </div>
                          </div>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">
                                sort
                              </span>
                              Display Order
                            </span>
                          </label>
                          <input
                            type="number"
                            name="displayOrder"
                            value={formData.displayOrder}
                            onChange={handleInputChange}
                            min="0"
                            className="input input-bordered w-full max-w-xs text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settings Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-4 sm:p-6">
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-neutral/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-neutral text-sm sm:text-lg">
                            settings
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-base-content">
                          Testimonial Settings
                        </h4>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-8">
                        <div className="form-control">
                          <label className="label cursor-pointer justify-start gap-4">
                            <input
                              type="checkbox"
                              name="featured"
                              checked={formData.featured}
                              onChange={handleInputChange}
                              className="checkbox checkbox-primary checkbox-lg"
                            />
                            <div className="flex items-center gap-2">
                              <span className="material-icons text-primary">
                                star
                              </span>
                              <span className="label-text font-medium text-base-content text-lg">
                                Featured Testimonial
                              </span>
                            </div>
                          </label>
                          <p className="text-sm text-base-content/60 ml-12">
                            Display this testimonial prominently
                          </p>
                        </div>

                        <div className="form-control">
                          <label className="label cursor-pointer justify-start gap-4">
                            <input
                              type="checkbox"
                              name="active"
                              checked={formData.active}
                              onChange={handleInputChange}
                              className="checkbox checkbox-success checkbox-lg"
                            />
                            <div className="flex items-center gap-2">
                              <span className="material-icons text-success">
                                check_circle
                              </span>
                              <span className="label-text font-medium text-base-content text-lg">
                                Active Testimonial
                              </span>
                            </div>
                          </label>
                          <p className="text-sm text-base-content/60 ml-12">
                            Make this testimonial visible to users
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Professional Footer with Gradient */}
              <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gradient-to-r from-base-200/80 to-base-300/50 border-t border-base-300/50 flex flex-col sm:flex-row justify-between items-center gap-4 backdrop-blur-sm">
                <div className="text-xs sm:text-sm text-base-content/60 text-center sm:text-left order-2 sm:order-1">
                  <span className="material-icons text-xs sm:text-sm mr-1">info</span>
                  All fields marked with * are required
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto order-1 sm:order-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(false);
                      resetForm();
                    }}
                    disabled={isSubmitting}
                    className="btn btn-outline btn-neutral hover:btn-neutral transition-all duration-200 hover:scale-105 w-full sm:w-auto"
                  >
                    <span className="material-icons text-sm mr-2">close</span>
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.name.trim() || !formData.testimonial.trim()}
                    className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 w-full sm:w-auto"
                  >
                    {isSubmitting && (
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                    )}
                    <span className="material-icons text-sm mr-2">
                      {isSubmitting ? "hourglass_empty" : editingTestimonial ? "update" : "star"}
                    </span>
                    <span className="hidden sm:inline">
                      {isSubmitting ? (editingTestimonial ? 'Updating...' : 'Creating...') : (editingTestimonial ? 'Update Testimonial' : 'Create Testimonial')}
                    </span>
                    <span className="sm:hidden">
                      {isSubmitting ? (editingTestimonial ? 'Updating...' : 'Creating...') : (editingTestimonial ? 'Update' : 'Create')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Modal backdrop */}
          <form method="dialog" className="modal-backdrop bg-black/50 backdrop-blur-sm">
            <button onClick={() => {
              setIsAddModalOpen(false);
              setIsEditModalOpen(false);
              resetForm();
            }}>close</button>
          </form>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, testimonialId: null, testimonialName: '' })}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        message={`Are you sure you want to delete the testimonial from "${deleteConfirm.testimonialName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default TestimonialsManagement;