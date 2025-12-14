import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, Mail, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-construction-dark relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-6"
          >
            Get Started Today
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Ready to Start Your
            <span className="text-primary block">Engineering Project?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-lg mb-10 max-w-2xl mx-auto"
          >
            Contact us today for a free site inspection and consultation. 
            Our expert team is ready to help you with your construction needs.
          </motion.p>

          {/* Contact info cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid sm:grid-cols-3 gap-4 mb-10"
          >
            <a
              href="tel:977-01-5907561"
              className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all group"
            >
              <Phone className="text-primary" size={22} />
              <div className="text-left">
                <div className="text-white font-medium">Call Us</div>
                <div className="text-white/60 text-sm">977-01-5907561</div>
              </div>
            </a>

            <a
              href="mailto:rass.engineering2016@gmail.com"
              className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all group"
            >
              <Mail className="text-primary" size={22} />
              <div className="text-left">
                <div className="text-white font-medium">Email Us</div>
                <div className="text-white/60 text-sm">rass.engineering2016@gmail.com</div>
              </div>
            </a>

            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <MapPin className="text-primary" size={22} />
              <div className="text-left">
                <div className="text-white font-medium">Visit Us</div>
                <div className="text-white/60 text-sm">Kathmandu, Nepal</div>
              </div>
            </div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="hero" size="lg" asChild>
              <Link to="/request-quote">
                Get Free Site Inspection
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button variant="heroDark" size="lg" asChild>
              <Link to="/contact">
                Contact Our Team
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
