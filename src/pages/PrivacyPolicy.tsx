import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';

const PrivacyPolicy = () => {
  return (
    <>
      <SEO 
        title="Privacy Policy"
        description="Privacy Policy of RASS Engineering & Construction Pvt. Ltd. Learn how we collect, use, and protect your personal information."
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
                Privacy Policy
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
              className="max-w-3xl mx-auto prose prose-lg"
            >
              <div className="space-y-8 text-muted-foreground">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
                  <p className="leading-relaxed">
                    We collect information you provide directly to us, such as when you request a quote, 
                    contact us, or sign up for our newsletter. This may include your name, email address, 
                    phone number, and project details.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
                  <p className="leading-relaxed mb-4">We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Respond to your inquiries and provide customer service</li>
                    <li>Send you project quotes and proposals</li>
                    <li>Communicate with you about our services</li>
                    <li>Improve our website and services</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">3. Information Sharing</h2>
                  <p className="leading-relaxed">
                    We do not sell, trade, or otherwise transfer your personal information to third parties 
                    without your consent, except as necessary to provide our services or as required by law.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
                  <p className="leading-relaxed">
                    We implement appropriate security measures to protect your personal information against 
                    unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">5. Cookies</h2>
                  <p className="leading-relaxed">
                    Our website may use cookies to enhance your browsing experience. You can choose to 
                    disable cookies through your browser settings.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">6. Contact Us</h2>
                  <p className="leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;
