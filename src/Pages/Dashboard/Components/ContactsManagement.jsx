import { useState } from 'react';
import { 
  Search, 
  RefreshCw, 
  Eye, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  Users, 
  Inbox, 
  Send, 
  AlertTriangle,
  X
} from 'lucide-react';
import useContactsAPI from '../../../hooks/useContactsAPI';
import { useToast } from '../../../Context/ToastContext';
import ConfirmDialog from '../../../components/ConfirmDialog';
import ContactViewModal from '../../../components/ContactViewModal';

const ContactsManagement = () => {
  const { 
    contacts, 
    stats, 
    loading, 
    error, 
    updateContactStatus, 
    deleteContact,
    replyToContact,
    refetchContacts 
  } = useContactsAPI();
  
  const { success, error: showError } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Messages');
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, contactId: null, contactName: '' });
  const [viewModal, setViewModal] = useState({ isOpen: false, contact: null });

  // Stats data with real backend data
  const statsData = [
    {
      title: 'Total Messages',
      value: stats.total || 0,
      icon: Users,
      color: 'bg-purple-600',
      shadowColor: 'shadow-purple-200 dark:shadow-none'
    },
    {
      title: 'New',
      value: stats.new || 0,
      icon: Inbox,
      color: 'bg-blue-500',
      shadowColor: 'shadow-blue-200 dark:shadow-none'
    },
    {
      title: 'Read',
      value: stats.read || 0,
      icon: Eye,
      color: 'bg-orange-500',
      shadowColor: 'shadow-orange-200 dark:shadow-none'
    },
    {
      title: 'Replied',
      value: stats.replied || 0,
      icon: Send,
      color: 'bg-emerald-500',
      shadowColor: 'shadow-emerald-200 dark:shadow-none'
    },
    {
      title: 'Spam',
      value: stats.spam || 0,
      icon: AlertTriangle,
      color: 'bg-pink-500',
      shadowColor: 'shadow-pink-200 dark:shadow-none'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'new': {
        color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50',
        icon: Inbox,
        text: 'New'
      },
      'read': {
        color: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800/50',
        icon: Eye,
        text: 'Read'
      },
      'replied': {
        color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50',
        icon: Send,
        text: 'Replied'
      },
      'spam': {
        color: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/50',
        icon: AlertTriangle,
        text: 'Spam'
      }
    };
    return statusConfig[status] || statusConfig['new'];
  };

  // Generate avatar initials and color
  const getAvatarInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500',
      'bg-emerald-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-red-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'All Messages' || 
                         contact.status === filterType.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const handleAction = (action, contactId) => {
    console.log(`${action} contact with ID: ${contactId}`);
    
    switch (action) {
      case 'view':
        const contactToView = contacts.find(c => c._id === contactId);
        if (contactToView) {
          setViewModal({ isOpen: true, contact: contactToView });
          // Mark as read when viewing
          if (contactToView.status === 'new') {
            handleStatusChange(contactId, 'read');
          }
        }
        break;
      case 'delete':
        const contactToDelete = contacts.find(c => c._id === contactId);
        if (contactToDelete) {
          setDeleteConfirm({
            isOpen: true,
            contactId: contactId,
            contactName: contactToDelete.name
          });
        }
        break;
      default:
        break;
    }
  };

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      await updateContactStatus(contactId, newStatus);
      success(`Contact marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating contact status:', error);
      showError('Failed to update contact status');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.contactId) return;

    try {
      await deleteContact(deleteConfirm.contactId);
      success('Contact deleted successfully');
      setDeleteConfirm({ isOpen: false, contactId: null, contactName: '' });
    } catch (error) {
      console.error('Error deleting contact:', error);
      showError('Failed to delete contact');
    }
  };

  const handleReply = async (contactId, message, trackingId = null) => {
    try {
      await replyToContact(contactId, message, trackingId);
      success('Reply sent successfully');
    } catch (error) {
      console.error('Error sending reply:', error);
      showError('Failed to send reply');
      throw error; // Re-throw to let the modal handle it
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Inbox</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage customer inquiries and messages from your website
            </p>
          </div>
          <button
            onClick={refetchContacts}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            Refresh
          </button>
        </div>
      </header>

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

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center transition-transform hover:-translate-y-1 duration-200"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {stat.title}
              </span>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-md ${stat.shadowColor}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </section>

      {/* Search and Filters */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Search by name, email, or message..."
            />
          </div>
          
          <div className="w-full md:w-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full md:w-auto inline-flex justify-between items-center px-4 py-2.5 border border-gray-200 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              <option>All Messages</option>
              <option>New</option>
              <option>Read</option>
              <option>Replied</option>
              <option>Spam</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <button
              onClick={() => window.location.reload()}
              className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2.5 border border-gray-200 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </section>

      {/* Contacts List */}
      <section className="space-y-4">
        {loading && contacts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading contacts...</p>
            </div>
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const statusBadge = getStatusBadge(contact.status);
            
            return (
              <div
                key={contact._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className={`h-12 w-12 rounded-xl ${getAvatarColor(contact.name)} flex items-center justify-center text-white text-lg font-bold shadow-sm`}>
                      {getAvatarInitials(contact.name)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    {/* Header */}
                    <div className="flex flex-wrap justify-between items-start mb-2">
                      <div className="flex items-center gap-3 mb-2 md:mb-0">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                          {contact.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                          <statusBadge.icon className="w-3 h-3 mr-1" />
                          {statusBadge.text}
                        </span>
                      </div>
                      
                      {/* Desktop Actions */}
                      <div className="hidden md:flex items-center gap-4">
                        <button
                          onClick={() => handleAction('view', contact._id)}
                          disabled={loading}
                          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleAction('delete', contact._id)}
                          disabled={loading}
                          className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        <span>{contact.email}</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(contact.createdAt)}</span>
                      </div>
                    </div>

                    {/* Message Preview */}
                    <div className="mb-4">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
                        {contact.subject}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                        {contact.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end items-center">
                      <div className="flex items-center gap-2">
                        {/* Mobile Actions */}
                        <button
                          onClick={() => handleAction('view', contact._id)}
                          disabled={loading}
                          className="md:hidden p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors disabled:opacity-50"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAction('delete', contact._id)}
                          disabled={loading}
                          className="md:hidden p-2 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Status Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStatusChange(contact._id, 'read')}
                            disabled={loading || contact.status === 'read'}
                            className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-900/20 rounded-md hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Mark Read
                          </button>
                          <button
                            onClick={() => handleStatusChange(contact._id, 'replied')}
                            disabled={loading || contact.status === 'replied'}
                            className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Mark Replied
                          </button>
                          <button
                            onClick={() => handleStatusChange(contact._id, 'spam')}
                            disabled={loading || contact.status === 'spam'}
                            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Mark Spam
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Empty State */}
        {!loading && filteredContacts.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No messages found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {searchTerm || filterType !== 'All Messages' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No contact messages have been received yet.'
              }
            </p>
          </div>
        )}
      </section>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, contactId: null, contactName: '' })}
        onConfirm={handleDelete}
        title="Delete Contact"
        message={`Are you sure you want to delete the message from "${deleteConfirm.contactName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Contact View Modal */}
      <ContactViewModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, contact: null })}
        contact={viewModal.contact}
        onStatusChange={handleStatusChange}
        onDelete={async (contactId) => {
          await deleteContact(contactId);
          setViewModal({ isOpen: false, contact: null });
        }}
        onReply={handleReply}
        loading={loading}
      />
    </div>
  );
};

export default ContactsManagement;