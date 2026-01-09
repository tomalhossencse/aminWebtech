import { useState } from 'react';
import { 
  X, 
  Mail, 
  Copy, 
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../Context/ToastContext';

const EmailReplyModal = ({ 
  isOpen, 
  onClose, 
  contact, 
  trackingId 
}) => {
  const { success, error: showError } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !contact) return null;

  const subject = `Re: ${contact.subject} [${trackingId}]`;
  const body = `Dear ${contact.name},

Thank you for contacting us regarding "${contact.subject}".

[Please write your reply here]

Best regards,
AminWebTech Team

---
Original Message:
From: ${contact.name} <${contact.email}>
Date: ${new Date(contact.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}
Subject: ${contact.subject}

${contact.message}`;

  const emailContent = `To: ${contact.email}
Subject: ${subject}

${body}`;

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(emailContent);
      setCopied(true);
      success('Email content copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
      showError('Failed to copy to clipboard');
    }
  };

  const handleOpenGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contact.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
    success('Gmail opened in new tab');
  };

  const handleOpenOutlook = () => {
    const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(contact.email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(outlookUrl, '_blank');
    success('Outlook opened in new tab');
  };

  const handleOpenYahoo = () => {
    const yahooUrl = `https://compose.mail.yahoo.com/?to=${encodeURIComponent(contact.email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(yahooUrl, '_blank');
    success('Yahoo Mail opened in new tab');
  };

  const handleTryMailto = () => {
    try {
      const mailtoLink = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
      success('Attempting to open default email client...');
    } catch (error) {
      showError('Failed to open email client. Please try copying the content instead.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-[10000]">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-2 sm:mx-4 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Reply via Email
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Choose your preferred method to reply
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[calc(95vh-200px)] overflow-y-auto">
          {/* Contact Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Subject:</span> {contact.subject}
            </p>
          </div>

          {/* Email Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Choose Email Method
            </h3>

            {/* Web Email Services */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleOpenGmail}
                className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Gmail</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Open in browser</p>
                </div>
              </button>

              <button
                onClick={handleOpenOutlook}
                className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Outlook</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Open in browser</p>
                </div>
              </button>

              <button
                onClick={handleOpenYahoo}
                className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Yahoo</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Open in browser</p>
                </div>
              </button>
            </div>

            {/* Default Email Client */}
            <button
              onClick={handleTryMailto}
              className="w-full flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">Default Email Client</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Open in your system's default email app (Outlook, Apple Mail, etc.)
                </p>
              </div>
            </button>

            {/* Copy to Clipboard */}
            <button
              onClick={handleCopyToClipboard}
              className="w-full flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                copied ? 'bg-green-500' : 'bg-gray-500'
              }`}>
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <Copy className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  {copied ? 'Copied!' : 'Copy Email Content'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Copy the email content to paste in any email client
                </p>
              </div>
            </button>
          </div>

          {/* Email Preview */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Email Preview</h4>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">To:</span> {contact.email}</p>
                <p><span className="font-medium">Subject:</span> {subject}</p>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                  <pre className="whitespace-pre-wrap text-xs text-gray-600 dark:text-gray-300 font-mono">
                    {body}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                  Important: Keep the tracking ID in the subject
                </p>
                <p className="text-blue-700 dark:text-blue-400">
                  The tracking ID <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">[{trackingId}]</code> in the subject line helps us track your reply automatically.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailReplyModal;