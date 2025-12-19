import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { servicesData } from '../data/serviceData';

const Services: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleSubServiceClick = (blogId: number) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <>
      <Helmet>
        <title>Our Services | RASS Engineering & Construction</title>
        <meta
          name="description"
          content="Explore our comprehensive construction and engineering services."
        />
        <link rel="canonical" href="/services" />
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
                <span className="text-[#F46A1F] font-semibold text-sm">WHAT WE DO</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
                Our <span className="text-[#F46A1F]">Services</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive construction and engineering solutions backed by 31+ years of expertise
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Detail Sections */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {servicesData.map((service, index) => {
              return (
                <motion.div
                  key={service.id}
                  id={service.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="mb-24 scroll-mt-24"
                >
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div>
                      <div className={`w-16 h-16 bg-[#F46A1F]/10 rounded-xl flex items-center justify-center mb-6 text-3xl`}>
                        {service.icon}
                      </div>

                      <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                        {service.title}
                      </h2>

                      <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        {service.description}
                      </p>

                      {/* Sub Services - Clickable List */}
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-black mb-4">Our Specialized Services</h3>
                        <ul className="space-y-3">
                          {service.subServices.map((subService, idx) => (
                            <li 
                              key={idx}
                              onClick={() => handleSubServiceClick(subService.blogId)}
                              className="flex items-start space-x-3 cursor-pointer group"
                            >
                              <div className="w-6 h-6 rounded-full bg-[#F46A1F]/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#F46A1F]/40 transition-colors">
                                <span className="text-[#F46A1F] font-semibold text-sm">{String.fromCharCode(97 + idx)}</span>
                              </div>
                              <span className="text-gray-700 group-hover:text-[#F46A1F] transition-colors group-hover:font-semibold">
                                {subService.title}
                              </span>
                              <div className="flex-1" />
                              <div className="text-[#F46A1F] opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Applications */}
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-black mb-3">Applications</h3>
                        <div className="flex flex-wrap gap-2">
                          {service.applications.map((app, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-[#F4F4F4] text-gray-700 rounded-full text-sm hover:bg-[#F46A1F] hover:text-white transition-colors"
                            >
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link to="/request-quote">
                        <button className="bg-[#F46A1F] hover:bg-[#d85a15] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                          Request This Service
                        </button>
                      </Link>
                    </div>

                    {/* Image/Icon Display */}
                    <div className="lg:col-start-2">
                      <div className="relative rounded-2xl overflow-hidden shadow-xl group h-[400px]">
                        <div className={`w-full h-full bg-gradient-to-br ${service.gradient} flex items-center justify-center`}>
                          <div className="text-center">
                            <div className="text-8xl mb-4">{service.icon}</div>
                            <p className="text-white text-lg font-semibold px-4">{service.title}</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
                Need a Custom Solution?
              </h2>
              <p className="text-xl text-gray-300 mb-10">
                We provide tailored engineering solutions for your unique requirements
              </p>
              <Link to="/contact">
                <button className="bg-[#F46A1F] hover:bg-[#d85a15] text-white px-10 py-6 text-lg rounded-lg font-semibold transition-colors">
                  Contact Our Team
                </button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Services;