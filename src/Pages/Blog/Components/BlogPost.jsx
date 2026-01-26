import { useState } from 'react';
import { useNavigate } from 'react-router';

const BlogPost = ({ post, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/blog/${post._id || post.id}`);
  };

  return (
    <article 
      className="group relative bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>

      {/* Featured Image */}
      <div className="relative h-40 sm:h-48 md:h-56 w-full overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse"></div>
        )}
        <img 
          alt={post.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          src={post.featuredImage || post.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop'}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Image Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}></div>
        
        {/* Category Badge */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
          <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-blue-600 dark:text-blue-400 text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg border border-white/20 hover:scale-105 transition-transform duration-300">
            <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
            {post.category}
          </span>
        </div>

        {/* Reading Time & Views */}
        <div className={`absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-1 sm:gap-1.5 transition-all duration-500 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          {post.readTime && (
            <span className="bg-black/50 backdrop-blur-md text-white text-xs font-medium px-2 sm:px-2.5 py-1 rounded-full">
              {post.readTime}m
            </span>
          )}
          <span className="bg-black/50 backdrop-blur-md text-white text-xs font-medium px-2 sm:px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="material-icons text-xs">visibility</span>
            {post.views || 0}
          </span>
        </div>

        {/* Floating Action Button */}
        <div className={`absolute bottom-3 sm:bottom-4 right-3 sm:right-4 transition-all duration-500 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}>
          <button className="w-8 sm:w-10 h-8 sm:h-10 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center border border-gray-200 dark:border-gray-700 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0">
            <span className="material-icons text-sm sm:text-base">bookmark_add</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-4 sm:p-6">
        {/* Meta Information */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-1.5 bg-gray-50 dark:bg-slate-700/50 px-2 sm:px-2.5 py-1 rounded-full">
            <span className="material-icons text-[12px] sm:text-[14px] text-blue-500">calendar_today</span>
            <span className="font-medium">{post.date || post.created || 'No date'}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 bg-gray-50 dark:bg-slate-700/50 px-2 sm:px-2.5 py-1 rounded-full">
            <span className="material-icons text-[12px] sm:text-[14px] text-green-500">person</span>
            <span className="font-medium">{post.author || 'Anonymous'}</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm line-clamp-2">
          {post.excerpt || post.content?.substring(0, 150) + '...' || 'No description available'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
          {(post.tags || []).slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <span className="material-icons text-[10px] sm:text-[12px]">sell</span>
              {tag}
            </span>
          ))}
          {(post.tags || []).length > 2 && (
            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
              +{(post.tags || []).length - 2}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
          <button 
            onClick={handleReadMore}
            className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group/btn text-xs sm:text-sm min-h-[44px]"
          >
            Read More
            <span className="material-icons text-[14px] sm:text-[16px] group-hover/btn:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
          
          <div className="flex items-center gap-3 sm:gap-4 text-gray-400 text-xs">
            <div className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer min-h-[44px] min-w-[44px] justify-center">
              <span className="material-icons text-[14px] sm:text-[16px]">favorite</span>
              <span className="font-medium">{post.likes || 0}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-green-500 transition-colors cursor-pointer min-h-[44px] min-w-[44px] justify-center">
              <span className="material-icons text-[14px] sm:text-[16px]">share</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
      <div className="absolute bottom-4 right-4 w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
    </article>
  );
};

export default BlogPost;