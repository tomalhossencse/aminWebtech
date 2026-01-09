import { useState, useEffect } from 'react';
import useTeamAPI from '../../../hooks/useTeamAPI';
import { useToast } from '../../../Context/ToastContext';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  Users,
  X,
  Loader2,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Tag,
  UserCircle
} from 'lucide-react';

const TeamManagement = () => {
  const { loading, error, getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } = useTeamAPI();
  const { success, error: showError, warning, info } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, memberId: null, memberName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    description: '',
    email: '',
    phone: '',
    avatar: '',
    expertise: [],
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      website: ''
    },
    displayOrder: 0,
    isActive: true
  });

  const [newExpertise, setNewExpertise] = useState('');
  const entriesPerPage = 12;

  // Load team members on component mount and when filters change
  useEffect(() => {
    loadTeamMembers();
  }, [currentPage]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      loadTeamMembers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const loadTeamMembers = async () => {
    try {
      const params = {
        page: currentPage,
        limit: entriesPerPage,
        search: searchTerm,
        active: 'all'
      };
      
      const response = await getTeamMembers(params);
      setTeamMembers(response.teamMembers || []);
      setTotalEntries(response.total || 0);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Failed to load team members:', error);
      showError('Failed to load team members. Please try again.');
    }
  };

  const filteredMembers = teamMembers; // Already filtered by backend

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      description: '',
      email: '',
      phone: '',
      avatar: '',
      expertise: [],
      socialLinks: {
        linkedin: '',
        github: '',
        twitter: '',
        website: ''
      },
      displayOrder: 0,
      isActive: true
    });
    setNewExpertise('');
    setEditingMember(null);
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addExpertise = () => {
    if (!newExpertise.trim()) {
      warning('Please enter an expertise area');
      return;
    }
    
    if (formData.expertise.includes(newExpertise.trim())) {
      warning('This expertise already exists');
      return;
    }
    
    if (formData.expertise.length >= 10) {
      warning('Maximum 10 expertise areas allowed');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      expertise: [...prev.expertise, newExpertise.trim()]
    }));
    setNewExpertise('');
    success(`Expertise "${newExpertise.trim()}" added successfully`);
  };

  const removeExpertise = (expertiseToRemove) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(exp => exp !== expertiseToRemove)
    }));
    info(`Expertise "${expertiseToRemove}" removed`);
  };

  const handleDeleteConfirm = async () => {
    try {
      info('Deleting team member...');
      await deleteTeamMember(deleteConfirm.memberId);
      await loadTeamMembers();
      success('Team member deleted successfully!');
    } catch (error) {
      console.error('Error deleting team member:', error);
      showError('Failed to delete team member. Please try again.');
    } finally {
      setDeleteConfirm({ isOpen: false, memberId: null, memberName: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, memberId: null, memberName: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.position) {
      warning('Please fill in all required fields (Name and Position)');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (editingMember) {
        info('Updating team member...');
        await updateTeamMember(editingMember._id, formData);
        setIsEditModalOpen(false);
        success('Team member updated successfully!');
      } else {
        info('Creating team member...');
        await createTeamMember(formData);
        setIsAddModalOpen(false);
        success('Team member created successfully!');
      }
      
      resetForm();
      await loadTeamMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
      showError(`Failed to ${editingMember ? 'update' : 'create'} team member. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (action, memberId) => {
    switch (action) {
      case 'add':
        setIsAddModalOpen(true);
        break;
      case 'edit':
        try {
          const member = teamMembers.find(m => m._id === memberId);
          if (member) {
            setEditingMember(member);
            setFormData({
              name: member.name || '',
              position: member.position || '',
              description: member.description || '',
              email: member.email || '',
              phone: member.phone || '',
              avatar: member.avatar || '',
              expertise: member.expertise || [],
              socialLinks: {
                linkedin: member.socialLinks?.linkedin || '',
                github: member.socialLinks?.github || '',
                twitter: member.socialLinks?.twitter || '',
                website: member.socialLinks?.website || ''
              },
              displayOrder: member.displayOrder || 0,
              isActive: member.isActive !== undefined ? member.isActive : true
            });
            setIsEditModalOpen(true);
            info('Team member loaded for editing');
          } else {
            showError('Team member not found');
          }
        } catch (error) {
          console.error('Error preparing edit:', error);
          showError('Failed to load team member for editing');
        }
        break;
      case 'delete':
        const memberToDelete = teamMembers.find(m => m._id === memberId);
        if (memberToDelete) {
          setDeleteConfirm({
            isOpen: true,
            memberId: memberId,
            memberName: memberToDelete.name
          });
        }
        break;
      default:
        console.log(`${action} team member with ID: ${memberId}`);
    }
  };

  const SocialIcon = ({ type, url }) => {
    if (!url || url === '#') return null;

    const iconProps = {
      className: "w-4 h-4",
    };

    const icons = {
      linkedin: <Linkedin {...iconProps} />,
      github: <Github {...iconProps} />,
      twitter: <Twitter {...iconProps} />,
      website: <Globe {...iconProps} />
    };

    return (
      <a 
        href={url} 
        className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        target="_blank"
        rel="noopener noreferrer"
        title={type.charAt(0).toUpperCase() + type.slice(1)}
      >
        {icons[type]}
      </a>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Members</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your team members and their profiles</p>
          {error && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">
              {error}
            </div>
          )}
        </div>
        <button
          onClick={() => handleAction('add', null)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow-sm flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Team Member
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Search team members..."
          />
        </div>
      </div>

      {/* Team Members Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-500 dark:text-gray-400">Loading team members...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full hover:shadow-md transition-shadow"
            >
              {/* Header with Avatar and Actions */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  {member.avatar ? (
                    <img
                      alt={`${member.name} Profile`}
                      className="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                      src={member.avatar}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 font-bold text-xl flex-shrink-0 ${
                      member.avatar ? 'hidden' : 'flex'
                    }`}
                  >
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-blue-500 font-medium text-sm">{member.position}</p>
                    {!member.isActive && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction('edit', member._id)}
                    className="text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction('delete', member._id)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
                {member.description || 'No description provided'}
              </p>

              {/* Contact Information */}
              {(member.email || member.phone) && (
                <div className="space-y-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {member.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Social Links */}
              {member.socialLinks && Object.values(member.socialLinks).some(link => link && link !== '#') && (
                <div className="flex gap-3 mb-6">
                  <SocialIcon type="linkedin" url={member.socialLinks.linkedin} />
                  <SocialIcon type="github" url={member.socialLinks.github} />
                  <SocialIcon type="twitter" url={member.socialLinks.twitter} />
                  <SocialIcon type="website" url={member.socialLinks.website} />
                </div>
              )}

              {/* Expertise */}
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-400 mb-2">Expertise:</p>
                {member.expertise && member.expertise.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2.5 py-1 rounded font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 italic">None listed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No team members found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first team member.'}
          </p>
        </div>
      )}

      {/* Add/Edit Team Member Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl h-[95vh] flex flex-col border border-gray-200 dark:border-gray-700 mx-2 sm:mx-4">
            
            {/* Fixed Header */}
            <div className="bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border-b border-gray-200 dark:border-gray-700 px-8 py-6 flex justify-between items-center backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-500 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {editingMember ? 'Update team member information' : 'Add a new member to your team'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>
              
              {/* Professional Form Content */}
              <div className="p-8 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Basic Information Section */}
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <UserCircle className="text-blue-500 w-5 h-5" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Basic Information
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Position *
                          </label>
                          <input
                            type="text"
                            value={formData.position}
                            onChange={(e) => handleInputChange('position', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Senior Developer"
                            required
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200"
                          placeholder="Tell us about this team member..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Mail className="text-green-500 w-5 h-5" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Contact Information
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="john@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="+1234567890"
                          />
                        </div>
                      </div>

                      {/* Avatar URL */}
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Avatar URL
                        </label>
                        <input
                          type="url"
                          value={formData.avatar}
                          onChange={(e) => handleInputChange('avatar', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="https://example.com/avatar.jpg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Areas of Expertise Section */}
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Tag className="text-purple-500 w-5 h-5" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Areas of Expertise
                          </h4>
                        </div>
                        <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                          {formData.expertise.length} skills
                        </div>
                      </div>

                      <div className="flex gap-2 mb-4">
                        <input
                          type="text"
                          value={newExpertise}
                          onChange={(e) => setNewExpertise(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Add an expertise (e.g., React, UI/UX)"
                        />
                        <button
                          type="button"
                          onClick={addExpertise}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl hover:scale-105 duration-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {formData.expertise.map((exp, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full transition-all duration-200 hover:scale-105"
                          >
                            {exp}
                            <button
                              type="button"
                              onClick={() => removeExpertise(exp)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 ml-1 hover:scale-110 transition-transform duration-200"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Social Media Links Section */}
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                          <Globe className="text-indigo-500 w-5 h-5" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Social Media Links
                        </h4>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                            <Linkedin className="w-3 h-3" />
                            LinkedIn
                          </label>
                          <input
                            type="url"
                            value={formData.socialLinks.linkedin}
                            onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                            <Github className="w-3 h-3" />
                            GitHub
                          </label>
                          <input
                            type="url"
                            value={formData.socialLinks.github}
                            onChange={(e) => handleInputChange('socialLinks.github', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="https://github.com/username"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                            <Twitter className="w-3 h-3" />
                            Twitter
                          </label>
                          <input
                            type="url"
                            value={formData.socialLinks.twitter}
                            onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="https://twitter.com/username"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                            <Globe className="w-3 h-3" />
                            Website
                          </label>
                          <input
                            type="url"
                            value={formData.socialLinks.website}
                            onChange={(e) => handleInputChange('socialLinks.website', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settings Section */}
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
                          <Users className="text-gray-500 w-5 h-5" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Member Settings
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Display Order
                          </label>
                          <input
                            type="number"
                            value={formData.displayOrder}
                            onChange={(e) => handleInputChange('displayOrder', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => handleInputChange('isActive', e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Active Member
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gradient-to-r from-gray-100/80 to-gray-200/50 dark:from-slate-700/80 dark:to-slate-800/50 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 backdrop-blur-sm flex-shrink-0">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 text-center sm:text-left order-2 sm:order-1">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
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
                  className="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105 disabled:opacity-50 order-2 sm:order-1"
                >
                  <X className="w-4 h-4 mr-2 inline" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl order-1 sm:order-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {editingMember ? 'Updating Member...' : 'Adding Member...'}
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4" />
                      {editingMember ? 'Update Member' : 'Add Member'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Team Member"
        message={`Are you sure you want to delete "${deleteConfirm.memberName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default TeamManagement;