import { useState, useMemo } from 'react';
import BlogHeader from './BlogHeader';
import BlogFilter from './BlogFilter';
import BlogPost from './BlogPost';
import BlogSidebar from './BlogSidebar';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Sample blog data
  const blogPosts = [
    {
      id: 1,
      title: "Building a Modern Android App: A Complete Beginner-to-Pro Guide",
      excerpt: "Build modern, scalable Android applications using the latest tools, architectures, and best practices. Learn how to integrate APIs, manage state, and deploy to the Play Store efficiently.",
      image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&h=600&fit=crop",
      category: "Mobile Development",
      author: "Super Admin",
      date: "Dec 27, 2025",
      readTime: 8,
      views: 127,
      likes: 23,
      tags: ["Android", "Java", "Kotlin", "Mobile", "API"],
      slug: "/blog/android-app-guide",
      type: "mobile"
    },
    {
      id: 2,
      title: "React Performance Optimization: Advanced Techniques",
      excerpt: "Discover advanced React optimization techniques including memoization, code splitting, and virtual DOM optimization to build lightning-fast applications.",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
      category: "Web Development",
      author: "John Doe",
      date: "Dec 25, 2025",
      readTime: 12,
      views: 89,
      likes: 15,
      tags: ["React", "JavaScript", "Performance", "Optimization"],
      slug: "/blog/react-performance",
      type: "web"
    },
    {
      id: 3,
      title: "UI/UX Design Principles for Modern Web Applications",
      excerpt: "Learn essential design principles and best practices for creating intuitive, accessible, and beautiful user interfaces that convert.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      category: "UI/UX Design",
      author: "Jane Smith",
      date: "Dec 23, 2025",
      readTime: 6,
      views: 156,
      likes: 31,
      tags: ["Design", "UX", "UI", "Figma", "Accessibility"],
      slug: "/blog/ui-ux-principles",
      type: "design"
    },
    {
      id: 4,
      title: "Node.js Microservices Architecture: Best Practices",
      excerpt: "Build scalable microservices with Node.js, Docker, and Kubernetes. Learn about service communication, data management, and deployment strategies.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
      category: "Backend Development",
      author: "Mike Johnson",
      date: "Dec 20, 2025",
      readTime: 15,
      views: 203,
      likes: 42,
      tags: ["Node.js", "Microservices", "Docker", "Kubernetes", "API"],
      slug: "/blog/nodejs-microservices",
      type: "backend"
    }
  ];

  const recentPosts = [
    {
      id: 1,
      title: "Building a Modern Android App: A Complete Guide",
      date: "27/12/2025",
      image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=200&h=150&fit=crop",
      slug: "/blog/android-app-guide"
    },
    {
      id: 2,
      title: "React Performance Optimization Techniques",
      date: "25/12/2025",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=150&fit=crop",
      slug: "/blog/react-performance"
    },
    {
      id: 3,
      title: "UI/UX Design Principles for Modern Apps",
      date: "23/12/2025",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=150&fit=crop",
      slug: "/blog/ui-ux-principles"
    }
  ];

  const popularTags = [
    "React", "JavaScript", "Laravel", "Node.js", "Vue.js", 
    "CSS", "Next.js", "PHP", "AWS", "MySQL", "Android", 
    "Kotlin", "Design", "UX"
  ];

  // Filter posts based on search term and active filter
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = activeFilter === 'all' || post.type === activeFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter, blogPosts]);

  return (
    <div className="bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 min-h-screen flex flex-col">
      {/* Header */}
      <BlogHeader onSearch={setSearchTerm} />

      {/* Main Content */}
      <main className="flex-grow -mt-12 px-4 sm:px-6 lg:px-8 pb-16 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-8">
              {/* Filter Buttons */}
              <BlogFilter 
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                postCount={blogPosts.length}
              />

              {/* Search Results Info */}
              {searchTerm && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Found {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{searchTerm}"
                  </p>
                </div>
              )}

              {/* Blog Posts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post, index) => (
                    <BlogPost key={post.id} post={post} index={index} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <span className="material-icons text-6xl text-gray-300 dark:text-gray-600 mb-4 block">
                      search_off
                    </span>
                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      No posts found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500">
                      Try adjusting your search terms or filters
                    </p>
                  </div>
                )}
              </div>

              {/* Load More Button */}
              {filteredPosts.length > 0 && (
                <div className="text-center pt-8">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                    Load More Posts
                    <span className="material-icons text-[18px]">expand_more</span>
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <BlogSidebar 
              recentPosts={recentPosts}
              popularTags={popularTags}
            />
          </div>
        </div>
      </main>

    </div>
  );
};

export default BlogPage;