import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  slug?: string;
}

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/blogs`);
        setBlogs(response.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch blogs');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog | RASS Engineering & Construction</title>
        <meta
          name="description"
          content="Read our latest articles on construction best practices. Expert insights from RASS Engineering."
        />
        <link rel="canonical" href="/blog" />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <div className="inline-block px-4 py-2 bg-[#F46A1F]/10 rounded-full mb-6">
                <span className="text-[#F46A1F] font-semibold text-sm">INSIGHTS & ARTICLES</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
                Our <span className="text-[#F46A1F]">Blog</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Expert insights, industry trends, and construction tips from our experienced team
              </p>
            </motion.div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-[#F46A1F]" size={48} />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600 text-lg">{error}</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">No blog posts available yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link to={`/blog/${post._id}`} className="block h-full">
                      <div className="rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group bg-white border border-gray-100 h-full flex flex-col">
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4 bg-[#F46A1F] text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {post.category}
                          </div>
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center">
                              <Calendar size={16} className="mr-1" />
                              {new Date(post.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </div>
                            <div className="flex items-center">
                              <Clock size={16} className="mr-1" />
                              {post.readTime}
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-black mb-3 group-hover:text-[#F46A1F] transition-colors line-clamp-2">
                            {post.title}
                          </h3>

                          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">By {post.author}</span>
                            <div className="flex items-center text-[#F46A1F] font-semibold text-sm group-hover:gap-2 transition-all">
                              Read More
                              <ArrowRight size={16} className="ml-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Stay Updated
              </h2>
              <p className="text-xl text-gray-300 mb-10">
                Subscribe to our newsletter for the latest construction tips and industry insights
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#F46A1F]"
                />
                <button className="bg-[#F46A1F] hover:bg-[#d85a15] text-white px-8 py-4 rounded-lg font-semibold transition-colors">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;