import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Send, Shield, Clock, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const benefits = [
  { icon: Shield, title: 'Free Site Inspection', description: 'Our experts will visit and assess your project requirements.' },
  { icon: Clock, title: 'Quick Response', description: 'Receive your detailed quote within 24-48 hours.' },
  { icon: Award, title: 'No Obligation', description: 'Get a transparent quote with no hidden costs or pressure.' },
];

const RequestQuote = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Quote Request Submitted!",
      description: "Our team will contact you within 24 hours.",
    });
  };

  return (
    <>
      <SEO 
        title="Request a Quote"
        description="Get a free quote for waterproofing, structural retrofitting, and specialized construction services from RASS Engineering. Free site inspection included."
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
                Request a Quote
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
                Get Your Free
                <span className="text-primary block">Project Estimate</span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed">
                Fill out the form below and our team will provide you with a detailed quote 
                for your project within 24-48 hours.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Quote Form Section */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="section-container">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2 space-y-8"
              >
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                    Why Request a Quote?
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our detailed quotes help you understand the full scope of work and make 
                    informed decisions about your construction project.
                  </p>
                </div>

                <div className="space-y-6">
                  {benefits.map((benefit) => (
                    <div key={benefit.title} className="flex items-start gap-4 p-4 rounded-2xl bg-muted/50">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <benefit.icon className="text-primary" size={22} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                        <p className="text-muted-foreground text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20">
                  <p className="text-foreground font-medium mb-2">Need urgent assistance?</p>
                  <p className="text-muted-foreground text-sm mb-4">Call us directly for immediate support:</p>
                  <a href="tel:9851084572" className="text-primary font-bold text-xl hover:underline">
                    9851084572
                  </a>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-3"
              >
                <div className="glass-card p-8 lg:p-10">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-primary" size={32} />
                      </div>
                      <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                        Quote Request Submitted!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you! Our team will contact you within 24 hours with a detailed quote.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)} variant="outline">
                        Submit Another Request
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                          <Input placeholder="Your full name" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
                          <Input type="tel" placeholder="Your phone number" required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                        <Input type="email" placeholder="your@email.com" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Service Required *</label>
                        <select className="w-full h-11 px-4 rounded-2xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" required>
                          <option value="">Select a service</option>
                          <option value="waterproofing">Waterproofing Treatment</option>
                          <option value="grouting">Cement Pressure Grouting</option>
                          <option value="expansion">Expansion Joint Treatment</option>
                          <option value="retrofitting">Structural Retrofitting</option>
                          <option value="antitermite">Anti-Termite Treatment</option>
                          <option value="flooring">Epoxy & PU Flooring</option>
                          <option value="cladding">ACP & HPL Cladding</option>
                          <option value="glazing">Structural Glazing</option>
                          <option value="fabrication">Metal Truss & Canopy</option>
                          <option value="multiple">Multiple Services</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Project Location</label>
                        <Input placeholder="City / District" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Project Details *</label>
                        <Textarea 
                          placeholder="Describe your project requirements, approximate area, specific concerns, etc." 
                          rows={5} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Preferred Contact Time</label>
                        <select className="w-full h-11 px-4 rounded-2xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                          <option value="">Any time</option>
                          <option value="morning">Morning (9 AM - 12 PM)</option>
                          <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                          <option value="evening">Evening (4 PM - 6 PM)</option>
                        </select>
                      </div>
                      <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Get Free Quote'}
                        <Send size={18} />
                      </Button>
                      <p className="text-center text-muted-foreground text-sm">
                        By submitting this form, you agree to our privacy policy.
                      </p>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default RequestQuote;
