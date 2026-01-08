import { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';

const BlogManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);

  const blogPosts = [
    {
      id: 1,
      title: 'Building a Modern Android App: A Complete Beginner-to-Pro Guide',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArVwEQNHy75aT5zD6LEA3zIz80v912KOx_938apZfLFxqnlHEQfeHThkOMpYzqWwOwWkCBCY3yl_PN2-RlNcaX64_eho3aIUnMISrjb3OWjevZuTW5z1FtDbEfkbGbC1B4aMUOQquM7L3QpBhJk4YRqi3lUhqzzmqmrFYDNvp7RWcYN8_52vB988cQRrtyfedleeSk640QNoXoDA6Fpigl6hI1f3i_40aRgZexCS6M51amqGA8eLoPxqUuu7acC2uHwNpXVnSwDYE',
      author: 'Super Admin',
      category: 'Mobile Development',
      status: 'Published',
      views: 7,
      created: '27/12/2025'
    },
    {
      id: 2,
      title: 'The Future of Web Design: Trends to Watch in 2026',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0kgggbL8qgK9v6ZQWb6_fZyvVUPzIXo9u5yu2_E5hNVXfB2WoUycQjCveSDWCPFf-kg0Wuo-l1arOl2STy_EhzathYmDDPPcL8On-71ZEsOkUY4EbfP5cGQGzLaUYP1VdPuC0jXdgE0tCd5NE8QPwdv2i24W3Df6lPf2WrydYtGlAowes9DwFZMppu1ekaoMfBEhGSwNlzrvIMyZfWThkAaoslUL_ssL1cnH7N4VLv5M55QslIFmrcFjIrnbGZyFtYgXpDuIZ780',
      author: 'Sarah Jenkins',
      category: 'Design',
      status: 'Draft',
      views: 0,
      created: '26/12/2025'
    },
    {
      id: 3,
      title: 'Understanding Zero Trust Security Architecture',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpNyAvPC9KpkGO7BOA89AKNsN2pEx8a5JNQvMI3F68ObYkvodt8CQ4JmypGJOLGmAZ5Y19Msn1XHrZEyMtlwke3WQLeUGKzE8cYWjRlT8UTFL2lIAXevp8WEX0dbDcGoygkzQlNIwd6ZcC4yEzFCvpc_fjXTA_IVUBKw0dW6RtYb8PfsNPUCeNGPaBOsegnTp_lyOVZB6X_GkHyCwffyg976nHSxk8zqO0gfPBWRgprOe0_xnZ41JENQAr9mf1JhI88KSwM8cXsV0',
      author: 'Mike Ross',
      category: 'Security',
      status: 'Published',
      views: 142,
      created: '15/12/2025'
    },
    {
      id: 4,
      title: 'Selecting the Right Chipset for IoT Devices',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW9OE8eNizg7H9uub5fCXJra0TbP5rS8Fh3SWiNCTXVSDqvl8eVCrecoAVfmPurQCrqnRnZ--o-Kzgs2xzVugbGb2yxYyLqJM-Ij70P67RgRcMYY2T4T7kMNI072RsCXat4L8cRk2sFeYrtVSH2pzhMPrpbwFo_r1ceyiJUGMBEVVNLTJQI4Ae7aslOh0H2WunLZwkT22rWjo2_-XL1lj_lfcpTNr2Q_Yu-otBjcCJhLU5h3jvCURZn-vQQodnyBumFuUU43REAh4',
      author: 'Super Admin',
      category: 'Hardware',
      status: 'Archived',
      views: 45,
      created: '10/11/2025'
    }
  ];

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

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalEntries = 24; // Total blog posts in the system
  const entriesPerPage = 10;
  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, filteredPosts.length);

  const handleAction = (action, postId) => {
    console.log(`${action} blog post with ID: ${postId}`);
    // Implement actual actions here
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your blog posts and articles</p>
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
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-16">
                        <img
                          alt={`${post.title} Thumbnail`}
                          className="h-12 w-16 rounded object-cover border border-gray-200 dark:border-gray-700"
                          src={post.thumbnail}
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
                    {post.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1.5" />
                      {post.created}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleAction('view', post.id)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        title="View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleAction('edit', post.id)}
                        className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors p-1 rounded-md hover:bg-amber-50 dark:hover:bg-amber-900/30"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleAction('delete', post.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startEntry} to {endEntry} of {totalEntries} entries
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={endEntry >= totalEntries}
              className="flex items-center gap-1 px-3 py-1 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;