import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  slug?: string;
  views?: number;
}

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchBlog = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching blog with ID:', id);
        
        // Fetch blog post - backend supports both ID and slug
        const response = await axios.get(`${API_BASE_URL}/blogs/${id}`);
        const blog = response.data.data;
        
        console.log('Blog fetched:', blog);
        setBlogPost(blog);
        
        // Fetch related blogs
        try {
          const relatedResponse = await axios.get(`${API_BASE_URL}/blogs/${blog._id}/related`);
          setRelatedBlogs(relatedResponse.data.data || []);
        } catch (err) {
          console.error('Failed to fetch related blogs:', err);
          // Don't fail the whole page if related blogs fail
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Failed to fetch blog post';
        setError(errorMsg);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <Loader2 className="animate-spin text-[#F46A1F]" size={48} />
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-8">{error || "Sorry, the blog post you're looking for doesn't exist."}</p>
          <button 
            onClick={() => navigate('/blog')}
            className="inline-flex items-center px-6 py-3 bg-[#F46A1F] hover:bg-[#d85a15] text-white font-semibold rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blogPost.title} | RASS Engineering & Construction Blog</title>
        <meta name="description" content={blogPost.excerpt} />
        <meta name="author" content={blogPost.author} />
        <link rel="canonical" href={`/blog/${blogPost.slug || blogPost._id}`} />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Back Button */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center text-[#F46A1F] hover:text-[#d85a15] font-semibold transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Blog
            </button>
          </div>
        </div>

        {/* Hero Section with Image */}
        <section className="relative h-96 overflow-hidden">
          <motion.img
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.7 }}
            src={blogPost.image}
            alt={blogPost.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="inline-block px-4 py-2 bg-[#F46A1F] text-white rounded-full text-sm font-semibold mb-4">
                  {blogPost.category}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {blogPost.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-white">
                  <div className="flex items-center">
                    <Calendar size={18} className="mr-2" />
                    <span>{new Date(blogPost.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={18} className="mr-2" />
                    <span>{blogPost.readTime}</span>
                  </div>
                  <div>By {blogPost.author}</div>
                  {blogPost.views && blogPost.views > 0 && (
                    <div>{blogPost.views} views</div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="prose prose-lg max-w-none"
            >
              <div 
                className="text-gray-700 prose prose-headings:text-black prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:font-bold prose-h3:mt-10 prose-h3:mb-5 prose-h4:text-xl prose-h4:font-bold prose-h4:mt-8 prose-h4:mb-4 prose-p:leading-8 prose-p:mb-6 prose-ul:space-y-3 prose-ul:list-disc prose-ul:list-outside prose-ul:ml-6 prose-ol:space-y-3 prose-ol:list-decimal prose-ol:list-outside prose-ol:ml-6 prose-li:pl-2 prose-li:leading-7 prose-a:text-[#F46A1F] prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-lg prose-blockquote:border-l-4 prose-blockquote:border-[#F46A1F] prose-blockquote:pl-6 prose-blockquote:italic"
                dangerouslySetInnerHTML={{ __html: blogPost.content }} 
              />
            </motion.article>

            {/* CTA Section within blog */}
            <div className="mt-16 p-8 bg-gradient-to-r from-[#F46A1F]/10 to-orange-100 rounded-2xl border border-[#F46A1F]/20">
              <h3 className="text-2xl font-bold text-black mb-3">Need This Service?</h3>
              <p className="text-gray-700 mb-6">
                Get in touch with our team to discuss how we can help with your specific needs.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center px-6 py-3 bg-[#F46A1F] hover:bg-[#d85a15] text-white font-semibold rounded-lg transition-colors"
              >
                Contact Us Today
              </button>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-black mb-12">More from {blogPost.category}</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {relatedBlogs.map((post, index) => (
                  <motion.button
                    key={post._id}
                    onClick={() => navigate(`/blog/${post.slug || post._id}`)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-left group"
                  >
                    <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="text-lg font-bold text-black group-hover:text-[#F46A1F] transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default BlogDetail;