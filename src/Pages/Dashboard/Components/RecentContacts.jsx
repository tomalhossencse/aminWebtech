import { useState } from 'react';
import { MessageSquare, ExternalLink, Eye, CheckCircle, Mail, Phone, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import useContactsAPI from '../../../hooks/useContactsAPI';
import ContactViewModal from '../../../components/ContactViewModal';

const RecentContacts = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { contacts, stats, loading, updateContactStatus, deleteContact, replyToContact } = useContactsAPI();

  // Get recent contacts (last 3)
  const recentContacts = contacts.slice(0, 3);

  const filters = [
    { key: 'all', label: 'All Messages', count: stats.total || 0 },
    { key: 'new', label: 'New', count: stats.new || 0 },
    { key: 'read', label: 'Read', count: stats.read || 0 },
    { key: 'replied', label: 'Replied', count: stats.replied || 0 },
    { key: 'spam', label: 'Spam', count: stats.spam || 0 }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      read: {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-800 dark:text-amber-500',
        border: 'border-amber-200 dark:border-amber-800/50',
        dot: 'bg-amber-500'
      },
      new: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-800 dark:text-blue-500',
        border: 'border-blue-200 dark:border-blue-800/50',
        dot: 'bg-blue-500'
      },
      replied: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-500',
        border: 'border-green-200 dark:border-green-800/50',
        dot: 'bg-green-500'
      },
      spam: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-500',
        border: 'border-red-200 dark:border-red-800/50',
        dot: 'bg-red-500'
      }
    };

    const config = statusConfig[status] || statusConfig.new;

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`}></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-indigo-500', 'bg-orange-500', 'bg-red-500', 'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleQuickView = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const handleStatusChange = async (contactId, newStatus) => {
    if (updateContactStatus) {
      await updateContactStatus(contactId, newStatus);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (deleteContact) {
      await deleteContact(contactId);
    }
  };

  const handleReplyToContact = async (contactId, message, trackingId) => {
    if (replyToContact) {
      await replyToContact(contactId, message, trackingId);
    }
  };

  const handleViewAllContacts = () => {
    navigate('/dashboard/contacts');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-6 flex justify-between items-start">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-200 dark:shadow-none">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Contacts</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {loading ? 'Loading...' : `${stats.total || 0} total messages • ${stats.new || 0} unread`}
            </p>
          </div>
        </div>
        <button 
          onClick={handleViewAllContacts}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1 transition-colors"
        >
          View All
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="px-6 pb-2">
        <div className="flex flex-wrap gap-2 md:gap-6 text-sm">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeFilter === filter.key
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {filter.label}
              {filter.count > 0 && (
                <span className="ml-1 text-gray-400 dark:text-gray-600">{filter.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading contacts...</div>
          </div>
        ) : recentContacts.length > 0 ? (
          <div className="space-y-6">
            {recentContacts.map((contact) => (
              <div key={contact._id} className="flex gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${getAvatarColor(contact.name)} text-white flex items-center justify-center text-xl font-bold`}>
                  {getInitials(contact.name)}
                </div>
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">{contact.name}</h3>
                      {getStatusBadge(contact.status)}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(contact.createdAt)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{contact.email}</span>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{contact.subject}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {contact.message}
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleQuickView(contact)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm shadow-blue-200 dark:shadow-none"
                    >
                      <Eye className="w-4 h-4" />
                      Quick View
                    </button>
                    <button 
                      onClick={() => handleQuickView(contact)}
                      className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">No recent contacts</p>
          </div>
        )}
      </div>

      <div className="p-6 pt-0 border-t-0 flex flex-col sm:flex-row justify-between items-center text-sm gap-4 mt-auto">
        <span className="text-gray-500 dark:text-gray-400">
          Showing {recentContacts.length} of {stats.total || 0} messages
        </span>
        <button 
          onClick={handleViewAllContacts}
          className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 group"
        >
          Manage all contacts
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Contact View Modal */}
      <ContactViewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        contact={selectedContact}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteContact}
        onReply={handleReplyToContact}
        loading={loading}
      />
    </div>
  );
};

export default RecentContacts;