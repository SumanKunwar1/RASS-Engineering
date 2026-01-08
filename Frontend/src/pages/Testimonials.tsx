import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Testimonial {
  _id: string;
  name: string;
  position: string;
  company: string;
  testimonial: string;
  image?: string;
  rating: number;
  order: number;
  active: boolean;
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${API_URL}/testimonials`);
      
      if (response.data.success) {
        setTestimonials(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  if (loading || testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0
    })
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#F46A1F]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F46A1F]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-[#F46A1F]/10 rounded-full mb-4">
            <span className="text-[#F46A1F] font-semibold text-sm">TESTIMONIALS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            What Our <span className="text-[#F46A1F]">Clients Say</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </motion.div>

        {/* Testimonial Slider */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative min-h-[450px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="w-full"
              >
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative">
                  {/* Quote Icon */}
                  <div className="absolute -top-6 right-8 w-12 h-12 bg-[#F46A1F] rounded-full flex items-center justify-center shadow-lg">
                    <Quote className="w-6 h-6 text-white" />
                  </div>

                  {/* Main Content - Left Side (Photo & Info) + Right Side (Testimonial) */}
                  <div className="grid md:grid-cols-[300px,1fr] gap-8 items-center">
                    {/* Left Side - Photo and Details */}
                    <div className="flex flex-col items-center text-center space-y-4">
                      {/* Profile Photo */}
                      {currentTestimonial.image ? (
                        <img
                          src={currentTestimonial.image}
                          alt={currentTestimonial.name}
                          className="w-40 h-40 rounded-full object-cover border-4 border-[#F46A1F]/20 shadow-lg"
                        />
                      ) : (
                        <div className="w-40 h-40 rounded-full bg-[#F46A1F]/10 flex items-center justify-center border-4 border-[#F46A1F]/20 shadow-lg">
                          <span className="text-5xl font-bold text-[#F46A1F]">
                            {currentTestimonial.name.charAt(0)}
                          </span>
                        </div>
                      )}

                      {/* Client Details Below Photo */}
                      <div className="space-y-2">
                        <h4 className="text-2xl font-bold text-gray-900">
                          {currentTestimonial.name}
                        </h4>
                        <p className="text-gray-600 text-base">
                          {currentTestimonial.position}
                        </p>
                        <p className="text-[#F46A1F] font-semibold text-lg">
                          {currentTestimonial.company}
                        </p>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < currentTestimonial.rating
                                ? 'text-[#F46A1F] fill-[#F46A1F]'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Right Side - Testimonial Text */}
                    <div className="flex items-center">
                      <div className="space-y-4">
                        <p className="text-gray-700 text-lg md:text-xl leading-relaxed italic">
                          "{currentTestimonial.testimonial}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#F46A1F] hover:bg-[#F46A1F] hover:text-white transition-all duration-300 z-10"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#F46A1F] hover:bg-[#F46A1F] hover:text-white transition-all duration-300 z-10"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-[#F46A1F] w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#F46A1F]/10 rounded-full">
            <span className="text-sm font-semibold text-gray-700">
              {testimonials.length}+ Happy Clients sharing their experiences
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;