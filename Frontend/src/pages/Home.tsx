import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Mail, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { servicesData, whyChooseUsData, companyInfo } from '../data/mockData';

const Home: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroBannerImages = [
    "https://res.cloudinary.com/dihev9qxc/image/upload/v1766306898/WhatsApp_Image_2025-12-21_at_14.10.49_itbaq8.jpg",
    "https://res.cloudinary.com/dihev9qxc/image/upload/v1766306898/WhatsApp_Image_2025-12-21_at_14.10.50_ihyboi.jpg",
    "https://res.cloudinary.com/dihev9qxc/image/upload/v1766306898/WhatsApp_Image_2025-12-21_at_14.10.50_1_ifq2a2.jpg"
  ];

  // Auto-scroll carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroBannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroBannerImages.length]);

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + heroBannerImages.length) % heroBannerImages.length);
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroBannerImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <Helmet>
        <title>RASS Engineering | Construction & Engineering Experts</title>
        <meta
          name="description"
          content="RASS Engineering & Construction Pvt. Ltd. offers professional construction and specialized engineering solutions with 31+ years of expertise."
        />
        <link rel="canonical" href="/" />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-block px-4 py-2 bg-[#F46A1F]/10 rounded-full mb-6">
                  <span className="text-[#F46A1F] font-semibold text-sm">Since 2050 B.S.</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight mb-6">
                  32+ Years of
                  <span className="block text-[#F46A1F]">Engineering Excellence</span>
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Specialized Construction Solutions & Engineering Services
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/services">
                    <Button className="bg-[#F46A1F] hover:bg-[#d85a15] text-white px-8 py-6 text-lg transition-all hover:scale-105">
                      View Services
                      <ArrowRight className="ml-2" size={20} />
                    </Button>
                  </Link>
                  <Link to="/request-quote">
                    <Button variant="outline" className="border-2 border-black text-black px-8 py-6 text-lg hover:bg-black hover:text-white transition-all">
                      Request Consultation
                    </Button>
                  </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6 mt-12">
                  <div>
                    <div className="text-3xl font-bold text-[#F46A1F]">32+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#F46A1F]">500+</div>
                    <div className="text-sm text-gray-600">Projects Completed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#F46A1F]">100%</div>
                    <div className="text-sm text-gray-600">Client Satisfaction</div>
                  </div>
                </div>
              </motion.div>

              {/* Right Image Carousel */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                  {/* Image Container with fade transition */}
                  <div className="relative h-[500px] overflow-hidden">
                    {heroBannerImages.map((image, index) => (
                      <motion.img
                        key={index}
                        src={image}
                        alt={`Construction Banner ${index + 1}`}
                        className="absolute w-full h-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    ))}
                  </div>

                  {/* Previous Button */}
                  <button
                    onClick={goToPreviousImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={goToNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Floating Card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#F46A1F] rounded-full flex items-center justify-center">
                        <CheckCircle2 className="text-white" size={24} />
                      </div>
                      <div>
                        <div className="font-bold text-black">Quality Assured</div>
                        <div className="text-sm text-gray-600">Professional Services</div>
                      </div>
                    </div>
                  </div>

                  {/* Image Indicators/Dots */}
                  <div className="absolute bottom-28 left-0 right-0 flex justify-center gap-2 z-20">
                    {heroBannerImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? 'bg-white w-8'
                            : 'bg-white/50 w-3 hover:bg-white/75'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#F46A1F]/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#F46A1F]/20 rounded-full blur-3xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Snapshot */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <div>
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
                  alt="About RASS Engineering"
                  className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
                />
              </div>

              <div>
                <div className="text-[#F46A1F] font-semibold mb-3">ABOUT US</div>
                <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                  Building Trust Since 2050 B.S.
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Under the visionary leadership of <strong>{companyInfo.managingDirector.name}</strong>,
                  RASS Engineering has been at the forefront of specialized construction solutions for over
                  three decades.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We combine advanced technologies with time-tested engineering principles to deliver exceptional 
                  results that stand the test of time.
                </p>
                <Link to="/about">
                  <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3 transition-colors">
                    Read More
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core Services Grid */}
        <section className="py-20 bg-[#F4F4F4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="text-[#F46A1F] font-semibold mb-3">OUR SERVICES</div>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                Specialized Construction Solutions
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Comprehensive engineering services tailored to your specific needs
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesData.map((service, index) => {
                const IconComponent = Icons[service.icon as keyof typeof Icons] as React.ComponentType<{ className?: string; size?: number }>;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white rounded-2xl overflow-hidden group">
                      <CardContent className="p-6">
                        <div className="w-14 h-14 bg-[#F46A1F]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#F46A1F] transition-colors">
                          <IconComponent className="text-[#F46A1F] group-hover:text-white transition-colors" size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-3">{service.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {service.description}
                        </p>
                        <Link
                          to={`/services#${service.id}`}
                          className="text-[#F46A1F] font-semibold text-sm flex items-center hover:gap-2 transition-all"
                        >
                          Learn More
                          <ArrowRight size={16} className="ml-1" />
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link to="/services">
                <Button className="bg-[#F46A1F] hover:bg-[#d85a15] text-white px-8 py-3">
                  View All Services
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="text-[#F46A1F] font-semibold mb-3">WHY CHOOSE US</div>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                Engineering Excellence You Can Trust
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {whyChooseUsData.map((item, index) => {
                const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ComponentType<{ className?: string; size?: number }>;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-[#F46A1F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="text-[#F46A1F]" size={32} />
                    </div>
                    <h3 className="font-bold text-black mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-black text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
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
                Get a free site inspection and consultation from our expert engineers
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a href={`tel:${companyInfo.phone}`} className="flex items-center space-x-3 text-lg">
                  <div className="w-12 h-12 bg-[#F46A1F] rounded-full flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-400">Call Us</div>
                    <div className="font-semibold">{companyInfo.phone}</div>
                  </div>
                </a>

                <a href={`mailto:${companyInfo.email}`} className="flex items-center space-x-3 text-lg">
                  <div className="w-12 h-12 bg-[#F46A1F] rounded-full flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-400">Email Us</div>
                    <div className="font-semibold truncate">{companyInfo.email}</div>
                  </div>
                </a>
              </div>

              <div className="mt-10">
                <Link to="/request-quote">
                  <Button className="bg-[#F46A1F] hover:bg-[#d85a15] text-white px-10 py-6 text-lg transition-all hover:scale-105">
                    Get Free Site Inspection
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;