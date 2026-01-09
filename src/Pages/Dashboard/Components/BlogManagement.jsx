import { useState, useEffect } from 'react';
import useBlogAPI from '../../../hooks/useBlogAPI';
import { useToast } from '../../../Context/ToastContext';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  User,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  AlignLeft,
  Link,
  Image,
  Type,
  Tag,
  Loader2
} from 'lucide-react';

const BlogManagement = () => {
  const { loading, error, getBlogs, createBlog, updateBlog, deleteBlog } = useBlogAPI();
  const { success, error: showError, warning, info } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, postId: null, postTitle: '' });
  
  // Form state for add/edit blog modal
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Web Development',
    featuredImage: '',
    tags: [],
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    publishImmediately: false
  });

  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const entriesPerPage = 10;

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      loadBlogs();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter]);

  // Load blogs on page change
  useEffect(() => {
    loadBlogs();
  }, [currentPage]);

  const loadBlogs = async () => {
    try {
      const params = {
        page: currentPage,
        limit: entriesPerPage,
        search: searchTerm,
        status: statusFilter
      };
      
      const response = await getBlogs(params);
      setBlogPosts(response.blogs || []);
      setTotalEntries(response.total || 0);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Failed to load blogs:', error);
      showError('Failed to load blog posts. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Published': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      'Draft': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      'Archived': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    };
    return statusConfig[status] || statusConfig['Draft'];
  };

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      'Mobile Development': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      'Design': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      'Security': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      'Hardware': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300'
    };
    return categoryConfig[category] || categoryConfig['Design'];
  };

  const filteredPosts = blogPosts; // Already filtered by backend

  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  const handleDeleteConfirm = async () => {
    try {
      info('Deleting blog post...');
      await deleteBlog(deleteConfirm.postId);
      await loadBlogs(); // Refresh the list
      success('Blog post deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog:', error);
      showError('Failed to delete blog post. Please try again.');
    } finally {
      setDeleteConfirm({ isOpen: false, postId: null, postTitle: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, postId: null, postTitle: '' });
  };

  const handleAction = async (action, postId) => {
    switch (action) {
      case 'add':
        setIsAddModalOpen(true);
        break;
      case 'view':
        console.log('View blog post:', postId);
        // You can implement view functionality here
        break;
      case 'edit':
        try {
          const blog = blogPosts.find(post => post._id === postId);
          if (blog) {
            setEditingBlog(blog);
            setFormData({
              title: blog.title || '',
              excerpt: blog.excerpt || '',
              content: blog.content || '',
              category: blog.category || 'Web Development',
              featuredImage: blog.featuredImage || blog.thumbnail || '',
              tags: blog.tags || [],
              metaTitle: blog.metaTitle || '',
              metaKeywords: blog.metaKeywords || '',
              metaDescription: blog.metaDescription || '',
              publishImmediately: blog.status === 'Published'
            });
            setIsEditModalOpen(true);
            info('Blog post loaded for editing');
          } else {
            showError('Blog post not found');
          }
        } catch (error) {
          console.error('Error preparing edit:', error);
          showError('Failed to load blog post for editing');
        }
        break;
      case 'delete':
        const postToDelete = blogPosts.find(post => post._id === postId);
        if (postToDelete) {
          setDeleteConfirm({
            isOpen: true,
            postId: postId,
            postTitle: postToDelete.title
          });
        }
        break;
      default:
        console.log(`${action} blog post with ID: ${postId}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'Web Development',
      featuredImage: '',
      tags: [],
      metaTitle: '',
      metaKeywords: '',
      metaDescription: '',
      publishImmediately: false
    });
    setNewTag('');
    setEditingBlog(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (!newTag.trim()) {
      warning('Please enter a tag name');
      return;
    }
    
    if (formData.tags.includes(newTag.trim())) {
      warning('This tag already exists');
      return;
    }
    
    if (formData.tags.length >= 10) {
      warning('Maximum 10 tags allowed');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));
    setNewTag('');
    success(`Tag "${newTag.trim()}" added successfully`);
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    info(`Tag "${tagToRemove}" removed`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.excerpt || !formData.content) {
      warning('Please fill in all required fields (Title, Excerpt, and Content)');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (editingBlog) {
        // Update existing blog
        info('Updating blog post...');
        await updateBlog(editingBlog._id, formData);
        setIsEditModalOpen(false);
        success('Blog post updated successfully!');
      } else {
        // Create new blog
        info('Creating blog post...');
        await createBlog(formData);
        setIsAddModalOpen(false);
        success('Blog post created successfully!');
      }
      
      resetForm();
      await loadBlogs(); // Refresh the list
    } catch (error) {
      console.error('Error saving blog post:', error);
      showError(`Failed to ${editingBlog ? 'update' : 'create'} blog post. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your blog posts and articles</p>
          {error && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">
              {error}
            </div>
          )}
        </div>
        <div>
          <button
            onClick={() => handleAction('add', null)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-sm flex items-center font-medium transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Post
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-3xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
            placeholder="Search posts..."
          />
        </div>
        
        <div className="w-full md:w-auto min-w-[160px]">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 sm:text-sm rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
            >
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/3" scope="col">
                  Post
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                  Author
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                  Views
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                      <span className="text-gray-500 dark:text-gray-400">Loading blog posts...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No blog posts found
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-16">
                          <img
                            alt={`${post.title} Thumbnail`}
                            className="h-12 w-16 rounded object-cover border border-gray-200 dark:border-gray-700"
                            src={post.featuredImage || post.thumbnail || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA2NCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyNEwyOCAyMEwzNiAyOEwyOCAzNkwyNCAzMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'}
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA2NCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyNEwyOCAyMEwzNiAyOEwyOCAzNkwyNCAzMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 max-w-xs whitespace-normal" title={post.title}>
                            {post.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <User className="w-4 h-4 text-gray-400 mr-1.5" />
                        {post.author}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryBadge(post.category)}`}>
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {post.views || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 text-gray-400 mr-1.5" />
                        {post.created || new Date(post.createdAt).toLocaleDateString('en-GB')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleAction('view', post._id)}
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleAction('edit', post._id)}
                          className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors p-1 rounded-md hover:bg-amber-50 dark:hover:bg-amber-900/30"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleAction('delete', post._id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {totalEntries > 0 ? startEntry : 0} to {endEntry} of {totalEntries} entries
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
              className="flex items-center gap-1 px-3 py-1 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= totalPages || loading}
              className="flex items-center gap-1 px-3 py-1 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Blog Post Modal */}
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
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-base-300/50 px-8 py-6 flex justify-between items-center backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="material-icons text-primary text-2xl">
                      {editingBlog ? 'edit_note' : 'post_add'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-base-content">
                      {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                    </h3>
                    <p className="text-sm text-base-content/60 mt-1">
                      {editingBlog ? 'Update your blog post content and settings' : 'Create engaging content for your audience'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
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

                      {/* Title */}
                      <div className="form-control mb-6">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">title</span>
                            Title <span className="text-error">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                          placeholder="Enter blog post title"
                          required
                        />
                      </div>

                      {/* Excerpt */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">short_text</span>
                            Excerpt <span className="text-error">*</span>
                          </span>
                        </label>
                        <textarea
                          value={formData.excerpt}
                          onChange={(e) => handleInputChange('excerpt', e.target.value)}
                          rows={3}
                          className="textarea textarea-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 resize-none"
                          placeholder="Brief summary of the post"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-success text-lg">article</span>
                        </div>
                        <h4 className="text-lg font-semibold text-base-content">Content Editor</h4>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">edit_note</span>
                            Content <span className="text-error">*</span>
                          </span>
                        </label>
                        
                        {/* Simple Content Editor */}
                        <div className="border border-base-300 rounded-lg overflow-hidden bg-base-100">
                          {/* Toolbar */}
                          <div className="bg-base-200/50 p-3 border-b border-base-300 flex items-center gap-2 flex-wrap">
                            <select 
                              className="select select-sm select-bordered bg-base-100 text-base-content focus:border-primary"
                              onChange={(e) => {
                                const textarea = document.getElementById('content-textarea');
                                if (textarea) {
                                  const start = textarea.selectionStart;
                                  const end = textarea.selectionEnd;
                                  const selectedText = textarea.value.substring(start, end);
                                  let replacement = selectedText;
                                  
                                  switch(e.target.value) {
                                    case 'h1':
                                      replacement = `# ${selectedText}`;
                                      break;
                                    case 'h2':
                                      replacement = `## ${selectedText}`;
                                      break;
                                    case 'h3':
                                      replacement = `### ${selectedText}`;
                                      break;
                                    default:
                                      replacement = selectedText;
                                  }
                                  
                                  const newContent = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
                                  handleInputChange('content', newContent);
                                  
                                  // Reset select
                                  e.target.value = 'normal';
                                }
                              }}
                            >
                              <option value="normal">Normal</option>
                              <option value="h1">Heading 1</option>
                              <option value="h2">Heading 2</option>
                              <option value="h3">Heading 3</option>
                            </select>
                            
                            <div className="divider divider-horizontal"></div>
                            
                            <button 
                              type="button" 
                              className="btn btn-sm btn-ghost hover:btn-primary transition-all duration-200"
                              title="Bold"
                              onClick={() => {
                                const textarea = document.getElementById('content-textarea');
                                if (textarea) {
                                  const start = textarea.selectionStart;
                                  const end = textarea.selectionEnd;
                                  const selectedText = textarea.value.substring(start, end);
                                  const replacement = selectedText ? `**${selectedText}**` : '**bold text**';
                                  const newContent = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
                                  handleInputChange('content', newContent);
                                  
                                  // Restore focus and cursor position
                                  setTimeout(() => {
                                    textarea.focus();
                                    const newCursorPos = start + replacement.length;
                                    textarea.setSelectionRange(newCursorPos, newCursorPos);
                                  }, 0);
                                }
                              }}
                            >
                              <Bold className="w-4 h-4" />
                            </button>
                            
                            <button 
                              type="button" 
                              className="btn btn-sm btn-ghost hover:btn-primary transition-all duration-200"
                              title="Italic"
                              onClick={() => {
                                const textarea = document.getElementById('content-textarea');
                                if (textarea) {
                                  const start = textarea.selectionStart;
                                  const end = textarea.selectionEnd;
                                  const selectedText = textarea.value.substring(start, end);
                                  const replacement = selectedText ? `*${selectedText}*` : '*italic text*';
                                  const newContent = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
                                  handleInputChange('content', newContent);
                                  
                                  // Restore focus and cursor position
                                  setTimeout(() => {
                                    textarea.focus();
                                    const newCursorPos = start + replacement.length;
                                    textarea.setSelectionRange(newCursorPos, newCursorPos);
                                  }, 0);
                                }
                              }}
                            >
                              <Italic className="w-4 h-4" />
                            </button>
                            
                            <button 
                              type="button" 
                              className="btn btn-sm btn-ghost hover:btn-primary transition-all duration-200"
                              title="Underline"
                              onClick={() => {
                                const textarea = document.getElementById('content-textarea');
                                if (textarea) {
                                  const start = textarea.selectionStart;
                                  const end = textarea.selectionEnd;
                                  const selectedText = textarea.value.substring(start, end);
                                  const replacement = selectedText ? `<u>${selectedText}</u>` : '<u>underlined text</u>';
                                  const newContent = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
                                  handleInputChange('content', newContent);
                                }
                              }}
                            >
                              <Underline className="w-4 h-4" />
                            </button>
                            
                            <button 
                              type="button" 
                              className="btn btn-sm btn-ghost hover:btn-primary transition-all duration-200"
                              title="Strikethrough"
                              onClick={() => {
                                const textarea = document.getElementById('content-textarea');
                                if (textarea) {
                                  const start = textarea.selectionStart;
                                  const end = textarea.selectionEnd;
                                  const selectedText = textarea.value.substring(start, end);
                                  const replacement = selectedText ? `~~${selectedText}~~` : '~~strikethrough text~~';
                                  const newContent = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
                                  handleInputChange('content', newContent);
                                }
                              }}
                            >
                              <Strikethrough className="w-4 h-4" />
                            </button>
                            
                            <div className="divider divider-horizontal"></div>
                            
                            <button 
                              type="button" 
                              className="btn btn-sm btn-ghost hover:btn-primary transition-all duration-200"
                              title="Bullet List"
                              onClick={() => {
                                const textarea = document.getElementById('content-textarea');
                                if (textarea) {
                                  const start = textarea.selectionStart;
                                  const end = textarea.selectionEnd;
                                  const selectedText = textarea.value.substring(start, end);
                                  const replacement = selectedText ? 
                                    selectedText.split('\n').map(line => line.trim() ? `- ${line.trim()}` : line).join('\n') : 
                                    '- List item 1\n- List item 2\n- List item 3';
                                  const newContent = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
                                  handleInputChange('content', newContent);
                                }
                              }}
                            >
                              <List className="w-4 h-4" />
                            </button>
                            
                            <button 
                              type="button" 
                              className="btn btn-sm btn-ghost hover:btn-primary transition-all duration-200"
                              title="Add Link"
                              onClick={() => {
                                const textarea = document.getElementById('content-textarea');
                                if (textarea) {
                                  const start = textarea.selectionStart;
                                  const end = textarea.selectionEnd;
                                  const selectedText = textarea.value.substring(start, end);
                                  const linkText = selectedText || 'link text';
                                  const replacement = `[${linkText}](https://example.com)`;
                                  const newContent = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
                                  handleInputChange('content', newContent);
                                }
                              }}
                            >
                              <Link className="w-4 h-4" />
                            </button>
                            
                            <button 
                              type="button" 
                              className="btn btn-sm btn-ghost hover:btn-primary transition-all duration-200"
                              title="Add Image"
                              onClick={() => {
                                const textarea = document.getElementById('content-textarea');
                                if (textarea) {
                                  const start = textarea.selectionStart;
                                  const end = textarea.selectionEnd;
                                  const replacement = '![Image description](https://example.com/image.jpg)';
                                  const newContent = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
                                  handleInputChange('content', newContent);
                                }
                              }}
                            >
                              <Image className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Content Textarea */}
                          <textarea
                            id="content-textarea"
                            value={formData.content}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            rows={12}
                            className="textarea w-full bg-base-100 text-base-content focus:outline-none border-0 resize-none rounded-none"
                            placeholder="Write your blog post content here... You can use Markdown formatting:

# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
~~Strikethrough~~

- Bullet point 1
- Bullet point 2

[Link text](https://example.com)
![Image](https://example.com/image.jpg)

> Blockquote

```
Code block
```"
                          />
                        </div>
                        
                        {/* Markdown Help */}
                        <div className="mt-2 text-xs text-base-content/60">
                          <span className="font-medium">Tip:</span> You can use Markdown formatting. Use the toolbar buttons or type directly.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category and Featured Image Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-warning text-lg">category</span>
                        </div>
                        <h4 className="text-lg font-semibold text-base-content">Category & Media</h4>
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
                            <option value="Web Development">Web Development</option>
                            <option value="Mobile Development">Mobile Development</option>
                            <option value="Design">Design</option>
                            <option value="Security">Security</option>
                            <option value="Hardware">Hardware</option>
                            <option value="AI/ML">AI/ML</option>
                            <option value="DevOps">DevOps</option>
                          </select>
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">image</span>
                              Featured Image URL
                            </span>
                          </label>
                          <input
                            type="url"
                            value={formData.featuredImage}
                            onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                            className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-accent text-lg">local_offer</span>
                        </div>
                        <h4 className="text-lg font-semibold text-base-content">Tags</h4>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">tag</span>
                            Blog Tags
                          </span>
                        </label>
                        <div className="flex gap-2 mb-4">
                          <div className="relative flex-1">
                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                            <input
                              type="text"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                              className="input input-bordered w-full pl-10 text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                              placeholder="Add a tag"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={addTag}
                            className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                          >
                            <span className="material-icons text-sm mr-1">add</span>
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="badge badge-primary badge-lg gap-2 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
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

                  {/* SEO Meta Fields Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-secondary text-lg">search</span>
                        </div>
                        <h4 className="text-lg font-semibold text-base-content">SEO & Meta Information</h4>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">title</span>
                              Meta Title
                            </span>
                          </label>
                          <input
                            type="text"
                            value={formData.metaTitle}
                            onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                            className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                            placeholder="SEO meta title"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">label</span>
                              Meta Keywords
                            </span>
                          </label>
                          <input
                            type="text"
                            value={formData.metaKeywords}
                            onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                            className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                            placeholder="keyword1, keyword2, keyword3"
                          />
                        </div>
                        <div className="form-control lg:col-span-2">
                          <label className="label">
                            <span className="label-text font-medium text-base-content flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">description</span>
                              Meta Description
                            </span>
                          </label>
                          <textarea
                            value={formData.metaDescription}
                            onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                            rows={3}
                            className="textarea textarea-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 resize-none"
                            placeholder="SEO meta description"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Publish Options Section */}
                  <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                    <div className="card-body p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-neutral/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-neutral text-lg">settings</span>
                        </div>
                        <h4 className="text-lg font-semibold text-base-content">Publish Settings</h4>
                      </div>

                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                          <input
                            type="checkbox"
                            id="publishImmediately"
                            checked={formData.publishImmediately}
                            onChange={(e) => handleInputChange('publishImmediately', e.target.checked)}
                            className="checkbox checkbox-primary checkbox-lg"
                          />
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-primary">publish</span>
                            <span className="label-text font-medium text-base-content text-lg">
                              Publish Immediately
                            </span>
                          </div>
                        </label>
                        <p className="text-sm text-base-content/60 ml-12">
                          Make this post live immediately after creation
                        </p>
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
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(false);
                      resetForm();
                    }}
                    disabled={isSubmitting}
                    className="btn btn-outline btn-neutral hover:btn-neutral transition-all duration-200 hover:scale-105 w-full sm:w-auto order-2 sm:order-1"
                  >
                    <span className="material-icons text-sm mr-2">close</span>
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        <span className="hidden sm:inline">{editingBlog ? 'Updating Post...' : 'Creating Post...'}</span>
                        <span className="sm:hidden">{editingBlog ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      <>
                        <span className="material-icons text-sm">
                          {editingBlog ? 'update' : 'add_circle'}
                        </span>
                        <span className="hidden sm:inline">{editingBlog ? 'Update Post' : 'Create Post'}</span>
                        <span className="sm:hidden">{editingBlog ? 'Update' : 'Create'}</span>
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
              setIsEditModalOpen(false);
              resetForm();
            }}>close</button>
          </form>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteConfirm.postTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default BlogManagement;