import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  { icon: Phone, label: 'Phone', value: '977-01-5907561', href: 'tel:977-01-5907561', secondary: '9851084572, 9849792606' },
  { icon: Mail, label: 'Email', value: 'rass.engineering2016@gmail.com', href: 'mailto:rass.engineering2016@gmail.com' },
  { icon: MapPin, label: 'Address', value: 'Kathmandu, Nepal' },
  { icon: Clock, label: 'Working Hours', value: 'Sun - Fri: 9:00 AM - 6:00 PM' },
];

const Contact = () => {
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
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
  };

  return (
    <>
      <SEO 
        title="Contact Us"
        description="Get in touch with RASS Engineering & Construction. Contact us for waterproofing, structural retrofitting, and specialized construction solutions in Nepal."
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
                Contact Us
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
                Let's Start Your
                <span className="text-primary block">Next Project</span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed">
                Get in touch with our team for a free consultation and site inspection.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="section-container">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2 space-y-8"
              >
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                    Get In Touch
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Have a question or need a quote? Reach out to us through any of 
                    the channels below or fill out the contact form.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <div key={info.label} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <info.icon className="text-primary" size={22} />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">{info.label}</div>
                        {info.href ? (
                          <a href={info.href} className="text-foreground font-medium hover:text-primary transition-colors">
                            {info.value}
                          </a>
                        ) : (
                          <div className="text-foreground font-medium">{info.value}</div>
                        )}
                        {info.secondary && (
                          <div className="text-muted-foreground text-sm mt-1">{info.secondary}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Contact Form */}
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
                        Message Sent Successfully!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. We'll get back to you within 24 hours.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)} variant="outline">
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                          <Input placeholder="Your full name" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                          <Input type="tel" placeholder="Your phone number" required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                        <Input type="email" placeholder="your@email.com" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Service Type</label>
                        <select className="w-full h-11 px-4 rounded-2xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                          <option value="">Select a service</option>
                          <option value="waterproofing">Waterproofing</option>
                          <option value="grouting">Cement Pressure Grouting</option>
                          <option value="retrofitting">Structural Retrofitting</option>
                          <option value="flooring">Epoxy & PU Flooring</option>
                          <option value="cladding">ACP & HPL Cladding</option>
                          <option value="glazing">Structural Glazing</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                        <Textarea placeholder="Tell us about your project..." rows={5} required />
                      </div>
                      <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                        <Send size={18} />
                      </Button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-muted/50">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="font-heading text-2xl font-bold text-foreground">Find Us</h2>
            </motion.div>
            <div className="rounded-3xl overflow-hidden h-[400px] bg-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113032.00939893!2d85.22883145!3d27.708954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2044600%2C%20Nepal!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RASS Engineering Location"
              />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Contact;
