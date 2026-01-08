import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star,
  Building,
  ChevronDown,
  Calendar
} from 'lucide-react';

const TestimonialsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Testimonials');

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      company: 'Global Tech',
      position: 'CTO',
      rating: 5,
      testimonial: 'Professional team with great attention to detail. Will work with them again.',
      date: '24/12/2025',
      featured: true,
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'David Chen',
      company: 'Innovate Inc',
      position: 'Product Manager',
      rating: 4,
      testimonial: 'The platform is intuitive and easy to use. Support team was very helpful.',
      date: '20/12/2025',
      featured: false,
      avatar: 'DC'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      company: 'StartupXYZ',
      position: 'Founder',
      rating: 5,
      testimonial: 'Exceeded our expectations in every way. Highly recommend their services.',
      date: '18/12/2025',
      featured: true,
      avatar: 'ER'
    },
    {
      id: 4,
      name: 'Michael Thompson',
      company: 'TechCorp',
      position: 'Lead Developer',
      rating: 5,
      testimonial: 'Outstanding work quality and timely delivery. Great communication throughout.',
      date: '15/12/2025',
      featured: false,
      avatar: 'MT'
    }
  ];

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.testimonial.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'All Testimonials' || 
                         (filterType === 'Featured' && testimonial.featured) ||
                         (filterType === 'Recent' && new Date(testimonial.date.split('/').reverse().join('-')) > new Date(Date.now() - 7*24*60*60*1000));
    
    return matchesSearch && matchesFilter;
  });

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
    // Implement actual actions here
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Add Testimonial
        </button>
      </div>

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`relative rounded-xl p-6 transition-all duration-200 hover:shadow-lg group ${
                testimonial.featured
                  ? 'bg-blue-50 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-600'
                  : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Action Buttons */}
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => handleAction('edit', testimonial.id)}
                  className="p-2 text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all duration-200"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAction('delete', testimonial.id)}
                  className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-semibold text-sm ${getAvatarColor(testimonial.name)}`}>
                  {testimonial.avatar}
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-1">
                    {testimonial.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-1.5">
                    <Building className="w-4 h-4" />
                    <span>{testimonial.company}</span>
                    <span className="text-gray-400">•</span>
                    <span>{testimonial.position}</span>
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
                  {testimonial.date}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTestimonials.length === 0 && (
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
    </div>
  );
};

export default TestimonialsManagement;