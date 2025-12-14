import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Building, Droplets } from 'lucide-react';

const LOGO_URL = 'https://res.cloudinary.com/dihev9qxc/image/upload/f_auto,q_auto/v1765519977/WhatsApp_Image_2025-12-09_at_15.04.23_99b99d02_havp7x.jpg';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-construction-dark overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Gradient orbs */}
        <motion.div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="section-container relative z-10 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-white"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm font-medium text-white/90 mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Trusted Since 2050 B.S.
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1 
              variants={itemVariants}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6"
            >
              <span className="text-white">31+ Years of</span>
              <br />
              <span className="text-primary">Engineering</span>
              <br />
              <span className="text-white">Excellence</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              variants={itemVariants}
              className="text-lg sm:text-xl text-white/70 mb-8 max-w-xl leading-relaxed"
            >
              Waterproofing • Structural Retrofitting • Specialized Construction Solutions
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/services">
                  View Services
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button variant="heroDark" size="lg" asChild>
                <Link to="/request-quote">
                  Request Consultation
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/10"
            >
              <div>
                <div className="text-3xl lg:text-4xl font-heading font-bold text-primary">31+</div>
                <div className="text-sm text-white/60 mt-1">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-heading font-bold text-primary">500+</div>
                <div className="text-sm text-white/60 mt-1">Projects Completed</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-heading font-bold text-primary">100%</div>
                <div className="text-sm text-white/60 mt-1">Client Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right content - Floating cards */}
          <motion.div 
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative h-[500px]">
              {/* Main logo card */}
              <motion.div
                variants={floatingVariants}
                animate="animate"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 flex items-center justify-center shadow-elevated"
              >
                <img 
                  src={LOGO_URL} 
                  alt="RASS Engineering Logo" 
                  className="w-full h-full object-contain rounded-2xl"
                />
              </motion.div>

              {/* Floating service cards */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute top-0 left-0 glass-card-dark p-4 flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Droplets className="text-primary" size={24} />
                </div>
                <div>
                  <div className="text-white font-medium">Waterproofing</div>
                  <div className="text-white/60 text-sm">Expert Solutions</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute top-20 right-0 glass-card-dark p-4 flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Building className="text-primary" size={24} />
                </div>
                <div>
                  <div className="text-white font-medium">Retrofitting</div>
                  <div className="text-white/60 text-sm">Structural Experts</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute bottom-10 right-10 glass-card-dark p-4 flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Shield className="text-primary" size={24} />
                </div>
                <div>
                  <div className="text-white font-medium">Quality Assured</div>
                  <div className="text-white/60 text-sm">ISO Certified</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
