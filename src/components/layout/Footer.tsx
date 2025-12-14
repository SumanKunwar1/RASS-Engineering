import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Facebook, Linkedin, Twitter, Instagram, ArrowUpRight } from 'lucide-react';

const LOGO_URL = 'https://res.cloudinary.com/dihev9qxc/image/upload/f_auto,q_auto/v1765519977/WhatsApp_Image_2025-12-09_at_15.04.23_99b99d02_havp7x.jpg';

const quickLinks = [
  { name: 'About Us', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

const services = [
  { name: 'Waterproofing', path: '/services#waterproofing' },
  { name: 'Structural Retrofitting', path: '/services#retrofitting' },
  { name: 'Epoxy Flooring', path: '/services#flooring' },
  { name: 'ACP Cladding', path: '/services#cladding' },
  { name: 'Metal Fabrication', path: '/services#fabrication' },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export function Footer() {
  return (
    <footer className="bg-construction-dark text-white">
      {/* Main footer */}
      <div className="section-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Company info */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img
                src={LOGO_URL}
                alt="RASS Engineering"
                className="h-16 w-auto rounded-lg"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              RASS Engineering & Construction Pvt. Ltd. - Delivering excellence in waterproofing, 
              structural retrofitting, and specialized construction solutions since 2050 B.S.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.path}>
                  <Link
                    to={service.path}
                    className="text-white/70 hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {service.name}
                    <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:977-01-5907561" className="flex items-start gap-3 text-white/70 hover:text-primary transition-colors">
                  <Phone size={18} className="mt-0.5 shrink-0" />
                  <div>
                    <div>977-01-5907561</div>
                    <div className="text-sm">9851084572, 9849792606</div>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:rass.engineering2016@gmail.com" className="flex items-start gap-3 text-white/70 hover:text-primary transition-colors">
                  <Mail size={18} className="mt-0.5 shrink-0" />
                  <span>rass.engineering2016@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <MapPin size={18} className="mt-0.5 shrink-0" />
                <span>Kathmandu, Nepal</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="section-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <p>© {new Date().getFullYear()} RASS Engineering & Construction Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
