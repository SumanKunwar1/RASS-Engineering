import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Project {
  _id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  image: string;
}

const Projects: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories: string[] = ['All', 'Waterproofing', 'Structural Retrofitting', 'Epoxy Flooring', 'ACP Cladding', 'Metal Fabrication', 'Expansion Joint'];

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/projects`, {
        params: selectedCategory !== 'All' ? { category: selectedCategory } : {}
      });
      setProjects(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Our Projects | RASS Engineering & Construction</title>
        <meta
          name="description"
          content="Explore our portfolio of successful construction projects including waterproofing, structural retrofitting, and specialized engineering solutions."
        />
        <link rel="canonical" href="/projects" />
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
                <span className="text-[#F46A1F] font-semibold text-sm">OUR WORK</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
                Featured <span className="text-[#F46A1F]">Projects</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Showcasing excellence in engineering and construction across Nepal
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Categories */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={`${
                    selectedCategory === category
                      ? 'bg-[#F46A1F] text-white hover:bg-[#d85a15]'
                      : 'border-gray-300 text-gray-700 hover:border-[#F46A1F] hover:text-[#F46A1F]'
                  } transition-all`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-[#F46A1F]" size={48} />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600 text-lg">{error}</p>
                <Button onClick={fetchProjects} className="mt-4 bg-[#F46A1F] hover:bg-[#d85a15]">
                  Try Again
                </Button>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">No projects found in this category.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link to={`/projects/${project._id}`}>
                      <Card className="h-full overflow-hidden border-0 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4 bg-[#F46A1F] text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {project.category}
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-black mb-3 group-hover:text-[#F46A1F] transition-colors">
                            {project.title}
                          </h3>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-600 text-sm">
                              <MapPin size={16} className="mr-2 text-[#F46A1F]" />
                              {project.location}
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                              <Calendar size={16} className="mr-2 text-[#F46A1F]" />
                              {project.year}
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {project.description}
                          </p>

                          <div className="flex items-center text-[#F46A1F] font-semibold text-sm group-hover:gap-2 transition-all">
                            View Details
                            <ArrowRight size={16} className="ml-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
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
                Ready to Start Your Project?
              </h2>
              <p className="text-xl text-gray-300 mb-10">
                Let's create something exceptional together
              </p>
              <Link to="/request-quote">
                <Button className="bg-[#F46A1F] hover:bg-[#d85a15] text-white px-10 py-6 text-lg">
                  Request a Quote
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Projects;