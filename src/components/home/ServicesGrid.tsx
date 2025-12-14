import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Droplets, 
  Building, 
  Layers, 
  Shield, 
  Bug, 
  Paintbrush, 
  LayoutGrid, 
  Frame,
  ArrowRight
} from 'lucide-react';

const services = [
  {
    icon: Droplets,
    title: 'Waterproofing Treatment',
    description: 'Advanced waterproofing solutions for basements, roofs, and structures using cutting-edge materials.',
    link: '/services#waterproofing',
  },
  {
    icon: Layers,
    title: 'Cement Pressure Grouting',
    description: 'High-pressure cement injection to strengthen foundations and seal structural cracks.',
    link: '/services#grouting',
  },
  {
    icon: Frame,
    title: 'Expansion Joint Treatment',
    description: 'Professional expansion joint sealing and repair for buildings and infrastructure.',
    link: '/services#expansion',
  },
  {
    icon: Building,
    title: 'Structural Retrofitting',
    description: 'Strengthening and upgrading existing structures to meet modern safety standards.',
    link: '/services#retrofitting',
  },
  {
    icon: Paintbrush,
    title: 'Epoxy & PU Flooring',
    description: 'Durable, chemical-resistant flooring solutions for industrial and commercial spaces.',
    link: '/services#flooring',
  },
  {
    icon: LayoutGrid,
    title: 'ACP & HPL Cladding',
    description: 'Modern facade solutions with aluminum composite and high-pressure laminate panels.',
    link: '/services#cladding',
  },
  {
    icon: Shield,
    title: 'Structural Glazing',
    description: 'Premium glass facade systems with aluminum framework for contemporary buildings.',
    link: '/services#glazing',
  },
  {
    icon: Bug,
    title: 'Anti-Termite Treatment',
    description: 'Comprehensive termite prevention and treatment to protect your property.',
    link: '/services#antitermite',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function ServicesGrid() {
  return (
    <section className="py-20 lg:py-32 bg-muted/50">
      <div className="section-container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Our Expertise
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Specialized Construction
            <span className="text-primary block">Services</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive engineering solutions tailored to your specific needs, 
            delivered with precision and backed by decades of expertise.
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
            >
              <Link
                to={service.link}
                className="group block h-full glass-card p-6 hover:shadow-elevated hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <service.icon className="text-primary group-hover:text-primary-foreground transition-colors" size={28} />
                </div>
                
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {service.description}
                </p>

                <div className="flex items-center text-primary font-medium text-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Learn More
                  <ArrowRight size={16} className="ml-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View all services button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-orange hover:shadow-orange-lg hover:-translate-y-1 transition-all duration-300"
          >
            View All Services
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
