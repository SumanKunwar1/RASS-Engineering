import React, { FC, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { companyInfo } from '../../data/mockData';
import { servicesData } from '../../data/serviceData';
import { Button } from '../ui/button';

interface NavLink {
  name: string;
  path: string;
}

const Navbar: FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState<boolean>(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside or after a delay
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.services-dropdown-container')) {
        setIsServicesDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const navLinks: NavLink[] = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleServiceClick = (serviceId: string) => {
    setIsServicesDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
    
    // If we're already on the services page, scroll to the service
    if (location.pathname === '/services') {
      const element = document.getElementById(serviceId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 0);
      }
    } else {
      // Navigate to services page with hash
      window.location.href = `/services#${serviceId}`;
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={companyInfo.logo}
              alt="RASS Engineering Logo"
              className="h-14 w-auto object-contain"
            />
            <div className="hidden md:block">
              <div className="text-lg font-bold text-black leading-tight">RASS Engineering</div>
              <div className="text-xs text-gray-600">32+ Years of Excellence</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Home and About links */}
            {navLinks.slice(0, 2).map((link: NavLink) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'text-[#F46A1F] bg-[#F46A1F]/10'
                    : 'text-gray-700 hover:text-[#F46A1F] hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Services with Integrated Dropdown */}
            <div 
              className="services-dropdown-container relative group"
              onMouseEnter={() => setIsServicesDropdownOpen(true)}
              onMouseLeave={() => setIsServicesDropdownOpen(false)}
            >
              {/* Services Link */}
              <Link
                to="/services"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  location.pathname === '/services'
                    ? 'text-[#F46A1F] bg-[#F46A1F]/10'
                    : 'text-gray-700 hover:text-[#F46A1F] hover:bg-gray-50'
                }`}
              >
                Services
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    isServicesDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </Link>

              {/* Dropdown Menu */}
              {isServicesDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                  {servicesData.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceClick(service.id)}
                      className="w-full text-left px-5 py-4 hover:bg-[#F46A1F]/10 transition-colors border-b border-gray-100 last:border-b-0 flex items-start gap-3 group"
                    >
                      <span className="text-2xl mt-1">{service.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 group-hover:text-[#F46A1F] transition-colors text-sm">
                          {service.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {service.subServices.length} specialized services
                        </p>
                      </div>
                      <svg
                        className="w-4 h-4 text-[#F46A1F] opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Projects, Blog, and Contact links */}
            {navLinks.slice(2).map((link: NavLink) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'text-[#F46A1F] bg-[#F46A1F]/10'
                    : 'text-gray-700 hover:text-[#F46A1F] hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link to="/request-quote">
              <Button className="bg-[#F46A1F] hover:bg-[#d85a15] text-white px-6 py-2 transition-colors">
                Request Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-white border-t"
        >
          <div className="px-4 py-4 space-y-2">
            {/* Home and About links */}
            {navLinks.slice(0, 2).map((link: NavLink) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'text-[#F46A1F] bg-[#F46A1F]/10'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Services */}
            <Link
              to="/services"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/services'
                  ? 'text-[#F46A1F] bg-[#F46A1F]/10'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Services
            </Link>

            {/* Mobile Services Submenu */}
            <div className="pl-4 border-l-2 border-gray-200">
              <button
                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
              >
                View All Services
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    isMobileServicesOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isMobileServicesOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-1"
                >
                  {servicesData.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceClick(service.id)}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-[#F46A1F]/10 hover:text-[#F46A1F] transition-all flex items-start gap-2"
                    >
                      <span className="text-lg">{service.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium">{service.title}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Projects, Blog, Contact links */}
            {navLinks.slice(2).map((link: NavLink) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'text-[#F46A1F] bg-[#F46A1F]/10'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/request-quote"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block"
            >
              <Button className="w-full bg-[#F46A1F] hover:bg-[#d85a15] text-white py-3">
                Request Quote
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;