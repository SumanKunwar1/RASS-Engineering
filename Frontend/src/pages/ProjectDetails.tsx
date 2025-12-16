import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, User, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { projectsData } from '../data/mockData';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = projectsData.find(p => p.id === parseInt(id || '0'));

  if (!project) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Project Not Found</h1>
          <Link to="/projects">
            <Button className="bg-[#F46A1F] hover:bg-[#d85a15] text-white">
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project.title} | RASS Engineering</title>
        <meta name="description" content={project.description} />
        <link rel="canonical" href={`/projects/${project.id}`} />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Image */}
        <section className="pt-24 bg-black">
          <div className="relative h-[500px] overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            
            {/* Breadcrumb */}
            <div className="absolute top-8 left-0 right-0">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/projects" className="flex items-center text-white hover:text-[#F46A1F] transition-colors">
                  <ArrowLeft size={20} className="mr-2" />
                  Back to Projects
                </Link>
              </div>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-12 left-0 right-0">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <span className="inline-block px-4 py-2 bg-[#F46A1F] text-white rounded-full text-sm font-semibold mb-4">
                    {project.category}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    {project.title}
                  </h1>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Info */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <h2 className="text-3xl font-bold text-black mb-4">Project Overview</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {project.description}
                  </p>
                </motion.div>

                {/* Scope of Work */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  <h3 className="text-2xl font-bold text-black mb-4">Scope of Work</h3>
                  <ul className="space-y-2">
                    {project.scope.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle2 className="text-[#F46A1F] flex-shrink-0 mt-0.5" size={20} />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Challenge */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="bg-[#F4F4F4] p-6 rounded-2xl"
                >
                  <h3 className="text-2xl font-bold text-black mb-3">The Challenge</h3>
                  <p className="text-gray-600 leading-relaxed">{project.challenges}</p>
                </motion.div>

                {/* Solution */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="bg-[#F4F4F4] p-6 rounded-2xl"
                >
                  <h3 className="text-2xl font-bold text-black mb-3">Our Solution</h3>
                  <p className="text-gray-600 leading-relaxed">{project.solution}</p>
                </motion.div>

                {/* Results */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  <h3 className="text-2xl font-bold text-black mb-4">Results Achieved</h3>
                  <ul className="space-y-2">
                    {project.results.map((result, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle2 className="text-[#F46A1F] flex-shrink-0 mt-0.5" size={20} />
                        <span className="text-gray-600">{result}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Gallery */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                >
                  <h3 className="text-2xl font-bold text-black mb-6">Project Gallery</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {project.gallery.map((image, index) => (
                      <div key={index} className="relative h-64 rounded-xl overflow-hidden group">
                        <img
                          src={image}
                          alt={`${project.title} ${index + 1}`}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Project Details Card */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                  className="bg-[#F4F4F4] p-6 rounded-2xl sticky top-28"
                >
                  <h3 className="text-xl font-bold text-black mb-6">Project Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="text-[#F46A1F] flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-semibold text-black">{project.location}</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Calendar className="text-[#F46A1F] flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <div className="text-sm text-gray-500">Year</div>
                        <div className="font-semibold text-black">{project.year}</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <User className="text-[#F46A1F] flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <div className="text-sm text-gray-500">Client</div>
                        <div className="font-semibold text-black">{project.client}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-300">
                    <Link to="/request-quote" className="block">
                      <Button className="w-full bg-[#F46A1F] hover:bg-[#d85a15] text-white py-3">
                        Start Your Project
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProjectDetail;