import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, User, CheckCircle2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { projectsData } from '../data/mockData';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = projectsData.find(p => p.id === parseInt(id || '0'));
  
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

  // Gallery display settings
  const displayedImages = project.gallery.slice(0, 4);
  const remainingImages = Math.max(0, project.gallery.length - 4);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const handleViewAllGallery = () => {
    setCurrentImageIndex(0);
    setIsGalleryOpen(true);
    setIsLightboxOpen(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.gallery.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

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
                    {displayedImages.map((image, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="relative h-64 rounded-xl overflow-hidden group cursor-pointer"
                        onClick={() => handleImageClick(index)}
                      >
                        <img
                          src={image}
                          alt={`${project.title} ${index + 1}`}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 13H7" />
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* +X More Images */}
                    {remainingImages > 0 && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative h-64 rounded-xl overflow-hidden group cursor-pointer bg-gradient-to-br from-[#F46A1F] to-[#d85a15]"
                        onClick={handleViewAllGallery}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-6xl font-bold text-white mb-2">
                              +{remainingImages}
                            </div>
                            <p className="text-white text-lg font-semibold">More Images</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </motion.div>
                    )}
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={handleCloseLightbox}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseLightbox}
              className="absolute top-6 right-6 text-white hover:text-[#F46A1F] transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={project.gallery[currentImageIndex]}
                alt={`${project.title} ${currentImageIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              {/* Navigation Buttons */}
              {project.gallery.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviousImage();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#F46A1F] hover:bg-[#d85a15] text-white p-3 rounded-full transition-all z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#F46A1F] hover:bg-[#d85a15] text-white p-3 rounded-full transition-all z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {currentImageIndex + 1} / {project.gallery.length}
                  </div>
                </>
              )}
            </motion.div>

            {/* Thumbnail Navigation */}
            {project.gallery.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-2"
              >
                {project.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-[#F46A1F] scale-110'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectDetail;