import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { servicesData } from '../data/mockData';
import { CheckCircle2 } from 'lucide-react';

const Services: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

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
              const IconComponent = Icons[service.icon as keyof typeof Icons] as React.ComponentType<{ className?: string; size?: number }>;
              const isEven = index % 2 === 0;

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
                  <div className={`grid lg:grid-cols-2 gap-12 items-center ${
                    isEven ? '' : 'lg:grid-flow-dense'
                  }`}>
                    {/* Image */}
                    <div className={isEven ? '' : 'lg:col-start-2'}>
                      <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className={isEven ? '' : 'lg:col-start-1 lg:row-start-1'}>
                      <div className="w-16 h-16 bg-[#F46A1F]/10 rounded-xl flex items-center justify-center mb-6">
                        <IconComponent className="text-[#F46A1F]" size={32} />
                      </div>

                      <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                        {service.title}
                      </h2>

                      <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        {service.description}
                      </p>

                      {/* Benefits */}
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-black mb-3">Key Benefits</h3>
                        <ul className="space-y-2">
                          {service.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start space-x-3">
                              <CheckCircle2 className="text-[#F46A1F] flex-shrink-0 mt-0.5" size={20} />
                              <span className="text-gray-600">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Applications */}
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-black mb-3">Applications</h3>
                        <div className="flex flex-wrap gap-2">
                          {service.applications.map((app, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-[#F4F4F4] text-gray-700 rounded-full text-sm"
                            >
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link to="/request-quote">
                        <Button className="bg-[#F46A1F] hover:bg-[#d85a15] text-white px-6 py-3">
                          Request This Service
                        </Button>
                      </Link>
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
                <Button className="bg-[#F46A1F] hover:bg-[#d85a15] text-white px-10 py-6 text-lg">
                  Contact Our Team
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Services;