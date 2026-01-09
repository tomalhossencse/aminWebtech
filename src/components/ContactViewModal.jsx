import { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  Send, 
  Trash2,
  User,
  MessageSquare,
  Reply
} from 'lucide-react';
import { useToast } from '../Context/ToastContext';
import EmailReplyModal from './EmailReplyModal';

const ContactViewModal = ({ 
  isOpen, 
  onClose, 
  contact, 
  onStatusChange, 
  onDelete, 
  onReply,
  loading = false 
}) => {
  const { success, error: showError } = useToast();
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [currentTrackingId, setCurrentTrackingId] = useState('');

  if (!isOpen || !contact) return null;

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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await onStatusChange(contact._id, newStatus);
      success(`Contact marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      showError('Failed to update contact status');
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(contact._id);
      success('Contact deleted successfully');
      onClose();
    } catch (error) {
      console.error('Error deleting contact:', error);
      showError('Failed to delete contact');
    }
  };

  const handleReplyViaEmail = async () => {
    try {
      // Create tracking ID
      const trackingId = `TRACK_${contact._id}_${Date.now()}`;
      setCurrentTrackingId(trackingId);
      
      // Track that email client is being opened
      await onReply(contact._id, `Email client opened for reply. Tracking ID: ${trackingId}`, trackingId);
      
      // Show email modal with options
      setShowEmailModal(true);
      
      // Mark as replied since we're tracking it
      await handleStatusChange('replied');
      
    } catch (error) {
      console.error('Error tracking email client opening:', error);
      showError('Failed to track email. Please try again.');
    }
  };

  const handleReplySubmit = async () => {
    if (!replyMessage.trim()) {
      showError('Please enter a reply message');
      return;
    }

    setIsSendingReply(true);
    try {
      await onReply(contact._id, replyMessage);
      success('Reply sent successfully');
      setReplyMessage('');
      setIsReplying(false);
      // Mark as replied
      await handleStatusChange('replied');
    } catch (error) {
      console.error('Error sending reply:', error);
      showError('Failed to send reply');
    } finally {
      setIsSendingReply(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-[9999]">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-2 sm:mx-4 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg ${getAvatarColor(contact.name)}`}>
              {getAvatarInitials(contact.name)}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {contact.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                {contact.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[calc(95vh-200px)] overflow-y-auto">
          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Email */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Email</span>
              </div>
              <p className="text-blue-600 dark:text-blue-400 font-medium break-all">
                {contact.email}
              </p>
            </div>

            {/* Phone */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800 dark:text-green-300">Phone</span>
              </div>
              <p className="text-green-600 dark:text-green-400 font-medium">
                {contact.phone || 'Not provided'}
              </p>
            </div>

            {/* Date */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Date</span>
              </div>
              <p className="text-purple-600 dark:text-purple-400 font-medium text-sm">
                {formatDate(contact.createdAt)}
              </p>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Subject
            </label>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-gray-900 dark:text-white font-medium">
                {contact.subject}
              </p>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Message
            </label>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                {contact.message}
              </p>
            </div>
          </div>

          {/* Reply Section */}
          {isReplying && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                Reply Message
              </label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply here..."
                className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Status */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={contact.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={loading}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="spam">Spam</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Delete Button */}
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>

              {/* Reply Button */}
              {!isReplying ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReplyViaEmail}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm font-medium shadow-lg hover:shadow-xl"
                  >
                    <Reply className="w-4 h-4" />
                    Reply via Email
                  </button>
                  <button
                    onClick={() => setIsReplying(true)}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Quick Reply
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsReplying(false);
                      setReplyMessage('');
                    }}
                    disabled={isSendingReply}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReplySubmit}
                    disabled={isSendingReply || !replyMessage.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm font-medium shadow-lg hover:shadow-xl"
                  >
                    {isSendingReply ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {isSendingReply ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Email Reply Modal */}
      <EmailReplyModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        contact={contact}
        trackingId={currentTrackingId}
      />
    </div>
  );
};

export default ContactViewModal;