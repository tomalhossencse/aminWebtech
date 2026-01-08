import { useState } from 'react';

const BlogPost = ({ post, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <article 
      className="group relative bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>

      {/* Featured Image */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse"></div>
        )}
        <img 
          alt={post.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          src={post.image}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Image Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20 hover:scale-105 transition-transform duration-300">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
            {post.category}
          </span>
        </div>

        {/* Reading Time & Views */}
        <div className={`absolute top-4 right-4 flex gap-1.5 transition-all duration-500 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          <span className="bg-black/50 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {post.readTime}m
          </span>
          <span className="bg-black/50 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="material-icons text-xs">visibility</span>
            {post.views}
          </span>
        </div>

        {/* Floating Action Button */}
        <div className={`absolute bottom-4 right-4 transition-all duration-500 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}>
          <button className="w-10 h-10 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center border border-gray-200 dark:border-gray-700">
            <span className="material-icons text-base">bookmark_add</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6">
        {/* Meta Information */}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-700/50 px-2.5 py-1 rounded-full">
            <span className="material-icons text-[14px] text-blue-500">calendar_today</span>
            <span className="font-medium">{post.date}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-700/50 px-2.5 py-1 rounded-full">
            <span className="material-icons text-[14px] text-green-500">person</span>
            <span className="font-medium">{post.author}</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-sm line-clamp-2">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <span className="material-icons text-[12px]">sell</span>
              {tag}
            </span>
          ))}
          {post.tags.length > 2 && (
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
              +{post.tags.length - 2}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <a 
            href={post.slug}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group/btn text-sm"
          >
            Read More
            <span className="material-icons text-[16px] group-hover/btn:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </a>
          
          <div className="flex items-center gap-4 text-gray-400 text-xs">
            <div className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer">
              <span className="material-icons text-[16px]">favorite</span>
              <span className="font-medium">{post.likes}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-green-500 transition-colors cursor-pointer">
              <span className="material-icons text-[16px]">share</span>
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