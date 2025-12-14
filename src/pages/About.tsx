import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Award, Target, Eye, Users, Shield, Lightbulb, ArrowRight } from 'lucide-react';

const LOGO_URL = 'https://res.cloudinary.com/dihev9qxc/image/upload/f_auto,q_auto/v1765519977/WhatsApp_Image_2025-12-09_at_15.04.23_99b99d02_havp7x.jpg';

const values = [
  { icon: Shield, title: 'Quality', description: 'Uncompromising standards in every project we undertake.' },
  { icon: Users, title: 'Integrity', description: 'Transparent and honest dealings with all stakeholders.' },
  { icon: Lightbulb, title: 'Innovation', description: 'Adopting cutting-edge technologies and methods.' },
  { icon: Award, title: 'Excellence', description: 'Striving for perfection in every detail.' },
];

const About = () => {
  return (
    <>
      <SEO 
        title="About Us"
        description="Learn about RASS Engineering & Construction Pvt. Ltd. - 31+ years of engineering excellence under the leadership of Rabi Kumar Paudel."
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
                About Us
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
                31+ Years of
                <span className="text-primary block">Engineering Excellence</span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed">
                Building trust, delivering quality, and transforming Nepal's construction landscape.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
                  <img 
                    src={LOGO_URL} 
                    alt="RASS Engineering Logo" 
                    className="w-full h-full object-contain p-12"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                  Our Story
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-4 mb-6">
                  From Vision to Reality
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    RASS Engineering & Construction Pvt. Ltd. was established with a vision to provide 
                    world-class engineering solutions to Nepal's growing infrastructure needs. Since our 
                    inception in 2050 B.S., we have been at the forefront of specialized construction services.
                  </p>
                  <p>
                    Our journey began with a commitment to quality and innovation. Over the decades, we 
                    have successfully completed more than 500 projects, ranging from residential waterproofing 
                    to large-scale structural retrofitting of commercial buildings.
                  </p>
                  <p>
                    Today, RASS Engineering stands as a symbol of trust and reliability in Nepal's 
                    construction industry, known for our technical expertise, professional approach, 
                    and unwavering commitment to client satisfaction.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Managing Director */}
        <section className="py-20 lg:py-32 bg-muted/50">
          <div className="section-container">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                  Leadership
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-4 mb-8">
                  Meet Our Managing Director
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-card p-8 lg:p-12"
              >
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-5xl font-heading font-bold text-primary">RK</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                  Mr. Rabi Kumar Paudel
                </h3>
                <p className="text-primary font-medium mb-6">Managing Director</p>
                <div className="max-w-2xl mx-auto text-muted-foreground leading-relaxed space-y-4">
                  <p>
                    Mr. Rabi Kumar Paudel brings over three decades of experience in the construction 
                    and engineering sector. He served as Director from 2050 to 2073 B.S., before taking 
                    on the role of Managing Director at RASS Engineering in 2073 B.S.
                  </p>
                  <p>
                    Under his visionary leadership, RASS Engineering has grown from a small enterprise 
                    to one of Nepal's most trusted names in specialized construction solutions. His 
                    commitment to quality, innovation, and client satisfaction continues to drive the 
                    company's success.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="section-container">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
              {/* Mission */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card p-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="text-primary" size={28} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To deliver exceptional engineering and construction solutions that exceed client 
                  expectations, ensuring durability, safety, and value. We are committed to employing 
                  advanced technologies and sustainable practices while maintaining the highest 
                  standards of quality and professionalism.
                </p>
              </motion.div>

              {/* Vision */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="glass-card p-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Eye className="text-primary" size={28} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be Nepal's leading specialized construction company, recognized for innovation, 
                  reliability, and excellence. We aspire to set industry benchmarks and contribute 
                  to the nation's infrastructure development through world-class engineering solutions.
                </p>
              </motion.div>
            </div>

            {/* Core Values */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h3 className="font-heading text-2xl font-bold text-foreground">Our Core Values</h3>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="text-primary" size={32} />
                  </div>
                  <h4 className="font-heading font-semibold text-foreground mb-2">{value.title}</h4>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
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
                Ready to Work With Us?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Let's discuss how we can help with your next construction project.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Contact Our Team
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

export default About;
