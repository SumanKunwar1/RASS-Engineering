import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { companyInfo } from '../data/mockData';

const Privacy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | RASS Engineering & Construction</title>
        <meta
          name="description"
          content="Privacy Policy for RASS Engineering & Construction Pvt. Ltd. Learn how we collect, use, and protect your personal information."
        />
        <link rel="canonical" href="/privacy" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
                Privacy Policy
              </h1>
              <p className="text-lg text-gray-600">
                Last updated: January 2025
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="prose prose-lg max-w-none"
            >
              <div className="space-y-8 text-gray-600">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">1. Introduction</h2>
                  <p className="leading-relaxed">
                    {companyInfo.name} ("we," "our," or "us") is committed to protecting your privacy.
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                    when you visit our website or use our services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">2. Information We Collect</h2>
                  <h3 className="text-xl font-semibold text-black mb-3">Personal Information</h3>
                  <p className="leading-relaxed mb-4">
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Contact us through our website forms</li>
                    <li>Request a quote for our services</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Communicate with us via phone or email</li>
                  </ul>
                  <p className="leading-relaxed mt-4">
                    This information may include your name, email address, phone number, company name,
                    and project details.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">3. How We Use Your Information</h2>
                  <p className="leading-relaxed mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Respond to your inquiries and provide requested services</li>
                    <li>Send you quotes and project proposals</li>
                    <li>Communicate about ongoing projects</li>
                    <li>Send newsletters and marketing communications (with your consent)</li>
                    <li>Improve our website and services</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">4. Information Sharing</h2>
                  <p className="leading-relaxed">
                    We do not sell, trade, or otherwise transfer your personal information to third parties
                    without your consent, except:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>To trusted service providers who assist in operating our website or conducting our business</li>
                    <li>When required by law or to protect our rights</li>
                    <li>With your explicit consent</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">5. Data Security</h2>
                  <p className="leading-relaxed">
                    We implement appropriate technical and organizational security measures to protect your
                    personal information against unauthorized access, alteration, disclosure, or destruction.
                    However, no method of transmission over the Internet is 100% secure.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">6. Your Rights</h2>
                  <p className="leading-relaxed mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access the personal information we hold about you</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Withdraw consent where we rely on consent to process your data</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">7. Cookies</h2>
                  <p className="leading-relaxed">
                    Our website may use cookies to enhance user experience. You can choose to disable cookies
                    through your browser settings, though this may affect website functionality.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">8. Children's Privacy</h2>
                  <p className="leading-relaxed">
                    Our services are not directed to individuals under the age of 18. We do not knowingly
                    collect personal information from children.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">9. Changes to This Policy</h2>
                  <p className="leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any changes
                    by posting the new policy on this page with an updated "Last updated" date.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">10. Contact Us</h2>
                  <p className="leading-relaxed mb-4">
                    If you have any questions about this Privacy Policy, please contact us:
                  </p>
                  <div className="bg-[#F4F4F4] p-6 rounded-xl">
                    <p className="font-semibold text-black mb-2">{companyInfo.name}</p>
                    <p>Email: {companyInfo.email}</p>
                    <p>Phone: {companyInfo.phone}</p>
                    <p>Address: {companyInfo.address}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Privacy;