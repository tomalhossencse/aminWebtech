import { useState } from 'react';
import { useNavigate } from 'react-router';

const BlogSidebar = ({ recentPosts, popularTags, title = "Recent Posts" }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <aside className="lg:col-span-4 mt-20 space-y-6">
      {/* Recent Posts */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-300">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="material-icons text-blue-500">schedule</span>
          {title}
        </h3>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <button 
              key={post.id}
              onClick={() => navigate(post.slug)}
              className="group flex gap-4 items-start hover:bg-gray-50 dark:hover:bg-slate-700/50 p-2 -m-2 rounded-lg transition-colors w-full text-left"
            >
              <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  src={post.image}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <span className="material-icons text-[12px]">calendar_month</span>
                  {post.date}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

     
      {/* Popular Tags */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-300">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="material-icons text-green-500">label</span>
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag, index) => (
            <a 
              key={index}
              href={`/blog/tag/${tag.toLowerCase()}`}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105"
            >
              #{tag}
            </a>
          ))}
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="rounded-xl shadow-lg p-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-white opacity-5 rounded-full animate-pulse delay-1000"></div>
        
        <div className="relative z-10">
          <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                  Newsletter
          </h3>
          <p className="text-blue-100 text-sm mb-4">
            Subscribe to get updates directly to your inbox.
          </p>
          
          {isSubscribed ? (
            <div className="text-center py-4">
              <span className="material-icons text-4xl text-green-300 mb-2 block">check_circle</span>
              <p className="text-green-100 font-medium">Successfully subscribed!</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all backdrop-blur-sm"
                  placeholder="Your email"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white text-blue-600 font-bold py-2.5 px-4 rounded-lg hover:bg-blue-50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                Subscribe
                <span className="material-icons text-[18px]">arrow_forward</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;