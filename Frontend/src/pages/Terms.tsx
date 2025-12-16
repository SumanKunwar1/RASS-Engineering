import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { companyInfo } from '../data/mockData';

const Terms: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | RASS Engineering & Construction</title>
        <meta
          name="description"
          content="Terms and Conditions for RASS Engineering & Construction Pvt. Ltd. Read our service terms, conditions, and policies."
        />
        <link rel="canonical" href="/terms" />
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
                Terms & Conditions
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
                  <h2 className="text-2xl font-bold text-black mb-4">1. Acceptance of Terms</h2>
                  <p className="leading-relaxed">
                    By accessing and using the services of {companyInfo.name}, you accept and agree to be
                    bound by these Terms and Conditions. If you do not agree to these terms, please do not
                    use our services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">2. Services</h2>
                  <p className="leading-relaxed mb-4">
                    RASS Engineering & Construction provides specialized construction and engineering services
                    including but not limited to professional construction solutions and engineering consultation.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">3. Project Quotes and Contracts</h2>
                  <p className="leading-relaxed">
                    All quotes provided are estimates based on the information provided and subject to site
                    inspection. Final pricing will be confirmed in a written contract. Projects commence only
                    after signing a formal agreement and receipt of advance payment as specified.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">4. Payment Terms</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Payment terms will be specified in individual project contracts</li>
                    <li>Advance payment is typically required before commencement</li>
                    <li>Progress payments may be required for long-duration projects</li>
                    <li>Final payment is due upon project completion and client approval</li>
                    <li>Delayed payments may result in project suspension</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">5. Project Timeline</h2>
                  <p className="leading-relaxed">
                    While we strive to complete projects within agreed timelines, actual completion may be
                    affected by factors beyond our control including weather conditions, material availability,
                    and unforeseen site conditions. We will communicate any delays promptly.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">6. Client Responsibilities</h2>
                  <p className="leading-relaxed mb-4">
                    Clients are responsible for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Providing accurate project information and site access</li>
                    <li>Obtaining necessary permits and approvals</li>
                    <li>Ensuring site is ready for work commencement</li>
                    <li>Making timely payments as per contract</li>
                    <li>Communicating changes or concerns promptly</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">7. Warranty and Liability</h2>
                  <p className="leading-relaxed">
                    We provide warranties on our workmanship as specified in individual project contracts.
                    Warranty periods and terms vary by service type. We are not liable for damages arising from:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Improper use or maintenance by the client</li>
                    <li>Modifications made by third parties</li>
                    <li>Natural disasters or acts of God</li>
                    <li>Normal wear and tear</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">8. Modifications and Cancellations</h2>
                  <p className="leading-relaxed">
                    Project modifications may be requested in writing and will be subject to revised quotes.
                    Cancellation policies are specified in individual contracts. Advance payments may be
                    non-refundable in case of client-initiated cancellations.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">9. Intellectual Property</h2>
                  <p className="leading-relaxed">
                    All designs, drawings, and technical documentation created by RASS Engineering remain our
                    intellectual property unless otherwise agreed in writing. Clients receive usage rights for
                    the specific project only.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">10. Dispute Resolution</h2>
                  <p className="leading-relaxed">
                    Any disputes arising from our services will first be attempted to resolve through mutual
                    discussion. If resolution cannot be achieved, disputes will be subject to the jurisdiction
                    of courts in Kathmandu, Nepal.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">11. Safety and Compliance</h2>
                  <p className="leading-relaxed">
                    We comply with all applicable safety regulations and building codes. Clients must ensure
                    safe working conditions and inform us of any site-specific hazards or restrictions.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">12. Changes to Terms</h2>
                  <p className="leading-relaxed">
                    We reserve the right to modify these Terms and Conditions at any time. Changes will be
                    effective immediately upon posting to our website. Continued use of our services constitutes
                    acceptance of modified terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">13. Contact Information</h2>
                  <p className="leading-relaxed mb-4">
                    For questions regarding these Terms and Conditions, please contact us:
                  </p>
                  <div className="bg-[#F4F4F4] p-6 rounded-xl">
                    <p className="font-semibold text-black mb-2">{companyInfo.name}</p>
                    <p>Email: {companyInfo.email}</p>
                    <p>Phone: {companyInfo.phone}</p>
                    <p>Mobile: {companyInfo.mobile.join(', ')}</p>
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

export default Terms;