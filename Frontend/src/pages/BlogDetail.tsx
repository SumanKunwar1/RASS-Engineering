import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { blogData } from '../data/blogData';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const blogPost = blogData.find(post => post.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-8">Sorry, the blog post you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/blog')}
            className="inline-flex items-center px-6 py-3 bg-[#F46A1F] hover:bg-[#d85a15] text-white font-semibold rounded-lg transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  // Find adjacent posts for navigation
  const currentIndex = blogData.findIndex(post => post.id === Number(id));
  const prevPost = currentIndex > 0 ? blogData[currentIndex - 1] : null;
  const nextPost = currentIndex < blogData.length - 1 ? blogData[currentIndex + 1] : null;

  // Function to parse content and format it properly
  const parseContent = (content: string) => {
    const sections = content.split('\n\n').filter(section => section.trim());
    
    return sections.map((section, index) => {
      // Check if this section is a header (ends with colon and is short)
      const isHeader = section.includes(':') && !section.includes('\n') && section.length < 100 && section.trim().endsWith(':');
      
      if (isHeader) {
        return (
          <h3 key={index} className="text-xl font-bold text-black mt-8 mb-4">
            {section.trim()}
          </h3>
        );
      }

      // Check if this is a numbered list
      const lines = section.split('\n').filter(line => line.trim());
      const isNumberedList = lines.every(line => /^\d+\./.test(line.trim())) && lines.length > 1;

      if (isNumberedList) {
        return (
          <ol key={index} className="space-y-2 list-decimal list-inside text-gray-700 mb-6">
            {lines.map((line, lineIndex) => {
              const cleanedLine = line.trim().replace(/^\d+\.\s*/, '');
              return (
                <li key={lineIndex} className="ml-4 text-gray-700">
                  {cleanedLine}
                </li>
              );
            })}
          </ol>
        );
      }

      // Check if this is a bulleted list (starts with -, *, or •)
      const isBulletedList = lines.every(line => /^[-*•]\s/.test(line.trim())) && lines.length > 1;

      if (isBulletedList) {
        return (
          <ul key={index} className="space-y-2 list-disc list-inside text-gray-700 mb-6">
            {lines.map((line, lineIndex) => {
              const cleanedLine = line.trim().replace(/^[-*•]\s*/, '');
              return (
                <li key={lineIndex} className="ml-4 text-gray-700">
                  {cleanedLine}
                </li>
              );
            })}
          </ul>
        );
      }

      // Otherwise, it's a paragraph
      return (
        <p key={index} className="text-gray-700 leading-8 mb-6">
          {section.trim()}
        </p>
      );
    });
  };

  return (
    <>
      <Helmet>
        <title>{blogPost.title} | RASS Engineering & Construction Blog</title>
        <meta name="description" content={blogPost.excerpt} />
        <meta name="author" content={blogPost.author} />
        <link rel="canonical" href={`/blog/${blogPost.id}`} />
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
              className="prose-lg max-w-none"
            >
              <div className="text-gray-700">
                {parseContent(blogPost.content)}
              </div>
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

        {/* Previous/Next Navigation */}
        <section className="py-12 bg-gray-50 border-t">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {prevPost ? (
                <motion.button
                  onClick={() => navigate(`/blog/${prevPost.id}`)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: -10 }}
                  className="group text-left hover:bg-white p-4 rounded-lg transition-all"
                >
                  <div className="flex items-center text-[#F46A1F] font-semibold mb-2">
                    <ArrowLeft size={18} className="mr-2" />
                    Previous Article
                  </div>
                  <h4 className="text-lg font-bold text-black group-hover:text-[#F46A1F] transition-colors line-clamp-2">
                    {prevPost.title}
                  </h4>
                </motion.button>
              ) : (
                <div />
              )}

              {nextPost ? (
                <motion.button
                  onClick={() => navigate(`/blog/${nextPost.id}`)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 10 }}
                  className="group text-right hover:bg-white p-4 rounded-lg transition-all"
                >
                  <div className="flex items-center justify-end text-[#F46A1F] font-semibold mb-2">
                    Next Article
                    <ArrowRight size={18} className="ml-2" />
                  </div>
                  <h4 className="text-lg font-bold text-black group-hover:text-[#F46A1F] transition-colors line-clamp-2">
                    {nextPost.title}
                  </h4>
                </motion.button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>

        {/* Related Articles */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-12">More from {blogPost.category}</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {blogData
                .filter(post => post.category === blogPost.category && post.id !== blogPost.id)
                .slice(0, 3)
                .map((post, index) => (
                  <motion.button
                    key={post.id}
                    onClick={() => navigate(`/blog/${post.id}`)}
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
      </div>
    </>
  );
};

export default BlogDetail;