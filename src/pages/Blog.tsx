import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: '10 Signs Your Building Needs Waterproofing',
    excerpt: 'Learn to identify early warning signs of water damage and when to seek professional waterproofing solutions.',
    category: 'Waterproofing',
    author: 'RASS Engineering',
    date: '2024-03-15',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Understanding Structural Retrofitting: A Complete Guide',
    excerpt: 'Everything you need to know about strengthening existing structures to meet modern safety standards.',
    category: 'Retrofitting',
    author: 'RASS Engineering',
    date: '2024-03-10',
    readTime: '8 min read',
  },
  {
    id: 3,
    title: 'Epoxy vs PU Flooring: Which is Right for Your Space?',
    excerpt: 'Compare the benefits and applications of epoxy and polyurethane flooring for industrial and commercial use.',
    category: 'Flooring',
    author: 'RASS Engineering',
    date: '2024-03-05',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'The Benefits of ACP Cladding for Modern Buildings',
    excerpt: 'Discover why aluminum composite panels are becoming the preferred choice for contemporary facades.',
    category: 'Cladding',
    author: 'RASS Engineering',
    date: '2024-02-28',
    readTime: '4 min read',
  },
  {
    id: 5,
    title: 'Preventing Termite Damage: A Comprehensive Approach',
    excerpt: 'Protect your property from termites with these proven prevention and treatment strategies.',
    category: 'Anti-Termite',
    author: 'RASS Engineering',
    date: '2024-02-20',
    readTime: '5 min read',
  },
  {
    id: 6,
    title: 'Cement Pressure Grouting: Strengthening Foundations',
    excerpt: 'How high-pressure cement injection can restore and strengthen your building foundations.',
    category: 'Grouting',
    author: 'RASS Engineering',
    date: '2024-02-15',
    readTime: '7 min read',
  },
];

const Blog = () => {
  return (
    <>
      <SEO 
        title="Blog"
        description="Expert construction tips, waterproofing guides, and engineering insights from RASS Engineering's 31+ years of experience."
      />
      <Layout>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-construction-dark overflow-hidden">
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          
          <div className="section-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Our Blog
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
                Engineering Insights &
                <span className="text-primary block">Expert Tips</span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed">
                Stay updated with the latest construction industry insights, tips, and best practices.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="section-container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group glass-card overflow-hidden hover:-translate-y-2 hover:shadow-elevated transition-all duration-300"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-construction-dark to-construction-gray flex items-center justify-center">
                    <Tag className="text-primary/30" size={48} />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="text-primary font-medium">{post.category}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar size={14} />
                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <span className="flex items-center gap-1 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        Read More
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Coming Soon Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mt-16"
            >
              <p className="text-muted-foreground">
                More articles coming soon. Stay tuned for expert insights!
              </p>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Blog;
