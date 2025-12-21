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

  // Enhanced function to parse content with image and media support
  const parseContent = (content: string) => {
    const blocks = content.split('\n\n').filter(block => block.trim());
    
    return blocks.map((block, index) => {
      const trimmedBlock = block.trim();
      
      // Check for image syntax: [image:url:alignment:caption]
      // alignment can be: left, center, right, full
      const imageMatch = trimmedBlock.match(/^\[image:([^\]]+):([^\]]+):([^\]]*)\]$/);
      if (imageMatch) {
        const [, url, alignment, caption] = imageMatch;
        
        const alignmentClasses = {
          left: 'float-left mr-6 mb-6 w-full md:w-1/2',
          right: 'float-right ml-6 mb-6 w-full md:w-1/2',
          center: 'mx-auto my-8 w-full md:w-3/4',
          full: 'w-full my-8'
        };
        
        const containerClass = alignmentClasses[alignment as keyof typeof alignmentClasses] || alignmentClasses.center;
        
        return (
          <div key={index} className={containerClass}>
            <img
              src={url.trim()}
              alt={caption || 'Blog image'}
              className="w-full rounded-lg shadow-lg"
            />
            {caption && (
              <p className="text-sm text-gray-600 italic mt-2 text-center">
                {caption}
              </p>
            )}
          </div>
        );
      }
      
      // Check for image gallery: [gallery:url1,url2,url3:caption]
      const galleryMatch = trimmedBlock.match(/^\[gallery:([^\]]+):([^\]]*)\]$/);
      if (galleryMatch) {
        const [, urls, caption] = galleryMatch;
        const imageUrls = urls.split(',').map(url => url.trim());
        
        const gridClass = imageUrls.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3';
        
        return (
          <div key={index} className="my-8">
            <div className={`grid ${gridClass} gap-4`}>
              {imageUrls.map((url, imgIndex) => (
                <img
                  key={imgIndex}
                  src={url}
                  alt={`Gallery image ${imgIndex + 1}`}
                  className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
                />
              ))}
            </div>
            {caption && (
              <p className="text-sm text-gray-600 italic mt-3 text-center">
                {caption}
              </p>
            )}
          </div>
        );
      }
      
      // Check for quote block: [quote:text:author]
      const quoteMatch = trimmedBlock.match(/^\[quote:([^\]]+):([^\]]*)\]$/);
      if (quoteMatch) {
        const [, text, author] = quoteMatch;
        return (
          <blockquote key={index} className="my-8 pl-6 border-l-4 border-[#F46A1F] bg-gray-50 p-6 rounded-r-lg">
            <p className="text-xl text-gray-800 italic leading-relaxed mb-2">
              "{text.trim()}"
            </p>
            {author && (
              <footer className="text-gray-600 font-semibold">
                — {author.trim()}
              </footer>
            )}
          </blockquote>
        );
      }
      
      // Check for callout/info box: [callout:title:content]
      const calloutMatch = trimmedBlock.match(/^\[callout:([^\]]+):([^\]]+)\]$/);
      if (calloutMatch) {
        const [, title, content] = calloutMatch;
        return (
          <div key={index} className="my-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <h4 className="text-lg font-bold text-blue-900 mb-2">{title.trim()}</h4>
            <p className="text-gray-700 leading-7">{content.trim()}</p>
          </div>
        );
      }

      // Check for video embed: [video:url:caption]
      const videoMatch = trimmedBlock.match(/^\[video:([^\]]+):([^\]]*)\]$/);
      if (videoMatch) {
        const [, url, caption] = videoMatch;
        const videoId = url.includes('youtube.com') || url.includes('youtu.be') 
          ? url.split(/v=|\//).pop()?.split('&')[0]
          : null;
        
        if (videoId) {
          return (
            <div key={index} className="my-8">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="Video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {caption && (
                <p className="text-sm text-gray-600 italic mt-3 text-center">
                  {caption}
                </p>
              )}
            </div>
          );
        }
      }
      
      // Regular content parsing
      const lines = block.split('\n').map(line => line.trim()).filter(line => line);
      
      // Single line processing
      if (lines.length === 1) {
        const line = lines[0];
        
        // Check for headers
        if (line.startsWith('# ')) {
          return (
            <h2 key={index} className="text-3xl font-bold text-black mt-12 mb-6">
              {line.substring(2)}
            </h2>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h3 key={index} className="text-2xl font-bold text-black mt-10 mb-5">
              {line.substring(3)}
            </h3>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h4 key={index} className="text-xl font-bold text-black mt-8 mb-4">
              {line.substring(4)}
            </h4>
          );
        }
        
        // Check if it's a natural header (ends with colon)
        const isHeader = (line.endsWith(':') || line.endsWith('?')) && 
                        line.length < 100 && 
                        !line.endsWith('.');
        
        if (isHeader) {
          return (
            <h3 key={index} className="text-xl font-bold text-black mt-8 mb-4">
              {line}
            </h3>
          );
        }
        
        // Regular paragraph
        return (
          <p key={index} className="text-gray-700 leading-8 mb-6">
            {line}
          </p>
        );
      }
      
      // Multiple lines - check for lists
      const isNumberedList = lines.every(line => /^\d+[\.)]\s/.test(line));
      
      if (isNumberedList) {
        return (
          <ol key={index} className="space-y-3 list-decimal list-outside ml-6 text-gray-700 mb-6">
            {lines.map((line, lineIndex) => {
              const cleanedLine = line.replace(/^\d+[\.)]\s*/, '');
              return (
                <li key={lineIndex} className="pl-2 leading-7">
                  {cleanedLine}
                </li>
              );
            })}
          </ol>
        );
      }
      
      const isBulletedList = lines.every(line => /^[-*•]\s/.test(line));
      
      if (isBulletedList) {
        return (
          <ul key={index} className="space-y-3 list-disc list-outside ml-6 text-gray-700 mb-6">
            {lines.map((line, lineIndex) => {
              const cleanedLine = line.replace(/^[-*•]\s*/, '');
              return (
                <li key={lineIndex} className="pl-2 leading-7">
                  {cleanedLine}
                </li>
              );
            })}
          </ul>
        );
      }
      
      // Check if first line is a header
      const firstLineIsHeader = lines[0].endsWith(':') && lines[0].length < 100;
      
      if (firstLineIsHeader && lines.length > 1) {
        const remainingLines = lines.slice(1);
        const remainingIsBulletList = remainingLines.every(line => /^[-*•]\s/.test(line));
        const remainingIsNumberedList = remainingLines.every(line => /^\d+[\.)]\s/.test(line));
        
        if (remainingIsBulletList) {
          return (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-bold text-black mt-8 mb-4">
                {lines[0]}
              </h3>
              <ul className="space-y-3 list-disc list-outside ml-6 text-gray-700">
                {remainingLines.map((line, lineIndex) => {
                  const cleanedLine = line.replace(/^[-*•]\s*/, '');
                  return (
                    <li key={lineIndex} className="pl-2 leading-7">
                      {cleanedLine}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        }
        
        if (remainingIsNumberedList) {
          return (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-bold text-black mt-8 mb-4">
                {lines[0]}
              </h3>
              <ol className="space-y-3 list-decimal list-outside ml-6 text-gray-700">
                {remainingLines.map((line, lineIndex) => {
                  const cleanedLine = line.replace(/^\d+[\.)]\s*/, '');
                  return (
                    <li key={lineIndex} className="pl-2 leading-7">
                      {cleanedLine}
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        }
        
        return (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-bold text-black mt-8 mb-4">
              {lines[0]}
            </h3>
            {remainingLines.map((line, lineIndex) => (
              <p key={lineIndex} className="text-gray-700 leading-8 mb-3">
                {line}
              </p>
            ))}
          </div>
        );
      }
      
      // Multiple paragraphs
      return (
        <div key={index} className="mb-6">
          {lines.map((line, lineIndex) => (
            <p key={lineIndex} className="text-gray-700 leading-8 mb-3">
              {line}
            </p>
          ))}
        </div>
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