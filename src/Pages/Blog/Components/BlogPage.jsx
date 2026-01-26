import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import BlogHeader from './BlogHeader';
import BlogFilter from './BlogFilter';
import BlogPost from './BlogPost';
import BlogSidebar from './BlogSidebar';
import useBlogAPI from '../../../hooks/useBlogAPI';

const BlogPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [blogPosts, setBlogPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  const { getBlogs, loading, error } = useBlogAPI();

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const params = {
          page: currentPage,
          limit: 10,
          search: searchTerm || undefined,
          status: 'Published' // Only show published blogs on public page
        };
        
        const response = await getBlogs(params);
        
        if (response) {
          const blogs = response.blogs || [];
          
          if (currentPage === 1) {
            setBlogPosts(blogs);
          } else {
            setBlogPosts(prev => [...prev, ...blogs]);
          }
          
          setTotalPages(response.totalPages || 1);
          setHasMore(currentPage < (response.totalPages || 1));
          
          // Set recent posts (first 3 from latest blogs)
          if (currentPage === 1) {
            const recent = blogs.slice(0, 3).map(post => ({
              id: post._id || post.id,
              title: post.title,
              date: post.created || post.createdAt || post.date,
              image: post.featuredImage || post.image,
              slug: `/blog/${post.slug || post._id || post.id}`
            }));
            setRecentPosts(recent);
            
            // Extract unique tags from all posts
            const allTags = blogs.reduce((tags, post) => {
              if (post.tags && Array.isArray(post.tags)) {
                return [...tags, ...post.tags];
              }
              return tags;
            }, []);
            
            const uniqueTags = [...new Set(allTags)].slice(0, 14); // Limit to 14 tags
            setPopularTags(uniqueTags);
          }
        }
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      }
    };

    fetchBlogs();
  }, [getBlogs, currentPage, searchTerm]);

  // Reset to first page when search term changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  // Load more posts
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Calculate category counts from blog posts
  const categoryStats = useMemo(() => {
    const stats = {
      all: blogPosts.length,
      mobile: 0,
      web: 0,
      design: 0,
      backend: 0
    };

    blogPosts.forEach(post => {
      const category = post.category?.toLowerCase() || '';
      const type = post.type?.toLowerCase() || '';
      
      if (category.includes('mobile') || type === 'mobile') {
        stats.mobile++;
      } else if (category.includes('web') || type === 'web') {
        stats.web++;
      } else if (category.includes('design') || category.includes('ui') || type === 'design') {
        stats.design++;
      } else if (category.includes('backend') || category.includes('server') || type === 'backend') {
        stats.backend++;
      }
    });

    return stats;
  }, [blogPosts]);

  // Filter posts based on search term and active filter
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (post.tags && Array.isArray(post.tags) && 
                            post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesFilter = activeFilter === 'all' || 
                           post.category?.toLowerCase().includes(activeFilter.toLowerCase()) ||
                           post.type === activeFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter, blogPosts]);

  return (
    <div className="bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 min-h-screen flex flex-col">
      {/* Header */}
      <BlogHeader onSearch={setSearchTerm} />

      {/* Main Content */}
      <main className="flex-grow -mt-8 sm:-mt-12 px-3 sm:px-4 lg:px-8 pb-8 sm:pb-12 lg:pb-16 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Filter Buttons */}
              <BlogFilter 
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                postCount={blogPosts.length}
                categoryStats={categoryStats}
              />

              {/* Search Results Info */}
              {searchTerm && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Found {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{searchTerm}"
                  </p>
                </div>
              )}

              {/* Loading State */}
              {loading && currentPage === 1 && (
                <div className="col-span-full text-center py-12 sm:py-16">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading blog posts...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="col-span-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    Error loading blogs: {error}
                  </p>
                </div>
              )}

              {/* Blog Posts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {!loading && filteredPosts.length > 0 ? (
                  filteredPosts.map((post, index) => (
                    <BlogPost key={post._id || post.id} post={post} index={index} />
                  ))
                ) : !loading && (
                  <div className="col-span-full text-center py-12 sm:py-16">
                    <span className="material-icons text-4xl sm:text-6xl text-gray-300 dark:text-gray-600 mb-3 sm:mb-4 block">
                      search_off
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      No posts found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500 text-sm sm:text-base px-4">
                      {searchTerm ? 'Try adjusting your search terms or filters' : 'No blog posts available at the moment'}
                    </p>
                  </div>
                )}
              </div>

              {/* Load More Button */}
              {!loading && filteredPosts.length > 0 && hasMore && (
                <div className="text-center pt-6 sm:pt-8">
                  <button 
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More Posts
                        <span className="material-icons text-[18px]">expand_more</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block lg:col-span-4">
              <BlogSidebar 
                recentPosts={recentPosts}
                popularTags={popularTags}
              />
            </div>
          </div>

          {/* Mobile Sidebar - Shown only on mobile as a separate section */}
          <div className="lg:hidden mt-8 sm:mt-12">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-icons text-blue-500">explore</span>
                Explore More
              </h3>
              
              {/* Popular Tags for Mobile */}
              {popularTags.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Popular Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.slice(0, 8).map((tag, index) => (
                      <a 
                        key={index}
                        href={`/blog/tag/${tag.toLowerCase()}`}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                      >
                        #{tag}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Posts for Mobile */}
              {recentPosts.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Recent Posts</h4>
                  <div className="space-y-3">
                    {recentPosts.slice(0, 3).map((post) => (
                      <button 
                        key={post.id}
                        onClick={() => navigate(post.slug)}
                        className="group flex gap-3 items-start hover:bg-gray-50 dark:hover:bg-slate-700/50 p-2 -m-2 rounded-lg transition-colors w-full text-left"
                      >
                        <div className="flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                          <img 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            src={post.image}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {post.date}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPage;