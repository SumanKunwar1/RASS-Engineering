import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ChevronDown, Loader2, Search } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  active: boolean;
}

const categories = [
  { id: 'all', label: 'All FAQs', value: '' },
  { id: 'general', label: 'General', value: 'general' },
  { id: 'services', label: 'Services', value: 'services' },
  { id: 'pricing', label: 'Pricing', value: 'pricing' },
  { id: 'technical', label: 'Technical', value: 'technical' },
  { id: 'projects', label: 'Projects', value: 'projects' }
];

const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    filterFAQs();
  }, [faqs, activeCategory, searchQuery]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/faqs`);
      
      if (response.data.success) {
        setFaqs(response.data.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch FAQs:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const filterFAQs = () => {
    let filtered = faqs;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFaqs(filtered);
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const getCategoryLabel = (value: string) => {
    return categories.find(cat => cat.value === value)?.label || value;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#F46A1F]" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | RASS Engineering</title>
        <meta
          name="description"
          content="Find answers to common questions about RASS Engineering's construction and engineering services."
        />
        <link rel="canonical" href="/faq" />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <div className="inline-block px-4 py-2 bg-[#F46A1F]/10 rounded-full mb-6">
                <span className="text-[#F46A1F] font-semibold text-sm">HELP CENTER</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
                Frequently Asked <span className="text-[#F46A1F]">Questions</span>
              </h1>
              <p className="text-xl text-gray-600">
                Find answers to common questions about our services
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search for questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 text-lg border-2 rounded-xl"
                />
              </div>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap gap-3 mb-12"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.value)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    activeCategory === category.value
                      ? 'bg-[#F46A1F] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </motion.div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={faq._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Card className="border-2 hover:border-[#F46A1F] transition-colors">
                      <CardContent className="p-0">
                        <button
                          onClick={() => toggleFaq(faq._id)}
                          className="w-full text-left p-6 flex items-start justify-between gap-4"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-3 py-1 bg-[#F46A1F]/10 text-[#F46A1F] text-xs font-semibold rounded-full uppercase">
                                {getCategoryLabel(faq.category)}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-black">
                              {faq.question}
                            </h3>
                          </div>
                          <ChevronDown
                            size={24}
                            className={`text-gray-400 flex-shrink-0 transition-transform ${
                              openFaqId === faq._id ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        {openFaqId === faq._id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-6 pb-6"
                          >
                            <div className="pt-4 border-t">
                              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-gray-500 text-lg">
                    {searchQuery
                      ? 'No FAQs found matching your search.'
                      : 'No FAQs available in this category.'}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Still Have Questions?
              </h2>
              <p className="text-xl text-gray-300 mb-10">
                Our team is here to help. Contact us for more information.
              </p>
              <a
                href="/contact"
                className="inline-block bg-[#F46A1F] hover:bg-[#d85a15] text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105"
              >
                Contact Us
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FAQ;