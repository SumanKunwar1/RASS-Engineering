import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
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
  Wrench,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const services = [
  {
    id: 'waterproofing',
    icon: Droplets,
    title: 'Waterproofing Treatment',
    description: 'Comprehensive waterproofing solutions for basements, roofs, bathrooms, and building structures using advanced materials and techniques.',
    benefits: ['Long-lasting protection', 'Prevents structural damage', 'Reduces maintenance costs', 'Eco-friendly solutions'],
    applications: ['Basements', 'Terraces & Roofs', 'Bathrooms', 'Water Tanks', 'Swimming Pools'],
  },
  {
    id: 'grouting',
    icon: Layers,
    title: 'Cement Pressure Grouting',
    description: 'High-pressure cement injection technology to strengthen foundations, fill voids, and seal cracks in concrete structures.',
    benefits: ['Strengthens foundations', 'Seals structural cracks', 'Prevents water ingress', 'Cost-effective repair'],
    applications: ['Foundation repair', 'Concrete structures', 'Dams & Tunnels', 'Underground structures'],
  },
  {
    id: 'expansion',
    icon: Frame,
    title: 'Expansion Joint Treatment',
    description: 'Professional expansion joint sealing and repair services for buildings, bridges, and infrastructure projects.',
    benefits: ['Prevents water damage', 'Accommodates movement', 'Extends joint lifespan', 'Maintains aesthetics'],
    applications: ['Buildings', 'Bridges', 'Parking structures', 'Industrial floors'],
  },
  {
    id: 'retrofitting',
    icon: Building,
    title: 'Structural Retrofitting',
    description: 'Strengthening and upgrading existing structures to meet modern safety standards and extend building life.',
    benefits: ['Earthquake resistance', 'Extended building life', 'Cost vs reconstruction', 'Minimal disruption'],
    applications: ['Historic buildings', 'Commercial structures', 'Residential buildings', 'Industrial facilities'],
  },
  {
    id: 'antitermite',
    icon: Bug,
    title: 'Anti-Termite Treatment',
    description: 'Comprehensive termite prevention and treatment solutions to protect your property from termite infestation.',
    benefits: ['Complete protection', 'Long-term effectiveness', 'Safe for occupants', 'Warranty included'],
    applications: ['New construction', 'Existing buildings', 'Wooden structures', 'Furniture protection'],
  },
  {
    id: 'flooring',
    icon: Paintbrush,
    title: 'Epoxy & PU Flooring',
    description: 'Durable, chemical-resistant flooring solutions for industrial, commercial, and residential spaces.',
    benefits: ['Chemical resistance', 'Easy maintenance', 'Seamless finish', 'Customizable colors'],
    applications: ['Factories', 'Warehouses', 'Hospitals', 'Parking areas', 'Commercial spaces'],
  },
  {
    id: 'cladding',
    icon: LayoutGrid,
    title: 'ACP & HPL Cladding',
    description: 'Modern facade solutions with aluminum composite panels and high-pressure laminate for contemporary buildings.',
    benefits: ['Weather resistance', 'Modern aesthetics', 'Easy installation', 'Low maintenance'],
    applications: ['Commercial buildings', 'Offices', 'Retail spaces', 'Residential exteriors'],
  },
  {
    id: 'glazing',
    icon: Shield,
    title: 'Structural Glazing & Aluminum Works',
    description: 'Premium glass facade systems with aluminum framework for contemporary, energy-efficient buildings.',
    benefits: ['Natural lighting', 'Energy efficiency', 'Modern appearance', 'Sound insulation'],
    applications: ['Office buildings', 'Shopping malls', 'Hotels', 'Corporate headquarters'],
  },
  {
    id: 'fabrication',
    icon: Wrench,
    title: 'Metal Truss & Canopy Fabrication',
    description: 'Custom metal truss and canopy fabrication for industrial, commercial, and residential applications.',
    benefits: ['Custom designs', 'High strength', 'Durability', 'Cost-effective'],
    applications: ['Industrial sheds', 'Parking canopies', 'Sports facilities', 'Commercial structures'],
  },
];

const Services = () => {
  return (
    <>
      <SEO 
        title="Our Services"
        description="Explore RASS Engineering's comprehensive construction services including waterproofing, structural retrofitting, epoxy flooring, ACP cladding, and more."
      />
      <Layout>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-construction-dark overflow-hidden">
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          
          <div className="section-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Our Services
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
                Specialized Construction
                <span className="text-primary block">Solutions</span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed">
                Comprehensive engineering services tailored to meet your specific project requirements 
                with precision and expertise.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services List */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="section-container space-y-20">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <service.icon className="text-primary" size={32} />
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Key Benefits</h4>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle2 className="text-primary shrink-0" size={18} />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Applications</h4>
                      <ul className="space-y-2">
                        {service.applications.map((app) => (
                          <li key={app} className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle2 className="text-primary shrink-0" size={18} />
                            {app}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button variant="default" asChild>
                    <Link to="/request-quote">
                      Request This Service
                      <ArrowRight size={18} />
                    </Link>
                  </Button>
                </div>

                {/* Visual */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-construction-dark to-construction-gray flex items-center justify-center">
                    <service.icon className="text-primary/50" size={120} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-construction-dark">
          <div className="section-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-6">
                Need a Custom Solution?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Our team of experts is ready to discuss your specific requirements and provide tailored solutions.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/request-quote">
                  Get Free Consultation
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Services;
