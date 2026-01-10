import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import useBlogAPI from '../../../hooks/useBlogAPI';
import BlogSidebar from './BlogSidebar';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  
  const { getBlog, getBlogs, incrementViews, loading, error } = useBlogAPI();

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        // Fetch the specific blog
        const blogResponse = await getBlog(id);
        if (blogResponse) {
          setBlog(blogResponse);
          setLikes(blogResponse.likes || 0);
          
          // Increment view count
          await incrementViews(id);
          
          // Fetch related posts (same category, excluding current post)
          const relatedResponse = await getBlogs({ 
            limit: 3, 
            status: 'Published' 
          });
          
          if (relatedResponse && relatedResponse.blogs) {
            const related = relatedResponse.blogs
              .filter(post => post._id !== id && post.category === blogResponse.category)
              .slice(0, 3)
              .map(post => ({
                id: post._id,
                title: post.title,
                date: post.created || post.createdAt,
                image: post.featuredImage,
                slug: `/blog/${post._id}`
              }));
            setRelatedPosts(related);
            
            // Extract tags for sidebar
            const allTags = relatedResponse.blogs.reduce((tags, post) => {
              if (post.tags && Array.isArray(post.tags)) {
                return [...tags, ...post.tags];
              }
              return tags;
            }, []);
            setPopularTags([...new Set(allTags)].slice(0, 14));
          }
        }
      } catch (err) {
        console.error('Failed to fetch blog details:', err);
      }
    };

    if (id) {
      fetchBlogDetail();
    }
  }, [id, getBlog, getBlogs, incrementViews]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title || '';
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="bg-gray-50 dark:bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="material-icons text-6xl text-gray-300 dark:text-gray-600 mb-4 block">
            error_outline
          </span>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Blog Post Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <button 
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 min-h-screen">
      {/* Header with breadcrumb */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button 
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Home
            </button>
            <span className="text-gray-400">/</span>
            <button 
              onClick={() => navigate('/blog')}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Blog
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400 truncate">
              {blog.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article */}
          <article className="lg:col-span-8">
            {/* Article Header */}
            <header className="mb-8">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  {blog.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-base text-green-500">person</span>
                  <span className="font-medium">{blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-base text-blue-500">calendar_today</span>
                  <span>{blog.created || blog.createdAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-base text-purple-500">visibility</span>
                  <span>{blog.views || 0} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-base text-red-500">schedule</span>
                  <span>{blog.readTime || Math.ceil((blog.content?.length || 0) / 200)} min read</span>
                </div>
              </div>

              {/* Excerpt */}
              {blog.excerpt && (
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8 font-medium">
                  {blog.excerpt}
                </p>
              )}
            </header>

            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src={blog.featuredImage} 
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <div 
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="material-icons text-blue-500">sell</span>
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isLiked 
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="material-icons text-base">
                      {isLiked ? 'favorite' : 'favorite_border'}
                    </span>
                    <span>{likes}</span>
                  </button>
                  
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="material-icons text-base">link</span>
                    <span>Copy Link</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Share:</span>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                    title="Share on Twitter"
                  >
                    <span className="material-icons text-base">share</span>
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                    title="Share on Facebook"
                  >
                    <span className="material-icons text-base">facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                    title="Share on LinkedIn"
                  >
                    <span className="material-icons text-base">business</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Author Bio */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {blog.author?.charAt(0) || 'A'}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {blog.author}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Passionate developer and tech enthusiast sharing insights about modern web development, 
                    mobile applications, and emerging technologies. Always learning and exploring new ways 
                    to build better digital experiences.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => navigate('/blog')}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="material-icons text-base">arrow_back</span>
                Back to Blog
              </button>
              
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="material-icons text-base">keyboard_arrow_up</span>
                Back to Top
              </button>
            </div>
          </article>

          {/* Sidebar */}
          <BlogSidebar 
            recentPosts={relatedPosts}
            popularTags={popularTags}
            title="Related Posts"
          />
        </div>
      </main>
    </div>
  );
};

export default BlogDetailPage;