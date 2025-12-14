import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';

const Terms = () => {
  return (
    <>
      <SEO 
        title="Terms & Conditions"
        description="Terms and Conditions of RASS Engineering & Construction Pvt. Ltd. Read our service terms and policies."
      />
      <Layout>
        {/* Hero Section */}
        <section className="relative py-20 bg-construction-dark">
          <div className="section-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
                Terms & Conditions
              </h1>
              <p className="text-white/70">Last updated: December 2024</p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="space-y-8 text-muted-foreground">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                  <p className="leading-relaxed">
                    By accessing and using this website, you accept and agree to be bound by the terms and 
                    provisions of this agreement. If you do not agree to these terms, please do not use this website.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">2. Services</h2>
                  <p className="leading-relaxed">
                    RASS Engineering & Construction Pvt. Ltd. provides specialized construction services 
                    including waterproofing, structural retrofitting, flooring, cladding, and related services. 
                    All services are subject to separate service agreements.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">3. Quotes and Pricing</h2>
                  <p className="leading-relaxed">
                    All quotes provided are estimates based on the information provided at the time of inquiry. 
                    Final pricing may vary based on actual site conditions and project requirements. Quotes are 
                    valid for 30 days unless otherwise specified.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">4. Warranties</h2>
                  <p className="leading-relaxed">
                    Specific warranties for each service will be detailed in the individual service agreement. 
                    Warranty terms vary based on the type of work and materials used.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">5. Limitation of Liability</h2>
                  <p className="leading-relaxed">
                    RASS Engineering shall not be liable for any indirect, incidental, special, or consequential 
                    damages arising out of or in connection with our services, except as specified in individual 
                    service agreements.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">6. Intellectual Property</h2>
                  <p className="leading-relaxed">
                    All content on this website, including text, graphics, logos, and images, is the property 
                    of RASS Engineering & Construction Pvt. Ltd. and is protected by copyright laws.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">7. Governing Law</h2>
                  <p className="leading-relaxed">
                    These terms and conditions are governed by and construed in accordance with the laws of Nepal. 
                    Any disputes shall be subject to the exclusive jurisdiction of the courts of Kathmandu.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">8. Contact Information</h2>
                  <p className="leading-relaxed">
                    For any questions regarding these terms, please contact us at:
                  </p>
                  <p className="mt-2">
                    <strong className="text-foreground">Email:</strong> rass.engineering2016@gmail.com<br />
                    <strong className="text-foreground">Phone:</strong> 977-01-5907561
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Terms;
