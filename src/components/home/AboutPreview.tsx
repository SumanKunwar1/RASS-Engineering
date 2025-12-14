import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export function AboutPreview() {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-construction-dark to-construction-gray">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="text-8xl font-heading font-bold text-primary mb-4">31+</div>
                    <div className="text-2xl font-medium">Years of Excellence</div>
                    <div className="text-white/60 mt-2">Since 2050 B.S.</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-orange-lg"
            >
              <div className="text-3xl font-heading font-bold">500+</div>
              <div className="text-sm font-medium">Projects Completed</div>
            </motion.div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} className="mb-4">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                About RASS Engineering
              </span>
            </motion.div>

            <motion.h2 
              variants={itemVariants}
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight"
            >
              Building Trust Through
              <span className="text-primary block">Engineering Excellence</span>
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className="text-muted-foreground text-lg leading-relaxed mb-6"
            >
              Under the visionary leadership of <strong className="text-foreground">Mr. Rabi Kumar Paudel</strong>, 
              RASS Engineering & Construction Pvt. Ltd. has been at the forefront of specialized construction 
              solutions since 2050 B.S. Our commitment to quality, innovation, and client satisfaction has 
              made us a trusted name in Nepal's construction industry.
            </motion.p>

            <motion.p 
              variants={itemVariants}
              className="text-muted-foreground leading-relaxed mb-8"
            >
              From waterproofing to structural retrofitting, we deliver comprehensive engineering solutions 
              that stand the test of time. Our team combines decades of experience with cutting-edge 
              technologies to ensure every project exceeds expectations.
            </motion.p>

            <motion.div variants={itemVariants}>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
