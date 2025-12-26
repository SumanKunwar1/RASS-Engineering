import React, { FC, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Linkedin, Twitter, ChevronUp } from 'lucide-react';
import { companyInfo } from '../../data/mockData';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Service {
  _id: string;
  title: string;
  slug: string;
}

const Footer: FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const navigate = useNavigate();

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/services`);
        setServices(response.data.data || []);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      }
    };

    fetchServices();
  }, []);

  // Calculate number of services to show
  const quickLinksCount = 7; // About, Services, Projects, Blog, Contact, Privacy, Terms
  const servicesToShow = Math.min(services.length, quickLinksCount);
  const footerServices = services.slice(0, servicesToShow);

  // Function to handle service click
  const handleServiceClick = (serviceSlug: string) => {
    // Navigate to services page with hash
    navigate(`/services#${serviceSlug}`);
    // Scroll to top first, then to element
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const element = document.getElementById(serviceSlug);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1F1F1F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <img
              src={companyInfo.logo}
              alt="RASS Engineering Logo"
              className="h-12 w-auto mb-4 bg-white/10 p-2 rounded"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              {companyInfo.tagline}. Professional construction and engineering solutions provider.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-[#F46A1F] transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-[#F46A1F] transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-[#F46A1F] transition-colors text-sm">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-[#F46A1F] transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[#F46A1F] transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-[#F46A1F] transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-[#F46A1F] transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            {footerServices.length > 0 ? (
              <ul className="space-y-2">
                {footerServices.map((service) => (
                  <li key={service._id} className="text-gray-400 text-sm">
                    <button 
                      onClick={() => handleServiceClick(service.slug)}
                      className="hover:text-[#F46A1F] transition-colors text-left w-full py-0.5"
                    >
                      {service.title}
                    </button>
                  </li>
                ))}
                
                {/* Show "View All Services" link if there are more services than shown */}
                {services.length > servicesToShow && (
                  <li className="pt-2">
                    <Link 
                      to="/services"
                      onClick={scrollToTop}
                      className="inline-flex items-center text-[#F46A1F] hover:text-[#d85a15] text-sm font-medium transition-colors group"
                    >
                      View All Services 
                      <ChevronUp 
                        size={16} 
                        className="ml-1 transform rotate-90 group-hover:translate-x-1 transition-transform" 
                      />
                    </Link>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">Loading services...</p>
            )}
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-[#F46A1F] mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="text-gray-400">Tel: {companyInfo.phone}</div>
                  <div className="text-gray-400">Mob: {companyInfo.mobile.join(', ')}</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-[#F46A1F] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm break-all">{companyInfo.email}</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-[#F46A1F] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">{companyInfo.address}</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61579130197121#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#F46A1F] transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-[#F46A1F] transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-[#F46A1F] transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 RASS Engineering & Construction Pvt. Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;